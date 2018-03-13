import React, { Component } from 'react';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Tabs, Tab} from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import Report from '../modules/Report'
import axios from 'axios';
import { complementaryColor, selectedColor, interactionProfileName, galaxyViewName, overviewName } from '../../utilities/constants';
import Overview from '../modules/Overview';
import GalaxyView from '../modules/GalaxyView';
import ProfileView from '../modules/ProfileView';
import ReportChipContainer from '../modules/ReportChipContainer';
import PropTypes from 'prop-types';

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	floatingButton: {
		position: 'absolute',
		right: 30,
		bottom: 30,
		zIndex: 100
	}
};

/**
 * This component combines the ReportChipContainer, Overview, Galaxy View, Interaction Profile and Report View.
 */
class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			col: 4,
			isGalaxyFullscreen: false,
			isOverviewFullscreen: false,
			isProfileFullscreen: false,
			tableData: [],
			tableTitle: '',
			tableDrugs: [],
			open: false,
			width: 0,
			height: 0,
			currentReport: ''
		}

		
		this.toggleFullscreenOverview = this.toggleFullscreenOverview.bind(this);
		this.toggleFullscreenGalaxy = this.toggleFullscreenGalaxy.bind(this);
		this.toggleFullscreenProfile = this.toggleFullscreenProfile.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	/**
	 * Set initial window dimensions and create window resize listener to automatically update them.
	 */
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	/**
	 * Remove window resize listener on unmount.
	 */
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	/**
	 * Update window dimensions using current measurements.
	 */
	updateWindowDimensions() {
		this.setState({width: window.innerWidth, height: window.innerHeight});
	}

	/**
	 * If the tour is started while in fullscreen mode, exit fullscreen mode. 
	 */
	componentWillReceiveProps(nextProps) {
		if(nextProps.tourRunning !== this.props.tourRunning && nextProps.tourRunning === true) {
			this.setState({col: 4, isGalaxyFullscreen: false, isOverviewFullscreen: false, isProfileFullscreen: false});
		}
	}

	/**
	 * Open the reports view.
	 * 
	 * @param {object} report contains information about type of report (drug/adr) and the drugs involved in the report
	 */
	handleOpen(report) {
		// This part was commented out to avoid a waiting period before opening the report view for the drug/interaction that was last
		// opened in the report view

		// if (this.state.currentReport !== '' && this.state.currentReport.type === report.type &&
		// 	_.isEqual(this.state.currentReport.drugs, report.drugs)
		// ) {
		// 	this.setState({
		// 		open: true,
		// 	});		
		// } else {
			const title = report.type === 'drug' ? _.startCase(report.drugs[0]) : report.drugs.map((drug) => (_.startCase(drug))).join(" - ");
			
			this.setState({ 
				currentReport: report, 
				tableData: [],
				open: true,
				tableTitle: 'Reports for ' + title,
			})
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
		// }
  	}

	/**
	 * Close the reports view. If the tour is at the reports step, advance the tour.
	 */
	handleClose() {
		this.setState({
			open: false,
		});
		if(this.props.currentSelector === '.report') {
			this.props.nextTourStep();
		}
	}

	/**
	 * Fullscreen the Overview.
	 */
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

	/**
	 * Fullscreen the Galaxy View.
	 */
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

	/**
	 * Fullscreen the Interaction Profile View.
	 */
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

	/**
	 * Return the current tab based on which view is fullscreened.
	 */
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

	/**
	 * Handle changing the tab index.
	 * 
	 * @param {number} value new tab index
	 */
	handleChange(value) {
		this.setState({
		  value: value,
		});
	}

	render() {
		let profileTitle = interactionProfileName;
		if (this.props.selectedDrug != '') {
			profileTitle += `: ${_.capitalize(this.props.selectedDrug)}`;
		} else if (this.props.selectedRule != '') {
			const drugsString = this.props.selectedRule.split(' --- ').map(drug => _.capitalize(drug)).join(' - ');
			profileTitle += `: ${drugsString}`;
		}

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

					<ReportChipContainer 
						selectedRule={this.props.selectedRule} 
						deleteNode={this.props.deleteNode}
						selectedDrug={this.props.selectedDrug}
						clearSearchTerm={this.props.clearSearchTerm}
						clearRule={this.props.clearRule}
						links={this.props.links}
						scoreRange={this.props.scoreRange}
						handleOpen={this.handleOpen}
						currentDrugs={this.props.currentDrugs}/>

					<Row>
						<Col xs={12} md={12}> 
							<Tabs style={{marginBottom: 0,
								display: this.state.col === 4 ? 'none' : 'block'}}
								inkBarStyle={{background: selectedColor, height: '4px', marginTop: '-4px'}}
								value={this.getTabsIndex()}
								onChange={this.handleChange}>
								<Tab label={overviewName} style={{background: complementaryColor}} onActive={this.toggleFullscreenOverview} value={0}/>
								<Tab label={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}><div style={{width: 48}}/>{galaxyViewName} <div style={{alignSelf: 'flex-end'}}><TreeViewFilterContainer /></div></div>} style={{background: complementaryColor}} onActive={this.toggleFullscreenGalaxy} value={1}/>
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
								nextTourStep={this.props.nextTourStep}
								isOverviewFullscreen={this.state.isOverviewFullscreen}
								status={this.props.status}
								getStatus={this.props.getStatus}/>
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
								width={this.state.width}
								height={this.state.height}
								onClickNode={this.props.showDetailNode}
								onClickEdge={this.props.onClickEdge}
								onDeleteNode={this.props.deleteNode}
								onClearDrug={this.props.clearSearchTerm}
								handleOpen={this.handleOpen}
								scoreRange={this.props.scoreRange}
								dmeRange={this.props.dmeRange}
								isGalaxyFullscreen={this.state.isGalaxyFullscreen}
								selectedDrug={this.props.selectedDrug}/>	
						</Col>
						<Col xs={12} md={this.state.col} style={{ 
							display: (this.state.col === 12 && (this.state.isGalaxyFullscreen || this.state.isOverviewFullscreen)) ? 'none' : 'block',
						}}>
							<ProfileView
								col={this.state.col}
								toggleFullscreenProfile={this.toggleFullscreenProfile}
								selectedDrug={this.props.selectedDrug}
								selectedRule={this.props.selectedRule}
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

MainView.propTypes = {
	/**
	 * Indicates whether the data is still being fetched for the nodes and links.
	 */
	isFetching: PropTypes.bool.isRequired,

	/**
	 * Array of links representing all interaction between pairs of drugs in the visualization.
	 */
	links: PropTypes.array.isRequired,

	/**
	 * Array of nodes representing all drugs in the visualization.
	 */
	nodes: PropTypes.array.isRequired,
	
	/**
	 * Array of drugs currently in the Galaxy View.
	 */
	currentDrugs: PropTypes.array.isRequired,

	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string.isRequired,

	/**
	 * Name of the currently selected rule (of format: drug_1 --- drug_2).
	 */
	selectedRule: PropTypes.string.isRequired,

	/**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
	filter: PropTypes.string.isRequired,

	/**
	 * Minimum score for filtering interactions.
	 */
	minScore: PropTypes.number.isRequired,

	/**
	 * Maximum score for filtering interactions.
	 */
	maxScore: PropTypes.number.isRequired,

	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired,

	/**
	 * Array of severe ADR count boundaries, indicating how to color galaxy view headers.
	 */
	dmeRange: PropTypes.array.isRequired,

	/**
	 * Contains information about the status of the last MARAS analysis ran.
	 */
	status: PropTypes.object.isRequired,

	/**
	 * Callback used when a node is clicked. Takes the node as a parameter.
	 */
	onClickNode: PropTypes.func.isRequired,

	/**
	 * Callback used when an edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func.isRequired,

	/**
	 * Callback used when a node is clicked (Galaxy View). Takes the node as a parameter.
	 */
	showDetailNode: PropTypes.func.isRequired,

	/**
	 * Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
	 */
	deleteNode: PropTypes.func.isRequired,

	/**
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
	isUpdating: PropTypes.func.isRequired,

	/**
	 * Remove the currently selected rule from the Interaction Profile.
	 */
	clearRule: PropTypes.func.isRequired,

	/**
	 * Remove the currently selected drug from the Interaction Profile.
	 */
	clearSearchTerm: PropTypes.func.isRequired,

	/**
	 * Used to get updated information about the status of the last MARAS analysis ran.
	 */
	getStatus: PropTypes.func.isRequired
};

export default MainView;