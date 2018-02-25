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
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LineChart from 'react-linechart';
import 'react-linechart/dist/styles.css';
import { isNullOrUndefined } from 'util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { GridTile } from 'material-ui/GridList';
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
import { primaryColor, secondaryColor } from '../../utilities/constants';
import Help from './Help';

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
    background: primaryColor
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
      uploadDialog: false,
      uploadFiles: [],
      prevFiles: [],
      uploadSnackbar: false,
      uploadSnackbarMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateMinScore = this.updateMinScore.bind(this);
    this.updateMaxScore = this.updateMaxScore.bind(this);
    this.updateMinAndMax = this.updateMinAndMax.bind(this);
    this.openUploadDialog = this.openUploadDialog.bind(this);
    this.closeUploadDialog = this.closeUploadDialog.bind(this);
    this.findFrequencyDistribution = this.findFrequencyDistribution.bind(this);
    this.callUpdateMinScore = this.callUpdateMinScore.bind(this);
    this.callUpdateMaxScore = this.callUpdateMaxScore.bind(this);
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

  render() {
    
		const updating = this.props.updating ? (
				<i style={{position: 'relative', top: -102, left: 520}} className="MainView__Loading fa fa-spinner fa-spin fa-lg fa-fw" ></i>
		) : null;

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

    var points = [];
    this.state.freqDist.forEach(entry => {
      points.push({x: entry['Score'], y: entry['Freq']});
    });

    const data = [
      {									
        color: secondaryColor, 
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
              selectedMenuItemStyle={{ color: primaryColor }}
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
                  style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={[{border: 'none'}, {border: 'none'}]} trackStyle={[{background: 'white'}]} railStyle={{background: secondaryColor}}
                  dotStyle={{display: 'none'}}/>
              </div>
            </div>
            {updating}
        </div>
        }
        iconElementLeft={wpiLogo}
        iconElementRight={ 
          <div style={styles.elementRight}>
          <Col>
            <div style={{marginTop: 5}}>
              <div style={{color: 'white', fontSize: '0.91em'}}>
                {this.props.numDrugs + ' Drugs'}
              </div>

              <div style={{color: 'white', fontSize: '0.91em'}}>
                {this.props.rules.length + ' Interactions'}
              </div>
            </div>
          </Col>
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
            <Help 
              scoreRange={this.props.scoreRange}
              dmeRange={this.props.dmeRange}
              startTour={this.props.startTour}
              scoreDistribution={data}
              minScore={this.state.minScore}
              maxScore={this.state.maxScore}
              dropDownValue={this.state.value}
              />


            <SearchBarContainer />
          </div>
        }
      />
    )
  }
}