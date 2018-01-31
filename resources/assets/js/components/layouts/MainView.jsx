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

export default class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colOverview: 4,
			colGalaxy: 4,
			colProfile: 4,
			reportChips: [],
			tableData: [],
			tableTitle: '',
			open: false,
		}

		this.toggleFullscreenOverview = this.toggleFullscreenOverview.bind(this);
		this.toggleFullscreenGalaxy = this.toggleFullscreenGalaxy.bind(this);
		this.toggleFullscreenProfile = this.toggleFullscreenProfile.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderChip = this.renderChip.bind(this);
		this.handleRequestDelete = this.handleRequestDelete.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.selectedDrug !== nextProps.selectedDrug && nextProps.selectedDrug !== undefined && 
			nextProps.selectedDrug !== '' && this.state.reportChips.indexOf(nextProps.selectedDrug) == -1) {
			var chips = this.state.reportChips;
			chips.unshift({type: 'drug', title: nextProps.selectedDrug});
			this.setState({reportChips: chips});
		}

		if(this.props.selectedRule !== nextProps.selectedRule && nextProps.selectedRule !== undefined && 
			nextProps.selectedRule !== '' && this.state.reportChips.indexOf(nextProps.selectedRule) == -1) {
			var chips = this.state.reportChips;
			chips.unshift({type: 'adr', title: nextProps.selectedRule});
			this.setState({reportChips: chips});
		}	
	}

	renderChip(report) {
		const titleCase = _.startCase(_.toLower(report.title));
		const title = report.type === 'drug' ? titleCase : titleCase.split(" ").join(" - ");
		return (
			<Chip
				key={report}
				onRequestDelete={() => this.handleRequestDelete(report)}
				style={styles.chip}
				onClick={() => this.handleOpen(report)}
				>
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
				colOverview: prevState.colOverview == 4 ? 12 : 4,
				colGalaxy: 4,
				colProfile: 4,
			}
		})
	}

	toggleFullscreenGalaxy() {
		this.setState((prevState, props) => {
			return {
				colGalaxy: prevState.colGalaxy == 4 ? 12 : 4,
				colOverview: 4,
				colProfile: 4,
			}
		})
	}

	toggleFullscreenProfile() {
		this.setState((prevState, props) => {
			return {
				colProfile: prevState.colProfile == 4 ? 12 : 4,
				colOverview: 4,
				colGalaxy: 4,
			}
		})
	}

	getTabsIndex() {
		if(this.state.colOverview == 12) {
			return 0;
		}else if(this.state.colGalaxy == 12) {
			return 1;
		}else if(this.state.colProfile == 12) {
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

	render() {
		const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];

		return (
			<div>
				<Grid fluid style={{ marginTop: 25, height: '75vh' }}>
					<FloatingActionButton
						onClick={() => {this.setState({ colGalaxy: 4, colOverview: 4, colProfile: 4 })}}
						style={{
							position: 'absolute',
							right: 30,
							bottom: 30,
							zIndex: 100,
							display: this.state.colOverview != 4 || this.state.colGalaxy != 4 || this.state.colProfile != 4 ? 'block' : 'none'
						}}
					>
						<NavigationFullscreenExit />
					</FloatingActionButton>
					<Row>
						<Col xs={6} md={12}> 
							<Tabs style={{marginBottom: 15,
								display: (this.state.colGalaxy == 4 && this.state.colProfile == 4 && this.state.colOverview == 4) ? 'none' : 'block'}}
								inkBarStyle={{background: 'white', height: '4px', marginTop: '-4px'}}
								value={this.getTabsIndex()}
								onChange={this.handleChange}>
								<Tab label={'Overview'} style={{background: "#24915C"}} onActive={this.toggleFullscreenOverview} value={0}/>
								<Tab label={'Galaxy View'} style={{background: "#2D3E46"}} onActive={this.toggleFullscreenGalaxy} value={1}/>
								<Tab label={'Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")} style={{background: "#2B81AC"}} onActive={this.toggleFullscreenProfile} value={2}/>
							</Tabs>
						</Col>
						<Col xs={6} md={this.state.colOverview} style={{ 
										display: (this.state.colGalaxy == 4 && this.state.colProfile == 4) ? 'block' : 'none',
									}}>
										<GridTile
											title={this.state.colOverview != 12 ? "Overview" : ""}
											titlePosition="top"
											titleBackground="#24915C"
											style={{
												// border: '1px solid #F0F0F0', 
												boxSizing: 'border-box',
												background: 'white',
												top: this.state.colOverview == 12 ? -14 : 0

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
												onClickNode={this.props.onClickNode}
												onClickEdge={this.props.onClickEdge}
												isFetching={this.props.isFetching}
												filter={this.props.filter}
												minScore={this.props.minScore}
												maxScore={this.props.maxScore}
											/>
										</GridTile>
						</Col>
						<Col xs={6} md={this.state.colGalaxy} style={{
							display: this.state.colOverview == 4 && this.state.colProfile == 4 ? 'block' : 'none'
						}}
						>
							<GridTile
								title={this.state.colGalaxy != 12 ? "Galaxy View" : ""}
								titlePosition="top"
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
									top: this.state.colGalaxy == 12 ? -14 : 0
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
									cols={this.state.colGalaxy}
									selectedDrug={this.props.selectedDrug}
								/>
							</GridTile>
						</Col>
						<Col xs={6} md={this.state.colProfile} style={{ display: this.state.colGalaxy == 4 && this.state.colOverview == 4 ? 'block' : 'none'}}>
							<GridTile
								// title={'Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")}
								title={this.state.colProfile != 12 ? ('Interaction Profile ' + (this.props.selectedDrug != "" ? '- ' + _.capitalize(this.props.selectedDrug) : "")) : ""}
								titlePosition="top"
								titleBackground="#2B81AC"
								style={{
									// border: '1px solid #F0F0F0', 
									boxSizing: 'border-box',
									background: 'white',
									top: this.state.colProfile == 12 ? -14 : 0
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
