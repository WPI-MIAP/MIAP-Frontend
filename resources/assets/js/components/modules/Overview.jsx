import React, { Component } from 'react';
import DndGraph from '../modules/DndGraph';
import { scoreColors, complementaryColor, secondaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { Row, Col } from 'react-flexbox-grid';
import IconHome from 'material-ui/svg-icons/action/home';
import IconZoomIn from 'material-ui/svg-icons/action/zoom-in';
import IconZoomOut from 'material-ui/svg-icons/action/zoom-out';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SvgIcon from 'material-ui/SvgIcon';
import StatusInformationButton from './StatusInformation';
import PropTypes from 'prop-types';

/**
 * Icon used for homing the overview.
 */
const Tracker = () => (
	<SvgIcon>
			<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="tracker-(1)" transform="translate(2.000000, 2.000000)" fillRule="nonzero">
					<path d="M9.97586957,12.1754348 C11.1886957,12.1754348 12.1754348,11.1886957 12.1754348,9.97586957 C12.1754348,8.76304348 11.1886957,7.77630435 9.97586957,7.77630435 C8.76304348,7.77630435 7.77630435,8.76304348 7.77630435,9.97586957 C7.77630435,11.1886957 8.76304348,12.1754348 9.97586957,12.1754348 Z" id="Shape" fill="#000000"></path>
					<path d="M19.5169565,9.54108696 L17.7941304,9.54108696 C17.5756522,5.56876812 14.382971,2.37608696 10.4106522,2.1576087 L10.4106522,0.434782609 C10.4106522,0.194710145 10.215942,0 9.97586957,0 C9.7357971,0 9.54108696,0.194710145 9.54108696,0.434782609 L9.54108696,2.58007246 C9.54108696,2.82014493 9.7357971,3.01485507 9.97586957,3.01485507 C13.8142029,3.01485507 16.9368841,6.13753623 16.9368841,9.97586957 C16.9368841,13.8142029 13.8142029,16.9368841 9.97586957,16.9368841 C6.13753623,16.9368841 3.01485507,13.8142029 3.01485507,9.97586957 C3.01485507,7.31043478 4.56934783,4.8442029 6.97507246,3.69297101 C7.19166667,3.58927536 7.28326087,3.32971014 7.17956522,3.11311594 C7.07594203,2.8965942 6.81615942,2.805 6.59971014,2.90862319 C5.28586957,3.53731884 4.17413043,4.51855072 3.38478261,5.74615942 C2.65217391,6.88557971 2.23282609,8.18949275 2.1584058,9.54108696 L0.434782609,9.54108696 C0.194710145,9.54108696 0,9.7357971 0,9.97586957 C0,10.215942 0.194710145,10.4106522 0.434782609,10.4106522 L2.1576087,10.4106522 C2.37608696,14.382971 5.56876812,17.5756522 9.54108696,17.7941304 L9.54108696,19.5169565 C9.54108696,19.757029 9.7357971,19.9517391 9.97586957,19.9517391 C10.215942,19.9517391 10.4106522,19.757029 10.4106522,19.5169565 L10.4106522,17.7941304 C14.382971,17.5756522 17.5756522,14.382971 17.7941304,10.4106522 L19.5169565,10.4106522 C19.757029,10.4106522 19.9517391,10.215942 19.9517391,9.97586957 C19.9517391,9.7357971 19.757029,9.54108696 19.5169565,9.54108696 Z" id="Shape" stroke="#000000" fill="#424242"></path>
				</g>
			</g>
	</SvgIcon >
);


/**
 * This component controls and renders the Overview.
 */
class Overview extends Component {
    constructor(props) {
		super(props);

		this.state = {
			legendShow: true,
		};

		this.onClickEdgeTour = this.onClickEdgeTour.bind(this);
		this.onClickNodeTour = this.onClickNodeTour.bind(this);
	}


	/**
	 * Callback that checks whether to advance the tour when an edge is clicked.
	 * 
	 * @param {object} interaction The interaction represented by the edge that was clicked on
	 */
	onClickEdgeTour(interaction) {
		this.props.onClickEdge(interaction);
		if(this.props.currentSelector === '.overview2'){
			this.props.nextTourStep();
		}
	}

	/**
	 * Callback that checks whether to advance the tour when a node is clicked.
	 * 
	 * @param {object} drug The drug represented by the node that was clicked on
	 */
	onClickNodeTour(drug) {
		this.props.onClickNode(drug);
		if(this.props.currentSelector === '.overview3'){
			this.props.nextTourStep();
		}
	}

	/**
	 * Redraw the network graph if this view is fullscreened
	 */
	componentWillReceiveProps(nextProps) {
		if (nextProps.isOverviewFullscreen !== this.props.isOverviewFullscreen) {
			this.graph.state.network.redraw();
		}
	}

	/**
	 * Recenter the network graph if the view is maximized/minimized
	 */
	componentDidUpdate(prevProps, prevState) {
		if(prevProps.col !== this.props.col || prevProps.isOverviewFullscreen !== this.props.isOverviewFullscreen) {
			this.graph.reposition();
		}
	}

	render() {

		return (
			<div>
				<FloatingActionButton mini={true}
					style={{
						position: 'absolute',
						right: 20,
						top: this.props.isOverviewFullscreen ? 62 : 110,
						zIndex: 100,
					}}
					backgroundColor="white"
					zDepth={2}
					iconStyle={{ fill: '#424242' }}
					onClick={() => { this.graph.zoomIn(0.2) }}
				>
					<IconZoomIn />
				</FloatingActionButton>

				<FloatingActionButton mini={true}
					style={{
						position: 'absolute',
						right: 20,
						top: this.props.isOverviewFullscreen ? 112 : 160,
						zIndex: 100,
					}}
					backgroundColor="white"
					zDepth={2}
					iconStyle={{ fill: '#424242' }}
					onClick={() => { this.graph.zoomOut(0.2) }}
				>
					<IconZoomOut/>
				</FloatingActionButton>

				<FloatingActionButton mini={true}
					style={{
						position: 'absolute',
						right: 20,
						top: this.props.isOverviewFullscreen ? 12 : 60,
						zIndex: 100,
					}}
					backgroundColor="white"
					zDepth={2}
					iconStyle={{ fill: '#424242' }}
					onClick={() => { this.graph.home() }}
				>
					<Tracker />
				</FloatingActionButton>

				<Paper zDepth={1}>
					<GridTile
						title={this.props.col != 12 ? "Overview" : ""}
						titlePosition="top"
						className="overview overview2 overview3"
						titleBackground={complementaryColor}
						style={{
							boxSizing: 'border-box',
							background: 'white',
							height: this.state.legendShow ? 'calc(100% - 79px)' : '100%',
							marginBottom: this.state.legendShow ? 0 : -48,
							// marginTop: this.props.isOverviewFullscreen ? -48 : -96
						}}
						actionIcon={
							<Row style={{margin: 0}}>
								<IconButton 
									tooltip="Go Fullscreen"
									iconStyle={{ color: 'white' }}
									tooltipPosition='bottom-left'
									onClick={this.props.toggleFullscreenOverview}>
									<IconFullscreen />	
								</IconButton>
								<StatusInformationButton status={this.props.status} getStatus={this.props.getStatus}/>
							</Row>
						}
					>

						<div style={{height: this.props.isOverviewFullscreen ? '100%' : 'calc(100% - 48px)', marginTop: this.props.isOverviewFullscreen ? 0 : 48}}>
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
								ref={(graph) => {this.graph = graph;}}
							/>
						</div>
					</GridTile>
					{/* LEGEND */}
					{
						this.state.legendShow ? (
							<Row>
								<Col sm={12}>
									<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', margin: '0 auto'}}/>
									<Row>
										<Col sm={3} style={{paddingLeft: '3%'}}>
											<IconButton
												tooltip="Hide Legend"
												iconStyle={{ color: complementaryColor }}
												tooltipPosition='top-right'
												onClick={() => {this.setState({legendShow: false})}}>
												<KeyboardArrowDown/>
											</IconButton>
										</Col>
										<Col sm={6} style={{textAlign: 'center', lineHeight: '48px'}}>
											Interaction Score
										</Col>
										<Col sm={3}></Col>
									</Row>
									<Row style={{paddingBottom: 5}}>
										{scoreColors.map(scoreColor => (
											<Col xs={3} md={3} key={scoreColor.color}>
												<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
											</Col>
										))}
									</Row>
								</Col>
							</Row>
						) : ([])
					}
				</Paper>
				{
					!this.state.legendShow ? (
						<IconButton
							tooltip="Show Legend"
							iconStyle={{ background: complementaryColor, color: 'white', border: '3px solid ' + complementaryColor, borderRadius: '5px', }}
							tooltipPosition='top-right'
							onClick={() => {this.setState({legendShow: true})}}>

							<KeyboardArrowUp/>
						</IconButton>
					) : ([])
				}
			</div>
		);
	}
}

Overview.propTypes = {
	/**
	 * Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
	 */
	col: PropTypes.number.isRequired,

	/**
	 * Function that fullscreens the Overview.
	 */
	toggleFullscreenOverview: PropTypes.func.isRequired,

	/**
	 * Callback used when a node is clicked. Takes the node as a parameter.
	 */
	onClickNode: PropTypes.func.isRequired,

	/**
	 * Callback used when an edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func.isRequired,

	/**
	 * Class name of the component the tour is currently looking at.
	 */
	currentSelector: PropTypes.string.isRequired,

	/**
	 * Array of nodes representing all drugs in the visualization.
	 */
	nodes: PropTypes.array.isRequired,

	/**
	 * Array of links representing all interaction between pairs of drugs in the visualization.
	 */
	links: PropTypes.array.isRequired,

	/**
	 * Width of the browser window.
	 */
	width: PropTypes.number.isRequired,

	/**
	 * Height of the browser window.
	 */
	height: PropTypes.number.isRequired,

	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string.isRequired,

	/**
	 * Indicates whether the data is still being fetched for the nodes and links.
	 */
	isFetching: PropTypes.bool.isRequired,

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
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
	isUpdating: PropTypes.func.isRequired,

	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired,

	/**
	 * Advances the tour to the next step.
	 */
	nextTourStep: PropTypes.func.isRequired,

	/**
	 * Indicates whether the Overview is currently fullscreened.
	 */
	isOverviewFullscreen: PropTypes.bool.isRequired,

	/**
	 * Contains information about the status of the last MARAS analysis ran.
	 */
	status: PropTypes.object.isRequired,

	/**
	 * Used to get updated information about the status of the last MARAS analysis ran.
	 */
	getStatus: PropTypes.func.isRequired,

};

export default Overview;