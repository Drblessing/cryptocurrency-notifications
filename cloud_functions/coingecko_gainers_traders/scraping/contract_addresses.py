import json
import time

import pandas as pd
import requests
from bs4 import BeautifulSoup
import logging


def main(local=False):
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")

    # Create a console handler and set its level
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # Create a formatter and set it on the console handler
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    console_handler.setFormatter(formatter)

    # Add the console handler to the logger
    logger.addHandler(console_handler)

    with open("tmp/gainers.json") as f:
        items = json.load(f)

    df = pd.DataFrame(items)
    # remove duplicates
    df = df.drop_duplicates(subset=["href_id"])

    coins = requests.get(
        "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
    ).json()
    coins = pd.DataFrame(coins)
    # Rename id to api_id
    coins = coins.rename(columns={"id": "api_id"})
    # Merge, coins and df on id, but leave out name
    df = df.merge(
        coins[["api_id", "symbol", "platforms"]],
        left_on="href_id",
        right_on="api_id",
        how="left",
    )
    # Get missing symbols
    missing_symbols = df[df["symbol"].isna()]
    href_ids = missing_symbols["href_id"].tolist()
    href_urls = [
        f"https://www.coingecko.com/en/coins/{href_id}" for href_id in href_ids
    ]
    logger.info(f"Scraping {len(href_urls)} coins that are missing symbols.")
    api_ids = []
    for href_url in href_urls:
        try:
            response = requests.get(href_url)
            soup = BeautifulSoup(response.text, "html.parser")
            # Find the api_id
            api_id = soup.find("span", string="API id")
            # Text is in next div
            api_id = api_id.find_next_sibling("div").text.strip()
            api_ids.append([api_id, href_url.split("/")[-1].strip()])
            time.sleep(3)
            logger.info(f"Scraped {href_url}")

        except:
            logger.error(f"Could not scrape {href_url}")
            time.sleep(3)

    # Create a dataframe from api_ids
    api_ids = pd.DataFrame(api_ids, columns=["api_id", "href_id"])
    # Merge with coins
    api_ids = api_ids.merge(
        coins[["api_id", "symbol", "platforms"]], on="api_id", how="left"
    )
    # Merge with df rows missing symbols
    mask = pd.isna(df["symbol"])
    # Combine the two dataframes
    df_merged = pd.merge(df[mask].dropna(axis=1), api_ids, on="href_id", how="left")
    df_combined = pd.concat([df[~mask], df_merged])
    df_combined.reset_index(drop=True, inplace=True)
    # Turn platforms column into just the string of ethereum contract address
    df_combined["platforms"] = df_combined["platforms"].apply(
        lambda x: x.get("ethereum")
    )
    # Drop rows without ethereum contract
    df_combined = df_combined.dropna(subset=["platforms"])
    df_combined = df_combined[df_combined["platforms"] != ""]
    # Test that every platform is an ethereum address, i.e. a string that starts with 0x and is 42 characters long
    assert (
        df_combined["platforms"]
        .apply(lambda x: x.startswith("0x") and len(x) == 42)
        .all()
    )
    # Rename platforms to contract_address
    df_combined = df_combined.rename(columns={"platforms": "contract_address"})
    df_combined.to_csv("tmp/gainers.csv", index=False)
    # Yay!
    # Now we have a dataframe with all the coins that gained and have an etherum contract address
    # We can use this to query the blockchain for wallets that have received these tokens in the last 7 days
    logger.info(f"Number of coins with ethereum contract addresses: {len(df_combined)}")
    logger.info("Done scraping contract addresses!")


if __name__ == "__main__":
    main()
