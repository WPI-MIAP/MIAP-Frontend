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

	return (
		<GridList
			cellHeight={250}
			style={styles.gridList}
			cols={1}
		>
		{Object.keys(currentDrugs).slice(0).reverse().map((drug) => (
			<GridTile
				key={drug}
				title={drug}
				titleStyle={styles.titleStyle}
		        titlePosition="top"
				style={styles.gridTile}
			>
				{ currentDrugs[drug].isFetching ? 
					(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>) :
					<DndTree data={currentDrugs[drug]}/>
				}
			</GridTile>
		))}
		</GridList>
		)
}

export default DndTreeContainer