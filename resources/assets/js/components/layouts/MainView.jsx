import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer';
import Paper from 'material-ui/Paper';
import Share from 'material-ui/svg-icons/social/share';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Tabs, Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import Report from '../modules/Report'
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import { complementaryColor, selectedColor, baseNodeColor } from '../../utilities/constants';
import { generateColor } from '../../utilities/functions';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import Slider from 'react-slick';
import SwipeableViews from 'react-swipeable-views';
import Overview from '../modules/Overview';
import GalaxyView from '../modules/GalaxyView';
import ProfileView from '../modules/ProfileView';


const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
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
			hover: false,
			currentReport: ''
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
		if (this.state.currentReport !== '' && this.state.currentReport.type === report.type &&
			_.isEqual(this.state.currentReport.drugs, report.drugs)
		) {
			console.log('here handle open');
			this.setState({
				open: true,
				tableTitle: 'Reports for ' + title,
			});		
		} else {
			this.setState({ currentReport: report })
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

	render() {
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
				<Grid fluid style={{ marginTop: 10, height: this.state.col === 12 ? 'calc(100% - 70px - 72px - 48px - 50px)' : 'calc(100% - 70px - 72px - 50px)'}}>
					<FloatingActionButton
						onClick={() => {this.setState({ col: 4, isOverviewFullscreen: false, isGalaxyFullscreen: false, isProfileFullscreen: false })}}
						backgroundColor={complementaryColor}
						style={{
							position: 'absolute',
							right: 20,
							bottom: 70,
							zIndex: 100,
							display: this.state.col === 12 ? 'block' : 'none'
						}}
					>
						<NavigationFullscreenExit />
					</FloatingActionButton>
					<Paper className='chipContainer' zDepth={1} style={{marginBottom: 10, display: 'flex'}}>
						<EditorInsertChart color={complementaryColor} style={{height: 52, width: 52}}/>
						<div style={{ 
							height: 52, 
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
							<Tabs style={{marginBottom: 0,
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
								display: (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isGalaxyFullscreen)) ? 'none' : 'block',
							}}
						>
							<Overview 
								col={this.state.col}
								toggleFullscreenOverview={this.toggleFullscreenOverview}
								onClickNode={this.props.onClickNode}
								onClickEdge={this.props.onClickEdge}
								currentSelector={this.props.currentSelector}
								nodes={this.props.nodes}
								links={this.props.links}
								width={this.state.width}
								height={this.state.height} 
								selectedDrug={this.props.selectedDrug}
								isFetching={this.props.isFetching}
								filter={this.props.filter}
								minScore={this.props.minScore}
								maxScore={this.props.maxScore}
								isUpdating={this.props.isUpdating}
								scoreRange={this.props.scoreRange}
								nextTourStep={this.props.nextTourStep}/>
						</Col>
						<Col xs={12} md={this.state.col} style={{
							display: (this.state.col === 12 && (this.state.isProfileFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
						}}>
							<GalaxyView 
								col={this.state.col}
								toggleFullscreenGalaxy={this.toggleFullscreenGalaxy}
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
								handleOpen={this.handleOpen}
								scoreRange={this.props.scoreRange}
								dmeRange={this.props.dmeRange}
								isGalaxyFullscreen={this.state.isGalaxyFullscreen}/>	
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
							display: (this.state.col === 12 && (this.state.isGalaxyFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
						}}>
							<ProfileView
								col={this.state.col}
								toggleFullscreenProfile={this.toggleFullscreenProfile}
								selectedDrug={this.props.selectedDrug}
								selectedRule={this.props.selectedRule}
								toggleFullscreenProfile={this.toggleFullscreenProfile}
								scoreRange={this.props.scoreRange}
								filter={this.props.filter}
								minScore={this.props.minScore}
								maxScore={this.props.maxScore}
								isProfileFullscreen={this.state.isProfileFullscreen}
								profileTitle={profileTitle}/>
						</Col>
					</Row>
			</Grid>
			<Report 
				tableTitle={this.state.tableTitle}
				open={this.state.open}
				handleClose={this.handleClose}
				tableData={this.state.tableData}
				drugs={this.state.tableDrugs}
				currentSelector={this.props.currentSelector}
				nextTourStep={this.props.nextTourStep}
				windowWidth={this.state.width} />
	 	</div>
		)
	}
}

MainView.defaultProps = {
	width: '100%',
	height: '100%'
};
