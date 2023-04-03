import logging

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


def main(debug=False):
    import pandas as pd

    with open("gainers.csv") as f:
        df = pd.read_csv(f)

    token_contracts = [f"'{contract}'" for contract in df["contract_address"]]
    token_contracts_string = f"({','.join(token_contracts)})"
    logger.info(f"Checking {len(token_contracts)} token contracts.")

    import os

    # Load environment variables from .env file
    from dotenv import load_dotenv

    load_dotenv()
    KEY_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    PROJECT_ID = os.getenv("PROJECT_ID")

    from google.cloud import bigquery
    from google.oauth2 import service_account

    # Authenticate to BigQuery
    credentials = service_account.Credentials.from_service_account_file(
        KEY_PATH,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    client = bigquery.Client(
        credentials=credentials,
        project=credentials.project_id,
    )

    dry_run_config = bigquery.QueryJobConfig(dry_run=True, use_query_cache=False)
    wet_run_config = bigquery.QueryJobConfig(use_query_cache=False)

    # Query the last 7 days of token transfers
    query = f"""
    WITH wallet_token_counts AS (
    SELECT tt.to_address, tt.token_address, COUNT(tt.to_address) as num_txns
    FROM `bigquery-public-data.crypto_ethereum.token_transfers` tt 
    WHERE tt.block_timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY) 
    AND tt.block_timestamp < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 2 DAY) 
    AND tt.token_address in {token_contracts_string}
    GROUP BY tt.to_address, tt.token_address)

    SELECT to_address as wallet, COUNT(to_address) as num_tokens, SUM(num_txns) as num_txns
    FROM wallet_token_counts wtc 
    LEFT JOIN `bigquery-public-data.crypto_ethereum.contracts` c
    ON wtc.to_address = c.address
    LEFT JOIN `labels.labels` labels
    ON wtc.to_address = labels.address
    WHERE c.address IS NULL
    AND labels.address IS NULL
    GROUP BY to_address
    HAVING num_tokens >= 3
    ORDER BY num_txns ASC, num_tokens DESC
    """

    if debug:
        print(query)
        return

    logger.info("Running SQL query on Google Big Cloud.")
    dry_query = client.query(query, job_config=dry_run_config)

    # Check how much data will be processed
    mb_processed = dry_query.total_bytes_processed / (1024 * 1024 * 4)
    # Throw error if over 1024*4 MB
    if mb_processed > 1024:
        logger.error(f"Query will process {mb_processed:.2f} MB.")
        raise Exception(f"Query will process {mb_processed:.2f} MB.")

    logger.info(f"Query will process {mb_processed:.0f} MB.")

    # Run query
    logger.info(f"Running query...")
    query_job = client.query(query, job_config=wet_run_config)
    logger.info(f"Query completed.")

    # Turn query job into df
    df = query_job.to_dataframe()
    logger.info(f"Found {len(df)} wallets.")

    df.to_csv("coingecko_gainers_wallets.csv", index=False)

    return df
