import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import { Row, Col } from 'react-flexbox-grid';
import { primaryColor, wpiLogo } from '../../utilities/constants';
import Help from './Help';
import Filters from './Filters';
import DistributionRangeSlider from './DistributionRangeSlider';
import UploadFAERS from './UploadFAERS';
import KnownUnknownDropDown from './KnownUnknownDropDown';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Share from 'material-ui/svg-icons/social/share';
import Brightness1 from 'material-ui/svg-icons/image/brightness-1';
import drug from '../../../../images/drug.svg'
import molecular from '../../../../images/molecular.svg'
import SvgIcon from 'material-ui/SvgIcon';
import SVG  from 'react-inlinesvg';
import { countDrugInteraction } from '../../utilities/functions'; 

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

export default class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drugsCount: 0,
      interactionsCount: 0
    };
  }

  componentDidMount() {
    this.setState({
      drugsCount: countDrugInteraction(this.props.rules, this.props.filter, this.props.minScore, this.props.maxScore)[0],
      interactionsCount: countDrugInteraction(this.props.rules, this.props.filter, this.props.minScore, this.props.maxScore)[1],
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      drugsCount: countDrugInteraction(nextProps.rules, nextProps.filter, nextProps.minScore, nextProps.maxScore)[0],
      interactionsCount: countDrugInteraction(nextProps.rules, nextProps.filter, nextProps.minScore, nextProps.maxScore)[1],
    })
  }

  render() {
    
		// const updating = this.props.updating ? (
		// 		<i style={{position: 'relative', top: -102, left: 520}} className="MainView__Loading fa fa-spinner fa-spin fa-lg fa-fw" ></i>
		// ) : null;

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
            style={{marginLeft: 20}}
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
            <IconButton tooltip="Number of Drugs" iconStyle={{color: 'white'}}>
            <SVG
              src={drug}
            >
            </SVG>
            </IconButton>
          </Badge>
          <Badge
            badgeContent={this.state.interactionsCount}
            secondary={true}
            badgeStyle={{top: 20, right: 20}}
            style={{top: -5, left: 20}}
          >
            <IconButton tooltip="Number Of Interactions" iconStyle={{color: 'white'}}>
              <SVG
                src={molecular}
              >
              </SVG>
            </IconButton>
          </Badge>
          <UploadFAERS />
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