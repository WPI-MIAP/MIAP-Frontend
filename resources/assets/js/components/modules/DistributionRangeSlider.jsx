import React, { Component } from 'react';
import 'rc-slider/assets/index.css';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import { secondaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';
import { primaryColor } from '../../utilities/constants';
import PropTypes from 'prop-types';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const styles = {
	slider: {
	  position: 'relative',
	  top: -10,
	  width: 200,
	  zIndex: 1200,
	  marginLeft: 55
	},
	sliderTip: {
	  position: 'relative',
	  zIndex: 1200,
	  placement: 'bottom',
	  background: 'white'
	}
};

/**
 * This component shows a distribution of the scores of all links over a range slider used to filter by score.
 */
class DistributionRangeSlider extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		freqDist: [],
		minScore: -1,
		maxScore: 1,
		filteredMin: '',
		filteredMax: '',
	  }

	  this.findFrequencyDistribution = this.findFrequencyDistribution.bind(this);
	  this.updateMinAndMax = this.updateMinAndMax.bind(this);
	}

	/**
	 * If the rules changed, recalculate the frequency distribution.
	 */
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.rules !== this.props.rules) {
			this.findFrequencyDistribution();
		}
	}

	/**
	 * Find frequency distribution with initial rules.
	 */
	componentDidMount() {
		this.findFrequencyDistribution();
	}

	/**
	 * Updates the min and max labels shown on the range slider.
	 * 
	 * @param {array} value Array containing the max (value[1]) and the min (value[0])
	 */
	updateMinAndMax(value) {
		if(value[1] !== this.state.filteredMax || value[0] !== this.state.filteredMin) {
		  this.setState({
			filteredMax: value[1],
			filteredMin: value[0],
		  });
		  this.props.updateMaxScore(value[1]);
		  this.props.updateMinScore(value[0]);
		  this.props.isUpdating(true);
		}
	}

	/**
	 * Calculates and scales the frequency distribution.
	 */
	findFrequencyDistribution(){
		if(this.props.rules.length > 1) {
		 	// find frequency distribution of rules by score, find max score and min score
			var freqDist = [];
			var maxScore = this.props.rules[0]['Score'];
			var minScore = this.props.rules[0]['Score'];
			var ruleCount = this.props.rules.length;
			this.props.rules.forEach(rule => {
				rule['Score'] = parseFloat(rule['Score']);
				//check freqDist to see if score has already been seen before
				var found = false;
				for(var i=0; i < freqDist.length; i++) {
				if(Math.abs(freqDist[i]['Score'] - rule['Score']) < 0.03) {
					freqDist[i]['Freq'] = freqDist[i]['Freq'] + 1;
					found = true;
					break;
				}
				}
				if(!found) {
				//add entry for current score
				freqDist.push({'Score': rule['Score'], 'Freq': 1});
				}
				
				//check min and max scores
				if(rule['Score'] < minScore) {
				minScore = rule['Score'];
				}
				if(rule['Score'] > maxScore) {
				maxScore = rule['Score'];
				}
			});
		
			//scale the distribution to make it easier to see
			freqDist.forEach(entry => {
				entry['Freq'] = (entry['Freq'] * 300) / ruleCount;
			});
		
			freqDist = _.sortBy(freqDist, 'Score');
		
			minScore = parseFloat(minScore);
			maxScore = parseFloat(maxScore);
		
			this.setState({
				minScore: minScore,
				maxScore: maxScore,
				freqDist: freqDist
			});
		}
	};
  
	render() {
		const marks = {
			[this.state.minScore]: {
				style: {
				  position: 'absolute',
				  zIndex: 1100,
				  color: 'white',
				  top: (this.props.helpExample) ? -4 : 0,
				}, label: 'Min Score: ' + this.state.minScore.toFixed(2),
			  },
			[this.state.maxScore]: {
			  style: {
				position: 'absolute',
				zIndex: 1100,
				color: 'white',
				top: (this.props.helpExample) ? -4 : 0,
			  }, label: 'Max Score: ' + this.state.maxScore.toFixed(2),
			}
		};
	  
		var points = [];
		this.state.freqDist.forEach(entry => {
			points.push({x: entry['Score'], y: entry['Freq']});
		});
	
		const data = [
			{									
				color: secondaryColor, 
				points: points
			}
		];
	
		return (
			<Paper style={{width: 310, height: 55, background: 'rgba(255,255,255,0.1)'}}>
			<div style={{position: 'relative', top: -35, zIndex: 100}}>
					<LineChart
						width={274}
						height={60}
						data={data}
						xMin={this.state.minScore}
						xMax={this.state.maxScore}
						yMax={0}
						yMin={180}
						hidePoints={true}
						hideXLabel={true}
						hideYLabel={true}
						hideXAxis={true}
						hideYAxis={true}
						margins={{top: 0, bottom: 0, left: 0, right: 0}}/>
					<Range className='scoreMinMax scoreMinMax2'
						defaultValue={[this.state.minScore, this.state.maxScore]} allowCross={false} min={this.state.minScore} max={this.state.maxScore} step={0.01} onAfterChange={this.updateMinAndMax} 
						style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={[{border: 'none'},{border: 'none'}]} trackStyle={[{background: 'white'}]} railStyle={{background: secondaryColor}}
						dotStyle={{display: 'none'}}/>
		  	</div>
				</Paper>
		);
	}
}

DistributionRangeSlider.propTypes = {
	/**
	 * Array of rules representing all interaction between pairs of drugs in the visualization.
	 */
	rules: PropTypes.array.isRequired,
 
	/**
	 * Used to set the new minimum score. Takes the new minimum score (a number) as a paramter.
	 */
	updateMinScore: PropTypes.func,
	
	/**
	 * Used to set the new maximum score. Takes the new maximum score (a number) as a paramter.
	 */
	updateMaxScore: PropTypes.func,
	
	/**
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
	isUpdating: PropTypes.func,
	
	/**
	 * Indicates whether this is the version found in the help menu (defaults to false).
	 */
	helpExample: PropTypes.bool
};

DistributionRangeSlider.defaultProps = {
	helpExample: false,
	updateMinScore: () => {},
	updateMaxScore: () => {},
	isUpdating: () => {}
};

export default DistributionRangeSlider;