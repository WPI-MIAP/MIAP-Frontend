import React, {Component} from 'react';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { primaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';

const styles = {
	dropDown: {
		width: 190,
		top: -8
		// height: 56,
		// border: '1px white', 
		// borderStyle: 'solid',
		// borderRadius: 5,
		// paddingBottom: 6,
		// marginTop: 4,
		// marginLeft: 10,
	}
};

export default class KnownUnknownDropDown extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			value: 'all',
		};

		this.handleChange = this.handleChange.bind(this);
	}

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
					// className="knownUnknown"
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