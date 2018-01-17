import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Delete from 'material-ui/svg-icons/action/delete'
import Launch from 'material-ui/svg-icons/action/launch'
import { Grid, Row, Col } from 'react-flexbox-grid';


const DndTreeContainer = ({ currentDrugs, width, height, filter, minScore, maxScore, onClickNode, onDeleteNode, cols }) => {
	const colsWidth = cols == 4 ? 12 : 3;

	const styles = {
		root: {
			overflow: 'auto',
			height: 500,
			paddingTop: 75
		},
		card: {
			border: '1px solid grey',
			height: 300
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
								<div className="card" key={drug[0]} style={styles.card}>
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
										{
											 drug[1].isFetching ? 
											(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
											<DndTree currentDrug={drug[0]} data={drug[1]} filter={filter} minScore={minScore} maxScore={maxScore} />
										}	
									</div>
								</div>
								{/* <div>
									<Subheader style={styles.subHeader}>
									{drug[0]}
									</Subheader>
									<GridTile
										key={drug[0]}
										actionIcon={
											<div>
											<IconButton onClick={() => onDeleteNode(drug[0])}>
											<Delete color='#757575' />
											</IconButton>

											<IconButton onClick={() => onClickNode(drug[0])}>
											<Launch color='#757575' />
											</IconButton>
											</div>
											}
											title=" "
											style={styles.gridTitle}
											titleBackground='rgba(0, 0, 0, 0)'
										>
											{ drug[1].isFetching ? 
											(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
											<DndTree currentDrug={drug[0]} data={drug[1]} filter={filter} minScore={minScore} maxScore={maxScore} />
											}
									</GridTile>
								</div>	 */}
							</Col>
						))
					}
				</Row>
			</Grid>
		</div>
	)

	// return (
	// 	<div className="row">
	// 	{currentDrugs.map(drug => (
	// 		<div className="col-md-3" style={styles.gridTile}>
	// 			<Subheader style={styles.subHeader}>
	// 				{drug[0]}
	// 			</Subheader>
	// 			<GridTile
	// 				key={drug[0]}
	// 				actionIcon={
	// 					<div>
	// 						<IconButton onClick={() => onDeleteNode(drug[0])}>
	// 							<Delete color='#757575' />
	// 						</IconButton>

	// 						<IconButton onClick={() => onClickNode(drug[0])}>
	// 							<Launch color='#757575' />
	// 						</IconButton>
	// 					</div>
	// 				}
  //         title=" "
	// 				style={styles.gridTitle}
	// 				titleBackground='rgba(0, 0, 0, 0)'
	// 			>
	// 				{ drug[1].isFetching ? 
	// 					(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
	// 					<DndTree currentDrug={drug[0]} data={drug[1]} filter={filter} minScore={minScore} maxScore={maxScore} />
	// 				}
	// 			</GridTile>
	// 		</div>
	// 	))}
	// 	</div>
	// 	)
}

export default DndTreeContainer