import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

import Navigation from './layouts/Navigation';
import MainView from './layouts/MainView';
import SideBarContent from './layouts/SideBarContent'

const mql = window.matchMedia(`(min-width: 800px)`);

export default class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			mql: mql,
			docked: props.docked,
			open: props.open
		}

		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
	}

	onSetSidebarOpen(open) {
		this.setState({sidebarOpen: open});
	}

	mediaQueryChanged() {
		this.setState({sidebarDocked: this.state.mql.matches});
	}

	componentWillMount() {
		mql.addListener(this.mediaQueryChanged);
		this.setState({mql: mql, sidebarDocked: mql.matches});
	}

	componentWillUnmount() {
		this.state.mql.removeListener(this.mediaQueryChanged);
	}

	render() {
		const sidebarContent = <SideBarContent />

		const sidebarProps = {
			sidebar: this.state.sidebarOpen,
			docked: this.state.sidebarDocked,
			onSetOpen: this.onSetSidebarOpen
		};
		

		return (
			<Sidebar sidebar={sidebarContent}
				open={this.state.sidebarOpen}
				docked={this.state.sidebarDocked}
				onSetOpen={this.onSetSidebarOpen}
			>
				<Navigation />
				<MainView />
			</Sidebar>
			);
	}
}
				

