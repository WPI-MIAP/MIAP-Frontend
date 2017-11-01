import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';
import { prepareData } from '../../utilities/generate-data';

export default class DndTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 960,
			height: 500
		};
	}

	componentDidMount() {
		prepareData();
	}

	render() {
		const data = [

		];
		
		return (
			<InteractiveForceGraph
				simulationOptions={{ height: 300, width: 300 }}
				labelAttr="label"
				highlightDependencies
			>
				<ForceGraphNode node={{ id: 'first-node', label: 'First node' }} />
				<ForceGraphNode node={{ id: 'second-node', label: 'Second node' }} />
				<ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />
			</InteractiveForceGraph>
		);
	}
}

DndTree.propTypes = {

};

DndTree.defaultProps = {
};
