import React from 'react';

const Card = ({ title, text }) => {
	return (
		<div className="card">
			<div className="card-block">
				<h3 className="card-title">{title}</h3>
				<p className="card-text">{text}</p>
			</div>
		</div>
	)
}

export default Card
