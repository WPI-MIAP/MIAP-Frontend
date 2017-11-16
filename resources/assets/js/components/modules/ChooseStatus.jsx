import React from 'react';

const ChooseStatus = ({ onClickRadio }) => {
	return (
		<div className="input-group add-on">
			Filter DDIs:
			<div className="radio">
				<label><input type="radio" name="optradio" onClick={() => onClickRadio('known')}/>Known DIARs</label>
			</div>
			<div className="radio">
				<label><input type="radio" name="optradio" onClick={() => onClickRadio('unknown')}/>Unknown DIARs</label>
			</div>
			<div className="radio">
				<label><input defaultChecked type="radio" name="optradio" onClick={() => onClickRadio('all')}/>Both</label>
			</div>
		</div>
	)
}

export default ChooseStatus;