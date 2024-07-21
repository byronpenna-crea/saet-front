const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.feature$/,
        use: [
          {
            loader: '@badeball/cypress-cucumber-preprocessor/webpack',
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};
