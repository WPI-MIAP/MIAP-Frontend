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
import axios from 'axios'
import Avatar from 'material-ui/Avatar';


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
	},
	floatingButton: {
		position: 'absolute',
		right: 30,
		bottom: 30,
		zIndex: 100
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
			open: false,
			width: 0,
			height: 0,
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
		if(this.props.selectedDrug !== nextProps.selectedDrug && nextProps.selectedDrug !== undefined && 
			nextProps.selectedDrug !== '' && _.find(this.state.reportChips, chip => chip.title == nextProps.selectedDrug) == undefined) {
			var chips = this.state.reportChips;
			chips.unshift({type: 'drug', title: nextProps.selectedDrug});
			this.setState({reportChips: chips});
		}

		if(this.props.selectedRule !== nextProps.selectedRule && nextProps.selectedRule !== undefined && 
			nextProps.selectedRule !== '' && _.find(this.state.reportChips, chip => chip.title == nextProps.selectedRule) == undefined) {
			var chips = this.state.reportChips;
			chips.unshift({type: 'adr', title: nextProps.selectedRule});
			this.setState({reportChips: chips});
		}	
	}

	renderChip(report) {
		// alert(report.title);
		const lower = _.toLower(report.title);
		const titleCase = _.startCase(lower);
		const title = report.type === 'drug' ? titleCase : titleCase.split(" ").join(" - ");
		const drugs = lower.split(" ");
		const avatarColor = report.type === 'drug' ? "#2C98F0" : generateColor(this.props.links.filter((link) => {
			var match = ((_.toLower(link.Drug1.name) === drugs[0] && _.toLower(link.Drug2.name) === drugs[1]) || 
			(_.toLower(link.Drug1.name) === drugs[1] && _.toLower(link.Drug2.name) === drugs[0]));
			return match;
		})[0].Score); //TODO: change color based on interaction's score
		return (
			<Chip
				key={report.title}
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
			axios.get('/csv/reports?drug=' + report.title)
				.then(response => {
					this.setState({ tableData: response.data })	
				});
		}

		if (report.type === 'adr') {
			const drugs = report.title.split(" ");
			axios.get('/csv/reports?drug1=' + drugs[0] + '&drug2=' + drugs[1])
				.then(response => {
					this.setState({ tableData: response.data })	
				});

		}

		const titleCase = _.startCase(_.toLower(report.title));
		const title = report.type === 'drug' ? titleCase : titleCase.split(" ").join(" - ");

		this.setState({
			open: true,
			tableTitle: 'Reports for ' + title
		});
  }

  handleClose() {
    this.setState({open: false});
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
				<Grid fluid style={{ marginTop: 25, height: '75vh' }}>
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
										onClickEdge={this.props.onClickEdge}
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
										onDeleteNode={this.props.deleteNode}
										cols={this.state.col}
										selectedDrug={this.props.selectedDrug}
										nextTourStep={this.props.nextTourStep}
										currentSelector={this.props.currentSelector}
									/>
								</GridTile>
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
										rules={this.props.currentDrugs.find(el => el[0] == this.props.selectedDrug)}
									/>
								</GridTile>
							</Paper>
						</Col>
					</Row>
					<Row style={{ margin: '8px 0' }}> 
						{this.state.reportChips.map(this.renderChip, this)}
					</Row>
					<Row style={{marginTop: '10px', marginBottom: '10px'}}>
						<p style={{textAlign: 'center', margin: '0 auto'}}>
							Developed at Worcester Polytechnic Institute as part of a Major Qualifying Project. To contact the developers, email <a href='mailto:divamqp1718@WPI.EDU'>divamqp1718@WPI.EDU</a>.
						</p>
					</Row>
			</Grid>
			<Report 
				tableTitle={this.state.tableTitle}
				open={this.state.open}
				handleClose={this.state.handleClose}
				actions={actions}
				tableData={this.state.tableData}
			/>
	 	</div>
		)
	}
}

MainView.defaultProps = {
	width: '100%',
	height: '100%'
};
