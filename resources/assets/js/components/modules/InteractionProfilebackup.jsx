import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import _ from 'lodash'

const InteractionProfile = ({ mainDrug = '', rules = ['', { drugs: [], rules: [] } ] }) => {
	let rankIdMap = {}
	let id = 10000
	const selectedDrugRules = rules[1]

	const drugNodesArray = selectedDrugRules.drugs.map(node => ({
		id: node, 
		label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
		title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
		level: node == mainDrug ? 1 : 2
	}))

	for (let i = 0; i < selectedDrugRules.rules.length; i = i + 1) {
		rankIdMap[selectedDrugRules.rules[i].Rank] = id
		id = id + 1
	}

	const adrNodesArray = selectedDrugRules.rules.map(rule => {
		console.log(rankIdMap)
		return {
			id: rankIdMap[rule.Rank],
			label: rule.ADR,
			title: rule.ADR,
			level: 	3
		}
	})

	const nodesArray = _.flattenDeep([ drugNodesArray, adrNodesArray])

	const edgesArray = _.flattenDeep(selectedDrugRules.rules.map(link => {
		const link1 = {
			from: link.Drug1.name === mainDrug ? link.Drug1.name : link.Drug2.name,
			to: link.Drug1.name === mainDrug ? link.Drug2.name : link.Drug1.name,
			value: link.Score, 
			// title: generateTitle(link),
			// dashes: link.status == 'known'
		}		
		const link2 = {
			from: link.Drug1.name !== mainDrug ? link.Drug1.name : link.Drug2.name,
			to: rankIdMap[link.Rank],
			value: link.Score,
			// dashes: link.status == 'known'
		}

		return [link1, link2]
	}))

	const graph = {
		nodes: nodesArray,
		edges: edgesArray
	}

	const options = {
		height: 500 + 'px',
		width: 500 + 'px',
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
			},
			// smooth: {
			// 	type: 'cubicBezier',
			// 	forceDirection: "none",
			// 	roundness: 0.25            
			// }
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
		layout: {
			improvedLayout: false,
			hierarchical: {
				levelSeparation: 150,
				nodeSpacing: 100,
				treeSpacing: 200,
				blockShifting: true,
				edgeMinimization: true,
				parentCentralization: true,
				direction: 'LR',        // UD, DU, LR, RL
				sortMethod: 'directed'   // hubsize, directed
			}
		},
	    physics: false
	};

	const events = {
		select(event) {
			const { nodes, edges } = event;
		},
	}

	return (
		<Graph graph={graph} options={options} events={events} />
	)
}

export default InteractionProfile;