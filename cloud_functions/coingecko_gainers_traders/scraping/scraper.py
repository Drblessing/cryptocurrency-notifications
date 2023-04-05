from pathlib import Path
import scrapy
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from twisted.internet import reactor
from multiprocessing import Process, Queue
import logging
import os
import tempfile

# Fix deprecation warnings
import warnings
from scrapy.exceptions import ScrapyDeprecationWarning

warnings.filterwarnings("ignore", category=ScrapyDeprecationWarning)


class Gainers(scrapy.Spider):
    name = "gainers"
    start_urls = [
        "https://www.coingecko.com/en/crypto-gainers-losers",
        "https://www.coingecko.com/en/crypto-gainers-losers?top=all",
    ]

    def parse(self, response):
        for row in response.xpath("(//table)[1]//tbody//tr"):
            yield {
                "name": row.xpath(".//td[3]//span[1]/text()").get().strip(),
                "price": row.xpath(".//td[4]//span[1]/text()").get(),
                "change": row.xpath(".//td[6]//span[1]/text()").get(),
                "href_id": row.xpath(".//td[3]//a/@href").get().split("/")[-1],
            }


def script(queue):
    tmp_dir = tempfile.gettempdir()
    csv_path = os.path.join(tmp_dir, "gainers.json")
    try:
        logging.getLogger("scrapy").propagate = False
        process = CrawlerProcess(
            settings={
                "FEEDS": {
                    csv_path: {
                        "format": "json",
                        "overwrite": True,
                        "mode": "w",
                    },
                },
            }
        )
        process.crawl(Gainers)
        process.start()
        queue.put(None)
    except Exception as e:
        queue.put(e)


def main():
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

    queue = Queue()
    p = Process(target=script, args=(queue,))
    p.start()
    p.join()
    result = queue.get()
    if result is not None:
        raise result
    logger.info(
        "Scraped: https://www.coingecko.com/en/crypto-gainers-losers?top=allcomplete"
    )
    return "Scraping complete."


if __name__ == "__main__":
    main()
