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

const DndTree = ({ nodes, links, width, height }) => {
	return (
		<div className='DndTree'>
			<h1>Hello world</h1>
		</div>
		)
}

export default DndTree