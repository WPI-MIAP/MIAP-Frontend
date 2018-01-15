import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

import Navigation from './layouts/Navigation';
import GlobalFilterNavContainer from '../containers/GlobalFilterNavContainer';
import MainViewContainer from '../containers/MainViewContainer';

export default class App extends Component {
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
				

