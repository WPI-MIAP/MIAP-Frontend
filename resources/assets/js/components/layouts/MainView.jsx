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
import { dmeColors, scoreColors, regularADRColor, adrBorderColor, complementaryColor, selectedColor, baseNodeColor, secondaryColor } from '../../utilities/constants';
import { generateColor } from '../../utilities/functions';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import Footer from '../modules/Footer';
import Slider from 'react-slick';
import SwipeableViews from 'react-swipeable-views';


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
		backgroundColor: dmeColors[3].color,
		border: '3px solid ' + adrBorderColor,
		borderRadius: '50%',
		height: 25,
		width: 25,
		textAlign: 'center'
	},
	legendNormal: {
		backgroundColor: regularADRColor,
		border: '3px solid ' + adrBorderColor,
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
			hover: false
		}

		this.toggleHover = this.toggleHover.bind(this);
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

		const avatarColor = report.type === 'drug' ? baseNodeColor : generateColor(this.props.links.filter((link) => {
			var match = ((_.toLower(link.Drug1.name) === drug1 && _.toLower(link.Drug2.name) === drug2) || 
			(_.toLower(link.Drug1.name) === drug2 && _.toLower(link.Drug2.name) === drug1));
			return match;
		})[0].Score, this.props.scoreRange);
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

	toggleHover() {
		this.setState({ hover: !this.state.hover });
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

		let profileTitle = 'Interaction Profile';
		if (this.props.selectedDrug != '') {
			profileTitle += `: ${_.capitalize(this.props.selectedDrug)}`;
		} else if (this.props.selectedRule != '') {
			const drugsString = this.props.selectedRule.split(' --- ').map(drug => _.capitalize(drug)).join(' - ');
			profileTitle += `: ${drugsString}`;
		}
		// const profileTitle = this.state.col != 12 ? ('Interaction Profile ' + drugString) : '';

		return (
			<div>
				<Grid fluid style={{ marginTop: 15, height: '70vh'}}>
					<FloatingActionButton
						onClick={() => {this.setState({ col: 4, isOverviewFullscreen: false, isGalaxyFullscreen: false, isProfileFullscreen: false })}}
						backgroundColor={complementaryColor}
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
					<Paper className='chipContainer' zDepth={1} style={{marginBottom: 15, display: 'flex'}}>
						<EditorInsertChart color={complementaryColor} style={{height: 54, width: 54}}/>
						<div style={{ 
							height: 54, 
							width: '100%', 
							overflowX: 'auto',
							overflowY: 'hidden', 
							whiteSpace: 'nowrap', 
							display: 'flex', 
						}}
							onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}
						>
							{this.state.reportChips.map(this.renderChip, this)}
						</div>
					</Paper>

					<Row>
						<Col xs={12} md={12}> 
							<Tabs style={{marginBottom: 15,
								display: this.state.col === 4 ? 'none' : 'block'}}
								inkBarStyle={{background: selectedColor, height: '4px', marginTop: '-4px'}}
								value={this.getTabsIndex()}
								onChange={this.handleChange}>
								<Tab label={'Overview'} style={{background: complementaryColor}} onActive={this.toggleFullscreenOverview} value={0}/>
								<Tab label={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}><div style={{width: 48}}/>Galaxy View <div style={{alignSelf: 'flex-end'}}><TreeViewFilterContainer /></div></div>} style={{background: complementaryColor}} onActive={this.toggleFullscreenGalaxy} value={1}/>
								<Tab label={profileTitle} style={{background: complementaryColor}} onActive={this.toggleFullscreenProfile} value={2}/>
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
									titleBackground={complementaryColor}
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
										onClickEdge={this.onClickEdgeTour}
										isFetching={this.props.isFetching}
										filter={this.props.filter}
										minScore={this.props.minScore}
										maxScore={this.props.maxScore}
										isUpdating={this.props.isUpdating}
										scoreRange={this.props.scoreRange}
									/>
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
											{scoreColors.map(scoreColor => (
												<Col xs={3} md={3}>
													<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
													<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
												</Col>
											))}
										</Row>
										<Row style={{ paddingBottom: 10 }}><Col sm={12} style={{textAlign: 'center'}}>Interaction Score</Col></Row>
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
									titleBackground={complementaryColor}
									style={{
										boxSizing: 'border-box',
										background: 'white',
									}}
									cols={this.state.colGalaxy}
								>
									{
										_.isEmpty(this.props.currentDrugs) ? 
										<div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
											<h4 style={{ color: 'grey' }}>
												No drugs are being selected
											</h4>
										</div> :
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
											scoreRange={this.props.scoreRange}
											dmeRange={this.props.dmeRange}
										/>
									}
								</GridTile>
									<Col>
										<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row style={{marginTop: 10, paddingBottom: 10}}>
										{dmeColors.map(dmeColor => (
											<Col xs={2.4} md={2.4}>
												<div style={{height: 5, width: 50, background: dmeColor.color, margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>{dmeColor.text}</div>
											</Col>
										))}
										</Row>
										<Row style={{ paddingBottom: 10 }}><Col sm={12} style={{textAlign: 'center'}}>Severe ADR Count</Col></Row>
									</Col>
							</Paper>
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
							display: (this.state.col === 12 && (this.state.isGalaxyFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
							top: this.state.col == 12 ? -14 : 0
						}}>
							<Paper zDepth={1}>
								<GridTile
									title={this.state.col != 12 ? profileTitle : ''}
									titlePosition="top"
									className="profile"
									titleBackground={complementaryColor}
									style={{
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
										scoreRange={this.props.scoreRange}
										filter={this.props.filter}
										minScore={this.props.minScore}
										maxScore={this.props.maxScore}
									/>
								</GridTile>
								<Col>
									<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', padding: 0, margin: '0 auto'}}/>
									<Row style={{marginTop: 10, paddingBottom: 10}} center="xs">
										<Col xs={4} md={4}>
											<div style={styles.legendSevere}>
												<span style={{ marginLeft: 30 }}>Severe</span>
											</div>
										</Col>
										<Col xs={4} md={4}>
											<div style={styles.legendNormal}>
												<span style={{ marginLeft: 30 }}>Not&nbsp;Severe</span>
											</div>
										</Col>
									</Row>
									<Row style={{paddingBottom: 10}}><Col sm={12} style={{textAlign: 'center'}}>Type of ADR</Col></Row>
								</Col>
							</Paper>
						</Col>
					</Row>
					<Footer />
			</Grid>
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
