import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';


const styles = {
  root: {
    paddingTop: 20,
    background: 'white',
  },
  selectField: {
    marginLeft: 26
  },
  textField: {
    marginTop: 23,
    marginLeft: 10
  }

}

const leftElement = (
  <Toolbar style={styles.root}>
    <ToolbarGroup firstChild={true}>
      <SelectField
        floatingLabelText="Filter DIARs"
        value={1}
        style={styles.selectField}
        selectedMenuItemStyle={{ color: '#1FBCD3' }}
      >
        <MenuItem value={1} primaryText="All DIARs" />
        <MenuItem value={2} primaryText="Known DIARs" />
        <MenuItem value={3} primaryText="Unknown DIARs" />
      </SelectField>
      <TextField
        style={styles.textField}
        hintText="Score"
      />
    </ToolbarGroup>
    <ToolbarGroup firstChild={true}>
    </ToolbarGroup>
  </Toolbar>
)

const GlobalFilterNav = ({ onHandleToggle }) => {
	return (
    <div>
    {leftElement}
    </div>
	)
}

export default GlobalFilterNav;