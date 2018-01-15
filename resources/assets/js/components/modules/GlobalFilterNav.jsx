import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import {debounce} from 'throttle-debounce';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/svg-icons/navigation/menu';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import {white} from 'material-ui/styles/colors';
import DropDownMenu from 'material-ui/DropDownMenu';
import Slider from 'material-ui/Slider';


const styles = {
  customWidth: {
    width: 200,
  },
  elementRight: {
    display: 'flex',
    flexDirection: 'row',
  },
  textField: {
    position: 'relative',
    top: -19,
    transition: 'none',
    width: 90,
    marginRight: 20,
  }
}

export default class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      value: 'all',
      minScore: '',
      maxScore: '',
      sliderValue: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.updateMinScore = this.updateMinScore.bind(this)
    this.updateMaxScore = this.updateMaxScore.bind(this)
    this.callUpdateMinScore = debounce(1000, this.callUpdateMinScore.bind(this));
    this.callUpdateMaxScore = debounce(1000, this.callUpdateMaxScore.bind(this));
  }

  handleSliderChange(value) {
    this.setState({
      sliderValue: value
    })
  }

  handleChange(event, index, value) {
    console.log(index + ' ' + value)
    this.setState({ value })

    this.props.onClick(value)
  }

  callUpdateMinScore(value) {
    this.props.updateMinScore(value)
  }

  callUpdateMaxScore(value) {
    this.props.updateMaxScore(value)
  }

  updateMinScore(event) {
    this.setState({
      minScore: event.target.value,
    });

    this.callUpdateMinScore(event.target.value)
  }

  updateMaxScore(event) {
    this.setState({
      maxScore: event.target.value,
    });

    this.callUpdateMaxScore(event.target.value)
  }

  render() {
    return (
      <AppBar style={styles.root}
        title={
          <div>
            <DropDownMenu 
              value={this.state.value}
              onChange={this.handleChange} 
              style={styles.customWidth}
              autoWidth={false} 
              labelStyle={{ color: 'white' }}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}

            >
              <MenuItem value='all' primaryText="All DIARs" />
              <MenuItem value='known' primaryText="Known DIARs" />
              <MenuItem value='unknown' primaryText="Unknown DIARs" />
            </DropDownMenu> 
            <TextField
              style={styles.textField}
              hintText="Min Score"
              hintStyle={{ color: 'white' }}
              inputStyle={{ color: 'white' }}	
              value={this.state.minScore}
              onChange={this.updateMinScore}
            />
            <TextField
              style={styles.textField}
              hintText="Max Score"
              hintStyle={{ color: 'white' }}
              inputStyle={{ color: 'white' }}	
              value={this.state.maxScore}
              onChange={this.updateMaxScore}
            />
        </div>
        }
        iconElementRight={ 
          <div style={styles.elementRight}>
            <SearchBarContainer />
          </div>
        }
      />
        /* <ToolbarGroup firstChild={true}>
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
        </ToolbarGroup> */
    )
  }
}