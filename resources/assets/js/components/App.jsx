import React, { Component } from 'react';
import DndTree from './dndtree/DndTree';

export default class App extends Component {
	render() {
		return (
			<div className="dndTree">
				<DndTree />
			</div>
		);
	}
}

