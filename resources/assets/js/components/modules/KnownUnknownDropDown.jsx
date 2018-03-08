import React, {Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { primaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

const styles = {
	dropDown: {
		width: 190,
		top: -8
	}
};

/**
 * This component controls and renders the filter for selecting all rules, only known rules, or only unknown rules.
 */
class KnownUnknownDropDown extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			value: 'all',
		};

		this.handleChange = this.handleChange.bind(this);
	}

	/**
	 * Update the state when a dropdown option is selected. Indicate that a filter has been applied and 
	 * the visualization is updating accordingly.
	 */
	handleChange(event, index, value) {
		if(value !== this.state.value) {
		  	this.props.isUpdating(true);
		}
		this.setState({ 
		  	value: value,
		});
		this.props.onClick(value);
	}

	render() {

		return (
			<Paper style={{background: 'rgba(255,255,255,0.1)', height: 55}}>
				<DropDownMenu 
					className="knownUnknown"
					value={this.state.value}
					onChange={this.handleChange} 
					style={styles.dropDown}
					autoWidth={false} 
					labelStyle={{ color: 'white' }}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}
					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					selectedMenuItemStyle={{ color: primaryColor }}>
					<MenuItem value='all' primaryText="All DIARs" />
					<MenuItem value='known' primaryText="Known DIARs" />
					<MenuItem value='unknown' primaryText="Unknown DIARs" />
				</DropDownMenu>
			</Paper>
		);
	}
}

KnownUnknownDropDown.propTypes = {
	/**
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
	isUpdating: PropTypes.func.isRequired,

	/**
	 * Used to apply the known/unknown filter. Takes the value of the selected option ('all', 'known', or 'unknown').
	 */
	onClick: PropTypes.func.isRequired
};

export default KnownUnknownDropDown;