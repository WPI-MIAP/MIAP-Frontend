import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import DndTree from '../dndtree/DndTree';
import Card from './Card';
import axios from 'axios';
import { Resizable, ResizableBox } from 'react-resizable';

const MainView = ({ drugLinks, links, width, height }) => {
	onResize(event, {element, size}) {
		// this.setState({width: size.width, height: size.height});
	}

	render() {
		return (
			<div className="MainView">
				<div className="MainView__Cards row">
					<div className="col-md-4">
						<Card title="Number of Drugs"
							text={Object.keys(drugLinks).length + ' Drugs'}
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
					<ResizableBox 
						width={width} 
						height={height} 
						onResize={onResize}
						minConstraints={[500, 500]}
			      	>
						<DndTree 
							drugLinks={drugLinks}
							links={links}
							maxLinks={maxLinks}
							width={width}
							height={height}
						/>
	    		    </ResizableBox>
				</div>
			</div>	
		)
	}
}

