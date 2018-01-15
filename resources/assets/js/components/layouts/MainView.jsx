import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import InteractionProfile from '../modules/InteractionProfile';
import DndTreeContainer from './DndTreeContainer';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import FontIcon from 'material-ui/FontIcon';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

const MainView = ({ nodes, links, width, height, onClickNode, showDetailNode, deleteNode, currentDrugs, isFetching, selectedDrug, filter, minScore, maxScore }) => {
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
				cols={3}
				cellHeight={500}
				padding={20}
			>
				<GridTile
					title='Overview'
					titlePosition="top"
					titleBackground="#D62261"
					style={{
						border: '1px solid #F0F0F0', 
						boxSizing: 'border-box'
					}}
					cols={1}
				>
					<DndGraph 
						nodes={nodes}
						links={links}
						width={width}
						height={height} 
						selectedDrug={selectedDrug}
						onClickNode={onClickNode}
						isFetching={isFetching}
						filter={filter}
						minScore={minScore}
						maxScore={maxScore}
					/>
				</GridTile>

				<GridTile
					title='Galaxy View'
					titlePosition="top"
					actionIcon={ <TreeViewFilterContainer /> }
					titleBackground="#1BACC0"
					style={{
						border: '1px solid #F0F0F0', 
						boxSizing: 'border-box',
						background: 'white'
					}}
					cols={1}
				>
					<DndTreeContainer 
						currentDrugs={currentDrugs}
						filter={filter}
						minScore={minScore}
						maxScore={maxScore}
						width={width}
						height={height} 
						onClickNode={showDetailNode}
						onDeleteNode={deleteNode}
					/>
				</GridTile>

				<GridTile
					title={'Interaction profile for: ' + selectedDrug}
					titlePosition="top"
          titleBackground="#8C2DA8"
          style={{
            border: '1px solid #F0F0F0', 
						boxSizing: 'border-box',
						background: 'white'
          }}
          cols={1}
        >
					<InteractionProfile 
						mainDrug={selectedDrug} 
						rules={currentDrugs.find(el => el[0] == selectedDrug)}
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

