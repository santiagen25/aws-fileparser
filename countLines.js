"use strict";
const querysgtring = require("query-string")
const axios = require("axios")

class CountLines {
  constructor(url) {
    this.url = url;
  }

  async execute() {
    var decodedUrl=querysgtring.parse("url="+this.url)
    var fileText= await this.retrieveFile(decodedUrl.url);
    
    var splittedLines=fileText.data.split('\n');
    return splittedLines.length;
  }

  async retrieveFile(decodedUrl){
    console.log(JSON.stringify(decodedUrl))
    try {
      return await axios.get(decodedUrl,{
        headers: {'Content-Type': 'text/plain'}})
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = CountLines;
