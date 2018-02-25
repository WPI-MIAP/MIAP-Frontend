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
import {selectedColor} from '../../utilities/constants';

export default class DndTreeContainer extends Component {
	constructor(props) {
		super(props);

		this.onDeleteNode = this.onDeleteNode.bind(this);
	}

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
				height: '70vh',
				paddingTop: 75
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

		return this.props.testExample ? (
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

												<IconButton tooltip="Show Profile"
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
											<DndTree scoreRange={this.props.scoreRange} testExample={true} currentDrug={drug[0]} data={drug[1]} filter={this.props.filter} minScore={this.props.minScore} maxScore={this.props.maxScore} />
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
											border: this.props.selectedDrug == drug[0] ? '3px solid #F44336' : '3px solid grey'
										}}
									>
										<h5 className="card-title" style={drug[1].drugDMEs == undefined ? styles.title : getStyleByDMECount(drug[1].drugDMEs.length, this.props.dmeRange)}>
											<span style={styles.titleText}>{(drug[0].length <= 20) ? _.capitalize(drug[0]) : _.capitalize(_.trim(drug[0].substring(0, 17)) + '...')}</span>
											<span className="pull-right" style={styles.cardButtons}>

												<IconButton tooltip="Show Profile"
													iconStyle={{ color: 'white' }}
													onClick={() => this.props.onClickNode(drug[0])}	
												>
													<ActionOpenInNew />
												</IconButton>

												<IconButton className="galaxyReports" tooltip="Show Reports"
													iconStyle={{ color: 'white' }}
													onClick={() => {this.props.handleOpen({type: 'drug', drugs: [drug[0]]})}}
												>
													<EditorInsertChart />
												</IconButton>

												<IconButton tooltip="Close Window"
													iconStyle={{ color: 'white' }}
													onClick={() => this.onDeleteNode(drug[0])}	
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