import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import DndTree from '../modules/DndTree';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import ChooseStatusContainer from '../../containers/ChooseStatusContainer'

const MainView = ({ nodes, links, width, height }) => {
	const styles = {
		root: {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
		},
		gridList: {
			width: 500,
			height: 500,
			overflowY: 'auto',
			// border: '1px solid grey'
		},
	};
	return (
		<div className="MainView">
		    <GridList
				style={styles.gridList}
				cols={1}
				cellHeight={495}
			>
				<GridTile
					title='Universal Network View'
					titlePosition="top"
					actionIcon={ <ChooseStatusContainer /> }
	          		titleBackground="#1bacc0"
	          		style={{
	          			border: '1px solid grey', 
	          			'box-sizing': 'border-box'
	          		}}
		        >
					<DndGraph 
						nodes={nodes}
						links={links}
						width={width}
						height={height} 
					/>
				</GridTile>
		    </GridList>
		</div>	
		)
}

MainView.defaultProps = {
	width: 500,
	height: 500
};

export default MainView

