import React from 'react';

const SideBarContent = () => {
	return (
		<div className="SideBar">
				<div className="SideBar__Header">
				Menu
				</div>
				<div className="SideBar__Content">
					<div className="navbar-form" role="search">
						<div className="input-group add-on">
							<input className="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text" />
							<div className="input-group-btn">
								<button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
							</div>
						</div>
					</div>
					<hr/>
					<div className="input-group add-on">
						<input className="form-control" placeholder="Score" type="text" />
					</div>
					<hr/>
					<div className="input-group add-on">
						Filter DDIs:
						<div className="radio">
							<label><input type="radio" name="optradio"/>Known DIARs</label>
						</div>
						<div className="radio">
							<label><input type="radio" name="optradio"/>Unknown DIARs</label>
						</div>
						<div className="radio">
							<label><input type="radio" name="optradio"/>Both</label>
						</div>
					</div>
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