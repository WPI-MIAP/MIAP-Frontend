import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { InteractiveForceGraph, ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

export default class DndTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 600,
			height: 600
		};
	}

	render() {
		let nodes = this.props.nodes.map(node => {
			return (
				<ForceGraphNode key={node.id} node={{ id: node.id, label: node.name }}/>
			)
		});

		let links = this.props.links.map((link, index) => {
			return (
				<ForceGraphLink key={index} link={{ source: link.Drug1.id, target: link.Drug2.id }} />
			)
		});
		
		return (
			<div className='DndTree'>
			{ this.props.links.length > 0 && this.props.nodes.length > 0 ?
				(<InteractiveForceGraph
					simulationOptions={{ height: this.state.height, width: this.state.width }}
					labelAttr="label"
					highlightDependencies
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
