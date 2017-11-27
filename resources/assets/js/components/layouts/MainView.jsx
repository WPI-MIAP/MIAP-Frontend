import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import DndTreeContainer from './DndTreeContainer';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import ChooseStatusContainer from '../../containers/ChooseStatusContainer'
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer'

const MainView = ({ nodes, links, width, height, onClickNode, currentDrugs, isFetching }) => {
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
						isFetching={isFetching}
					/>
				</GridTile>

					<GridTile
					title='Tree View'
					titlePosition="top"
					actionIcon={ <ChooseStatusContainer /> }
	          		titleBackground="#D62261"
	          		style={{
	          			border: '1px solid grey', 
	          			boxSizing: 'border-box'
	          		}}
	          		cols={2}
		        >
					<DndTreeContainer 
						currentDrugs={currentDrugs}
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

