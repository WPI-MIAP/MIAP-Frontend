import React, { Component } from 'react';
import DndTreeContainer from '../layouts/DndTreeContainer';
import Paper from 'material-ui/Paper';
import {GridTile} from 'material-ui/GridList';
import { Row, Col } from 'react-flexbox-grid';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import TreeViewFilterContainer from '../../containers/TreeViewFilterContainer';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { dmeColors, scoreColors, complementaryColor, secondaryColor, galaxyViewName } from '../../utilities/constants';
import PropTypes from 'prop-types';

/**
 * This component renders the Galaxy View.
 */
class GalaxyView extends Component {
    constructor(props) {
		super(props);

		console.log(props.width)

		this.state = {
			legendShow: true,
		};

	}

	render() {

		return (
			<div>
				<Paper zDepth={1}>
					<GridTile
						title={this.props.col != 12 ? galaxyViewName : ""}
						titlePosition="top"
						className="galaxy"
						actionIcon={ 
							<div>
								<IconButton 
									tooltip="Go Fullscreen"
									iconStyle={{ color: 'white' }}
									tooltipPosition='bottom-left'
									onClick={this.props.toggleFullscreenGalaxy}
								>
									<IconFullscreen />	
								</IconButton>
								<TreeViewFilterContainer /> 
							</div>
						}
						titleBackground={complementaryColor}
						style={{
							boxSizing: 'border-box',
							background: 'white',
							height: this.state.legendShow ? 'calc(100% - 79px)' : '100%',
							marginBottom: this.state.legendShow ? 0 : -48,
						}}
					>
						<div style={{height: this.props.isGalaxyFullscreen ? '100%' : 'calc(100% - 48px)', marginTop: this.props.isGalaxyFullscreen ? 0 : 48}}>
							{
								_.isEmpty(this.props.currentDrugs) ? 
								<div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
									<h4 style={{ color: 'grey' }}>
										No drugs are being selected
									</h4>
								</div> :
								<DndTreeContainer 
									currentDrugs={this.props.currentDrugs}
									filter={this.props.filter}
									minScore={this.props.minScore}
									maxScore={this.props.maxScore}
									width={this.props.width}
									height={this.props.height} 
									onClickNode={this.props.onClickNode}
									onClickEdge={this.props.onClickEdge}
									onDeleteNode={this.props.onDeleteNode}
									onClearDrug={this.props.onClearDrug}
									cols={this.props.col}
									selectedDrug={this.props.selectedDrug}
									handleOpen={this.props.handleOpen}
									scoreRange={this.props.scoreRange}
									dmeRange={this.props.dmeRange}/>
							}
						</div>
					</GridTile>
					 
					{
						this.state.legendShow ? (
							<div>
								<Row>
									{
										this.props.isGalaxyFullscreen ? (
											<Col sm={12} md={6}>
												<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', margin: '0 auto'}}/>
												<Row>
													<Col sm={3} style={{paddingLeft: '3%'}}>
														<IconButton
															tooltip="Hide Legend"
															iconStyle={{ color: complementaryColor }}
															tooltipPosition='top-right'
															onClick={() => {this.setState({legendShow: false})}}>
															<KeyboardArrowDown/>
														</IconButton>
													</Col>
													<Col sm={6} style={{textAlign: 'center', lineHeight: '48px'}}>
														Interaction Score
													</Col>
													<Col sm={3}></Col>
												</Row>
												<Row style={{paddingBottom: 5}}>
													{scoreColors.map(scoreColor => (
														<Col xs={3} md={3} key={scoreColor.color}>
															<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
															<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
														</Col>
													))}
												</Row>
											</Col>
										) : ([])
									}
									<Col sm={12} md={this.props.isGalaxyFullscreen ? 6 : 12}>
										<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', padding: 0, margin: '0 auto'}}/>
										<Row>
											<Col sm={3} style={{paddingLeft: '3%'}}>
												{
													this.props.isGalaxyFullscreen ? ([]) : (
														<IconButton
															tooltip="Hide Legend"
															iconStyle={{ color: complementaryColor }}
															tooltipPosition='top-right'
															onClick={() => {this.setState({legendShow: false})}}>
															<KeyboardArrowDown/>
														</IconButton>
													)
												}
											</Col>
											<Col sm={6} style={{textAlign: 'center', lineHeight: '48px'}}>
												Severe ADR Count
											</Col>
											<Col sm={3}></Col>
										</Row>
										<Row style={{paddingBottom: 5}}>
										{
											dmeColors.map(dmeColor => (
												<Col xs={2.4} md={2.4} key={dmeColor.color}>
													<div style={{height: 5, width: 50, background: dmeColor.color, margin: '0 auto'}}/>
													<div style={{textAlign: 'center'}}>{dmeColor.text}</div>
												</Col>
											))
										}
										</Row>
									</Col>
								</Row>
							</div>
						) : ([])
					}	
					
				</Paper>
				{
					!this.state.legendShow ? (
						<IconButton
							tooltip="Show Legend"
							iconStyle={{ background: complementaryColor, color: 'white', border: '3px solid ' + complementaryColor, borderRadius: '5px', }}
							tooltipPosition='top-right'
							onClick={() => {this.setState({legendShow: true})}}>

							<KeyboardArrowUp/>
						</IconButton>
					) : ([])
				}
			</div>
		);
	}
}

GalaxyView.propTypes = {
	/**
	 * Number of columns currently being displayed in Mainview (4 if all views visible or 12 if one is fullscreened).
	 */
	col: PropTypes.number.isRequired,

	/**
	 * Function that fullscreens the Galaxy View.
	 */
	toggleFullscreenGalaxy: PropTypes.func.isRequired,

	/**
	 * Array of drugs currently in the Galaxy View.
	 */
	currentDrugs: PropTypes.array.isRequired,

	/**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
	filter: PropTypes.string.isRequired,

	/**
	 * Minimum score for filtering interactions.
	 */
	minScore: PropTypes.number.isRequired,

	/**
	 * Maximum score for filtering interactions.
	 */
	maxScore: PropTypes.number.isRequired,

	/**
	 * Width of the browser window.
	 */
	width: PropTypes.number.isRequired,

	/**
	 * Height of the browser window.
	 */
	height: PropTypes.number.isRequired,

	/**
	 * Callback used when a node is clicked. Takes the node as a parameter.
	 */
	onClickNode: PropTypes.func.isRequired,

	/**
	 * Callback used when a edge is clicked. Takes the edge as a parameter.
	 */
	onClickEdge: PropTypes.func.isRequired,

	/**
	 * Callback used when a drug is removed from the galaxy view. Takes the drug name as a parameter.
	 */
	onDeleteNode: PropTypes.func.isRequired,

	/**
	 * Clears the selectedDrug.
	 */
	onClearDrug: PropTypes.func.isRequired,

	/**
	 * Used to open the reports view. Takes a report object containing information about the drug for which to retrieve reports.
	 */
	handleOpen: PropTypes.func.isRequired,

	/**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
	scoreRange: PropTypes.array.isRequired,

	/**
	 * Array of severe ADR count boundaries, indicating how to color galaxy view headers.
	 */
	dmeRange: PropTypes.array.isRequired,

	/**
	 * Indicates whether the Galaxy View is currently fullscreened.
	 */
	isGalaxyFullscreen: PropTypes.bool.isRequired,

	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string.isRequired,

};

export default GalaxyView;