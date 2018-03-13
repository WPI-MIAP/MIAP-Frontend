import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import { Row, Col } from 'react-flexbox-grid';
import { primaryColor, wpiLogo } from '../../utilities/constants';
import Help from '../modules/Help';
import DistributionRangeSlider from '../modules/DistributionRangeSlider';
import UploadFAERS from '../modules/UploadFAERS';
import KnownUnknownDropDown from '../modules/KnownUnknownDropDown';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import { countDrugInteraction } from '../../utilities/functions'; 
import {medicines, connection} from '../../utilities/constants';
import PropTypes from 'prop-types';

const styles = {
  root: {
    background: primaryColor,
    height: 70
  },
  elementRight: {
    display: 'flex',
    flexDirection: 'row',
  }
};

/**
 * This component renders the navbar, combining the filters, upload button, help button, and search bar.
 */
class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drugsCount: 0,
      interactionsCount: 0
    };
  }

  /**
   * Set initial drug and interaction counts.
   */
  componentDidMount() {
    this.setState({
      drugsCount: countDrugInteraction(this.props.rules, this.props.filter, this.props.minScore, this.props.maxScore)[0],
      interactionsCount: countDrugInteraction(this.props.rules, this.props.filter, this.props.minScore, this.props.maxScore)[1],
    })
  }

  /**
   * When filters are updated, update drug and interaction counts.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      drugsCount: countDrugInteraction(nextProps.rules, nextProps.filter, nextProps.minScore, nextProps.maxScore)[0],
      interactionsCount: countDrugInteraction(nextProps.rules, nextProps.filter, nextProps.minScore, nextProps.maxScore)[1],
    })
  }

  render() {
    return (
      <Paper zDepth={2}>
      <Toolbar style={styles.root}>
        <ToolbarGroup firstChild={true}>
          {wpiLogo}

          <ToolbarSeparator style={{opacity: 0}} />

          <KnownUnknownDropDown 
            isUpdating={this.props.isUpdating}
            onClick={this.props.onClick}/> 

          <ToolbarSeparator style={{opacity: 0}} />

          <DistributionRangeSlider
            rules={this.props.rules} 
            updateMinScore={this.props.updateMinScore} 
            updateMaxScore={this.props.updateMaxScore}
            isUpdating={this.props.isUpdating}/>
        </ToolbarGroup>
        <ToolbarGroup>
          <Badge
            badgeContent={this.state.drugsCount}
            primary={true}
            badgeStyle={{top: 20, right: 20}}
            style={{top: -5, left: 50}}
          >
            <IconButton tooltip="Number of Drugs" iconStyle={{color: 'white'}} disableTouchRipple={true} hoveredStyle={{cursor: 'default'}}>
              {medicines}
            </IconButton>
          </Badge>
          <Badge
            badgeContent={this.state.interactionsCount}
            secondary={true}
            badgeStyle={{top: 20, right: 20}}
            style={{top: -5, left: 20}}
          >
            <IconButton tooltip="Number Of Interactions" iconStyle={{color: 'white'}} disableTouchRipple={true} hoveredStyle={{cursor: 'default'}}>
              {connection}
            </IconButton>
          </Badge>
          <UploadFAERS status={this.props.status} getStatus={this.props.getStatus}/>
          <Help 
            scoreRange={this.props.scoreRange}
            dmeRange={this.props.dmeRange}
            startTour={this.props.startTour}
            rules={this.props.rules}
            />        
          <SearchBarContainer />
        </ToolbarGroup>
      </Toolbar>
      </Paper>
    )
  }
}

GlobalFilterNav.propTypes = {
  /**
	 * Array of rules representing all interaction between pairs of drugs in the visualization.
	 */
  rules: PropTypes.array.isRequired,
  
  /**
	 * Indicates whether filters are currently being applied.
	 */
  updating: PropTypes.bool.isRequired,
  
  /**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
  scoreRange: PropTypes.array.isRequired,
  
  /**
	 * Array of severe ADR count boundaries, indicating how to color galaxy view headers.
	 */
  dmeRange: PropTypes.array.isRequired,
  
  /**
	 * Minimum score for filtering interactions.
	 */
  minScore: PropTypes.number.isRequired,
  
  /**
	 * Maximum score for filtering interactions.
	 */
  maxScore: PropTypes.number.isRequired,
  
  /**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
  filter: PropTypes.string.isRequired,
  
  /**
	 * Contains information about the status of the last MARAS analysis ran.
	 */
  status: PropTypes.object.isRequired,
  
  /**
	 * Used to apply the known/unknown filter. Takes the value of the selected option ('all', 'known', or 'unknown').
	 */
  onClick: PropTypes.func.isRequired,

  /**
	 * Used to set the new minimum score. Takes the new minimum score (a number) as a paramter.
	 */
  updateMinScore: PropTypes.func.isRequired,

  /**
	 * Used to set the new maximum score. Takes the new maximum score (a number) as a paramter.
	 */
  updateMaxScore: PropTypes.func.isRequired,

  /**
	 * Used to indicate that the visualization is updating as a new filter has been applied. Takes a boolean indicating whether updating is in progress.
	 */
  isUpdating: PropTypes.func.isRequired,

  /**
	 * A function that can be called to get the updated analysis status.
	 */
  getStatus: PropTypes.func.isRequired
};

export default GlobalFilterNav;