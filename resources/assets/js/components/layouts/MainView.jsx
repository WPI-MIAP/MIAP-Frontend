import React, { Component } from 'react';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Tabs, Tab} from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';
import Report from '../modules/Report'
import axios from 'axios';
import { complementaryColor, selectedColor } from '../../utilities/constants';
import Overview from '../modules/Overview';
import GalaxyView from '../modules/GalaxyView';
import ProfileView from '../modules/ProfileView';
import ReportChipContainer from '../modules/ReportChipContainer';


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

export default class MainView extends Component {
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
		if(nextProps.tourRunning !== this.props.tourRunning && nextProps.tourRunning === true) {
			this.setState({col: 4, isGalaxyFullscreen: false, isOverviewFullscreen: false, isProfileFullscreen: false});
		}
	}

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

	handleClose() {
		this.setState({
			open: false,
			// tableTitle: '',
			// tableData: [],
		});
		if(this.props.currentSelector === '.report') {
			this.props.nextTourStep();
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

	render() {
		let profileTitle = 'Interaction Profile';
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
								width={this.props.width}
								height={this.props.height}
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
