import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'
import {baseNodeColor} from '../../utilities/constants';
import {generateColor} from '../../utilities/functions';


const generateTitle = ({ ADR, Score, Drug1, Drug2, status }, numADRs) => {
	return `
		<div>Drugs: ${_.startCase(Drug1.name)} - ${_.startCase(Drug2.name)}</div>
		<div>Number of ADRs: ${numADRs}</div>
		<div>Highest-scored ADR: ${ADR}</div>
		<div>Score: ${_.round(parseFloat(Score), 2)}</div>
		<div>Status: ${status}</div>
	`	
}

const isNodeHidden = (filter, rules, drug, currentDrug, minScore, maxScore) => {
	const currentRule = rules.find(el => (el.Drug1.name == drug || el.Drug2.name == drug))

	if (drug === currentDrug) {
		return false
	}

	if ((currentRule.status === filter || filter === 'all') && currentRule.Score > minScore && currentRule.Score < maxScore) {
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

export default class DndTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			network: null
		}

		this.setNetworkInstance = this.setNetworkInstance.bind(this);
	}

	componentDidUpdate() {
		if (this.state.network != null) {
			this.state.network.redraw();
			this.state.network.fit();
		}
	}

	setNetworkInstance(nw) {
		this.setState({ network: nw });
	}


	render() {
		const sortedLinks = _.orderBy(this.props.data.rules, ['r_Drugname', 'Score'], ['asc', 'desc']);
		var numADRs = {};
		sortedLinks.forEach(link => {
			if(link.r_Drugname in numADRs) {
				numADRs[link.r_Drugname]++;
			}
			else{
				numADRs[link.r_Drugname] = 1;
			}
		});
		const uniqueLinks = _.uniqBy(sortedLinks, 'r_Drugname')
		const edgesArray = uniqueLinks.map(link => ({
			id: link.Drug1.name + ' --- ' + link.Drug2.name,
			from: link.Drug1.name, 
			to: link.Drug2.name, 
			title: generateTitle(link, numADRs[link.r_Drugname]),
			color: {
				color: 'gray',
				highlight: 'gray',
				hover: 'gray',
				opacity: 1.0
			},
			width: 3,
			hidden: isEdgeHidden(this.props.filter, link.status, link.Score, this.props.minScore, this.props.maxScore)
		}))

		const nodesArray = this.props.data.drugs.map(node => ({
			id: node, 
			label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
			title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
			size: (this.props.data.rules.find(el => 
				(el.Drug1.name == node || el.Drug2.name == node)
			).status == 'known' && node != this.props.currentDrug) ? 5 : 10,
			hidden: isNodeHidden(this.props.filter, this.props.data.rules, node, this.props.currentDrug, this.props.minScore, this.props.maxScore),
			color: node != this.props.currentDrug ? generateColor(this.props.data.rules.find(el => 
				(el.Drug1.name == node || el.Drug2.name == node)
			).Score, this.props.scoreRange) : baseNodeColor
		}))

		const graph = {
			nodes: nodesArray,
			edges: edgesArray
		}

		const options = {
			height: this.props.testExample ? 140 + 'px' : 240 + 'px',
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
						face: 'Roboto',
				},
			},
			interaction:{
				hover: true,
			}
		}

		const events = {
			select: (event) => {
				const { nodes, edges } = event;
				console.log(nodes);
				// if (typeof nodes[0] !== undefined && nodes.length !== 0) {
				// 	this.props.onClickNode(nodes[0]);
				// } 

				if (typeof edges[0] !== undefined && nodes.length === 0) {
					this.props.onClickEdge(edges[0]);
				}
			}
		}

		return (
			<div>
			{
				! this.props.data.isFetching ? 
				<Graph graph={graph} options={options} events={events} getNetwork={this.setNetworkInstance} /> :
				<span >
					<i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw" style={{ marginTop: 100, marginLeft: 15 }}></i>
				</span>
			}
			</div>
		)
	}
}