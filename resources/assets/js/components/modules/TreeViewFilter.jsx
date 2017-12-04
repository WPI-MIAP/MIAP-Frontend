import React from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const TreeViewFilter = ({ onClickRadio }) => {
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
			<MenuItem primaryText="Latest" onClick={() => onClickRadio('latest')} />
			<MenuItem primaryText="Sort by names" onClick={() => onClickRadio('name')} />
			<MenuItem primaryText="Sort by count" onClick={() => onClickRadio('count')} />
			<MenuItem primaryText="Sort by severity" onClick={() => onClickRadio('severity')} />
		</IconMenu>
	)
}

export default TreeViewFilter