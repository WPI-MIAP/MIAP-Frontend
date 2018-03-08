import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'
import {baseNodeColor} from '../../utilities/constants';
import {generateColor} from '../../utilities/functions';
import PropTypes from 'prop-types';

/**
 * Generates a tooltip for an edge.
 * 
 * @param {object} param0 Information used to generate tooltip
 * @param {number} numADRs Number of ADRs between Drug1 and Drug2
 */
const generateTitle = ({ ADR, Score, Drug1, Drug2, status }, numADRs) => {
	return `
		<div>Drugs: ${_.startCase(Drug1.name)} - ${_.startCase(Drug2.name)}</div>
		<div>Number of ADRs: ${numADRs}</div>
		<div>Highest-scored ADR: ${ADR}</div>
		<div>Score: ${_.round(parseFloat(Score), 2)}</div>
		<div>Status: ${status}</div>
	`	
}

/**
 * Determines whether to show a node or not given current filters.
 * 
 * @param {string} filter Known/unknown filter. Can be 'all', 'known', or 'unknown'
 * @param {array} rules Array of all rules in visualization
 * @param {string} drug Drug name
 * @param {strng} currentDrug Name of central drug
 * @param {number} minScore Minimum score to filter by
 * @param {number} maxScore Maximum score to filter by
 */
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

/**
 * Determines whether to show an edge or not given current filters.
 * 
 * @param {string} filter Known/unknown filter. Can be 'all', 'known', or 'unknown'
 * @param {string} status 'known' or 'unknown' depending on the status of the current edge
 * @param {number} score Score of the current edge
 * @param {number} minScore Minimum score to filter by
 * @param {number} maxScore Maximum score to filter by
 */
const isEdgeHidden = (filter, status, score, minScore, maxScore) => {
	return ! ((filter === 'known' && status === 'known') || 
		(filter === 'unknown' && status === 'unknown') || 
		filter === 'all') ||
		(score > maxScore || score < minScore)
}

/**
 * This component controls and renders a single galaxy view inside of a DndTreeContainer.
 */
class DndTree extends Component {
	constructor(props) {
		super(props);

		this.state = {
			network: null
		}

		this.setNetworkInstance = this.setNetworkInstance.bind(this);
	}

	/**
	 * Make sure that the network is centered and rerendered if updated props are received.
	 */
	componentDidUpdate() {
		if (this.state.network != null) {
			this.state.network.redraw();
			this.state.network.fit();
		}
	}

	/**
	 * Assign the network ref to a state variable.
	 * 
	 * @param {*} nw The network ref from the Graph component
	 */
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
			height: this.props.helpExample ? 140 + 'px' : 240 + 'px',
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
				// console.log(nodes);
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

DndTree.propTypes = {
	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired,
 
	/**
	 * Indicates whether this is the version found in the help menu (defaults to false).
	 */
	helpExample: PropTypes.bool,
 
	/**
	 * Name of the central drug.
	 */
	currentDrug: PropTypes.string.isRequired,
 
	/**
	 * Contains information such as rules that allow for rendering the graph.
	 */
	data: PropTypes.object.isRequired,
 
	/**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
	filter: PropTypes.string,
 
	/**
	 * Minimum score for filtering interactions.
	 */
	minScore: PropTypes.number,
 
	/**
	 * Maximum score for filtering interactions.
	 */
	maxScore: PropTypes.number,

	/**
	 * Callback used when an edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func
};

DndTree.defaultProps = {
	helpExample: false,
	filter: 'all',
	minScore: -50,
	maxScore: 50,
	onClickEdge: () => {}
}

export default DndTree;