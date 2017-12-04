import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'

const generateTitle = ({ ADR, Score, id, Drug1, Drug2, status }) => {
	return `
		<div>Drugs: ${Drug1.name} - ${Drug2.name}</div>
		<div>ADR: ${ADR}</div>
		<div>Reports Count: ${id.split(',').length}</div>
		<div>Score: ${Score}</div>
		<div>Status: ${status}</div>
	`	
}

const DndTree = ({ data }) => {
	const nodesArray = data.drugs.map(node => ({
		id: node, 
		label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
		title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
	}));

	const edgesArray = data.rules.map(link => ({
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
		height: 250 + 'px',
		// width: 180 + 'px',
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
			const { nodes, edges } = event;
			console.log('hi')
		},
	}

	return (
		<div>
		{
			! data.isFetching ? 
			<Graph graph={graph} options={options} events={events} /> :
			(<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>)
		}
		</div>
	)
}
	
export default DndTree