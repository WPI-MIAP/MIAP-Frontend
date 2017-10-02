import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import Dots from './Dots';
import * as d3 from 'd3';

export default class LineChart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: this.props.width
		};
	}

	render() {
		const data = [
            { day: new Date(2016, 2, 11), count: 180 },
            { day: new Date(2016, 2, 12), count: 250 },
            { day: new Date(2016, 2, 13), count: 150 },
            { day: new Date(2016, 2, 14), count: 496 },
            { day: new Date(2016, 2, 15), count: 140 },
            { day: new Date(2016, 2, 16), count: 380 },
            { day: new Date(2016, 2, 17), count: 100 },
            { day: new Date(2016, 2, 18), count: 150 }
        ];
		
		let margin = {top: 5, right: 50, bottom: 20, left: 50};
        let w = this.state.width - (margin.left + margin.right);
        let h = this.props.height - (margin.top + margin.bottom);

        let x = d3.scaleTime()
        	.domain(d3.extent(data, d => d.day))
        	.rangeRound([0, w]);

        let y = d3.scaleLinear()
        	.domain([0, d3.max(data, d => d.count + 100)])
        	.range([h, 0]);

        let line = d3.line()
            .curve(d3.curveCardinal)
        	.x(d => x(d.day))
        	.y(d => y(d.count));

        let transform='translate(' + margin.left + ',' + margin.top + ')';
		
		// let yAxis = d3.axisLeft(y).ticks(5);
		// let xAxis = d3.axisBottom(x)
		// 	.tickValues(data.map((d, i) => {
		// 		return i > 0 ? d.day : null
		// 	})
		// 	.splice(1)
		// 	.ticks(4);

		// let yGrid = d3.axisLeft(y)
		// 	.ticks(5)
		// 	.tickSize(-w, 0, 0)
		// 	.tickFormat("");

	
		return (
			<svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
				<g transform={transform}>
					<path className="line shadow" d={line(data)} strokeLinecap="round" />
					<Dots data={data} x={x} y={y}/>
				</g>
			</svg>		
		);
	}
}

LineChart.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	chartId: PropTypes.string
};

LineChart.defaultProps = {
	width: 800,
	height: 300,
	chartId: 'v1_chart'
};
