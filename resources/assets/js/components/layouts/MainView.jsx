import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import DndTree from '../dndtree/DndTree';
import Card from './Card';
import axios from 'axios';

export default class MainView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nodes: [],
			links: []
		}
	}

	componentDidMount() {
		axios.get('/csv/drugs')
		.then(response => {
			const nodes = response.data;
			this.setState(
				{ nodes }
				);
		}).catch(error => {
			console.log(error);
		});

		axios.get('/csv/rules')
		.then(response => {
			const links = response.data;
			this.setState(
				{ links }
				);
		}).catch(error => {
			console.log(error);
		});
	}

	render() {
		const nodes = this.state.nodes;
		const links = this.state.links;
		return (
			<div className="MainView">
				<div className="MainView__Cards row">
					<div className="col-md-4">
						<Card title="Number of Drugs"
							text={this.state.nodes.length + ' Drugs'}
						/>
					</div>
					<div className="col-md-4">
						<Card title="Number of Interactions"
							text={this.state.links.length + ' Interactions'}
						/>
					</div>
					<div className="col-md-4">
						<Card title="Demo"
							text={this.state.links.length + ' Interactions'}
						/>
					</div>
				</div>
				<DndTree 
					nodes={this.state.nodes}
					links={this.state.links}
				/>
			</div>	
		)
	}
}

