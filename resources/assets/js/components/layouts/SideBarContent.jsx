import React from 'react';
import SearchInput, {createFilter} from 'react-search-input'
import ChooseStatusContainer from '../../containers/ChooseStatusContainer'
import SearchBarContainer from '../../containers/SearchBarContainer'

const SideBarContent = () => {
	return (
		<div className="SideBar">
				<div className="SideBar__Header">
				Menu
				</div>
				<div className="SideBar__Content">
					<SearchBarContainer />
					<hr/>
					<div className="input-group add-on">
						<input className="form-control" placeholder="Score" type="text" />
					</div>
					<hr/>
					<ChooseStatusContainer />
					<hr/>
					<div className="input-group add-on">
						Score Criteria:
						<div className="radio">
							<label><input type="radio" name="optradio"/>Support</label>
						</div>
						<div className="radio">
							<label><input type="radio" name="optradio"/>Confidence</label>
						</div>
						<div className="radio">
							<label><input type="radio" name="optradio"/>Reporting Ratio</label>
						</div>
					</div>
				</div>
			</div>
		)
}

export default SideBarContent