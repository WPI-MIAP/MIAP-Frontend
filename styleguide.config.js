module.exports = {
	showUsage: true,
	webpackConfig: {
		module: {
		  rules: [
			// Babel loader, will use your project’s .babelrc
			{
			  test: /\.jsx?$/,
			  exclude: /node_modules/,
			  loader: 'babel-loader'
			},
			// Other loaders that are needed for your components
			{
			  test: /\.css$/,
			  loader: 'style-loader!css-loader?modules'
			},
			// Other loaders that are needed for your components
			{
			  test: /\.png$|\.jpg$|\.svg$/,
			  loader: 'file-loader?name=images/[name].[ext]'
			}
		  ]
		}
	},
	sections: [
	  {
		name: 'Getting Started',
		content: 'README.md'
	  },
	  {
		name: 'Documentation',
		sections: [
		  {
			name: 'Front-end React.js Components',
			components: 'resources/**/*.jsx'
		  }
		  ,
		  {
			name: 'Node.js Server',
			components: 'server/**/*.{js, ts}'
		  }
		]
	  }
	]
  }