"use strict";
const querysgtring = require("query-string")
const axios = require("axios");
const BadRequestError = require("./badRequestError");

class CountLines {
  constructor(url) {
    this.url = url;
  }

  async execute() {
    var decodedUrl=querysgtring.parse("url="+this.url)
    var fileText= await this.retrieveFile(decodedUrl.url);
    
    if(fileText!=null){
      const splittedLines = fileText.data.split('\n');
      return splittedLines.length;
    }
  }

  async retrieveFile(decodedUrl){
    console.log(JSON.stringify(decodedUrl))
    try {
      return await axios.get(decodedUrl)
    } catch (error) {
      throw new BadRequestError(`Url ${decodedUrl} not found`)
    }
  }
}

module.exports = CountLines;
