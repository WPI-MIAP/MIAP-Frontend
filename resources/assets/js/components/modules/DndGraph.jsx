import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'
import CircularProgress from 'material-ui/CircularProgress'

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

const generateColor = score => {
	if (score <= 0.0) {
		return '#fecc5c'
	} 
	else if (score > 0.0 && score <= 0.01) {
		return '#fd8d3c'
	}
	else if (score > 0.01 && score <= 0.2) {
		return '#f03b20'
	}
	else if (score > 0.2) {
		return 'hsl(0, 100%, 25%)'
	}
}

const isEdgeHidden = (filter, status, score, minScore, maxScore) => {
	return (filter !== 'all' && filter != status) || (score > maxScore || score < minScore)
}

const isNodeHidden = (links, node, filter, minScore, maxScore) => {
	const outLinks = links.filter(link => 
		link.Drug1.name === node || 
		link.Drug2.name === node
	)
	
	return outLinks.every(link => (link.status !== filter && filter !== 'all') || 
		((link.status === filter || filter === 'all') && (link.Score > maxScore || link.Score < minScore)))
}

const DndGraph = ({ nodes, links, width, height, onClickNode, isFetching, selectedDrug, filter, minScore, maxScore }) => {
	const sortedLinks = _.orderBy(links, ['r_Drugname', 'Score'], ['asc', 'desc'])
	const uniqueLinks = _.uniqBy(sortedLinks, 'r_Drugname')

	const nodesArray = nodes.map(node => ({
		id: node, 
		label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
		title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
		hidden: isNodeHidden(uniqueLinks, node, filter, minScore, maxScore)
	}));

	const edgesArray = uniqueLinks.map(link => ({
		from: link.Drug1.name, 
		to: link.Drug2.name, 
		title: generateTitle(link),
		dashes: link.status === 'known',
		width: link.status === 'known' ? 2 : 4,
		color: {
			color: generateColor(link.Score),
			highlight: generateColor(link.Score),
			hover: generateColor(link.Score),
			opacity: 1.0
		},
		hidden: isEdgeHidden(filter, link.status, link.Score, minScore, maxScore)
	}));

	const graph = {
		nodes: nodesArray,
		edges: edgesArray
	};

	const options = {
		height: height + 'px',
		width: width + 'px',
		edges: {
			arrows: {
				to:     {enabled: false, scaleFactor:1, type:'arrow'},
				middle: {enabled: false, scaleFactor:1, type:'arrow'},
				from:   {enabled: false, scaleFactor:1, type:'arrow'}
			},
		},
		nodes: {
			shape: 'dot',
			color: '#2C98F0',
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

	// if (selectedDrug !== '') {
	// 	const nodeId = network.getPositions([selectedDrug]);
	// 	const options = {
	// 		position: { x: nodeId[selectedDrug].x, y: nodeId[selectedDrug].y},
	// 		scale: 1,
	// 		offset: { x: 0, y: 0},
	// 		animation: true
	// 	}
	// 	network.moveTo(options)
	// }

	return (
		<div className='DndGraph'
		style={{width: width + 'px', height: height + 'px', overflow: 'hidden'}}
		>
		{ ! isFetching ?
			<Graph graph={graph} options={options} events={events} getNetwork={setNetworkInstance}/> :
			(<i className="MainView_	_Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>)
		}
		</div>
		)
}

export default DndGraph