from pathlib import Path
import scrapy
import json
from scrapy.crawler import CrawlerProcess,CrawlerRunner
from twisted.internet import reactor
from multiprocessing import Process, Queue
from scrapy.utils.log import configure_logging
from fake_useragent import UserAgent

# # Fix deprecation warnings
# import warnings
# from scrapy.exceptions import ScrapyDeprecationWarning
# warnings.filterwarnings("ignore", category=ScrapyDeprecationWarning)


# import logging
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO)
# logger.propagate = False
# logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# # Create a console handler and set its level
# console_handler = logging.StreamHandler()
# console_handler.setLevel(logging.INFO)
# # Create a formatter and set it on the console handler
# formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
# console_handler.setFormatter(formatter)
# # Add the console handler to the logger
# logger.addHandler(console_handler)

class Gainers(scrapy.Spider):
    name = "gainers"
    start_urls = [
        'https://etherscan.io/accounts/label/binance',
    ]

    def load_cookies_from_json(self,file_path):
        with open(file_path, 'r') as f:
            cookies_data = json.load(f)
        cookies = {}
        for cookie in cookies_data:
            cookies[cookie['name']] = cookie['value']
        return cookies

    def start_requests(self):
        ua = UserAgent()
        cookies = self.load_cookies_from_json('cookies.json')

        for cookie_name,cookie_value in cookies.items():
            # logger.info(f"Setting cookie {cookie_name} to {cookie_value}")
            pass
        
        for url in self.start_urls:
            # logger.info(f"Scraping {url}")
            USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
            headers = {'User-Agent': USER_AGENT}
            yield scrapy.Request(url=url, headers=headers, callback=self.parse, cookies=cookies)

    def parse(self, response):
        # Save html
        print('Saving html')
        print(response)
        with open('labelled_cex_addresses.html', 'w') as f:
            f.write(response.text)

def script(queue):
    try:
        # logging.getLogger('scrapy').propagate = False
        process = CrawlerProcess(settings={
            "FEEDS": {
                "gainers.json": {"format": "json","overwrite": True,"mode":"w"}
            },
        })
        process.crawl(Gainers)
        process.start()
        queue.put(None)
    except Exception as e: 
        queue.put(e)

def main():

    queue = Queue()
    p = Process(target=script, args=(queue,))
    p.start()
    p.join()
    result = queue.get()
    if result is not None:
        raise result
    
    # logger.info("Scraping complete.")
    return "Scraping complete."

if __name__=='__main__':
    main()
