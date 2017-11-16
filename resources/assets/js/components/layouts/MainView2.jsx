import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import DndTree from '../dndtree/DndTree';
import Card from './Card';
import axios from 'axios';
import { Resizable, ResizableBox } from 'react-resizable';

const MainView = ({ nodes, links, width, height }) => {
	return (
		<div className="MainView">
				<div className="MainView__Cards row">
					<div className="col-md-4">
						<Card title="Number of Drugs"
							text={nodes.length + ' Drugs'}
						/>
					</div>
					<div className="col-md-4">
						<Card title="Number of Interactions"
							text={links.length + ' Interactions'}
						/>
					</div>
					<div className="col-md-4">
						<Card title="Demo"
							text={links.length + ' Interactions'}
						/>
					</div>
				</div>
				<div className="MainView__Graphs">
					<DndTree 
						nodes={nodes}
						links={links}
						width={width}
						height={height}
					/>
				</div>
			</div>	
		)
}

MainView.defaultProps = {
	width: 500,
	height: 500
};

export default MainView

