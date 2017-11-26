import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import DndTree from '../modules/DndTree';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import ChooseStatusContainer from '../../containers/ChooseStatusContainer'
import DndTreeContainer from '../../containers/DndTreeContainer'

const MainView = ({ nodes, links, width, height, onClickNode }) => {
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
	};

	return (
		<div className="MainView">
		    <GridList
				style={styles.gridList}
				cols={5}
				cellHeight={500}
				padding={20}

			>
				<GridTile
					title='Network View'
					titlePosition="top"
					actionIcon={ <ChooseStatusContainer /> }
	          		titleBackground="#D62261"
	          		style={{
	          			border: '1px solid grey', 
	          			boxSizing: 'border-box'
	          		}}
	          		cols={2}
		        >
					<DndGraph 
						nodes={nodes}
						links={links}
						width={width}
						height={height} 
						onClickNode={onClickNode}
					/>
				</GridTile>

				<GridTile
					title='View 3'
					titlePosition="top"
					actionIcon={ <ChooseStatusContainer /> }
	          		titleBackground="#D62261"
	          		style={{
	          			border: '1px solid grey', 
	          			boxSizing: 'border-box'
	          		}}
	          		cols={2}
		        >
		        	<DndTreeContainer />
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

