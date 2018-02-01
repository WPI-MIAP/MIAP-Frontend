import React from 'react'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import DropDownMenu from 'material-ui/DropDownMenu'
import SortIcon from 'material-ui/svg-icons/content/sort'

const TreeViewFilter = ({ onClickRadio }) => {
	const styles = {
		root: {
			color: 'white'
		}
	}

	return (
		<IconMenu
			tooltip="Expand"
			tooltipPosition='bottom-left'
			iconStyle={styles.root}
			iconButtonElement={<IconButton><SortIcon /></IconButton>}
			anchorOrigin={{horizontal: 'left', vertical: 'top'}}
			targetOrigin={{horizontal: 'left', vertical: 'top'}}
			onClick={(event) => {
				if(event)
				{
					if(event.stopPropagation){ event.stopPropagation() }
					if(event.nativeEvent && event.nativeEvent.stopImmediatePropagation)
					{
						event.nativeEvent.stopImmediatePropagation()
					}
				}
			}}
		>
			<MenuItem primaryText="Sort by latest" onClick={() => onClickRadio('latest')} />
			<MenuItem primaryText="Sort by names" onClick={() => onClickRadio('name')} />
			<MenuItem primaryText="Sort by count" onClick={() => onClickRadio('count')} />
			<MenuItem primaryText="Sort by severity" onClick={() => onClickRadio('severity')} />
		</IconMenu>
	)
}

export default TreeViewFilter