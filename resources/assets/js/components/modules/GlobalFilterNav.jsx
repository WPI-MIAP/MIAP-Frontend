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
import RaisedButton from 'material-ui/RaisedButton';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import { isNullOrUndefined } from 'util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { GridTile } from 'material-ui/GridList';
import DndGraph from './DndGraph';
import DndTreeContainer from '../layouts/DndTreeContainer';
import InteractionProfile from './InteractionProfile';
import Paper from 'material-ui/Paper';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const wpiLogo = <img style={{
    height: 45,
    marginLeft: 10
  }} 
  src={require('../../../../images/WPI_Inst_Prim_White_Rev.png')} />;

const styles = {
  root: {
    background: '#AA2C3B'
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
};

const dmeColors = ['#A9A9A9','#9E9AC8', '#807DBA', '#6A51A3', '#4A1486'];
const scoreColors = ['#fecc5c', '#fd8d3c', '#f03b20', 'hsl(0, 100%, 25%)'];

const dummyData = {
  nodes: [
    'Drug 1',
    'Drug 2',
    'Drug 3'
  ],
  edges: [
    {
      Rank: "408",
      Score: 0.089384071,
      ADR: "ADR 1",
      r_Drugname: "[Drug 1] [Drug 2]",
      Support: 15,
      Confidence: 30,
      Drug1: {
        id: 0,
        name: "Drug 1"
      },
      Support1: 12,
      Confidence1: 21.8182,
      Drug2: {
        id: 1,
        name: "Drug 2"
      },
      Support2: 34,
      Confidence2: 9.65909,
      status: "unknown",
      id: "1, 2, 4, 6"
    },
    {
      Rank: "702",
      Score: 0.314159265,
      ADR: "ADR 2",
      r_Drugname: "[Drug 2] [Drug 3]",
      Support: 45,
      Confidence: 60,
      Drug1: {
        id: 1,
        name: "Drug 2"
      },
      Support1: 19,
      Confidence1: 21.8182,
      Drug2: {
        id: 2,
        name: "Drug 3"
      },
      Support2: 56,
      Confidence2: 11.1241,
      status: "known",
      id: "3, 5, 7, 9, 11, 37"
    }
  ],
  currentDrugs: [
    ['Drug 2', {drugs: ['Drug 1', 'Drug 2', 'Drug 3'], 
      rules: [
        {
          Rank: "408",
          Score: 0.089384071,
          ADR: "ADR 1",
          r_Drugname: "[Drug 1] [Drug 2]",
          Support: 15,
          Confidence: 30,
          Drug1: {
            id: 0,
            name: "Drug 1"
          },
          Support1: 12,
          Confidence1: 21.8182,
          Drug2: {
            id: 1,
            name: "Drug 2"
          },
          Support2: 34,
          Confidence2: 9.65909,
          status: "unknown",
          id: "1, 2, 4, 6"
        },
        {
          Rank: "702",
          Score: 0.314159265,
          ADR: "ADR 2",
          r_Drugname: "[Drug 2] [Drug 3]",
          Support: 45,
          Confidence: 60,
          Drug1: {
            id: 1,
            name: "Drug 2"
          },
          Support1: 19,
          Confidence1: 21.8182,
          Drug2: {
            id: 2,
            name: "Drug 3"
          },
          Support2: 56,
          Confidence2: 11.1241,
          status: "known",
          id: "3, 5, 7, 9, 11, 37"
        }
      ],
    drugDMEs: ["ADR 2"]}]
  ],
  selectedDrug: 'Drug 2',
};

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
      help: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateMinScore = this.updateMinScore.bind(this);
    this.updateMaxScore = this.updateMaxScore.bind(this);
    this.updateMinAndMax = this.updateMinAndMax.bind(this);
    this.openHelp = this.openHelp.bind(this);
    this.closeHelp = this.closeHelp.bind(this);
    this.findFrequencyDistribution = this.findFrequencyDistribution.bind(this);
    this.callUpdateMinScore = debounce(1000, this.callUpdateMinScore.bind(this));
    this.callUpdateMaxScore = debounce(1000, this.callUpdateMaxScore.bind(this));
    this.startTour = this.startTour.bind(this);
    // this.endTour = this.endTour.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.findFrequencyDistribution();
  }

  handleChange(event, index, value) {
    console.log(index + ' ' + value)
    this.setState({ 
      value: value,
    });
    this.props.isUpdating(true);
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
    this.props.isUpdating(true);
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

  startTour() {
    if(this.state.help) {
      this.setState({ help: false });
    }
    this.props.startTour();
  }

  render() {
    
		const updating = this.props.updating ? (
				<i style={{position: 'relative', top: -102, left: 520}} className="MainView__Loading fa fa-spinner fa-spin fa-lg fa-fw" ></i>
		) : null;

    const actions = [
      <FlatButton
        label="Take a tour"
        primary={true}
        onClick={this.startTour}
      />, 
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

    const dummyMarks = {
      [this.state.minScore]: {
          style: {
            position: 'absolute',
            zIndex: 1100,
            color: 'white',
            top: 0,
          }, label: 'Min Score: ' + this.state.minScore.toFixed(2),
        },
      [this.state.maxScore]: {
        style: {
          position: 'absolute',
          zIndex: 1100,
          color: 'white',
          top: 0,
        }, label: 'Max Score: ' + this.state.maxScore.toFixed(2),
      }
    };

    var points = [];
    this.state.freqDist.forEach(entry => {
      points.push({x: entry['Score'], y: entry['Freq']});
    });

    const data = [
        {									
            color: "#A9B0B7", 
            points: points
        }
    ];
    return (
      <AppBar style={styles.root}
        zDepth={2}
        title={
          <div>
            <DropDownMenu 
              className="knownUnknown"
              value={this.state.value}
              onChange={this.handleChange} 
              style={styles.customWidth}
              autoWidth={false} 
              labelStyle={{ color: 'white' }}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              selectedMenuItemStyle={{ color: '#AA2C3B' }}
            >
              <MenuItem value='all' primaryText="All DIARs" />
              <MenuItem value='known' primaryText="Known DIARs" />
              <MenuItem value='unknown' primaryText="Unknown DIARs" />
            </DropDownMenu> 
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
              <Range className='scoreMinMax scoreMinMax2'
                defaultValue={[this.state.minScore, this.state.maxScore]} allowCross={false} min={this.state.minScore} max={this.state.maxScore} step={0.01} onAfterChange={this.updateMinAndMax} 
                style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={[{border: 'none'}, {border: 'none'}]} trackStyle={[{background: 'white'}]} railStyle={{background: '#A9B0B7'}}
                dotStyle={{display: 'none'}}/>
            </div>
            {updating}
        </div>
        }
        iconElementLeft={wpiLogo}
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
              contentStyle={{width: "80%", maxWidth: "none"}}
              actions={actions}
              modal={false}
              open={this.state.help}
              onRequestClose={this.closeHelp}
              autoScrollBodyContent={true}>
              <Grid>
                <Row>
                  <Card initiallyExpanded={true} style={{width: '100%'}}>
                    <CardHeader
                      title="Views"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      <Row>
                        <Col sm={12} md={7}>
                          <h5>Overview</h5>
                          <ul>
                            <li>Each <b>node</b> is a <b>drug</b></li>
                            <li>Each <b>edge</b> is a possible <b>adverse drug reaction (ADR)</b></li>
                            <li>A <b>dashed edge</b> means the interaction is <b>known</b></li>
                            <li>A <b>solid edge</b> means the interaction is <b>unknown</b></li>
                            <li>The <b>edge color</b> represents the <b>interaction score</b></li>
                          </ul>
                        </Col>
                        <Col sm={12} md={5}>
                          <Row>
                            <Paper zDepth={1} style={{height: 170, width: 230}}>
                              <DndGraph 
                                nodes={dummyData.nodes}
                                links={dummyData.edges}
                                width={100}
                                height={100} 
                                selectedDrug=''
                                onClickNode={() => {}}
                                onClickEdge={() => {}}
                                isFetching={false}
                                filter='all'
                                minScore={-50}
                                maxScore={50}
                              />
                            </Paper>
                            <Col style={{marginLeft: 20}}>
                              <Row style={{height: 34}}>
                                {'Contrast Score'}
                              </Row>
                              <Row>
                                <div style={{width: 34, height: 34, background: scoreColors[0], marginRight: 10}}/>
                                <div><p>{'Under 0.0'}</p></div>
                              </Row>
                              <Row>
                                <div style={{width: 34, height: 34, background: scoreColors[1], marginRight: 10}}/>
                                <div><p>{'0.0 - 0.01'}</p></div>
                              </Row>
                              <Row>
                                <div style={{width: 34, height: 34, background: scoreColors[2], marginRight: 10}}/>
                                <div><p>{'0.01 - 0.2'}</p></div>
                              </Row>
                              <Row>
                                <div style={{width: 34, height: 34, background: scoreColors[3], marginRight: 10}}/>
                                <div><p>{'Above 0.2'}</p></div>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={{marginTop: 20}}>
                        <Col sm={12} md={7}>
                          <h5>Galaxy View</h5>
                          <ul>
                            <li>The <b>central drug</b> in a window is the <b>drug of interest</b></li>
                            <li>The <b>surrounding nodes</b> are drugs that <b>interact with the central drug</b></li>
                            <li>The <b>color</b> of a window's header indicates the <b>severe ADR count</b> associated with the drug of interest</li>
                            <li>Drugs in this view can be <b>sorted</b> by <b>name</b>, <b>interaction count</b>, or <b>number of severe ADRs</b></li>
                            <li>Surrounding nodes are <b>bigger</b> if there may be an <b>unknown interaction</b> with that drug</li>
                            <li>Surrounding nodes are <b>smaller</b> if there is a <b>known interaction</b> with that drug</li>
                          </ul>
                        </Col>
                        <Col sm={12} md={5}>
                          <Row>
                            <Paper zDepth={1} style={{height: 210, width: 230}}>
                              <DndTreeContainer 
                                currentDrugs={dummyData.currentDrugs}
                                filter='all'
                                minScore={-50}
                                maxScore={50}
                                onClickNode={() => {}}
                                onDeleteNode={() => {}}
                                cols={4}
                                selectedDrug={dummyData.selectedDrug}
                                testExample={true}
                              />
                            </Paper>
                            <Col style={{marginLeft: 20}}>
                              <Row style={{height: 35}}>
                                {'Severe ADR Count'}
                              </Row>
                              <Row style={{height: 35}}>
                                <div style={{width: 34, background: dmeColors[0], marginRight: 10}}/>
                                <div><p>{'0'}</p></div>
                              </Row>
                              <Row style={{height: 35}}>
                                <div style={{width: 34, background: dmeColors[1], marginRight: 10}}/>
                                <div><p>{'1'}</p></div>
                              </Row>
                              <Row style={{height: 35}}>
                                <div style={{width: 34, background: dmeColors[2], marginRight: 10}}/>
                                <div><p>{'2'}</p></div>
                              </Row>
                              <Row style={{height: 35}}>
                                <div style={{width: 34, background: dmeColors[3], marginRight: 10}}/>
                                <div><p>{'3'}</p></div>
                              </Row>
                              <Row style={{height: 35}}>
                                <div style={{width: 34, background: dmeColors[4], marginRight: 10}}/>
                                <div><p>{'Above 4'}</p></div>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row style={{marginTop: 20}}>
                        <Col sm={12} md={7}>
                          <h5>Interaction Profile</h5>
                          <ul>
                            <li>Provides a detailed look at an <b>individual drug</b> using a <b>tree layout</b> with three levels</li>
                            <li>The <b>root node</b> is the <b>selected drug</b></li>
                            <li>The <b>second level</b> shows all drugs that may <b>interact with the selected drug</b></li>
                            <li>The <b>third level</b> represents the <b>ADRs that may result</b> from that interaction</li>
                            <li><b>Severe ADRs</b> are <b>purple</b>, while <b>other ADRs</b> are <b>tan</b></li>
                          </ul>
                        </Col>
                        <Col sm={12} md={5}>
                          <Row>
                            <Paper zDepth={1} style={{height: 210, width: '100%', overflow: 'hidden',}}>
                              <InteractionProfile 
                                mainDrug={dummyData.selectedDrug} 
                                rules={dummyData.currentDrugs.find(el => el[0] == dummyData.selectedDrug)}
                              />
                            </Paper>
                          </Row>
                        </Col>
                      </Row>
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={true} style={{width: '100%'}}>
                    <CardHeader
                      title="Filters"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      <Row>
                        <Col sm={12} md={7}>
                          <ul>
                            <li><b>Filters</b> are located in the <b>top bar</b></li>
                            <li>A <b>dropdown menu</b> enables filtering interactions by <b>known or unknown</b></li>
                            <li>A <b>slider</b> enables selection of a <b>minimum and maximum score</b> for interactions</li>
                            <li>A <b>search bar</b> allows users to search for and <b>select a specific drug</b></li>
                          </ul>
                        </Col>
                        <Col sm={12} md={5}>
                          <Paper zDepth={1} style={{background: "#AA2C3B", width: 200, height: 64}}>
                            <DropDownMenu 
                              className="knownUnknown"
                              value={this.state.value}
                              onChange={() => {}} 
                              style={styles.customWidth}
                              autoWidth={false} 
                              labelStyle={{ color: 'white' }}
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                              selectedMenuItemStyle={{ color: '#AA2C3B' }}
                            >
                              <MenuItem value='all' primaryText="All DIARs" />
                              <MenuItem value='known' primaryText="Known DIARs" />
                              <MenuItem value='unknown' primaryText="Unknown DIARs" />
                            </DropDownMenu> 
                          </Paper>
                          <Paper zDepth={1} style={{background: "#AA2C3B", width: 310, height: 64, marginTop: 10}}>
                            <div 
                              style={{position: 'relative', top: -25, marginLeft: 0}}>
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
                              <Range className='scoreMinMax scoreMinMax2'
                                defaultValue={[this.state.minScore, this.state.maxScore]} allowCross={false} min={this.state.minScore} max={this.state.maxScore} step={0.01} onAfterChange={() => {}} 
                                style={styles.slider} tipProps={styles.sliderTip} marks={dummyMarks} handleStyle={[{border: 'none'}, {border: 'none'}]} trackStyle={[{background: 'white'}]} railStyle={{background: '#A9B0B7'}}
                                dotStyle={{display: 'none'}}/>
                            </div>
                          </Paper>
                        </Col>
                      </Row>
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={true} style={{width: '100%'}}>
                    <CardHeader
                      title="Reports"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      <ul>
                        <li>This view allows <b>direct access</b> to the <b>FDA's Adverse Event Reporting System (FAERS) data</b></li>
                        <li>All <b>reports</b> linked to the chosen <b>drug</b> or <b>drug interaction</b> are shown</li>
                        <li><b>Selecting a report</b> will <b>highlight</b> the <b>corresponding drugs and reactions</b> in all views</li>
                        <li>The <b>narrative section</b> of a report may contain details of a <b>patient's medical history</b></li>
                        <li>Users can <b>search for key words</b> in the <b>narrative sections</b> of the reports</li>
                      </ul>
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={false} style={{width: '100%'}}>
                    <CardHeader
                      title="About Us"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      This software was developed at Worcester Polytechnic Institute as part of a Major Qualifying Project. The project team
                      was composed of undergraduate students Brian McCarthy, Andrew Schade, Huy Tran, and Brian Zylich. The team was advised
                      by Professor Elke Rundensteiner and graduate students Xiao Qin and Tabassum Kakar. To contact the team, email <a href='mailto:divamqp1718@WPI.EDU'>divamqp1718@WPI.EDU</a>.
                    </CardText>
                  </Card>
                </Row>
                <Row>
                </Row>
              </Grid>
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