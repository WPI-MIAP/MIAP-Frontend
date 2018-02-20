import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

import Navigation from './layouts/Navigation';
import GlobalFilterNavContainer from '../containers/GlobalFilterNavContainer';
import MainViewContainer from '../containers/MainViewContainer';
import Joyride from 'react-joyride';

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
			joyrideOverlay: true,
			joyrideType: 'continuous',
			isRunning: false,
			stepIndex: 0,
			steps: [],
			selector: '',
		};

		this.startTour = this.startTour.bind(this);
		this.next = this.next.bind(this);
		this.callback = this.callback.bind(this);
	}

	componentDidMount() {
		const steps = [
			{
				title: "Welcome!",
				text: 'Welcome to DIVA! This application is intended to assist in the discovery of critical drug-drug interactions.',
				selector: '.mainContainer',
			},
			{
				title: "Overview",
				selector: '.overview',
				text: 'This tab shows the network of all drugs (nodes) and their possible interactions (links between nodes).',
			},
			{
				title: "Overview",
				//note, this element was given a second classname as a workaround to force joyride to rerender the step (as the selector changed)
				selector: '.overview2',
				text: 'Click on a node to view more information about that drug. Try it now!',
				style: {
					footer: {
						display: 'none',
					}
				}
			},
			{
				title: "Galaxy View",
				selector: '.galaxy',
				text: 'The Galaxy View offers an overview of a specific drug, showing each of the drug\'s interactions.',
			},
			{
				title: "Galaxy View",
				//note, this element was given a second classname as a workaround to force joyride to rerender the step (as the selector changed)
				selector: '.galaxy2',
				text: 'To view details about the reports behind the visualization, click on the reports icon.',
				style: {
					footer: {
						display: 'none',
					}
				}
			},
			{
				title: "Report View",
				selector: '.report',
				text: 'The Reports View shows the FAERS reports that support any possible interactions. Click Close to exit the view.',
				style: {
					footer: {
						display: 'none',
					}
				}
			},
			{
				title: "Interaction Profile",
				selector: '.profile',
				text: 'The Interaction Profile shows all drugs that interact with the selected drug and ADRs caused by those interactions.',
			},
			{
				title: "Known/Unknown Filter",
				selector: '.knownUnknown',
				text: 'Here you can filter drug-drug interactions based on whether they are known or unknown.',
			},
			{
				title: "Min/Max Filter",
				selector: '.scoreMinMax',
				text: 'Similarly, you can filter interactions in each view by selecting a minimum and maximum score.',
			},
			{
				title: "Min/Max Filter",
				//note, this element was given a second classname as a workaround to force joyride to rerender the step (as the selector changed)
				selector: '.scoreMinMax2',
				text: 'Use the distribution above the slider to get an idea of how the scores are distributed.',
			},
			{
				title: "Thanks!",
				text: 'This concludes the tour! If you have more questions, our contact information is in the About Us section of the Help menu.',
				selector: '.mainContainer',
			},
		];

		this.setState({steps: steps});
	}

	next() {
		if(this.state.isRunning) {
			this.joyride.next();
		}
	}

	callback(data) {
		if(data.type === 'finished') {
			this.joyride.reset();
			this.setState({isRunning: false});
		}else if(data.type === 'step:before') {
			this.setState({selector: data.step.selector});
			if(data.step.selector === '.report' || data.step.selector === '.knownUnknown' 
			|| data.step.selector === '.scoreMinMax' || data.step.selector === '.scoreMinMax2'
			|| data.step.selector === '.mainContainer') {
				this.setState({joyrideOverlay: false});
			}else if(!this.state.joyrideOverlay){
				this.setState({joyrideOverlay: true});
			}
		}
	}

	startTour() {
		this.joyride.reset(true);
		this.setState({isRunning: true});
	}


	render() {
		const {
			isRunning,
			joyrideOverlay,
			joyrideType,
			stepIndex,
			steps,
		  } = this.state;

		return (
			<div className="mainContainer">
				<Joyride
					ref={ c => (this.joyride = c)}
					callback={this.callback}
					debug={false}
					disableOverlay={false}
					locale={{
					  back: (<span>Back</span>),
					  close: (<span>Close</span>),
					  last: (<span>Finish</span>),
					  next: (<span>Next</span>),
					  skip: (<span>Skip</span>),
					}}
					run={isRunning}
					showOverlay={joyrideOverlay}
					showSkipButton={true}
					showStepsProgress={true}
					stepIndex={stepIndex}
					steps={steps}
					type={joyrideType}
					autoStart={true}
					allowClicksThruHole={true}
					keyboardNavigation={false}
					disableOverlay={false}
					scrollToSteps={true}
				/>
				{/* <Navigation /> */}
				<GlobalFilterNavContainer startTour={this.startTour}/>
				<MainViewContainer currentSelector={this.state.selector} nextTourStep={this.next}/>
			</div>
		)
	}
}
				

