import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import ActionHelpOutline from 'material-ui/svg-icons/action/help-outline';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import DndGraph from './DndGraph';
import DndTreeContainer from '../layouts/DndTreeContainer';
import InteractionProfile from './InteractionProfile';
import { dmeColors, scoreColors, regularADRColor, severeADRColor, adrBorderColor, primaryColor, secondaryColor, barColor, barSelectedColor } from '../../utilities/constants';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell, Label} from 'recharts';
import 'rc-slider/assets/index.css';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const dummyDrugFreqs = [{name: 'Drug 1', freq: 8}, {name: 'Drug 2', freq: 6}, {name: 'Drug 3', freq: 5}, {name: 'Drug 4', freq: 3}, {name: 'Drug 5', freq: 1}];

const styles = {
	dropDown: {
	  width: 165,
	  height: 56,
	  border: '1px white', 
	  borderStyle: 'solid',
	  borderRadius: 5,
	  paddingBottom: 6,
	  marginTop: 4,
	  marginLeft: 10,
	},
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
	  background: 'black'
	}
  };
  

const dummyData = {
  nodes: [
    'Drug 1',
    'Drug 2',
    'Drug 3'
  ],
  edges: [
    {
      Rank: "408",
      Score: 0.089384071,
      ADR: "ADR 1",
      r_Drugname: "[Drug 1] [Drug 2]",
      Support: 15,
      Confidence: 30,
      Drug1: {
        id: 0,
        name: "Drug 1"
      },
      Support1: 12,
      Confidence1: 21.8182,
      Drug2: {
        id: 1,
        name: "Drug 2"
      },
      Support2: 34,
      Confidence2: 9.65909,
      status: "unknown",
      id: "1, 2, 4, 6"
    },
    {
      Rank: "702",
      Score: 0.314159265,
      ADR: "ADR 2",
      r_Drugname: "[Drug 2] [Drug 3]",
      Support: 45,
      Confidence: 60,
      Drug1: {
        id: 1,
        name: "Drug 2"
      },
      Support1: 19,
      Confidence1: 21.8182,
      Drug2: {
        id: 2,
        name: "Drug 3"
      },
      Support2: 56,
      Confidence2: 11.1241,
      status: "known",
      id: "3, 5, 7, 9, 11, 37"
    }
  ],
  currentDrugs: [
    ['Drug 2', {drugs: ['Drug 1', 'Drug 2', 'Drug 3'], 
      rules: [
        {
          Rank: "408",
          Score: 0.089384071,
          ADR: "ADR 1",
          r_Drugname: "[Drug 1] [Drug 2]",
          Support: 15,
          Confidence: 30,
          Drug1: {
            id: 0,
            name: "Drug 1"
          },
          Support1: 12,
          Confidence1: 21.8182,
          Drug2: {
            id: 1,
            name: "Drug 2"
          },
          Support2: 34,
          Confidence2: 9.65909,
          status: "unknown",
          id: "1, 2, 4, 6"
        },
        {
          Rank: "702",
          Score: 0.314159265,
          ADR: "ADR 2",
          r_Drugname: "[Drug 2] [Drug 3]",
          Support: 45,
          Confidence: 60,
          Drug1: {
            id: 1,
            name: "Drug 2"
          },
          Support1: 19,
          Confidence1: 21.8182,
          Drug2: {
            id: 2,
            name: "Drug 3"
          },
          Support2: 56,
          Confidence2: 11.1241,
          status: "known",
          id: "3, 5, 7, 9, 11, 37"
        }
      ],
    drugDMEs: ["ADR 2"]}]
  ],
  selectedDrug: 'Drug 2',
};


export default class Help extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		dialogOpen: false,
		helpBarSelectedIndex: -1
	  }

	  this.startTour = this.startTour.bind(this);
	}

	startTour() {
		this.setState({dialogOpen: false});
		this.props.startTour();
	}
  
	render() {
		const actions = [
			<FlatButton
			  label="Take a tour"
			  primary={true}
			  onClick={this.startTour}
			/>, 
			<FlatButton
			  label="Done"
			  primary={true}
			  onClick={() => {this.setState({dialogOpen: false})}}
			/>
		  ];

		  const dummyMarks = {
			[this.props.minScore]: {
				style: {
				  position: 'absolute',
				  zIndex: 1100,
				  color: 'white',
				  top: 0,
				}, label: 'Min Score: ' + (this.props.minScore === undefined ? -1 : this.props.minScore.toFixed(2)),
			  },
			[this.props.maxScore]: {
			  style: {
				position: 'absolute',
				zIndex: 1100,
				color: 'white',
				top: 0,
			  }, label: 'Max Score: ' + (this.props.maxScore === undefined ? 1 : this.props.maxScore.toFixed(2)),
			}
		  };

		return (
			<div>
				<IconButton 
					tooltip="Help"
					iconStyle={{ color: 'white' }}
					tooltipPosition='bottom-left'
					onClick={() => {this.setState({dialogOpen: true})}}
				>
					<ActionHelpOutline />	
				</IconButton>
				<Dialog
					title="Help"
					contentStyle={{width: "80%", maxWidth: "none"}}
					actions={actions}
					modal={false}
					open={this.state.dialogOpen}
					onRequestClose={() => {this.setState({dialogOpen: false})}}
					autoScrollBodyContent={true}>
					<Grid>
						<Row>
							<Card initiallyExpanded={true} style={{width: '100%'}}>
							<CardHeader
								title="Views"
								actAsExpander={true}
								showExpandableButton={true}
							/>
							<CardText expandable={true}>
								<Row>
								<Col sm={12} md={7}>
									<h5>Overview</h5>
									<ul>
									<li>Each <b>node</b> is a <b>drug</b></li>
									<li>Each <b>edge</b> represents a possible <b>drug-drug interaction</b></li>
									<li>Each <b>edge (drug-drug interaction)</b> corresponds to an <b>adverse drug reaction (ADR)</b></li>
									<li>A <b>dashed edge</b> means the interaction is <b>known</b></li>
									<li>A <b>solid edge</b> means the interaction is <b>unknown</b></li>
									<li>The <b>edge color</b> represents the highest <b>interaction score</b> of all interactions between the two drugs</li>
									<li><b>Clicking on a node</b> causes that drug to appear in the <b>Galaxy and Interaction Profile Views</b></li>
									<li><b>Hovering over an edge</b> will provide <b>additional information</b> about that <b>interaction (try it now)</b></li>
									</ul>
								</Col>
								<Col sm={12} md={5}>
									<Row>
									<Paper zDepth={1} style={{height: 170, width: 230}}>
										<DndGraph 
										nodes={dummyData.nodes}
										links={dummyData.edges}
										width={100}
										height={100} 
										selectedDrug=''
										onClickNode={() => {}}
										onClickEdge={() => {}}
										isFetching={false}
										filter='all'
										minScore={-50}
										maxScore={50}
										scoreRange={this.props.scoreRange}
										/>
									</Paper>
									<Col style={{marginLeft: 20}}>
										<Row style={{height: 34}}>
										{'Interaction Score'}
										</Row>
										{scoreColors.map(scoreColor => (
										<Row>
											<div style={{width: 34, height: 34, background: scoreColor.color, marginRight: 10}}/>
											<div><p>{scoreColor.text}</p></div>
										</Row>
										))}
									</Col>
									</Row>
								</Col>
								</Row>
								<Row style={{marginTop: 20}}>
								<Col sm={12} md={7}>
									<h5>Galaxy View</h5>
									<ul>
									<li>The <b>central drug (blue)</b> in a window is the <b>drug of interest</b></li>
									<li>The <b>surrounding nodes</b> are drugs that <b>interact with the central drug</b></li>
									<li><b>Surrounding nodes</b> are <b>colored</b> according to the <b>highest score</b> of all <b>interactions between that drug and the drug of interest</b></li>
									<li>The <b>color</b> of a window's header indicates the <b>severe ADR count</b> associated with the drug of interest</li>
									<li>Drugs in this view can be <b>sorted</b> by <b>name</b>, <b>interaction count</b>, or <b>number of severe ADRs</b></li>
									<li>Surrounding nodes are <b>bigger</b> if there may be an <b>unknown interaction</b> with that drug</li>
									<li>Surrounding nodes are <b>smaller</b> if there are only <b>known interactions</b> with that drug</li>
									<li><b>Buttons on a window's header</b> allow you to <b>view a drug in the Interaction Profile view</b>, <b>see reports for that drug</b>, or <b>remove the drug from the Galaxy view</b></li>
									</ul>
								</Col>
								<Col sm={12} md={5}>
									<Row>
									<Paper zDepth={1} style={{height: 210, width: 230}}>
										<DndTreeContainer 
										currentDrugs={dummyData.currentDrugs}
										filter='all'
										minScore={-50}
										maxScore={50}
										onClickNode={() => {}}
										onDeleteNode={() => {}}
										cols={4}
										selectedDrug={dummyData.selectedDrug}
										testExample={true}
										scoreRange={this.props.scoreRange}
										dmeRange={this.props.dmeRange}
										/>
									</Paper>
									<Col style={{marginLeft: 20}}>
										<Row style={{height: 35}}>
										{'Severe ADR Count'}
										</Row>
										{dmeColors.map(dmeColor => (
										<Row style={{height: 35}}>
											<div style={{width: 34, background: dmeColor.color, marginRight: 10}}/>
											<div><p>{dmeColor.text}</p></div>
										</Row>
										))}
									</Col>
									</Row>
								</Col>
								</Row>
								<Row style={{marginTop: 20}}>
								<Col sm={12} md={7}>
									<h5>Interaction Profile</h5>
									<ul>
									<li>Provides a detailed look at an <b>individual drug</b> using a <b>tree layout</b> with three levels</li>
									<li>The <b>root node</b> is the <b>selected drug</b></li>
									<li>The <b>second level</b> shows all drugs that may <b>interact with the selected drug</b></li>
									<li>The <b>third level</b> represents the <b>ADRs that may result</b> from that interaction</li>
									<li><b>Severe ADRs</b> are <b>purple</b>, while <b>other ADRs</b> are <b>grey</b></li>
									<li><b>Clicking</b> on a node at the first or second level will <b>minimize/maximize sections of the tree</b></li>
									</ul>
								</Col>
								<Col sm={12} md={5}>
									<Row>
									<Paper zDepth={1} style={{height: 210, width: '100%', overflow: 'hidden',}}>
										<InteractionProfile
										helpExample={true}
										scoreRange={this.props.scoreRange}
										/>
										<Row style={{float: 'right', position: 'relative', zIndex: 1600, marginRight: 10, marginTop: -60}}>
										<Col style={{marginRight: 10}}>
											<div style={{height: 35, width: 34, margin: '0 auto', background: severeADRColor, border: adrBorderColor, borderStyle: 'solid'}}/>
											<div>Severe ADR</div>
										</Col>
										<Col>
											<div style={{height: 35, width: 34, margin: '0 auto', background: regularADRColor, border: adrBorderColor, borderStyle: 'solid'}}/>
											<div>Normal ADR</div>
										</Col>
										</Row>
									</Paper>
									</Row>
								</Col>
								</Row>
							</CardText>
							</Card>
							<Card initiallyExpanded={true} style={{width: '100%'}}>
							<CardHeader
								title="Filters"
								actAsExpander={true}
								showExpandableButton={true}
							/>
							<CardText expandable={true}>
								<Row>
								<Col sm={12} md={7}>
									<ul>
									<li><b>Filters</b> are located in the <b>top bar</b></li>
									<li>A <b>dropdown menu</b> enables filtering interactions by <b>known or unknown</b></li>
									<li>A <b>slider</b> enables selection of a <b>minimum and maximum score</b> for interactions</li>
									<li>A <b>search bar</b> allows users to search for and <b>select a specific drug</b></li>
									</ul>
								</Col>
								<Col sm={12} md={5}>
									<Paper zDepth={1} style={{background: primaryColor, width: 200, height: 64}}>
									<DropDownMenu 
										className="knownUnknown"
										value={this.props.dropDownValue}
										onChange={() => {}} 
										style={styles.dropDown}
										autoWidth={false} 
										labelStyle={{ color: 'white' }}
										targetOrigin={{horizontal: 'right', vertical: 'top'}}
										anchorOrigin={{horizontal: 'right', vertical: 'top'}}
										selectedMenuItemStyle={{ color: primaryColor }}
									>
										<MenuItem value='all' primaryText="All DIARs" />
										<MenuItem value='known' primaryText="Known DIARs" />
										<MenuItem value='unknown' primaryText="Unknown DIARs" />
									</DropDownMenu> 
									</Paper>
									<Paper zDepth={1} style={{background: primaryColor, width: 310, height: 64, marginTop: 10}}>
									<div 
										style={{position: 'relative', top: -25, marginLeft: 0}}>
										<LineChart
										width={274}
										height={60}
										data={this.props.scoreDistribution}
										xMin={this.props.minScore}
										xMax={this.props.maxScore}
										yMax={0}
										yMin={180}
										hidePoints={true}
										hideXLabel={true}
										hideYLabel={true}
										hideXAxis={true}
										hideYAxis={true}
										margins={{top: 0, bottom: 0, left: 0, right: 0}}/>
										<Range className='scoreMinMax scoreMinMax2'
										defaultValue={[this.props.minScore, this.props.maxScore]} allowCross={false} min={this.props.minScore} max={this.props.maxScore} step={0.01} onAfterChange={() => {}} 
										style={styles.slider} tipProps={styles.sliderTip} marks={dummyMarks} handleStyle={[{border: 'none'}, {border: 'none'}]} trackStyle={[{background: 'white'}]} railStyle={{background: secondaryColor}}
										dotStyle={{display: 'none'}}/>
									</div>
									</Paper>
								</Col>
								</Row>
							</CardText>
							</Card>
							<Card initiallyExpanded={true} style={{width: '100%'}}>
							<CardHeader
								title="Reports"
								actAsExpander={true}
								showExpandableButton={true}
							/>
							<CardText expandable={true}>
								<Row>
								<Col sm={6}>
									<ul>
									<li>This view allows <b>direct access</b> to the <b>FDA's Adverse Event Reporting System (FAERS) data</b></li>
									<li>All <b>reports</b> linked to the chosen <b>drug</b> or <b>drug interaction</b> are shown</li>
									<li>A <b>bar graph</b> shows (up to) the <b>top 10 drugs</b> also found in reports containing the chosen drug or drug interaction</li>
									<li><b>Selecting a drug name</b> or the <b>corresponding bar on the graph</b> will <b>highlight</b> all <b>reports containing that drug</b></li>
									</ul>
								</Col>
								<Col sm={6}>
									<BarChart style={{margin: '0 auto'}} width={400} height={100} data={dummyDrugFreqs}>
									<XAxis tick={false} hide={false} dataKey="name">
										<Label value="Drug Co-occurrences" offset={10} position="insideBottom" />
									</XAxis>
									<YAxis />
									<Tooltip />
									<Bar dataKey="freq" onClick={(data, index) => {this.setState({barSelectedIndex: index})}}>
										{
										dummyDrugFreqs.map((entry, index) => (
											<Cell cursor="pointer" fill={index === this.state.barSelectedIndex ? barSelectedColor : barColor} key={`cell-${index}`}/>
										))
										}
									</Bar>
									</BarChart>
								</Col>
								</Row>
							</CardText>
							</Card>
						</Row>
					</Grid>
				</Dialog>
			</div>
		);
	}
}