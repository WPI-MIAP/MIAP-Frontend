import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const ChooseStatus = ({ numRules, numDrugs, onClickRadio }) => {
	const styles = {
		root: {
			color: 'white'
		}
	}
	
	return (
		<IconMenu
			iconStyle={styles.root}
			iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
			anchorOrigin={{horizontal: 'left', vertical: 'top'}}
			targetOrigin={{horizontal: 'left', vertical: 'top'}}
		>
			<MenuItem primaryText="Known DIARs" onClick={() => onClickRadio('known')} />
			<MenuItem primaryText="Unknown DIARs" onClick={() => onClickRadio('unknown')} />
			<MenuItem primaryText="Boths" onClick={() => onClickRadio('all')} />
		</IconMenu>
	)
}

export default ChooseStatus;