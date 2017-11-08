import React from 'react';

export default function Card(props) {
	return (
		<div className="card">
			<div className="card-block">
				<h3 className="card-title">{props.title}</h3>
				<p className="card-text">{props.text}</p>
			</div>
		</div>
	)
}