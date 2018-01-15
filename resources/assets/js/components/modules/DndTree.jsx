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

const isNodeHidden = (filter, rules, drug, currentDrug, minScore, maxScore) => {
	const currentRule = rules.find(el => (el.Drug1.name == drug || el.Drug2.name == drug))

	if (drug === currentDrug) {
		return false
	}

	if ((currentRule.status === filter || filter === 'all')) {
		return false
	}

	if ((currentRule.status === filter || filter === 'all') && (currentRule.Score < minScore || currentRule.Score > maxScore)) {
		return false
	}

	return true
}

const isEdgeHidden = (filter, status, score, minScore, maxScore) => {
	return ! ((filter === 'known' && status === 'known') || 
		(filter === 'unknown' && status === 'unknown') || 
		filter === 'all') ||
		(score > maxScore || score < minScore)
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

const DndTree = ({ currentDrug, data, filter, score }) => {
	const sortedLinks = _.orderBy(data.rules, ['r_Drugname', 'Score'], ['asc', 'desc'])
	const uniqueLinks = _.uniqBy(sortedLinks, 'r_Drugname')
	const edgesArray = uniqueLinks.map(link => ({
		from: link.Drug1.name, 
		to: link.Drug2.name, 
		title: generateTitle(link),
		color: {
			color: 'gray',
			highlight: 'gray',
			hover: 'gray',
			opacity: 1.0
		},
		width: 3,
		hidden: isEdgeHidden(filter, link.status, link.Score, minScore, maxScore)
	}))

	const nodesArray = data.drugs.map(node => ({
		id: node, 
		label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
		title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
		size: (data.rules.find(el => 
			(el.Drug1.name == node || el.Drug2.name == node)
		).status == 'known' && node != currentDrug) ? 5 : 10,
		hidden: isNodeHidden(filter, data.rules, node, currentDrug, minScore, maxScore),
		color: node != currentDrug ? generateColor(data.rules.find(el => 
			(el.Drug1.name == node || el.Drug2.name == node)
		).Score) : '#349AED'
	}))


	const graph = {
		nodes: nodesArray,
		edges: edgesArray
	}

	const options = {
		height: 250 + 'px',
		// width: 180 + 'px',
		edges: {
			color: "#000000",
			arrows: {
				to:     {enabled: false, scaleFactor:1, type:'arrow'},
				middle: {enabled: false, scaleFactor:1, type:'arrow'},
				from:   {enabled: false, scaleFactor:1, type:'arrow'}
			}
		},
		nodes: {
			shape: 'dot',
			font: {
				color: '#343434',
			    size: 11, // px
			    face: 'arial',
			},
		},
		interaction:{
			hover: true,
		}
	}

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