import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DndGraph from '../modules/DndGraph';
import InteractionProfile from '../modules/InteractionProfile';
import DndTreeContainer from './DndTreeContainer';
import { Resizable, ResizableBox } from 'react-resizable';
import IconMenu from 'material-ui/IconMenu';
import {GridList, GridTile} from 'material-ui/GridList';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { Grid, Row, Col } from 'react-flexbox-grid';

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	gridList: {
		width: window.clientWidth,
		// border: '1px solid grey'
	},
};

export default class MainView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colOverview: 4,
			colGalaxy: 4,
			colProfile: 4,
		}

		this.toggleFullscreenOverview = this.toggleFullscreenOverview.bind(this);
		this.toggleFullscreenGalaxy = this.toggleFullscreenGalaxy.bind(this);
		this.toggleFullscreenProfile = this.toggleFullscreenProfile.bind(this);
	}

	toggleFullscreenOverview() {
		this.setState((prevState, props) => {
			return {
				colOverview: prevState.colOverview == 4 ? 12 : 4,
			}
		})
	}

	toggleFullscreenGalaxy() {
		this.setState((prevState, props) => {
			return {
				colGalaxy: prevState.colGalaxy == 4 ? 12 : 4,
			}
		})
	}

	toggleFullscreenProfile() {
		this.setState((prevState, props) => {
			return {
				colProfile: prevState.colProfile == 4 ? 12 : 4,
			}
		})
	}

	render() {

		return (
				<Grid fluid style={{ marginTop: 25, height: 500 }}>
        <Row>
          <Col xs={6} md={this.state.colOverview} style={{ 
						display: (this.state.colGalaxy == 4 && this.state.colProfile == 4) ? 'block' : 'none',
					}}>
						<GridTile
							title='Overview'
							titlePosition="top"
							titleBackground="#D62261"
							style={{
								border: '1px solid #F0F0F0', 
								boxSizing: 'border-box',
								background: 'white'
							}}
							actionIcon={
								<IconButton 
									tooltip="Expand"
									iconStyle={{ color: 'white' }}
									tooltipPosition='bottom-left'
									onClick={this.toggleFullscreenOverview}
								>
									<IconFullscreen />	
								</IconButton>
							}
						>
							<DndGraph 
								nodes={this.props.nodes}
								links={this.props.links}
								width={this.props.width}
								height={this.props.height} 
								selectedDrug={this.props.selectedDrug}
								onClickNode={this.props.onClickNode}
								isFetching={this.props.isFetching}
								filter={this.props.filter}
								minScore={this.props.minScore}
								maxScore={this.props.maxScore}
							/>
						</GridTile>
          </Col>

					<Col xs={6} md={this.state.colGalaxy} style={{
						display: this.state.colOverview == 4 && this.state.colProfile == 4 ? 'block' : 'none'
					}}
					>
						<GridTile
							title='Galaxy View'
							titlePosition="top"
							actionIcon={ 
								<div>
									<IconButton 
										tooltip="Expand"
										iconStyle={{ color: 'white' }}
										tooltipPosition='bottom-left'
										onClick={this.toggleFullscreenGalaxy}
									>
									<IconFullscreen />	
								</IconButton>
									<TreeViewFilterContainer /> 
								</div>
							}
							titleBackground="#1BACC0"
							style={{
								border: '1px solid #F0F0F0', 
								boxSizing: 'border-box',
								background: 'white',
								// overflow: 'auto',
								// marginTop: 75
							}}
							cols={this.state.colGalaxy}
						>
							<DndTreeContainer 
								currentDrugs={this.props.currentDrugs}
								filter={this.props.filter}
								minScore={this.props.minScore}
								maxScore={this.props.maxScore}
								width={this.props.width}
								height={this.props.height} 
								onClickNode={this.props.showDetailNode}
								onDeleteNode={this.props.deleteNode}
								cols={this.state.colGalaxy}
								selectedDrug={this.props.selectedDrug}
							/>
						</GridTile>
          </Col>

          <Col xs={6} md={this.state.colProfile} style={{ display: this.state.colGalaxy == 4 && this.state.colOverview == 4 ? 'block' : 'none'}}>
						<GridTile
							title={'Interaction profile for: ' + this.props.selectedDrug}
							titlePosition="top"
							titleBackground="#8C2DA8"
							style={{
								border: '1px solid #F0F0F0', 
								boxSizing: 'border-box',
								background: 'white'
							}}
							actionIcon={
								<IconButton 
									tooltip="Expand"
									iconStyle={{ color: 'white' }}
									tooltipPosition='bottom-left'
									onClick={this.toggleFullscreenProfile}
								>
									<IconFullscreen />	
								</IconButton>
							}
						>
							<InteractionProfile 
								mainDrug={this.props.selectedDrug} 
								rules={this.props.currentDrugs.find(el => el[0] == this.props.selectedDrug)}
							/>
						</GridTile>
					</Col>
        </Row>
      </Grid>
		)
	}
}

MainView.defaultProps = {
	width: '100%',
	height: '100%'
};
