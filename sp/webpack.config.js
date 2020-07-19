const webpack = require("webpack");
const path = require("path");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

const HOST = "localhost";
const PORT = 8081;

module.exports = env => {
  const mode = (env && env.mode) || "DEV";
  const options = {
    entry:
      mode === "DEV"
        ? [
            "react-hot-loader/patch",
            path.join(__dirname, "../sp/sp.js")
          ]
        : path.join(__dirname, "../sp/sp.js"),

    output: {
      path: path.join(__dirname, "../sp/dist"),
      filename: "build.js"
    },
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: [
            {
              loader: "babel-loader"
            }
          ],
          exclude: "/node_modules/"
        },
        {
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: { minimize: false, sourceMap: true }
            },
            {
              loader: "less-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" }, //loader 倒序执行  先执行 less-laoder
            {
              loader: "css-loader",
              options: { minimize: false, sourceMap: true }
            }
          ]
        },
        {
          test: /\.(eot|ttf|svg|woff|woff2)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "./fonts/",
                name: "../fonts/[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    devtool: "source-map",
    resolve: {
      enforceExtension: false,
      extensions: [".js", ".jsx", ".json"],
      modules: [path.resolve("src"), path.resolve("."), "node_modules"]
    },
    externals: {
      async: "commonjs async"
    }
  };
  if (mode === "PROD") {

  }
  return options;
};
