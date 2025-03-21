const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js"
  },
  module: {
    rules: [
	  {
	    test: /\.js$/,
		exclude: /node_modules/,
		use: {
		  loader: "babel-loader"
		},
	  },
	  {
	    test: /\.css$/,
	    use: ["style-loader", "css-loader"]	
    },
    {
      test: /\.(png|jpg|gif|ttf|wav|mp3)$/,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
  }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
    	template: "./src/index.html"
    })
  ]
};