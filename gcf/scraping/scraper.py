from pathlib import Path
import scrapy
from scrapy.crawler import CrawlerProcess,CrawlerRunner
from twisted.internet import reactor
from multiprocessing import Process, Queue
import logging


class Gainers(scrapy.Spider):
    name = "gainers"
    start_urls = [
        'https://www.coingecko.com/en/crypto-gainers-losers',
        'https://www.coingecko.com/en/crypto-gainers-losers?top=300',
        'https://www.coingecko.com/en/crypto-gainers-losers?top=100',
    ]
    def parse(self, response):
        for row in response.xpath('(//table)[1]//tbody//tr'):
            yield {
                'name': row.xpath('.//td[3]//span[1]/text()').get().strip(),
                'price': row.xpath('.//td[4]//span[1]/text()').get(),
                'change': row.xpath('.//td[6]//span[1]/text()').get(),
                'href_id': row.xpath('.//td[3]//a/@href').get().split('/')[-1],
            }



def script(queue):
    try:
        process = CrawlerProcess(settings={
            "FEEDS": {
                "gainers.json": {"format": "json","overwrite": True,"mode":"w"},
            },
        })
        process.crawl(Gainers)
        process.start()
        queue.put(None)
    except Exception as e: 
        queue.put(e)

def main():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    # Create a console handler and set its level
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # Create a formatter and set it on the console handler
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
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
    logger.info("Scraping complete.")
    return "Scraping complete."

if __name__=='__main__':
    main()
