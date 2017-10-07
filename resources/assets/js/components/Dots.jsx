import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Dots extends Component {
	render() {
		let data = this.props.data.splice(1);
		data.pop();

		let circles = data.map((d, i) => {
			return (
				<circle className="dot" 
					r="7" 
					cx={this.props.x(d.day)} 
					cy={this.props.y(d.count)} 
					fill="#7dc7f4"
                    stroke="#3f5175" strokeWidth="5px" key={i}
                />
			)
		});

		return (
			<g>{circles}</g>
		)
	}
}

Dots.propTypes = {
	data: PropTypes.array,
	x: PropTypes.func,
	y: PropTypes.func
};