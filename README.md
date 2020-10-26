# FileParser

## Setup

- Fork this project
- Clone the repo from the forked project
- Setup credentials in GitLab:
    - Go to Settings
    - CI/CD
    - Variables -> Expand
    - Set variable: ACCESS_KEY_ID
    - Set variable: SECRET_ACCESS_KEY

- npm i

Note this project requires to have previously installed node

## Deploy

In order to deploy this project run:
- `sls deploy`

Note that `sls deploy` will only work in case AWS credentials are properly set

## Test

In order to run test, run:
- `npm run test`

You can also run lambda-local in the command line by typing:

`lambda-local -l handler.js -h countLines -e events/countLines.json`

Where: 
`lambda-local -l <Lambda File Name> -h <Handler Name> -e <Test File>`

Note: If it fails you may need to install lambda-local globally by typing:

`npm i lambda-local -g`

Note that countLines requires request using the following input:

{
    "pathParameters": {
      "url": "https%3A%2F%2Fwww.w3.org%2FTR%2FPNG%2Fiso_8859-1.txt"
    }
}

where url is a url containing a text file encoded, you can encode urls here: https://www.urlencoder.org/
