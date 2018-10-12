//entry can be an array and an include multiple files
var webpack = require('webpack');
var path = require('path');

/*Use for extracting CSS to keep it out of the bundle
 var ExtractTextPlugin = require('extract-text-webpack-plugin');*/

/* Replace <APPNAME> with the filename or name of application entry point */
/* Replace <FOLDER/FOLDER> with the path to the build directory to output bundle files */
module.exports = {
	entry: {
		"ngSessionize": "./ngSessionize.app.js"
		/*Include when extracting CSS To keep it out of the bundle
		 tempstyle: "./client/styles/tempstyle.scss"*/
	},
	output: {
		path: '/dev/ngSessionize/build/',
		filename: "[name].js",
		publicPath: '/'
	},
	devtool: 'source-map',
	/*Include when WebstormProjects/Semma/CDBextracting CSS to keep it out of the bundle
	 plugins: [
	 new ExtractTextPlugin("[name].css")
	 ],*/
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: "html-loader"
			}
		]
	},
	externals: {
		angular: 'angular'
	},
	resolve: {
		extensions: ['.js'],
		alias: {}
	},
	watch: true
};