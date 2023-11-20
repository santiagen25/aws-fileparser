"use strict";

class CountWords {
  constructor(s3Handler) {
    this.s3Handler = s3Handler;
  }

  async execute(bucketName, fileName) {
    const fileContents = await this.s3Handler.read(bucketName, fileName);

    if (fileContents != null) {
      const splittedWords = fileContents.split(' ');
      return splittedWords.length;
    }
  }
}

module.exports = CountWords;
