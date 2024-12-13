const querystring = require("query-string");
const axios = require("axios");
const BadRequestError = require("./badRequestError");

class CountLines {
  constructor(url) {
    this.url = url;
  }

  async execute() {
    const decodedUrl = querystring.parse("url=" + this.url).url;

    if (!decodedUrl || !this.isValidUrl(decodedUrl)) {
      throw new BadRequestError("Invalid URL");
    }

    const fileText = await this.retrieveFile(decodedUrl);

    if (fileText) {
      const splittedLines = fileText.data.split("\n");
      return splittedLines.length;
    }

    throw new BadRequestError("Unable to retrieve file content");
  }

  async retrieveFile(url) {
    console.log(url);
    try {
      return await axios.get(url);
    } catch (error) {
      throw new BadRequestError(`Url ${url} not found`);
    }
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = CountLines;
