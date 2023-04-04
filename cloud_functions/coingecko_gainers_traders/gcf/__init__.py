import os
import tempfile
import logging
import io
import zipfile

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


def create_zipfile(csv_files):
    # Create an in-memory buffer for the ZIP archive
    buffer = io.BytesIO()

    # Create a new ZIP archive in the buffer
    with zipfile.ZipFile(buffer, mode="w") as zip_file:
        # Add each CSV file to the archive
        for csv_file in csv_files:
            # Open the CSV file and read its contents
            with open(csv_file, "r") as f:
                csv_contents = f.read()
            # Create a new file in the ZIP archive with the same name as the CSV file
            zip_file.writestr(csv_file, csv_contents)

    # Return the contents of the ZIP archive as a bytes object
    return buffer.getvalue()


def main(local=False):
    tmp_dir = tempfile.gettempdir()
    gainers_path = os.path.join(tmp_dir, "gainers.csv")
    results_path = os.path.join(tmp_dir, "results.csv")

    # Create a ZIP archive of the CSV files
    logger.info("Zipping files")
    zip_contents = create_zipfile([gainers_path, results_path])

    return zip_contents
