import React, { Component } from 'react';
import Visitors from './Visitors';

export default class App extends Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<div className="top" id="top-line-chart">
							<Visitors />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

