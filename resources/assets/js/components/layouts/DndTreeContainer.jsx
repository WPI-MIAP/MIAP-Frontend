import React, { Component } from 'react'
import * as d3 from 'd3'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';

const DndTreeContainer = ({ currentDrugs, width, height, filter, score }) => {
	const styles = {
		root: {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
			paddingBottom: '20px'
		},
		gridList: {
			width: 'inherit',
			height: '500px',
			overflowY: 'auto'
		},
		gridTile: {
			margin: '70px 30px 150px 30px',
		},
		subHeader: {
			textAlign: 'center',
			fontSize: '0.8em'
		},
	};

	return (
		<GridList
			cellHeight={250}
			style={styles.gridList}
			cols={1}
		>
		<div style={styles.gridTile}>
		{currentDrugs.map(drug => (
			<div style={{ border: '1px solid grey', marginBottom: 20 }}>
				<Subheader style={styles.subHeader}>{drug[0]}</Subheader>
				<GridTile
					key={drug[0]}
				>
					{ drug[1].isFetching ? 
						(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
						<DndTree currentDrug={drug[0]} data={drug[1]} filter={filter} score={score} />
					}
				</GridTile>
			</div>
		))}
		</div>
		</GridList>
		)
}

export default DndTreeContainer