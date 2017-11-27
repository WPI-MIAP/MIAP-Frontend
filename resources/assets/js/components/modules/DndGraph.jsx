import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'

let network = null;

const generateTitle = ({ ADR, Score, id, Drug1, Drug2, status }) => {
	return `
		<div>Drugs: ${Drug1.name} - ${Drug2.name}</div>
		<div>ADR: ${ADR}</div>
		<div>Reports Count: ${id.split(',').length}</div>
		<div>Score: ${Score}</div>
		<div>Status: ${status}</div>
	`	
}

const setNetworkInstance = nw => {
	network = nw;	
}

const DndGraph = ({ nodes, links, width, height, onClickNode, isFetching }) => {
	const nodesArray = nodes.map(node => ({
		id: node, 
		label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
		title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
	}));

	const edgesArray = links.map(link => ({
		from: link.Drug1.name, 
		to: link.Drug2.name, 
		value: link.Score, 
		title: generateTitle(link),
		dashes: link.status === 'known' 
	}));

	const graph = {
		nodes: nodesArray,
		edges: edgesArray
	};

	const options = {
		height: height + 'px',
		width: width + 'px',
		edges: {
			color: "#000000",
			arrows: {
				to:     {enabled: false, scaleFactor:1, type:'arrow'},
				middle: {enabled: false, scaleFactor:1, type:'arrow'},
				from:   {enabled: false, scaleFactor:1, type:'arrow'}
			},
			scaling: {
				min: 1,
				max: 5
			}
		},
		nodes: {
			shape: 'dot',
			size: 10,
			font: {
				color: '#343434',
			    size: 11, // px
			    face: 'arial',
			},
		},
		interaction:{
			hover: true,
		}
	};

	const events = {
		select(event) {
			console.log(event)
			const { nodes, edges } = event;
			onClickNode(nodes[0]);
			const options = {
				position: { x: event.pointer.canvas.x, y: event.pointer.canvas.y},
				scale: 1,
				offset: { x: 0, y: 0},
				animation: true // default duration is 1000ms and default easingFunction is easeInOutQuad.
			};
			network.moveTo(options);
		},
	}

	return (
		<div className='DndGraph'
		style={{width: width + 'px', height: height + 'px', overflow: 'hidden'}}
		>
		{ ! isFetching ?
			<Graph graph={graph} options={options} events={events} getNetwork={setNetworkInstance}/> :
			(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>)
		}
		</div>
		)
}

export default DndGraph