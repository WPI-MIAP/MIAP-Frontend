import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Grid extends Component {
	render() {
				
	}
}

Grid.propTypes = {
	h: PropTypes.number,
	grid: PropTypes.func,
	gridType: PropTypes.oneOf(['x', 'y'])
};