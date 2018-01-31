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
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';

const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const wpiLogo = <img style={{
    height: 50,
    marginLeft: 10
  }} 
  src={require('../../../../images/WPI_Inst_Prim_BLK.png')} />;

const styles = {
  root: {
    // background: '#D42862'
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
  },
  highlightClass: {
    background: 'green',
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
      help: false,
      stepsEnabled: false,
      initialStep: 0,
      steps: [
        {
          intro: 'Welcome to DIVA! This application is intended to assist in the discovery of harmful drug-drug interactions.',
        },
        {
          element: '.knownUnknown',
          intro: 'This dropdown menu can be used to filter drug-drug interactions based on whether they are previously known or unknown.',
        },
        {
          element: '.scoreMinMax',
          intro: 'Similarly, this tool can be used to specify a minimum and maximum score to filter out interactions in each view that do not meet this criteria.',
        },
        {
          element: '.scoreMinMax',
          intro: 'Use the distribution above the slider to get an idea of how the scores are distributed.',
        },
        {
          element: '.overview',
          intro: 'This tab shows the network of all drugs and their interactions. Each node represents a drug, and each link represents an interaction between two drugs.',
        },
        {
          element: '.overview',
          intro: 'Click on a node to view more in depth information about that drug. Try it now!',
        },
        {
          element: '.galaxy',
          intro: 'The Galaxy View tab offers a general overview about a specific drug. Each of the drug\'s interactions can be seen.',
        },
        {
          element: '.galaxy',
          intro: 'To view detailed information about the reports behind the visualization, click on the reports icon.',
        },
        {
          intro: 'The reports view shows the FAERS reports that support any possible interactions with a specific drug.',
        },
        {
          element: '.profile',
          intro: 'The Interaction Profile tab shows detailed information about a drug, all drugs that interact with that drug, and the ADRs that may be caused by those interactions.',
        },
        {
          intro: 'This concludes the tour! If you have any more questions, you can find our contact information in the About Us section of the Help menu.',
        },
      ],
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
    this.endTour = this.endTour.bind(this);
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

  endTour() {
    this.setState({ stepsEnabled: false });
  }

  startTour() {
    if(this.state.help) {
      this.setState({ help: false });
    }
    this.setState({ stepsEnabled: true });
  }

  render() {

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
            <Steps
              enabled={this.state.stepsEnabled}
              steps={this.state.steps}
              initialStep={this.state.initialStep}
              onExit={this.endTour}
              ref={intro => {
                if(intro !== null) {
                  intro.introJs.setOption('showStepNumbers', false);
                  intro.introJs.setOption('showBullets', false);
                  intro.introJs.setOption('overlayOpacity', 0.5);
                  intro.introJs.setOption('highlightClass', 'green');
                }
              }}
            />
            <DropDownMenu 
              className="knownUnknown"
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
              <Range className='scoreMinMax'
                defaultValue={[this.state.minScore, this.state.maxScore]} allowCross={false} min={this.state.minScore} max={this.state.maxScore} step={0.01} onAfterChange={this.updateMinAndMax} 
                style={styles.slider} tipProps={styles.sliderTip} marks={marks} handleStyle={[{border: 'solid 2px #000000'}, {border: 'solid 2px #000000'}]} trackStyle={[{background: 'black'}]} railStyle={{background: '#A9B0B7'}}/>
            </div>
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
              actions={actions}
              modal={false}
              open={this.state.help}
              onRequestClose={this.closeHelp}
              autoScrollBodyContent={true}>
              <Grid>
                <Row>
                  <Card initiallyExpanded={true}>
                    <CardHeader
                      title="Views"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      The Overview tab features a node-link diagram to visually display relationships between drugs and ADRs. 
                      In this view, nodes represent drugs and edges represent an interaction between two drugs. If the edge is dashed,
                      the interaction is known; if the edge is solid the interaction is unknown. The width of each edge represents the 
                      strength of the interaction.
                      <br/>
                      <br/>
                      The Galaxy View tab shows overviews of specific drugs in separate windows. At the center of each window is the 
                      drug of interest, with the nodes surrounding it representing
                      the drugs that interact with that drug. The color of this view's header indicates the count of severe ADRs 
                      associated with this drug. Users can view multiple different drugs at a time, sorted by name, interaction count,
                      or severity as necessary. The size of each individual node indicates whether any of the MDARs between the two 
                      drugs are unknown; if there exists at least one unknown MDAR, the node will have a larger size than those with 
                      no unknown MDARs. Users can find additional information about each interaction by hovering over them.
                      <br/>
                      <br/>
                      The Interaction Profile tab provides a more detailed look at an individual drug in the form of a modified tree layout,
                      consisting of three levels. The root node represents the selected drug, the second level displays all of the drugs 
                      that interact with the selected drug, and finally, the third level represents the ADRs that exist between the 
                      drugs. Normal ADRs are represented with a tan color, while severe reactions are purple.
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={false}>
                    <CardHeader
                      title="Filters"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      The top bar contains controls that enable filtering the nodes in all tabs based on whether an interaction is known or
                      unknown and by the score of the interaction. Additionally, a search bar is provided to allow users to search for a specific
                      drug, which will then appear in the Galaxy View and Interaction Profile tabs.
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={false}>
                    <CardHeader
                      title="Reports"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                      The Reports View allows direct access to the FAERS data. This view shows a list of all reports related to a 
                      chosen drug or drug interaction, enabling the user to see the underlying information related to a drug or ADR. 
                      In addition, users can select a report and the drugs and reactions mentioned will be highlighted in the Overview, 
                      Galaxy view, and Profile view. This view also allows users to view the narrative section for each report, which 
                      may contain important information regarding the patient's medical history; users can search for certain key words 
                      contained in the narrative sections of the reports.
                    </CardText>
                  </Card>
                  <Card initiallyExpanded={false}>
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