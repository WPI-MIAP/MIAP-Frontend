import React, { Component } from 'react'
import * as d3 from 'd3'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

const DndTreeContainer = ({ currentDrugs, width, height }) => {
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
			border: '1px solid grey',
			margin: '70px 30px 0 30px',
		},
		titleStyle: {
			textAlign: 'center',
			fontSize: '0.8em'
		},
	};

	console.log(currentDrugs)

	return (
		<GridList
			cellHeight={250}
			style={styles.gridList}
			cols={1}
		>
		{currentDrugs.map(drug => (
			<GridTile
				key={drug[0]}
				title={drug[0]}
				titleStyle={styles.titleStyle}
				titlePosition="top"
				style={styles.gridTile}
			>
				{ drug[1].isFetching ? 
					(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
					<DndTree data={drug[1]}/>
				}
			</GridTile>
		))}
		</GridList>
		)
}

export default DndTreeContainer