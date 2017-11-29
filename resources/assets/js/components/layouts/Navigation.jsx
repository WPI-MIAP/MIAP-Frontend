import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';

const Navigation = ({ onHandleToggle }) => {
	

	return (
		<AppBar
			onLeftIconButtonTouchTap={onHandleToggle}
		    title="DIVA"
		    iconElementRight={<SearchBarContainer />}
		/>		
	)
}

export default Navigation;