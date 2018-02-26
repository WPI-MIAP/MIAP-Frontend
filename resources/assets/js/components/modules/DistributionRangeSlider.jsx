import React, { Component } from 'react';
import 'rc-slider/assets/index.css';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import { secondaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import { primaryColor } from '../../utilities/constants';


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

export default class DistributionRangeSlider extends Component {
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

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.rules !== this.props.rules) {
			this.findFrequencyDistribution();
		}
	}

	componentDidMount() {
		this.findFrequencyDistribution();
	}

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
			<Paper style={{width: 310, height: 50, background: primaryColor}}>
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
						style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={{border: 'none'}} trackStyle={[{background: 'white'}]} railStyle={{background: secondaryColor}}
						dotStyle={{display: 'none'}}/>
		  	</div>
				</Paper>
		);
	}
}