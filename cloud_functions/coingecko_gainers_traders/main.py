def main(request):
    import io
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

    logger.info("Cloud function starting.")
    # 1. Scrape coingecko gainers.
    import scraping.scraper

    scraping.scraper.main()

    # 2. Get contract address for gainers that have them, with coingecko.
    import scraping.contract_addresses

    scraping.contract_addresses.main()

    # 3. Run SQL query on Google Big Query to find wallets that have receieved these tokens within the last 7 days.
    import gbq.gbq

    gbq.gbq.main()

    # 4. Zip the results
    import gcf

    zip_contents = gcf.main()

    # 5. Send them
    from flask import make_response

    response = make_response(zip_contents)
    response.headers.set("Content-Type", "application/zip")
    response.headers.set("Content-Disposition", "attachment", filename="results.zip")

    return response
