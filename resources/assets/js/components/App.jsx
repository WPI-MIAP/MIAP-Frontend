import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

import Navigation from './layouts/Navigation';
import GlobalFilterNavContainer from '../containers/GlobalFilterNavContainer';
import MainViewContainer from '../containers/MainViewContainer';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const layout = [
	{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
	{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
	{i: 'c', x: 4, y: 0, w: 1, h: 2}
];

export default class App extends Component {
	componentWillMount() {
		document.body.style.backgroundColor = '#A9B0B7';
	}

	render() {
		return (
			<div>
				{/* <Navigation /> */}
				<GlobalFilterNavContainer />
				<MainViewContainer />


			</div>
		)
	}
}
				

