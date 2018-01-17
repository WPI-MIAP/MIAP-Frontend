import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import { Grid, Row, Col } from 'react-flexbox-grid';


const DndTreeContainer = ({ currentDrugs, width, height, filter, minScore, maxScore, onClickNode, onDeleteNode, cols, selectedDrug }) => {
	const colsWidth = cols == 4 ? 12 : 3;

	const styles = {
		root: {
			overflow: 'auto',
			height: 500,
			paddingTop: 75
		},
		title: {
			// textAlign: 'center'
			height: 30
		},
		titleText: {
			position: 'relative',
			top: 8,
			left: 15
		},
		row: {
			margin: '0 20px'
		},
		cols: {
			marginBottom: 30
		}
	};

	return (
		<div>
			<Grid fluid style={styles.root}>
				<Row style={styles.row}>
					{
						currentDrugs.map(drug => (
							<Col lg={colsWidth} md={colsWidth} style={styles.cols}>
								<div className="card" key={drug[0]} style={{
										height: 300,
										border: selectedDrug == drug[0] ? '3px solid #29ACBF' : '1px solid grey'
									}}
								>
									<h5 className="card-title" style={styles.title}>
										<span style={styles.titleText}>{drug[0]}</span>
										<span className="pull-right">
											<button type="button" class="btn btn-circle" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => onDeleteNode(drug[0])}>
												<span class="glyphicon glyphicon-trash"></span>&nbsp;
											</button>
											<button type="button" class="btn btn-circle" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => onClickNode(drug[0])}>
												<span class="glyphicon glyphicon-new-window"></span>&nbsp;
											</button>
										</span>
									</h5>	
									<div className="card-body">
										<DndTree currentDrug={drug[0]} data={drug[1]} filter={filter} minScore={minScore} maxScore={maxScore} />
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

export default DndTreeContainer