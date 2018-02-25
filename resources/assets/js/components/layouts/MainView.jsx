import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import DndGraph from '../modules/DndGraph';
import InteractionProfile from '../modules/InteractionProfile';
import DndTreeContainer from './DndTreeContainer';
import {GridList, GridTile} from 'material-ui/GridList';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer'
import Paper from 'material-ui/Paper';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import Share from 'material-ui/svg-icons/social/share';
import IconButton from 'material-ui/IconButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Tabs, Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import Report from '../modules/Report'
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { dmeColors, scoreColors } from '../../utilities/constants'
import { generateColor } from '../../utilities/functions'

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	gridList: {
		width: window.clientWidth,
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
			contactUs: false,
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
		// if(this.props.selectedDrug !== nextProps.selectedDrug && nextProps.selectedDrug !== undefined && 
		// 	nextProps.selectedDrug !== '' && _.find(this.state.reportChips, chip => (chip.drugs[0] == _.toLower(_.trim(nextProps.selectedDrug)) && chip.drugs[1] === undefined)) == undefined) {
		// 	var chips = this.state.reportChips;
		// 	chips.unshift({type: 'drug', drugs: [_.toLower(_.trim(nextProps.selectedDrug))]});
		// 	this.setState({reportChips: chips});
		// }
		console.log(nextProps.currentDrugs);
		
		nextProps.currentDrugs.forEach(drug => {
			if (! _.find(this.state.reportChips, chip => (chip.drugs[0] == _.toLower(_.trim(drug[0])) && ! chip.drugs[1]))) {
				let chips = this.state.reportChips;
				chips.unshift({type: 'drug', drugs: [_.toLower(_.trim(drug[0]))]});
				this.setState({reportChips: chips});
			}
		})

		this.setState((prevState, props) => {
			return {
				reportChips: prevState.reportChips.filter(chip => {
					return _.find(props.currentDrugs, drug => (drug[0] == _.toLower(_.trim(chip.drugs[0])))) || chip.type == "adr"
				})
			}
		});

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
			return ((_.toLower(link.Drug1.name) === drug1 && _.toLower(link.Drug2.name) === drug2) || 
			(_.toLower(link.Drug1.name) === drug2 && _.toLower(link.Drug2.name) === drug1));
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
					if(this.props.currentSelector === '.galaxy2') {
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
			contactUs: false,
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

		/**
		 * Clear rule or drug when deleting the currently selected one
		 */
		if (key.type === "drug") {
			this.props.deleteNode(key.drugs[0]);
			if (this.props.selectedDrug === key.drugs[0]) {
				this.props.clearSearchTerm();
			}
		}
		if (key.type === "adr" && this.props.selectedRule === key.drugs.join(' --- ')) {
			this.props.clearRule();
		}
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
				isOverviewFullscreen: false,
				isGalaxyFullscreen: false,
				isProfileFullscreen: true
			}
		})
	}

	getTabsIndex() {
		if (this.state.isOverviewFullscreen) {
			return 0;
		} else if (this.state.isGalaxyFullscreen) {
			return 1;
		} else if (this.state.isProfileFullscreen) {
			return 2;
		} else {
			return 0;
		}
	}

	handleChange(value) {
		this.setState({
		  value: value,
		});
	}

	onClickNodeTour(drug) {
		this.props.onClickNode(drug);
		if(this.props.currentSelector === '.overview2'){
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
				<Grid fluid style={{ marginTop: 15, height: '80vh'}}>
					<FloatingActionButton
						onClick={() => {this.setState({ col: 4, isOverviewFullscreen: false, isGalaxyFullscreen: false, isProfileFullscreen: false })}}
						backgroundColor={'#2D3E46'}
						style={{
							position: 'absolute',
							right: 30,
							bottom: 30,
							zIndex: 100,
							display: this.state.col === 12 ? 'block' : 'none'
						}}
					>
						<NavigationFullscreenExit />
					</FloatingActionButton>
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
									className="overview overview2"
									titleBackground="#2D3E46"
									style={{
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
										onClickEdge={this.props.onClickEdge}
										isFetching={this.props.isFetching}
										filter={this.props.filter}
										minScore={this.props.minScore}
										maxScore={this.props.maxScore}
										isUpdating={this.props.isUpdating}
									/>
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid #E9EBEE', width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
											{scoreColors.map(scoreColor => (
												<Col xs={3} md={3}>
													<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
													<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
												</Col>
											))}
										</Row>
									</Col>
							</Paper>
						</Col>
						<Col xs={12} md={this.state.col} style={{
							display: (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
							top: this.state.col == 12 ? -14 : 0
						}}
						>
							<Paper zDepth={1}
							>
								<GridTile
									title={this.state.col != 12 ? "Galaxy View" : ""}
									titlePosition="top"
									className="galaxy galaxy2"
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
										boxSizing: 'border-box',
										background: 'white',
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
										onClearDrug={this.props.clearSearchTerm}
										cols={this.state.col}
										selectedDrug={this.props.selectedDrug}
										handleOpen={this.handleOpen}
									/>
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid #E9EBEE', width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
										{dmeColors.map(dmeColor => (
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColor.color, margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>{dmeColor.text}</div>
											</Col>
										))}
										</Row>
									</Col>
							</Paper>
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
							display: (this.state.col === 12 && (this.state.isGalaxyFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
							top: this.state.col == 12 ? -14 : 0
						}}>
							<Paper zDepth={1}>
								<GridTile
									title={this.state.col != 12 ? ('Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")) : ""}
									titlePosition="top"
									className="profile"
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
					<Row style={{ margin: '8px 0'}}> 
							{this.state.reportChips.map(this.renderChip, this)}
					</Row>
					<Row style={{background: '#2D3E46', color: 'white', paddingLeft: 50, paddingRight: 50, paddingTop: 18, height: 60, marginLeft: -16, marginRight: -16}}>
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
					<li>Brian McCarthy, Senior, CS '18</li>
					<li>Andrew Schade, Senior, CS '18</li>
					<li>Huy Tran, Senior, CS '18</li>
					<li>Brian Zylich, BS/MS Candidate, CS '19</li>
				</ul>
				<b>Graduate Student Mentors:</b>
				<ul>
					<li>Xiao Qin, PhD Candidate</li>
					<li>Tabassum Kakar, PhD Candidate</li>
				</ul>
				<b>Faculty Advisor:</b> Elke Rundensteiner<br/>
				<b>Visualization Expert:</b> Lane Harrison<br/>
				<b>FDA Consultants:</b>
				<ul>
					<li>Sanjay K. Sahoo MS. MBA.</li>
					<li>Suranjan De MS. MBA.</li>
				</ul>
				<br/>
				To contact us, email the team at <a href="mailto:diva-support@wpi.edu">diva-support@wpi.edu</a> or Professor Rundensteiner at <a href="mailto:rundenst@cs.wpi.edu">rundenst@cs.wpi.edu</a>.
			</Dialog>
			<Report 
				tableTitle={this.state.tableTitle}
				open={this.state.open}
				handleClose={this.state.handleClose}
				actions={actions}
				tableData={this.state.tableData}
				drugs={this.state.tableDrugs}
			/>
	 	</div>
		)
	}
}

MainView.defaultProps = {
	width: '100%',
	height: '100%'
};
