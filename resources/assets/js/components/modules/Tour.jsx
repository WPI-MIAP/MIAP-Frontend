import React from 'react';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

/**
 * Define all of the tour steps.
 */
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
		title: "Overview - Edges",
		//note, this element was given a second classname as a workaround to force joyride to rerender the step (as the selector changed)
		selector: '.overview2',
		text: 'Clicking on an edge (or a node) will produce a "chip" that you can click on to access reports related to that interaction (or drug). Try clicking on an edge!',
		style: {
			footer: {
				display: 'none',
			}
		}
	},
	{
		title: "Report Chips",
		selector: '.chipContainer',
		text: 'This is where you can find any chips that you generate. You can click on them to access report information.',
	},
	{
		title: "Overview - Nodes",
		//note, this element was given a third classname as a workaround to force joyride to rerender the step (as the selector changed)
		selector: '.overview3',
		text: 'Clicking on a node will allow you to view more information about that drug. Try it now!',
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
		title: "Galaxy View - Reports",
		selector: '.galaxyReports',
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
			},
			arrow: {
				display: 'none'
			},
		},
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
		text: 'This concludes the tour! If you have more questions, our contact information is in the About Us section.',
		selector: '.mainContainer',
	},
];

/**
 * This component contains all of the tour steps and controls operation of the tour.
 * @see https://github.com/gilbarbara/react-joyride
 */
class Tour extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			joyrideOverlay: true,
			joyrideType: 'continuous',
			stepIndex: 0,
			steps: steps,
			showBackButton: true,
			tooltipOffset: 10,
		};

		this.callback = this.callback.bind(this);
		this.getJoyride = this.getJoyride.bind(this);
	}

	/**
	 * Used to access the underlying component that runs the tour.
	 * @see https://github.com/gilbarbara/react-joyride
	 */
	getJoyride() {
		return this.joyride;
	}

	/**
	 * Callback called periodically throughout the operation of the tour.
	 * @param {object} data Contains information about the current status of the tour.
	 * @see https://github.com/gilbarbara/react-joyride
	 */
	callback(data) {
		if(data.type === 'finished' || (data.action === 'close' && data.type === 'step:after')) {
			this.joyride.reset();
			// this.setState({isRunning: false});
			this.props.stopTour();
		}else if(data.type === 'step:before') {
			// this.setState({selector: data.step.selector});
			this.props.updateTourSelector(data.step.selector);
			if(data.step.selector === '.report' || data.step.selector === '.knownUnknown' 
			|| data.step.selector === '.scoreMinMax' || data.step.selector === '.scoreMinMax2'
			|| data.step.selector === '.mainContainer') {
				this.setState({joyrideOverlay: false});
			}else if(!this.state.joyrideOverlay){
				this.setState({joyrideOverlay: true});
			}
			if(data.step.selector === '.galaxyReports') {
				//set offset on step before it is needed, so it is updated by the time it gets to .report step
				this.setState({tooltipOffset: -150});
			}
			else {
				this.setState({tooltipOffset: 10});
			}
			if(data.step.selector === '.profile') {
				this.setState({showBackButton: false});
			}
			else {
				this.setState({showBackButton: true});
			}
		}
	}

	/**
	 * Render the tour.
	 */
	render() {
		const {
			joyrideOverlay,
			joyrideType,
			stepIndex,
			steps,
			tooltipOffset,
			showBackButton
		} = this.state;

		return (
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
				run={this.props.tourRunning}
				showOverlay={joyrideOverlay}
				showBackButton={showBackButton}
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
				tooltipOffset={tooltipOffset}
			/>
		)
	}
}

Tour.propTypes = {
	/**
	 * Callback used when the selector the tour is pointing to is changed. Takes the classname of the currently selected component as a parameter.
	 */
	updateTourSelector: PropTypes.func.isRequired, 
	/**
	 * Function that can be called to stop the tour.
	 */
	stopTour: PropTypes.func.isRequired,
	/**
	 * Boolean indicating whether the tour should be running or not.
	 */
	tourRunning: PropTypes.bool.isRequired
};

export default Tour;