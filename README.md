# FileParser

## Local setup
- Fork this project
- Clone the repo from the forked project
- npm i
- npm run test

## Gitlab Setup

- Setup credentials in GitLab:
    - Go to Settings
    - CI/CD
    - Variables -> Expand
    - Set variable: ACCESS_KEY_ID
    - Set variable: SECRET_ACCESS_KEY

Once Gitlab is properly setup you'll be able to run the pipelines

## Test

In order to run test, run:
- `npm run test`

You can test the local lambda (without deploying) by typing (in the terminal):

`npm run test-count-lines`

You can test the deployed labda by typing (in the terminal):
Where: 
`npm run test-count-lines-remote`


Note that countLines requires request using the following input:

{
    "pathParameters": {
      "url": "https%3A%2F%2Ffilesamples.com%2Fsamples%2Fdocument%2Ftxt%2Fsample3.txt"
    }
}

where url is a url containing a text file encoded, you can encode urls here: https://www.urlencoder.org/

Other txt files to test:
https://norvig.com/big.txt
https://www.learningcontainer.com/wp-content/uploads/2020/04/sample-text-file.txt


