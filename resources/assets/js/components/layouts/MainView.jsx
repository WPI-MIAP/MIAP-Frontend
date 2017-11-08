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
			drugLinks: [],
			links: [],
			maxLinks: 0
		}
	}

	componentDidMount() {
		axios.get('/csv/drugs')
		.then(response => {
			const drugLinks = response.data;
			const maxLinks = _.max(_.map(_.values(drugLinks), links => {
				return links.length;
			}));

			this.setState({
				drugLinks,
				maxLinks
			});
		}).catch(error => {
			console.log(error);
		});

		axios.get('/csv/rules')
		.then(response => {
			const links = response.data;
			this.setState (
				{ links }
			);


		}).catch(error => {
			console.log(error);
		});
	}

	render() {
		const drugLinks = this.state.drugLinks;
		const links = this.state.links;
		return (
			<div className="MainView">
				<div className="MainView__Cards row">
					<div className="col-md-4">
						<Card title="Number of Drugs"
							text={Object.keys(this.state.drugLinks).length + ' Drugs'}
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
					drugLinks={this.state.drugLinks}
					links={this.state.links}
					maxLinks={this.state.maxLinks}
				/>
			</div>	
		)
	}
}

