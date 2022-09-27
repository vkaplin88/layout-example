// Imports plugins
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const PurgecssPlugin = require('purgecss-webpack-plugin');
const fs = require('fs');

const WHITE_LIST_PATTERNS = [
  /^nav/,
  /^disabled/,
  /^animated/,
  /^show/,
  /^fade/,
  /^collapsing/,
  /^open-menu/,
  /^modal/,
  /^modal-backdrop/,
  /^modal-backdrop.show/,
  /^custom-accordion/,
  /^collapsing/,
  /^collapse/,
  /^collapsed/
];

// compiles html files
function generateHtmlPlugins(templateDir) {
  // Find all files in directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles.map(item => {
    // get parts file
    const parts = item.split(".");
    // get name file
    const name = parts[0];
    // get extension file
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      // filename new name for file
      filename: `${name}.html`,
      // souse file
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./src/html/pages');

const PATHS = {
  src: path.join(__dirname, 'src')
}

const config = {
  // webpack entry point. Module to start building dependency graph
  entry: [
    './src/js/main.js',
    './src/scss/bootstrap.scss'
  ],
  output: {
    filename: './js/main.js'
  },
  optimization: {
    minimizer: [],
  },
  module: {
    rules: [
      // For use ES2015 +
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "src/scss"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: true,
              plugins: () => [
                require('autoprefixer'),
                require("cssnano")({
                  preset: [
                    "default",
                    {
                      discardComments: {
                        removeAll: true
                      }
                    }
                  ]
                })
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader']
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.css',
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/images",
        to: "./images"
      },
      {
        from: "./src/fonts",
        to: "./fonts"
      },
    ]),
  ].concat(htmlPlugins),
  devServer: {  // configuration for webpack-dev-server
    port: 8081, // port to run dev-server
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.optimization.minimizer = [
      new UglifyJsPlugin({
        sourceMap: false
      })
    ]
  }

  if (argv.mode === 'production') {
    config.plugins.push(
        new PurgecssPlugin({
          paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
          whitelistPatterns: WHITE_LIST_PATTERNS
        })
    );

    // config.plugins.push(
    //   new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
    // );
  }

  return config;
};