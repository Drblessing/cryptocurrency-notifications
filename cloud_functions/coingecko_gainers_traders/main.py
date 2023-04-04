def main(request):
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
    return f"Hello World!"


# def hello_world(request):
#     """Responds to any HTTP request.
#     Args:
#         request (flask.Request): HTTP request object.
#     Returns:
#         The response text or any set of values that can be turned into a
#         Response object using
#         `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
#     """
#     request_json = request.get_json()
#     if request.args and "message" in request.args:
#         return request.args.get("message")
#     elif request_json and "message" in request_json:
#         return request_json["message"]
#     else:
#         return f"Hello World!"
