import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import FlatButton from 'material-ui/FlatButton';


const styles = {
	background: '#288AE2'
}

const Navigation = ({ onHandleToggle }) => {
	return (
		<AppBar
			onLeftIconButtonTouchTap={onHandleToggle}
			iconElementRight={<FlatButton label="Login" />}
			showMenuIconButton={false}
		    title="DIVA"
			style={styles}
		/>		
	)
}

export default Navigation;