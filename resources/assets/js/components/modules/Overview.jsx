import React, { Component } from 'react';
import DndGraph from '../modules/DndGraph';
import { scoreColors, complementaryColor, secondaryColor } from '../../utilities/constants';
import Paper from 'material-ui/Paper';
import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import IconFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { Row, Col } from 'react-flexbox-grid';


export default class Overview extends Component {
    constructor(props) {
		super(props);

		this.state = {
			legendShow: true,
		};

		this.onClickEdgeTour = this.onClickEdgeTour.bind(this);
		this.onClickNodeTour = this.onClickNodeTour.bind(this);
	}

	onClickEdgeTour(interaction) {
		this.props.onClickEdge(interaction);
		if(this.props.currentSelector === '.overview2'){
			this.props.nextTourStep();
		}
	}

	onClickNodeTour(drug) {
		this.props.onClickNode(drug);
		if(this.props.currentSelector === '.overview3'){
			this.props.nextTourStep();
		}
	}

	render() {

		return (
			<div>
				<Paper zDepth={1}>
					<GridTile
						title={this.props.col != 12 ? "Overview" : ""}
						titlePosition="top"
						className="overview overview2 overview3"
						titleBackground={complementaryColor}
						style={{
							boxSizing: 'border-box',
							background: 'white',
							height: this.state.legendShow ? 'calc(100% - 74px)' : '100%'
						}}
						actionIcon={
							<IconButton 
								tooltip="Go Fullscreen"
								iconStyle={{ color: 'white' }}
								tooltipPosition='bottom-left'
								onClick={this.props.toggleFullscreenOverview}>
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
							onClickNode={this.onClickNodeTour}
							onClickEdge={this.onClickEdgeTour}
							isFetching={this.props.isFetching}
							filter={this.props.filter}
							minScore={this.props.minScore}
							maxScore={this.props.maxScore}
							isUpdating={this.props.isUpdating}
							scoreRange={this.props.scoreRange}
						/>
					</GridTile>
					{/* LEGEND */}
					{
						this.state.legendShow ? (
							<Row>
								<Col sm={12}>
									<hr style={{borderTop: '1px solid ' + secondaryColor, width: '90%', padding: 0, margin: '0 auto'}}/>
									<Row style={{ padding: 0 }}>
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
									<Row style={{marginTop: 0, paddingBottom: 0}}>
										{scoreColors.map(scoreColor => (
											<Col xs={3} md={3}>
												<div style={{height: 5, width: 50, background: scoreColor.color, margin: '0 auto'}}/>
												<div style={{textAlign: 'center'}}>{scoreColor.text}</div>
											</Col>
										))}
									</Row>
								</Col>
							</Row>
						) : ([])
					}
				</Paper>
				{
					!this.state.legendShow ? (
						<IconButton
							style={{top: -48, position: 'relative'}}
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