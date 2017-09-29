import React, { Component } from 'react';
import LineChart from './LineChart';

export default class Visitors extends Component {
	render() {
		return (
			<div>
                <h3>Visitors to your site</h3>
                <div className="bottom-right-svg">
                    <LineChart />
                </div>
            </div>
		)
	}
}