import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import * as _ from 'lodash';

export default class DndTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 600,
			height: 600
		};
	}

	render() {
		const scores = _.map(this.props.links, 'Score');
		const low_color="#fecc5c", low_med_color="#fd8d3c",  med_color="#f03b20", high_color= "hsl(0, 100%, 25%)"

		const nodeRadiusScale = d3.scaleLinear()
			.domain([0, this.props.maxLinks])
			.range([5, 15])

		const nodes = Object.keys(this.props.drugLinks).map(drug => {
			return (
				<ForceGraphNode
					key={ drug }
					node={{ id: drug, label: drug }}
					r={nodeRadiusScale(this.props.drugLinks[drug].length)}
					fill="#42C0FB"
					stroke="white"
				/>
			)
		});

		const links = this.props.links.map((link, index) => {
			let color = '#8585ad';
			let width = 1;

			if (link.Score <= 0) {
				color = low_color;
			}
			else if (link.Score > 0 && link.Score <= 0.01) {
				color = low_med_color;
				width = 3;
			}
			else if (link.Score > 0.01 && link.Score <= 0.2) {
				color = med_color;
				width = 5;
			}
			else if (link.Score > 0.2) {
				color = high_color;
				width = 7;
			}

			return (
				<ForceGraphLink 
					key={index} 
					link={{ source: link.Drug1.name, target: link.Drug2.name, value: width }} 
					stroke={color}
					fill="none"
				/>
				)
		});

		return (
			<div className='DndTree'>
			{ this.props.links.length > 0 && Object.keys(this.props.drugLinks).length > 0 ?
				(<InteractiveForceGraph
					simulationOptions={{ 
						height: this.state.height, 
						width: this.state.width,
						radiusMargin: 100
					}}
					labelAttr="label"
					zoom
					>
					{nodes}
					{links}
					</InteractiveForceGraph>) :
				(<i className="MainView__Loading fa fa-spinner fa-pulse fa-3x fa-fw"></i>)
			}

			</div>
			);
	}
}

DndTree.propTypes = {

};

DndTree.defaultProps = {
};
