const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: path.resolve(__dirname, 'src', 'Main.ts'),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      type: "var",
      name: "[name]",
    },
  },
  resolve: {
    // Add ".ts" and ".tsx" as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [path.resolve(__dirname, 'html')]
      }
    ),
  ],
  optimization: {
    minimize: false,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          mangle: false,
          compress: {
            booleans: false,
            collapse_vars: false,
            conditionals: false,
            dead_code: false,
            evaluate: false,
            hoist_props: false,
            if_return: false,
            inline: false,
            join_vars: false,
            loops: false,
            reduce_funcs: false,
            reduce_vars: false,
            side_effects: false,
            switches: false,
            unused: false,
          },
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
