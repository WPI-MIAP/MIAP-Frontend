import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import SortIcon from 'material-ui/svg-icons/content/sort';
import PropTypes from 'prop-types';

/**
 * This component is used to provide users with the option of sorting the drugs in the 
 * galaxy view by various properties.
 */
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

TreeViewFilter.propTypes = {
	/**
	 * Function that can be called to sort the drugs in the Galaxy View. Takes a string parameter indicating what to sort by.
	 */
	onClickRadio: PropTypes.func.isRequired
};

export default TreeViewFilter