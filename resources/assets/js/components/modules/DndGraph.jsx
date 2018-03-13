import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'
import CircularProgress from 'material-ui/CircularProgress';
import { generateColor } from '../../utilities/functions';
import {baseNodeColor} from '../../utilities/constants';
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
 * Determines whether to show an edge or not given current filters.
 * 
 * @param {string} filter Known/unknown filter. Can be 'all', 'known', or 'unknown'
 * @param {string} status 'known' or 'unknown' depending on the status of the current edge
 * @param {number} score Score of the current edge
 * @param {number} minScore Minimum score to filter by
 * @param {number} maxScore Maximum score to filter by
 */
const isEdgeHidden = (filter, status, score, minScore, maxScore) => {
	return (filter !== 'all' && filter != status) || (score > maxScore || score < minScore)
}

/**
 * Determines whether to show a node or not given current filters.
 * 
 * @param {array} links Array of all rules in visualization
 * @param {string} node Drug name
 * @param {string} filter Known/unknown filter. Can be 'all', 'known', or 'unknown'
 * @param {number} minScore Minimum score to filter by
 * @param {number} maxScore Maximum score to filter by
 */
const isNodeHidden = (links, node, filter, minScore, maxScore) => {
	const outLinks = links.filter(link => 
		link.Drug1.name === node || 
		link.Drug2.name === node
	)
	
	return outLinks.every(link => (link.status !== filter && filter !== 'all') || 
		((link.status === filter || filter === 'all') && (link.Score > maxScore || link.Score < minScore)))
}

/**
 * This component renders the graph seen in the Overview.
 */
class DndGraph extends Component {
	constructor(props) {
		super(props);

		this.state = {
			network: null,
			initialZoom: 1.0
		}

		this.setNetworkInstance = this.setNetworkInstance.bind(this);
		this.home = this.home.bind(this);
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
	}

	/**
	 * Repositions network if selected drug has changed. Signals that filter updates have taken place.
	 */
	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedDrug !== this.props.selectedDrug) {
			const nodeId = this.state.network.getPositions([nextProps.selectedDrug]);
			if (nodeId[nextProps.selectedDrug]) {
				const options = {
					position: { x: nodeId[nextProps.selectedDrug].x, y: nodeId[nextProps.selectedDrug].y},
					scale: 1,
					offset: { x: 0, y: 0},
					animation: true
				}
				this.state.network.moveTo(options)
			}
		}
		if (this.props.filter !== nextProps.filter) {
			this.props.isUpdating(false);
		}
		if (this.props.minScore !== nextProps.minScore || this.props.maxScore !== nextProps.maxScore) {
			this.props.isUpdating(false);
		}
	}

	/**
	 * Redraws the network if the window size changes. If this is the first time the network is loaded, store initial zoom level.
	 */
	componentDidUpdate(prevProps, prevState) {
		if (this.state.network != null) {
			this.state.network.redraw();
			if (prevState.network == null) {
				this.setState({initialZoom: this.state.network.getScale()});
			}
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

	/**
	 * If a node/edge is selected, focus on that node/edge. Otherwise, fit the entire network to the view and center. 
	 */
	reposition() {
		if(this.state.network.getSelectedNodes().length > 0) {
			this.state.network.focus(this.state.network.getSelectedNodes()[0], {scale: 1.0});
		}
		else if(this.state.network.getSelectedEdges().length > 0) {
			var x, y = 0;
			var drugs = _.map(_.split(this.state.network.getSelectedEdges()[0], '---'), drug => _.trim(drug));
			var positions = this.state.network.getPositions([drugs[0], drugs[1]]);
			positions = [positions[drugs[0]], positions[drugs[1]]];
			x = _.meanBy(positions,p => p.x);
			y = _.meanBy(positions,p => p.y);
			this.state.network.moveTo({scale: 1.0, position: {x: x, y: y},});
		}
		else{
			this.state.network.fit({animation: false});
		}
	}

	/**
	 * Fit the entire network to the view and center. 
	 */
	home() {
		this.state.network.fit({animation: true});
	}

	/**
	 * Zoom in on the graph.
	 * 
	 * @param {number} scale Ammount by which to increment the zoom
	 */
	zoomIn(scale) {
		if(scale !== undefined) {
			var newZoom = this.state.network.getScale() + scale;
			this.state.network.moveTo({scale: newZoom});
		}
	}

	/**
	 * Zoom out on the graph. Don't zoom out past the initial zoom level.
	 * 
	 * @param {number} scale Ammount by which to decrement the zoom
	 */
	zoomOut(scale) {
		if(scale !== undefined) {
			const currentZoom = this.state.network.getScale();
			var newZoom = currentZoom - scale;
			if(newZoom < this.state.initialZoom){
				newZoom = this.state.initialZoom;
			}
			if(currentZoom !== newZoom) {
				this.state.network.moveTo({scale: newZoom});
			}
		}
	}

	render() {		
		const sortedLinks = _.orderBy(this.props.links, ['r_Drugname', 'Score'], ['asc', 'desc']);
		var numADRs = {};
		sortedLinks.forEach(link => {
			if(link.r_Drugname in numADRs) {
				numADRs[link.r_Drugname]++;
			}
			else{
				numADRs[link.r_Drugname] = 1;
			}
		});
		const uniqueLinks = _.uniqBy(sortedLinks, 'r_Drugname');

		const nodesArray = this.props.nodes.map(node => ({
			id: node, 
			label: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1), 
			title: node.charAt(0).toUpperCase() + node.toLowerCase().substring(1),
			hidden: isNodeHidden(uniqueLinks, node, this.props.filter, this.props.minScore, this.props.maxScore)
		}));

		const edgesArray = uniqueLinks.map(link => ({
			id: link.Drug1.name + ' --- ' + link.Drug2.name,
			from: link.Drug1.name, 
			to: link.Drug2.name, 
			title: generateTitle(link, numADRs[link.r_Drugname]),
			dashes: link.status === 'known',
			width: link.status === 'known' ? 2 : 4,
			color: {
				color: generateColor(link.Score, this.props.scoreRange),
				highlight: generateColor(link.Score, this.props.scoreRange),
				hover: generateColor(link.Score, this.props.scoreRange),
				opacity: 1.0
			},
			hidden: isEdgeHidden(this.props.filter, link.status, link.Score, this.props.minScore, this.props.maxScore)
		}));

		const graph = {
			nodes: nodesArray,
			edges: edgesArray
		};

		const options = {
			height: '100%',
			width: '100%',
			edges: {
				arrows: {
					to:     {enabled: false, scaleFactor:1, type:'arrow'},
					middle: {enabled: false, scaleFactor:1, type:'arrow'},
					from:   {enabled: false, scaleFactor:1, type:'arrow'}
				},
			},
			nodes: {
				shape: 'dot',
				color: baseNodeColor,
				size: 10,
				font: {
					color: '#343434',
						size: 11, // px
						face: 'Roboto',
				},
			},
			interaction:{
				hover: true,
			},
			physics:{
				barnesHut: {
					springLength: 150,
					avoidOverlap: 0.2,
				},
			},
		};

		const events = {
			select: (event) => {
				const { nodes, edges } = event;
				if (typeof nodes[0] !== undefined && nodes.length !== 0) {
					this.props.onClickNode(nodes[0]);
				} 

				if (typeof edges[0] !== undefined && nodes.length === 0) {
					this.props.onClickEdge(edges[0]);

					const options = {
						position: { x: event.pointer.canvas.x, y: event.pointer.canvas.y},
						scale: 1,
						offset: { x: 0, y: 0},
						animation: true // default duration is 1000ms and default easingFunction is easeInOutQuad.
					};
					this.state.network.moveTo(options);
				}

			},
		}

		return (
			<div className='DndGraph'>
			{ ! this.props.isFetching ?
				(
					<Graph graph={graph} options={options} events={events} getNetwork={this.setNetworkInstance} />
				) :
				(
					<div style={{position: 'absolute', left: 'calc(50% - 21px)', top: 'calc(50%)'}}>
						<i className="MainView_	_Loading fa fa-spinner fa-spin fa-3x fa-fw"></i>
					</div>
				)
			}
			</div>
		)
	}
}

DndGraph.propTypes = {
	/**
	 * Array of nodes representing all drugs in the visualization.
	 */
	nodes: PropTypes.array.isRequired,

	/**
	 * Array of links representing all interaction between pairs of drugs in the visualization.
	 */
	links: PropTypes.array.isRequired,

	/**
	 * Width of the browser window.
	 */
	width: PropTypes.number.isRequired,

	/**
	 * Height of the browser window.
	 */
	height: PropTypes.number.isRequired,
 
	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string,

	/**
	 * Callback used when a node is clicked. Takes the node as a parameter.
	 */
	onClickNode: PropTypes.func,

	/**
	 * Callback used when an edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func,

	/**
	 * Indicates whether the data is still being fetched for the nodes and links.
	 */
	isFetching: PropTypes.bool,

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
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
	isUpdating: PropTypes.func,

	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired
};

DndGraph.defaultProps = {
	selectedDrug: '',
	onClickNode: () => {},
	onClickEdge: () => {},
	isFetching: false,
	filter: 'all',
	minScore: -50,
	maxScore: 50,
	isUpdating: () => {}
};

export default DndGraph;