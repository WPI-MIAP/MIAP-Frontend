import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {GridTile} from 'material-ui/GridList';
import { Row, Col } from 'react-flexbox-grid';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { dmeColors, scoreColors, complementaryColor, secondaryColor, adrBorderColor, regularADRColor, severeADRColor } from '../../utilities/constants';
import InteractionProfile from '../modules/InteractionProfile';

const styles = {
	legendSevere: {
		backgroundColor: severeADRColor,
		border: '3px solid ' + adrBorderColor,
		borderRadius: '50%',
		height: 25,
		width: 25,
		textAlign: 'center'
	},
	legendNormal: {
		backgroundColor: regularADRColor,
		border: '3px solid ' + adrBorderColor,
		borderRadius: '50%',
		height: 25,
		width: 25,
		textAlign: 'center'
	}
};

export default class GalaxyView extends Component {
    constructor(props) {
		super(props);

		this.state = {
			legendShow: true,
		};

	}

	render() {
		return (
			<div>
				<Paper zDepth={1}>
					<GridTile
						title={this.props.col != 12 ? this.props.profileTitle : ''}
						titlePosition="top"
						className="profile"
						titleBackground={complementaryColor}
						style={{
							boxSizing: 'border-box',
							background: 'white',
							height: this.state.legendShow ? 'calc(100% - 79px)' : '100%',
							marginBottom: this.state.legendShow ? 0 : -48
						}}
						actionIcon={
							<IconButton 
								tooltip="Go Fullscreen"
								iconStyle={{ color: 'white' }}
								tooltipPosition='bottom-left'
								onClick={this.props.toggleFullscreenProfile}
							>
								<IconFullscreen />	
							</IconButton>
						}
					>
						<div style={{height: this.props.isProfileFullscreen ? '100%' : 'calc(100% - 48px)', marginTop: this.props.isProfileFullscreen ? 0 : 48}}>
							<InteractionProfile 
								mainDrug={this.props.selectedDrug} 
								mainRule={this.props.selectedRule}
								scoreRange={this.props.scoreRange}
								filter={this.props.filter}
								minScore={this.props.minScore}
								maxScore={this.props.maxScore}
							/>
						</div>
					</GridTile>
					{
						this.state.legendShow ? (
							<Row>
								{
									this.props.isProfileFullscreen ? (
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
														<Col xs={3} md={3}>
															<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
															<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
														</Col>
													))}
												</Row>
											</Col>
									) : ([])
								}
								<Col sm={12} md={this.props.isProfileFullscreen ? 6 : 12}>
									<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', margin: '0 auto'}}/>
									<Row>
										<Col sm={3} style={{paddingLeft: '3%'}}>
											{
												this.props.isProfileFullscreen ? ([]) : (
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
											Type of ADR
										</Col>
										<Col sm={3}></Col>
									</Row>
									<Row center="xs" style={{paddingBottom: 5}}>
										<Col xs={4} md={4}>
											<div style={styles.legendSevere}>
												<span style={{ marginLeft: 30 }}>Severe</span>
											</div>
										</Col>
										<Col xs={4} md={4}>
											<div style={styles.legendNormal}>
												<span style={{ marginLeft: 30 }}>Not&nbsp;Severe</span>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
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