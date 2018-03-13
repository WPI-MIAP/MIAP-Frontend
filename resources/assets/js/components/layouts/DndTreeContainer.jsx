import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import { Grid, Row, Col } from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import * as _ from 'lodash';
import Report from '../modules/Report';
import {getStyleByDMECount} from '../../utilities/functions';
import {selectedColor, interactionProfileName} from '../../utilities/constants';
import PropTypes from 'prop-types';

/**
 * This component creates the windows for each of the current drugs displayed in the Galaxy View.
 */
class DndTreeContainer extends Component {
	constructor(props) {
		super(props);

		this.onDeleteNode = this.onDeleteNode.bind(this);
	}

	/**
	 * Called to remove a drug from the Galaxy View. Also clears drug from the Interaction Profile if the drug
	 * removed is the drug currently displayed in that view.
	 * 
	 * @param {object} drug drug to be removed
	 */
	onDeleteNode(drug) {
		this.props.onDeleteNode(drug);
		if (this.props.selectedDrug === drug) {
			this.props.onClearDrug();
		}
	}

	render() {
		const colsWidth = this.props.cols == 4 ? 12 : 3;

		const styles = {
			root: {
				overflow: 'auto',
				height: '100%',
				paddingTop: 10
			},
			title: {
				// textAlign: 'center'
				// height: 30,
				padding: '20px 0',
				background: 'black',
				margin: 0,
				color: 'white'
			},
			titleText: {
				position: 'relative',
				left: 10
			},
			row: {
				margin: '0 20px'
			},
			cols: {
				marginBottom: 30
			},
			cardButtons: {
				position: 'relative',
				top: -15
			}
		};

		return this.props.helpExample ? (
			//HELP PAGE VERSION
			<div>
				{this.props.currentDrugs.map(drug => (
								<Col lg={colsWidth} md={colsWidth} style={styles.cols} key={drug[0]}>
									<div className="card" key={drug[0]} style={{
											height: 200,
											border: this.props.selectedDrug == drug[0] ? '3px solid #FF5722' + selectedColor : '3px solid grey',
											marginTop: 5,
											marginBottom: 5
										}}
									>
										<h5 className="card-title" style={drug[1].drugDMEs == undefined ? styles.title : getStyleByDMECount(drug[1].drugDMEs.length, this.props.dmeRange)}>
											<span style={styles.titleText}>{_.capitalize(drug[0])}</span>
											<span className="pull-right" style={styles.cardButtons}>

												<IconButton tooltip={`Show ${interactionProfileName}`}
													iconStyle={{ color: 'white' }}
													onClick={() => this.props.onClickNode(drug[0])}	
												>
													<ActionOpenInNew />
												</IconButton>

												<IconButton tooltip="Show Reports"
													iconStyle={{ color: 'white' }}
												>
													<EditorInsertChart />
												</IconButton>

												<IconButton tooltip="Close Window"
													iconStyle={{ color: 'white' }}
													onClick={() => this.props.onDeleteNode(drug[0])}	
												>
													<NavigationClose />
												</IconButton>
											</span>
										</h5>	
										<div className="card-body" style={{ position: 'relative', top: -13 }}>
											<DndTree scoreRange={this.props.scoreRange} helpExample={true} currentDrug={drug[0]} data={drug[1]} />
										</div>
									</div>
								</Col>
							))}
			</div>
			) : (
			//NORMAL VERSION				
			<div>
				<Grid fluid style={styles.root}>
					<Row style={styles.row}>
						{
							this.props.currentDrugs.map(drug => (
								<Col lg={colsWidth} md={colsWidth} style={styles.cols} key={drug[0]}>
									<div className="card" key={drug[0]} style={{
											height: 300,
											border: this.props.selectedDrug == drug[0] ? '3px solid ' + selectedColor : '3px solid grey'
										}}
									>
										<h5 className="card-title" style={drug[1].drugDMEs == undefined ? styles.title : getStyleByDMECount(drug[1].drugDMEs.length, this.props.dmeRange)}
											onClick={() => this.props.onClickNode(drug[0])}>
											<span style={styles.titleText}>{(drug[0].length <= 15) ? _.capitalize(drug[0]) : _.capitalize(_.trim(drug[0].substring(0, 12)) + '...')}</span>
											<span className="pull-right" style={styles.cardButtons}>

												<IconButton tooltip={`Show ${interactionProfileName}`}
													iconStyle={{ color: 'white' }}
													onClick={(event) => {event=event || window.event; event.stopPropagation(); this.props.onClickNode(drug[0]);}}	
												>
													<ActionOpenInNew />
												</IconButton>

												<IconButton className="galaxyReports" tooltip="Show Reports"
													iconStyle={{ color: 'white' }}
													onClick={(event) => {event=event || window.event; event.stopPropagation(); this.props.handleOpen({type: 'drug', drugs: [drug[0]]});}}
												>
													<EditorInsertChart />
												</IconButton>

												<IconButton tooltip="Close Window"
													iconStyle={{ color: 'white' }}
													onClick={(event) => {event=event || window.event; event.stopPropagation(); this.onDeleteNode(drug[0]);}}	
												>
													<NavigationClose />
												</IconButton>
											</span>
										</h5>	
										<div className="card-body" style={{ position: 'relative', top: -13 }}>
											<DndTree scoreRange={this.props.scoreRange} currentDrug={drug[0]} data={drug[1]} filter={this.props.filter} minScore={this.props.minScore} maxScore={this.props.maxScore} onClickEdge={this.props.onClickEdge} />
										</div>
									</div>
								</Col>
							))
						}
					</Row>
				</Grid>
			</div>
		)

	}
}

DndTreeContainer.propTypes = {
	/**
	 * Array of drugs currently in the Galaxy View.
	 */
	currentDrugs: PropTypes.array.isRequired,

	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string.isRequired,
	
	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired,
	
	/**
	 * Array of severe ADR count boundaries, indicating how to color galaxy view headers.
	 */
	dmeRange: PropTypes.array.isRequired,

	/**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
	filter: PropTypes.string,

	/**
	 * Minimum score for filtering interactions.
	 */
	minScore: PropTypes.number,

	/**
	 * Maximum score for filtering interactions.
	 */
	maxScore: PropTypes.number,
 
	/**
	 * Callback used when a node is clicked. Takes the node as a parameter.
	 */
	onClickNode: PropTypes.func,

	/**
	 * Callback used when a edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func,

	/**
	 * Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
	 */
	onDeleteNode: PropTypes.func,

	/**
	 * Clears the selectedDrug.
	 */
	onClearDrug: PropTypes.func,

	/**
	 * Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
	 */
	cols: PropTypes.number,

	/**
	 * Used to open the reports view. Takes a report object containing information about the drug for which to retrieve reports.
	 */
	handleOpen: PropTypes.func,

	/**
	 * Indicates whether this is the version found in the help menu (defaults to false).
	 */
	helpExample: PropTypes.bool
};

DndTreeContainer.defaultProps = {
		filter: 'all',
		minScore: -50,
		maxScore: 50,
		onClickNode: () => {},
		onClickEdge: () => {},
		onDeleteNode: () => {},
		onClearDrug: () => {},
		cols: 4,
		handleOpen: () => {},
		helpExample: false
};

export default DndTreeContainer;