import React, { Component } from 'react';
import GlobalFilterNavContainer from '../containers/GlobalFilterNavContainer';
import MainViewContainer from '../containers/MainViewContainer';
import Footer from './modules/Footer';
import Tour from './modules/Tour';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const layout = [
	{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
	{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
	{i: 'c', x: 4, y: 0, w: 1, h: 2}
];

export default class App extends Component {

	constructor(props) {
		super(props);
		
		this.state = {
			tourRunning: false,
			tourSelector: '',
			joyride: null
		};

		this.startTour = this.startTour.bind(this);
		this.stopTour = this.stopTour.bind(this);
		this.nextTourStep = this.nextTourStep.bind(this);
		this.updateTourSelector = this.updateTourSelector.bind(this);
	}

	componentDidMount() {
		this.joyride = this.tour.getJoyride();
	}

	nextTourStep() {
		if(this.state.tourRunning) {
			this.joyride.next();
		}
	}

	updateTourSelector(newSelector) {
		this.setState({tourSelector: newSelector});
	}

	startTour() {
		this.joyride.reset(true);
		this.setState({tourRunning: true});
	}

	stopTour() {
		this.setState({tourRunning: false});
	}


	render() {

		return (
			<div className="mainContainer">
				<Tour updateTourSelector={this.updateTourSelector} stopTour={this.stopTour} tourRunning={this.state.tourRunning} ref={tour => {this.tour = tour;}}/>
				<GlobalFilterNavContainer startTour={this.startTour}/>
				<MainViewContainer tourRunning={this.state.tourRunning} currentSelector={this.state.tourSelector} nextTourStep={this.nextTourStep}/>
				<Footer/>
			</div>
		)
	}
}
				

