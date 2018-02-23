import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import InteractionProfile from '../modules/InteractionProfile';
import DndTreeContainer from './DndTreeContainer';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import Share from 'material-ui/svg-icons/social/share';
import {blue300, indigo900} from 'material-ui/styles/colors';
import * as d3 from 'd3';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Tabs, Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import 'intro.js/introjs.css';
import Steps from 'intro.js-react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import Report from '../modules/Report'
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';


const dmeColors = ['#A9A9A9','#9E9AC8', '#807DBA', '#6A51A3', '#4A1486'];
const scoreColors = ['#fecc5c', '#fd8d3c', '#f03b20', 'hsl(0, 100%, 25%)'];

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	gridList: {
		width: window.clientWidth,
		// border: '1px solid grey'
	},
	chip: {
		margin: 4,
		height: 32
	},
	floatingButton: {
		position: 'absolute',
		right: 30,
		bottom: 30,
		zIndex: 100
	},
	legendSevere: {
		backgroundColor: 'black',
		border: '3px solid grey',
		borderRadius: '50%',
		height: 25,
		width: 25,
		textAlign: 'center'
	},
	legendNormal: {
		backgroundColor: 'white',
		border: '3px solid grey',
		borderRadius: '50%',
		height: 25,
		width: 25,
		textAlign: 'center'
	}
};

const generateColor = score => {
	if (score <= 0.0) {
		return '#fecc5c'
	} 
	else if (score > 0.0 && score <= 0.01) {
		return '#fd8d3c'
	}
	else if (score > 0.01 && score <= 0.2) {
		return '#f03b20'
	}
	else if (score > 0.2) {
		return 'hsl(0, 100%, 25%)'
	}
}

export default class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			col: 4,
			isGalaxyFullscreen: false,
			isOverviewFullscreen: false,
			isProfileFullscreen: false,
			reportChips: [],
			tableData: [],
			tableTitle: '',
			tableDrugs: [],
			open: false,
			width: 0,
			height: 0,
			aboutUs: false,
		}

		this.toggleFullscreenOverview = this.toggleFullscreenOverview.bind(this);
		this.toggleFullscreenGalaxy = this.toggleFullscreenGalaxy.bind(this);
		this.toggleFullscreenProfile = this.toggleFullscreenProfile.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderChip = this.renderChip.bind(this);
		this.handleRequestDelete = this.handleRequestDelete.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onClickNodeTour = this.onClickNodeTour.bind(this);
		this.onClickEdgeTour = this.onClickEdgeTour.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({width: window.innerWidth, height: window.innerHeight});
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.selectedDrug !== nextProps.selectedDrug && nextProps.selectedDrug !== undefined && 
			nextProps.selectedDrug !== '' && _.find(this.state.reportChips, chip => (chip.drugs[0] == _.toLower(_.trim(nextProps.selectedDrug)) && chip.drugs[1] === undefined)) == undefined) {
			var chips = this.state.reportChips;
			chips.unshift({type: 'drug', drugs: [_.toLower(_.trim(nextProps.selectedDrug))]});
			this.setState({reportChips: chips});
		}

		if(this.props.selectedRule !== nextProps.selectedRule && nextProps.selectedRule !== undefined && 
			nextProps.selectedRule !== '') {
			var drugs = _.split(nextProps.selectedRule, '---').map((drug) => (_.toLower(_.trim(drug))));
			if(_.find(this.state.reportChips, chip => ((chip.drugs[0] == drugs[0] && chip.drugs[1] == drugs[1]) || (chip.drugs[0] == drugs[1] && chip.drugs[1] == drugs[0]))) == undefined) {
				var chips = this.state.reportChips;
				chips.unshift({type: 'adr', drugs: drugs});
				this.setState({reportChips: chips});
			}
		}	
	}

	renderChip(report) {
		const title = report.type === 'drug' ? _.startCase(report.drugs[0]) : report.drugs.map((drug) => (_.startCase(drug))).join(" - ");
		const drug1 = report.drugs[0];
		const drug2 = report.drugs[1];
		const avatarColor = report.type === 'drug' ? "#2C98F0" : generateColor(this.props.links.filter((link) => {
			var match = ((_.toLower(link.Drug1.name) === drug1 && _.toLower(link.Drug2.name) === drug2) || 
			(_.toLower(link.Drug1.name) === drug2 && _.toLower(link.Drug2.name) === drug1));
			return match;
		})[0].Score);
		return (
			<Chip
				key={title}
				onRequestDelete={() => this.handleRequestDelete(report)}
				style={styles.chip}
				onClick={() => this.handleOpen(report)}
				>
				{ report.type == 'drug' ?
				<Avatar backgroundColor={avatarColor} color="white" /> :
				<Avatar backgroundColor={avatarColor} color="white" icon={<Share />} />
				}
				{title}
			</Chip>
		);
	}

	handleOpen(report) {
		if (report.type === 'drug') {
			axios.get('/csv/reports?drug=' + report.drugs[0])
				.then(response => {
					this.setState({ 
						tableData: response.data,
						tableDrugs: [report.drugs[0]],
					});
					if(this.props.currentSelector === '.galaxyReports') {
						this.props.nextTourStep();
					}	
				});
		}

		if (report.type === 'adr') {
			axios.get('/csv/reports?drug1=' + report.drugs[0] + '&drug2=' + report.drugs[1])
				.then(response => {
					this.setState({ 
						tableData: response.data,
						tableDrugs: report.drugs, 
					});	
				});

		}

		const title = report.type === 'drug' ? _.startCase(report.drugs[0]) : report.drugs.map((drug) => (_.startCase(drug))).join(" - ");

		this.setState({
			open: true,
			tableTitle: 'Reports for ' + title,
		});
  	}

	handleClose() {
		this.setState({
			open: false,
			tableTitle: '',
			tableData: [],
			aboutUs: false,
		});
		if(this.props.currentSelector === '.report') {
			this.props.nextTourStep();
		}
	}


	handleRequestDelete(key) {	
		this.reportChips = this.state.reportChips;
		const chipToDelete = this.reportChips.indexOf(key);
		this.reportChips.splice(chipToDelete, 1);
		this.setState({reportChips: this.reportChips});
	}

	toggleFullscreenOverview() {
		this.setState((prevState, props) => {
			return {
				col: 12,
				isOverviewFullscreen: true,
				isProfileFullscreen: false,
				isGalaxyFullscreen: false
			}
		})
	}

	toggleFullscreenGalaxy() {
		this.setState((prevState, props) => {
			return {
				// col: prevState.col == 4 ? 12 : 4,
				col: 12,
				isOverviewFullscreen: false,
				isGalaxyFullscreen: true,
				isProfileFullscreen: false
			}
		})
	}

	toggleFullscreenProfile() {
		this.setState((prevState, props) => {
			return {
				col: 12,
				// col: prevState.col == 4 ? 12 : 4,
				isOverviewFullscreen: false,
				isGalaxyFullscreen: false,
				isProfileFullscreen: true
			}
		})
	}

	getTabsIndex() {
		if(this.state.isOverviewFullscreen) {
			return 0;
		}else if(this.state.isGalaxyFullscreen) {
			return 1;
		}else if(this.state.isProfileFullscreen) {
			return 2;
		}else {
			return 0;
		}
	}

	handleChange(value) {
		this.setState({
		  value: value,
		});
	}

	onClickEdgeTour(interaction) {
		this.props.onClickEdge(interaction);
		if(this.props.currentSelector === '.overview2'){
			this.props.nextTourStep();
		}
	}

	onClickNodeTour(drug) {
		this.props.onClickNode(drug);
		if(this.props.currentSelector === '.overview3'){
			this.props.nextTourStep();
		}
	}

	render() {
		const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
		];
		
		let topPosition;

		if (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isGalaxyFullscreen)) {
			topPosition = -1000;
		} else if (this.state.col === 12) {
			topPosition = -14;
		} else {
			topPosition = 0;
		}

		return (
			<div>
				<Grid fluid style={{ marginTop: 10, height: '80vh'}}>
					<FloatingActionButton
						onClick={() => {this.setState({ col: 4, isOverviewFullscreen: false, isGalaxyFullscreen: false, isProfileFullscreen: false })}}
						backgroundColor={'#2D3E46'}
						style={{
							position: 'absolute',
							right: 30,
							bottom: '5vh',
							zIndex: 100,
							display: this.state.col === 12 ? 'block' : 'none'
						}}
					>
						<NavigationFullscreenExit />
					</FloatingActionButton>
					<Paper className='chipContainer' zDepth={1} style={{marginBottom: 8, display: 'flex'}}>
						<EditorInsertChart color="#2D3E46" style={{height: 54, width: 54}}/>
						<div style={{height: 54, width: '100%', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', display: 'flex'}}>
							{this.state.reportChips.map(this.renderChip, this)}
						</div>
					</Paper>
					<Row>
						<Col xs={12} md={12}> 
							<Tabs style={{marginBottom: 15,
								display: this.state.col === 4 ? 'none' : 'block'}}
								inkBarStyle={{background: '#29ACBF', height: '4px', marginTop: '-4px'}}
								value={this.getTabsIndex()}
								onChange={this.handleChange}>
								<Tab label={'Overview'} style={{background: "#2D3E46"}} onActive={this.toggleFullscreenOverview} value={0}/>
								<Tab label={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}><div style={{width: 48}}/>Galaxy View <div style={{alignSelf: 'flex-end'}}><TreeViewFilterContainer /></div></div>} style={{background: "#2D3E46"}} onActive={this.toggleFullscreenGalaxy} value={1}/>
								<Tab label={'Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")} style={{background: "#2D3E46"}} onActive={this.toggleFullscreenProfile} value={2}/>
							</Tabs>
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
								position: (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isGalaxyFullscreen)) ? 'absolute' : 'relative',
								top: topPosition
							}}
						>
							<Paper zDepth={1}>
								<GridTile
									title={this.state.col != 12 ? "Overview" : ""}
									titlePosition="top"
									className="overview overview2 overview3"
									// titleBackground="#24915C"
									titleBackground="#2D3E46"
									style={{
										// border: '1px solid #F0F0F0', 
										boxSizing: 'border-box',
										background: 'white',

									}}
									actionIcon={
										<IconButton 
											tooltip="Go Fullscreen"
											iconStyle={{ color: 'white' }}
											tooltipPosition='bottom-left'
											onClick={this.toggleFullscreenOverview}
										>
											<IconFullscreen />	
										</IconButton>
									}
								>
									<DndGraph 
										nodes={this.props.nodes}
										links={this.props.links}
										width={this.props.width}
										height={this.props.height} 
										selectedDrug={this.props.selectedDrug}
										onClickNode={this.onClickNodeTour}
										onClickEdge={this.onClickEdgeTour}
										isFetching={this.props.isFetching}
										filter={this.props.filter}
										minScore={this.props.minScore}
										maxScore={this.props.maxScore}
										isUpdating={this.props.isUpdating}
										// colGalaxy={this.state.colGalaxy}
										// colProfile={this.state.colProfile}
										// colOverview={this.state.colOverview}
									/>
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid #E9EBEE', width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
											<Col xs={3} md={3}>
												<div style={{height: 5, width: 50, background: scoreColors[0], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>Score &lt; 0.0</div>
											</Col>
											<Col xs={3} md={3}>
												<div style={{height: 5, width: 50, background: scoreColors[1], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>0.0 - 0.01</div>
											</Col>
											<Col xs={3} md={3}>
												<div style={{height: 5, width: 50, background: scoreColors[2], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>0.01 - 0.2</div>
											</Col>
											<Col xs={3} md={3}>
												<div style={{height: 5, width: 50, background: scoreColors[3], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>Above 0.2</div>
											</Col>
										</Row>
									</Col>
							</Paper>
						</Col>
						<Col xs={12} md={this.state.col} style={{
							// display: this.state.colOverview == 4 && this.state.colProfile == 4 ? 'block' : 'none',
							display: (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
							top: this.state.col == 12 ? -14 : 0
						}}
						>
							<Paper zDepth={1}
							>
								<GridTile
									title={this.state.col != 12 ? "Galaxy View" : ""}
									titlePosition="top"
									className="galaxy"
									actionIcon={ 
										<div>
											<IconButton 
												tooltip="Go Fullscreen"
												iconStyle={{ color: 'white' }}
												tooltipPosition='bottom-left'
												onClick={this.toggleFullscreenGalaxy}
											>
											<IconFullscreen />	
										</IconButton>
											<TreeViewFilterContainer /> 
										</div>
									}
									titleBackground="#2D3E46"
									style={{
										// border: '1px solid #F0F0F0', 
										boxSizing: 'border-box',
										background: 'white',
										// top: this.state.colGalaxy == 12 ? -14 : 0
										// overflow: 'auto',
										// marginTop: 75
									}}
									cols={this.state.colGalaxy}
								>
									<DndTreeContainer 
										currentDrugs={this.props.currentDrugs}
										filter={this.props.filter}
										minScore={this.props.minScore}
										maxScore={this.props.maxScore}
										width={this.props.width}
										height={this.props.height} 
										onClickNode={this.props.showDetailNode}
										onClickEdge={this.props.onClickEdge}
										onDeleteNode={this.props.deleteNode}
										cols={this.state.col}
										selectedDrug={this.props.selectedDrug}
										handleOpen={this.handleOpen}
									/>
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid #E9EBEE', width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColors[0], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>0 Severe</div>
											</Col>
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColors[1], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>1</div>
											</Col>
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColors[2], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>2</div>
											</Col>
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColors[3], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>3</div>
											</Col>

											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColors[4], margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>4+</div>
											</Col>
										</Row>
									</Col>
							</Paper>
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
							// display: this.state.colGalaxy == 4 && this.state.colOverview == 4 ? 'block' : 'none',
							display: (this.state.col === 12 && (this.state.isGalaxyFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
							top: this.state.col == 12 ? -14 : 0
						}}>
							<Paper zDepth={1}>
								<GridTile
									// title={'Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")}
									title={this.state.col != 12 ? ('Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")) : ""}
									titlePosition="top"
									className="profile"
									// titleBackground="#2B81AC"
									titleBackground="#2D3E46"
									style={{
										// border: '1px solid #F0F0F0', 
										boxSizing: 'border-box',
										background: 'white',
									}}
									actionIcon={
										<IconButton 
											tooltip="Go Fullscreen"
											iconStyle={{ color: 'white' }}
											tooltipPosition='bottom-left'
											onClick={this.toggleFullscreenProfile}
										>
											<IconFullscreen />	
										</IconButton>
									}
								>
									<InteractionProfile 
										mainDrug={this.props.selectedDrug} 
										mainRule={this.props.selectedRule}
									/>
									{/* <Row style={{float: 'right', position: 'relative', zIndex: 400, marginRight: 10, marginTop: -80, padding: 5, background: 'white', border: 'black', borderStyle: 'solid'}}>
										<Col style={{marginRight: 10}}>
											<div style={{height: 35, width: 34, margin: '0 auto', background: 'black', border: '#A9B0B7', borderStyle: 'solid'}}/>
											<div>Severe ADR</div>
										</Col>
										<Col>
											<div style={{height: 35, width: 34, margin: '0 auto', background: 'white', border: '#A9B0B7', borderStyle: 'solid'}}/>
											<div>Normal ADR</div>
										</Col>
									</Row> */}
								</GridTile>
								<Col>
									<hr style={{borderTop: '1px solid #E9EBEE', width: '90%', padding: 0, margin: '0 auto'}}/>
									<Row style={{marginTop: 10, paddingBottom: 10}} center="xs">
										<Col xs={4} md={4}>
											<div style={styles.legendSevere}>
												<span style={{ marginLeft: 30 }}>Severe&nbsp;ADR</span>
											</div>
										</Col>
										<Col xs={4} md={4}>
											<div style={styles.legendNormal}>
												<span style={{ marginLeft: 30 }}>Normal&nbsp;ADR</span>
											</div>
										</Col>
									</Row>
								</Col>
							</Paper>
						</Col>
					</Row>
					<Row style={{background: '#2D3E46', color: 'white', marginTop: 10, paddingLeft: 50, paddingRight: 50, paddingTop: 18, height: 60, marginLeft: -16, marginRight: -16}}>
						<Col sm={6}>
							<p style={{textAlign: 'left'}}>
								© 2018. Worcester Polytechnic Institute. All Rights Reserved.
							</p>
						</Col>
						<Col sm={6} style={{textAlign: 'right'}}>
							<a onClick={() => {this.setState({aboutUs: true})}} style={{color: 'white'}}>About Us</a>
						</Col>
					</Row>
			</Grid>
			<Dialog
              title="About Us"
              contentStyle={{width: "60%", maxWidth: "none"}}
              actions={actions}
              modal={false}
              open={this.state.aboutUs}
              onRequestClose={() => {this.setState({aboutUs: false})}}
              autoScrollBodyContent={true}
			>
				<br/>
				This system for analysis and visualization of multi-drug interactions was developed at Worcester Polytechnic Institute as part of a Major Qualifying Project. The project team
				was composed of: <br/><br/>
				<b>Undergraduate Students:</b> 
				<ul>
					<li><b>Brian McCarthy</b>, Senior, CS '18</li>
					<li><b>Andrew Schade</b>, Senior, CS '18</li>
					<li><b>Huy Tran</b>, Senior, CS '18</li>
					<li><b>Brian Zylich</b>, BS/MS Candidate, CS '19</li>
				</ul>
				<b>Graduate Student Mentors:</b>
				<ul>
					<li><b>Xiao Qin</b>, PhD Candidate</li>
					<li><b>Tabassum Kakar</b>, PhD Candidate</li>
				</ul>
				<b>Faculty:</b> <b>Prof. Rundensteiner</b> and <b>Prof. Harrison</b><br/>
				<b>FDA:</b>
				<ul>
					<li><b>Suranjan De</b>, MS, MBA.<br/>{'Deputy Director, Regulatory Science Staff (RSS), Office of Surveillance & Epidemiology, CDER, FDA'}</li>
					<li><b>Sanjay K. Sahoo</b>, MS, MBA<br/>{'Team Lead (Acting) Regulatory Science Staff (RSS), Office of Surveillance & Epidemiology, CDER, FDA'}</li>
					<li><b>FDA Safety Evaluators:</b></li>
					<ul>
						<li><b>Christian Cao</b></li>
						<li><b>Monica Munoz</b></li>
						<li><b>Tingting Gao</b></li>
						<li><b>Jo Wyeth</b></li>
						<li><b>Oanh Dang</b></li>
						<li><b>Cathy Miller</b></li>
						<li><b>Madhuri Patel</b></li>
					</ul>
				</ul>
				
				Tabassum and Xiao are thankful to Oak Ridge Institute for Science and Education (ORISE) managed for the U.S. Department of Energy (DOE) by Oak Ridge Associated Universities (ORAU) for supporting this work.
				<br/>
				<br/>
				To contact us, email the team at <a href="mailto:diva-support@wpi.edu">diva-support@wpi.edu</a> or Prof. Rundensteiner at <a href="mailto:rundenst@cs.wpi.edu">rundenst@cs.wpi.edu</a>.
			</Dialog>
			<Report 
				tableTitle={this.state.tableTitle}
				open={this.state.open}
				handleClose={this.state.handleClose}
				actions={actions}
				tableData={this.state.tableData}
				drugs={this.state.tableDrugs}
				currentSelector={this.props.currentSelector}
				nextTourStep={this.props.nextTourStep}
				windowWidth={this.state.width}
			/>
	 	</div>
		)
	}
}

MainView.defaultProps = {
	width: '100%',
	height: '100%'
};
