import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import DndTree from '../dndtree/DndTree';
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
						<div className="card">
							<div className="card-block">
								<h3 className="card-title">Number of Drugs</h3>
								<p className="card-text">{this.state.nodes.length} Drugs</p>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card">
							<div className="card-block">
								<h3 className="card-title">Number of Interactions</h3>
								<p className="card-text">{this.state.links.length} interactions</p>
							</div>
						</div>
					</div>
					<div className="col-md-4">
						<div className="card">
							<div className="card-block">
								<h3 className="card-title">This is a demo card</h3>
								<p className="card-text">{this.state.links.length} interactions</p>
							</div>
						</div>
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

