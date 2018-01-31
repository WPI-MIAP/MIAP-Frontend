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
import 'rc-slider/assets/index.css';
import ActionHelpOutline from 'material-ui/svg-icons/action/help-outline';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import { isNullOrUndefined } from 'util';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const styles = {
  root: {
    // background: '#D42862'
    background: '#AC2B37'
  },
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
  },
  slider: {
    position: 'relative',
    top: -10,
    width: 200,
    zIndex: 1200,
    marginLeft: 55
  },
  sliderTip: {
    position: 'relative',
    zIndex: 1200,
    placement: 'bottom',
    background: 'black'
  }
}

export default class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      value: 'all',
      filteredMin: '',
      filteredMax: '',
      sliderValue: 0,
      minScore: -0.5,
      maxScore: 1.0,
      freqDist: [],
      help: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.updateMinScore = this.updateMinScore.bind(this);
    this.updateMaxScore = this.updateMaxScore.bind(this);
    this.updateMinAndMax = this.updateMinAndMax.bind(this);
    this.openHelp = this.openHelp.bind(this);
    this.closeHelp = this.closeHelp.bind(this);
    this.findFrequencyDistribution = this.findFrequencyDistribution.bind(this);
    this.callUpdateMinScore = debounce(1000, this.callUpdateMinScore.bind(this));
    this.callUpdateMaxScore = debounce(1000, this.callUpdateMaxScore.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    this.findFrequencyDistribution();
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
      filteredMin: event.target.value,
    });

    this.callUpdateMinScore(event.target.value)
  }

  updateMaxScore(event) {
    this.setState({
      filteredMax: event.target.value,
    });

    this.callUpdateMaxScore(event.target.value)
  }

  updateMinAndMax(value) {
    // alert(value);
    this.setState({
      filteredMax: value[1],
      filteredMin: value[0],
    });
    this.callUpdateMaxScore(value[1]);
    this.callUpdateMinScore(value[0]);
  }

  openHelp(){
    this.setState({help: true});
  };

  closeHelp(){
    this.setState({help: false});
  };

  findFrequencyDistribution(){
    if(this.props.rules.length > 1 && this.state.freqDist.length == 0) {
      // find frequency distribution of rules by score, find max score and min score
      var freqDist = [];
      var maxScore = this.props.rules[0]['Score'];
      var minScore = this.props.rules[0]['Score'];
      var ruleCount = this.props.rules.length;
      this.props.rules.forEach(rule => {
        rule['Score'] = parseFloat(rule['Score']);
        //check freqDist to see if score has already been seen before
        var found = false;
        for(var i=0; i < freqDist.length; i++) {
          if(Math.abs(freqDist[i]['Score'] - rule['Score']) < 0.03) {
            freqDist[i]['Freq'] = freqDist[i]['Freq'] + 1;
            found = true;
            break;
          }
        }
        if(!found) {
          //add entry for current score
          freqDist.push({'Score': rule['Score'], 'Freq': 1});
        }
        
        //check min and max scores
        if(rule['Score'] < minScore) {
          minScore = rule['Score'];
        }
        if(rule['Score'] > maxScore) {
          maxScore = rule['Score'];
        }
      });

      freqDist.forEach(entry => {
        entry['Freq'] = (entry['Freq'] * 100) / ruleCount;
      });

      freqDist = _.sortBy(freqDist, 'Score');

      this.setState({
        minScore: minScore,
        maxScore: maxScore,
        freqDist: freqDist
      });
    }
  };

  render() {

    const actions = [
      <FlatButton
        label="Done"
        primary={true}
        onClick={this.closeHelp}
      />
    ];
    const marks = {
      [this.state.minScore]: {
          style: {
            position: 'absolute',
            zIndex: 1100,
            color: 'white',
            top: -27,
          }, label: 'Min Score: ' + this.state.minScore.toFixed(2),
        },
      [this.state.maxScore]: {
        style: {
          position: 'absolute',
          zIndex: 1100,
          color: 'white',
          top: -27,
        }, label: 'Max Score: ' + this.state.maxScore.toFixed(2),
      }
    };

    var points = [];
    this.state.freqDist.forEach(entry => {
      points.push({x: entry['Score'], y: entry['Freq']});
    });
    // points = _.sortBy(points, 'x');

    const data = [
        {									
            color: "#A9B0B7", 
            points: points
        }
    ];
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
            {/* <TextField
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
            /> */}
            <div 
              style={{position: 'relative', top: -75, marginLeft: 200}}>
              <LineChart 
                width={274}
                height={60}
                data={data}
                xMin={this.state.minScore}
                xMax={this.state.maxScore}
                yMax={0}
                yMin={180}
                hidePoints={true}
                hideXLabel={true}
                hideYLabel={true}
                hideXAxis={true}
                hideYAxis={true}
                margins={{top: 0, bottom: 0, left: 0, right: 0}}/>
              <Range defaultValue={[this.state.minScore, this.state.maxScore]} allowCross={false} min={this.state.minScore} max={this.state.maxScore} step={0.01} onAfterChange={this.updateMinAndMax} 
                style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={[{border: 'solid 2px #000000'}, {border: 'solid 2px #000000'}]} trackStyle={[{background: 'black'}]} railStyle={{background: '#A9B0B7'}}/>
            </div>
        </div>
        }
        iconElementRight={ 
          <div style={styles.elementRight}>
            <IconButton 
              tooltip="Help"
              iconStyle={{ color: 'white' }}
              tooltipPosition='bottom-left'
              onClick={this.openHelp}
            >
              <ActionHelpOutline />	
            </IconButton>
            <Dialog
              title="Help"
              actions={actions}
              modal={false}
              open={this.state.help}
              onRequestClose={this.closeHelp}>
              Help information will be shown here.
            </Dialog>

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