import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
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
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Files from 'react-files';
import {List, ListItem} from 'material-ui/List'; 
import Avatar from 'material-ui/Avatar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell} from 'recharts';


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
  dropDown: {
    width: 165,
    height: 56,
    border: '1px white', 
    borderStyle: 'solid',
    borderRadius: 5,
    paddingBottom: 6,
    marginTop: 4,
    marginLeft: 10,
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

const dummyDrugFreqs = [{name: 'Drug 1', freq: 8}, {name: 'Drug 2', freq: 6}, {name: 'Drug 3', freq: 5}, {name: 'Drug 4', freq: 3}, {name: 'Drug 5', freq: 1}];

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
      uploadDialog: false,
      uploadFiles: [],
      prevFiles: [],
      uploadSnackbar: false,
      uploadSnackbarMessage: '',
      helpBarSelectedIndex: -1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateMinScore = this.updateMinScore.bind(this);
    this.updateMaxScore = this.updateMaxScore.bind(this);
    this.updateMinAndMax = this.updateMinAndMax.bind(this);
    this.openHelp = this.openHelp.bind(this);
    this.closeHelp = this.closeHelp.bind(this);
    this.openUploadDialog = this.openUploadDialog.bind(this);
    this.closeUploadDialog = this.closeUploadDialog.bind(this);
    this.findFrequencyDistribution = this.findFrequencyDistribution.bind(this);
    this.callUpdateMinScore = this.callUpdateMinScore.bind(this);
    this.callUpdateMaxScore = this.callUpdateMaxScore.bind(this);
    this.startTour = this.startTour.bind(this);
    this.beginMARAS = this.beginMARAS.bind(this);
    this.onFilesChange = this.onFilesChange.bind(this);
    this.createRemoveFileHandler = this.createRemoveFileHandler.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    this.findFrequencyDistribution();
  }

  handleChange(event, index, value) {
    if(value !== this.state.value) {
      this.props.isUpdating(true);
    }
    this.setState({ 
      value: value,
    });
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
    if(value[1] !== this.state.filteredMax || value[0] !== this.state.filteredMin) {
      this.setState({
        filteredMax: value[1],
        filteredMin: value[0],
      });
      this.callUpdateMaxScore(value[1]);
      this.callUpdateMinScore(value[0]);
      this.props.isUpdating(true);
    }
  }

  openHelp(){
    this.setState({help: true});
  };

  closeHelp(){
    this.setState({help: false});
  };

  openUploadDialog(){
    this.setState({uploadDialog: true});
  };

  closeUploadDialog(){
    this.setState({uploadDialog: false, uploadFiles: []});
  };

  beginMARAS(){
    const files = this.state.uploadFiles;
    if(this.state.uploadFiles.length > 0) {
      // start MARAS process on current files

      var formData = new FormData();
      files.forEach((f) => {
        formData.append('file', f);
      });

      axios.post('/csv/reports', formData).then(
        (response) => {
          this.setState({
            uploadSnackbar: true,
            uploadSnackbarMessage: (response.data.success) ? "File(s) uploaded, your visualization will be updated when analysis is completed" : "Error uploading files",
          });
        },
        (error) => {console.log(error);}
      );

      this.closeUploadDialog();
    }
    else{
      this.setState({
        uploadSnackbar: true,
        uploadSnackbarMessage: "Add one or more file(s) to begin analysis",
      });
    }
  };

  onFilesChange(files){
    var newFiles = [];
    //find any new files that have been added
    for(var i = files.length-1; i > files.length-1-(files.length - this.state.prevFiles.length); i--) {
      newFiles.push(files[i]);
    }

    var filesWithoutDuplicates = this.state.uploadFiles;
    var found = false;
    //check to see if each new file is a duplicate, otherwise add it to the list of files to upload
    newFiles.forEach((newFile) => {
      filesWithoutDuplicates.forEach((addedFile) => {
        if(newFile.name === addedFile.name) {
          found = true;
        }
      });
      if(!found) {
        filesWithoutDuplicates.push(newFile);
      }
    });
    
    this.setState({
      uploadFiles: filesWithoutDuplicates,
      prevFiles: files,
    });
  };

  onFilesError(error, file){
    console.log(error.message);
  };

  createRemoveFileHandler(file){
    return function() {
      var files = this.state.uploadFiles;
      for(var i=0; i < files.length; i++) {
        if(files[i].name === file) {
          files.splice(i, 1);
          break;
        }
      }
      this.setState({
        uploadFiles: files,
      });
    }.bind(this);
  }

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
        entry['Freq'] = (entry['Freq'] * 300) / ruleCount;
      });

      freqDist = _.sortBy(freqDist, 'Score');

      minScore = parseFloat(minScore);
      maxScore = parseFloat(maxScore);

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

    const uploadFileActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.closeUploadDialog}
      />, 
      <FlatButton
        label="Upload"
        primary={true}
        onClick={this.beginMARAS}
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
              style={styles.dropDown}
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
            <div style={{height: 56, width: 312, position: 'relative', top: -56, marginLeft: 185, border: '1px white', borderStyle: 'solid', paddingBottom: 9, borderRadius: 5}}>
              <div 
                style={{position: 'absolute', bottom: 7}}>
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
            </div>
            {updating}
        </div>
        }
        iconElementLeft={wpiLogo}
        iconElementRight={ 
          <div style={styles.elementRight}>
            <ToolbarTitle text={this.props.numDrugs+ ' Drugs'}
              style={{color: 'white', fontSize: '0.91em'}}
            />

            <ToolbarTitle text={this.props.rules.length + ' Interactions'}
              style={{color: 'white', fontSize: '0.91em'}}
            />
          <IconButton 
              tooltip="Upload FAERS data"
              iconStyle={{ color: 'white' }}
              tooltipPosition='bottom-left'
              onClick={this.openUploadDialog}
            >
              <FileUpload />
            </IconButton>
            <Snackbar
              open={this.state.uploadSnackbar}
              message={this.state.uploadSnackbarMessage}
              autoHideDuration={4000}
              style={{zIndex: 1400}}
              onRequestClose={() => {this.setState({uploadSnackbar: false})}}
            />
            <Dialog
              title="Upload FAERS data"
              contentStyle={{width: "60%", maxWidth: "none"}}
              actions={uploadFileActions}
              modal={false}
              open={this.state.uploadDialog}
              onRequestClose={this.closeUploadDialog}
              autoScrollBodyContent={true}>
              <Files
                className='files-dropzone'
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                accepts={['application/x-zip-compressed']}
                multiple
                maxFileSize={1000000000}
                minFileSize={0}
                clickable
                >
                <Paper zDepth={1} style={{height: 76, lineHeight: '38px', textAlign: 'center'}}>
                  <div>Drop files here or click to upload<br/>(File format must be .zip)</div>
                </Paper>
              </Files>
              <List>
                {
                  this.state.uploadFiles.map((file) => (
                    <ListItem
                      key={file.name}
                      leftAvatar={<Avatar icon={<FileCreateNewFolder/>}/>}
                      rightIconButton={<IconButton onClick={this.createRemoveFileHandler(file.name)}><NavigationClose/></IconButton>}
                      primaryText={file.name}
                    />
                  ))
                }
              </List>
            </Dialog>
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
                            <li>Each <b>edge</b> represents a possible <b>drug-drug interaction</b></li>
                            <li>Each <b>edge (drug-drug interaction)</b> corresponds to an <b>adverse drug reaction (ADR)</b></li>
                            <li>A <b>dashed edge</b> means the interaction is <b>known</b></li>
                            <li>A <b>solid edge</b> means the interaction is <b>unknown</b></li>
                            <li>The <b>edge color</b> represents the highest <b>interaction score</b> of all interactions between the two drugs</li>
                            <li><b>Clicking on a node</b> causes that drug to appear in the <b>Galaxy and Interaction Profile Views</b></li>
                            <li><b>Hovering over an edge</b> will provide <b>additional information</b> about that <b>interaction (try it now)</b></li>
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
                                {'Interaction Score'}
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
                            <li>The <b>central drug (blue)</b> in a window is the <b>drug of interest</b></li>
                            <li>The <b>surrounding nodes</b> are drugs that <b>interact with the central drug</b></li>
                            <li><b>Surrounding nodes</b> are <b>colored</b> according to the <b>highest score</b> of all <b>interactions between that drug and the drug of interest</b></li>
                            <li>The <b>color</b> of a window's header indicates the <b>severe ADR count</b> associated with the drug of interest</li>
                            <li>Drugs in this view can be <b>sorted</b> by <b>name</b>, <b>interaction count</b>, or <b>number of severe ADRs</b></li>
                            <li>Surrounding nodes are <b>bigger</b> if there may be an <b>unknown interaction</b> with that drug</li>
                            <li>Surrounding nodes are <b>smaller</b> if there are only <b>known interactions</b> with that drug</li>
                            <li><b>Buttons on a window's header</b> allow you to <b>view a drug in the Interaction Profile view</b>, <b>see reports for that drug</b>, or <b>remove the drug from the Galaxy view</b></li>
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
                            <li><b>Severe ADRs</b> are <b>purple</b>, while <b>other ADRs</b> are <b>grey</b></li>
                            <li><b>Clicking</b> on a node at the first or second level will <b>minimize/maximize sections of the tree</b></li>
                          </ul>
                        </Col>
                        <Col sm={12} md={5}>
                          <Row>
                            <Paper zDepth={1} style={{height: 210, width: '100%', overflow: 'hidden',}}>
                              <InteractionProfile
                                helpExample={true}
                              />
                              <Row style={{float: 'right', position: 'relative', zIndex: 1600, marginRight: 10, marginTop: -60}}>
                                <Col style={{marginRight: 10}}>
                                  <div style={{height: 35, width: 34, margin: '0 auto', background: '#6A51A3', border: '#A9B0B7', borderStyle: 'solid'}}/>
                                  <div>Severe ADR</div>
                                </Col>
                                <Col>
                                  <div style={{height: 35, width: 34, margin: '0 auto', background: '#A9B0B7', border: '#A9B0B7', borderStyle: 'solid'}}/>
                                  <div>Normal ADR</div>
                                </Col>
                              </Row>
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
                              style={styles.dropDown}
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
                      <Row>
                        <Col sm={6}>
                          <ul>
                            <li>This view allows <b>direct access</b> to the <b>FDA's Adverse Event Reporting System (FAERS) data</b></li>
                            <li>All <b>reports</b> linked to the chosen <b>drug</b> or <b>drug interaction</b> are shown</li>
                            <li>A <b>bar graph</b> shows (up to) the <b>top 10 drugs</b> also found in reports containing the chosen drug or drug interaction</li>
                            <li><b>Selecting a drug name</b> or the <b>corresponding bar on the graph</b> will <b>highlight</b> all <b>reports containing that drug</b></li>
                          </ul>
                        </Col>
                        <Col sm={6}>
                          <BarChart style={{margin: '0 auto'}} width={400} height={100} data={dummyDrugFreqs}>
                            <XAxis hide={true} dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="freq" onClick={(data, index) => {this.setState({helpBarSelectedIndex: index})}}>
                              {
                                dummyDrugFreqs.map((entry, index) => (
                                  <Cell cursor="pointer" fill={index === this.state.helpBarSelectedIndex ? '#2C98F0' : '#73B8F0'} key={`cell-${index}`}/>
                                ))
                              }
                            </Bar>
                          </BarChart>
                        </Col>
                      </Row>
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
    )
  }
}