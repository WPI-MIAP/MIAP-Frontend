import React, { Component } from 'react';
import LineChart from './LineChart';

export default class Visitors extends Component {
	render() {
		return (
			<div>
                <div className="bottom-right-svg">
                    <LineChart />
                </div>
            </div>
		)
	}
}