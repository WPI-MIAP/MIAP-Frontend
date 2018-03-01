import React, { Component } from 'react';
import * as d3 from 'd3';
import Graph from 'react-graph-vis'
import CircularProgress from 'material-ui/CircularProgress';
import { generateColor } from '../../utilities/functions';
import {baseNodeColor} from '../../utilities/constants';

let network = null;

const generateTitle = ({ ADR, Score, id, Drug1, Drug2, status }) => {
	return `
		<div>Drugs: ${_.startCase(Drug1.name)} - ${_.startCase(Drug2.name)}</div>
		<div>ADR: ${ADR}</div>
		<div>Report Count: ${id.split(',').length}</div>
		<div>Score: ${Score}</div>
		<div>Status: ${status}</div>
	`	
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

export default class DndGraph extends Component {
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

	componentDidUpdate(prevProps, prevState) {
		if (this.state.network != null) {
			this.state.network.redraw();
			if (prevState.network == null) {
				this.setState({initialZoom: this.state.network.getScale()});
			}
		}
	}

	setNetworkInstance(nw) {
		this.setState({ network: nw });
	}

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

	home() {
		this.state.network.fit({animation: true});
	}

	zoomIn(scale) {
		if(scale !== undefined) {
			var newZoom = this.state.network.getScale() + scale;
			this.state.network.moveTo({scale: newZoom});
		}
	}

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
		if(this.state.network !== null)
		{
			console.log('selected nodes: ' + this.state.network.getSelectedNodes());
			console.log('selected edges: ' + this.state.network.getSelectedEdges());
			// 	console.log(this.state.network.getScale());
		}
		
		const sortedLinks = _.orderBy(this.props.links, ['r_Drugname', 'Score'], ['asc', 'desc'])
		const uniqueLinks = _.uniqBy(sortedLinks, 'r_Drugname')

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
			title: generateTitle(link),
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
				// smooth: {
				// 	type: 'continuous',
				// },
				// length: 1000
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
					// springConstant: 0.5,
					avoidOverlap: 0.2,
				},
				// repulsion: {
				// 	// nodeDistance: 10000,
				// 	// springLength: 1000000,
				// 	// springConstant: 1.0,
				// },
			},
		};

		const events = {
			select: (event) => {
				const { nodes, edges } = event;
				// console.log(nodes);
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
				// style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
				>
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