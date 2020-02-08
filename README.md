Blockchain Visualization Widgets
============

Library of visual components to build data visualization interface to the blockchain data.
Universal tool across all major blockchains ( ethereum, tron, bitcoin, zcash, many more...).

TLDR; Try [https://explorer.bitquery.io]()

![Screen Preview](https://raw.githubusercontent.com/bitquery/widgets/master/doc/files/screen2.png)



Every widget is a reusable visualization component to display the data from blockchain.
Typically every widget is displaying a result set from GraphQL request.

## Usage

To start with, look our [wiki](https://github.com/bitquery/widgets/wiki). You do not need programming skills
to use and embed widgets, most tasks can be done by examples. To use specialized filtering and data querying
you will need basic understanding of [GraphQL language](https://graphql.org/).

## Setup

Clone this repo to your desktop and run 

`npm install` 

to install all the dependencies.




For widget developers
-----------
```
npm init -y
npm install webpack webpack-cli --save-dev
npm install --save graphql apollo-boost vue vue-i18n vue-google-charts vue-loader vue-template-compiler vue-template-loader lodash
npm install --save-dev sass-loader node-sass style-loader css-loader file-loader
npm install --save vis numeral
npm install --save react react-dom isomorphic-fetch graphiql
npm install --save-dev extract-text-webpack-plugin@next
```

```
npm install
```

run webpack
```
node_modules/.bin/webpack
```


run webpack autocompile for dev
```
node_modules/.bin/webpack --watch
```


## License
>You can check out the full license [here](https://github.com/bitquery/widgets/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.

## Credits

The project is developing with the [Binance fellowship program](https://binancex.dev/fellowship_fellows.html)  support.