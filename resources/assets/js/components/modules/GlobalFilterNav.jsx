import React from 'react';
import AppBar from 'material-ui/AppBar';
import SearchBarContainer from '../../containers/SearchBarContainer';
import { Row, Col } from 'react-flexbox-grid';
import { primaryColor, wpiLogo } from '../../utilities/constants';
import Help from './Help';
import DistributionRangeSlider from './DistributionRangeSlider';
import UploadFAERS from './UploadFAERS';
import KnownUnknownDropDown from './KnownUnknownDropDown';

const styles = {
  root: {
    background: primaryColor
  },
  elementRight: {
    display: 'flex',
    flexDirection: 'row',
  }
};

export default class GlobalFilterNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
		const updating = this.props.updating ? (
				<i style={{position: 'relative', top: -102, left: 520}} className="MainView__Loading fa fa-spinner fa-spin fa-lg fa-fw" ></i>
		) : null;

    return (
      <AppBar style={styles.root}
        zDepth={2}
        title={
          <div>
            <KnownUnknownDropDown 
              isUpdating={this.props.isUpdating}
              onClick={this.props.onClick}/> 
            <DistributionRangeSlider 
              rules={this.props.rules} 
              updateMinScore={this.props.updateMinScore} 
              updateMaxScore={this.props.updateMaxScore}
              isUpdating={this.props.isUpdating}/>
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
            <UploadFAERS />
            <Help 
              scoreRange={this.props.scoreRange}
              dmeRange={this.props.dmeRange}
              startTour={this.props.startTour}
              rules={this.props.rules}
              />

            <SearchBarContainer />
          </div>
        }
      />
    )
  }
}