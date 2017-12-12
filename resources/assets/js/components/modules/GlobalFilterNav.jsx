import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {debounce} from 'throttle-debounce';



const styles = {
  root: {
    paddingTop: 20,
    background: '#F5F5F5',
  },
  selectField: {
    marginLeft: 26
  },
  textField: {
    marginTop: 23,
    marginLeft: 10
  }

}

export default class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      value: 'all',
      score: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateScore = this.updateScore.bind(this)
    this.callEvent = debounce(1000, this.callEvent.bind(this));
  }

  handleChange(event, index, value) {
    console.log(index + ' ' + value)
    this.setState({ value })

    this.props.onClick(value)
  }

  callEvent(value) {
    this.props.updateScore(value)
  }

  updateScore(event) {
    this.setState({
      score: event.target.value,
    });

    this.callEvent(event.target.value)
  }

  render() {
    return (
      <Toolbar style={styles.root}>
        <ToolbarGroup firstChild={true}>
          <SelectField
            value={this.state.value}
            onChange={this.handleChange}
            floatingLabelText="Filter DIARs"
            style={styles.selectField}
            selectedMenuItemStyle={{ color: '#1FBCD3' }}
          >
            <MenuItem value='all' primaryText="All DIARs" />
            <MenuItem value='known' primaryText="Known DIARs" />
            <MenuItem value='unknown' primaryText="Unknown DIARs" />
          </SelectField>
          <TextField
            style={styles.textField}
            hintText="Score"
            value={this.state.score}
            onChange={this.updateScore}
          />
        </ToolbarGroup>
        <ToolbarGroup firstChild={true}>
          <SearchBarContainer />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}