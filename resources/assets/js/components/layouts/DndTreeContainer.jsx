import React, { Component } from 'react'
import Graph from 'react-graph-vis'
import DndTree from '../modules/DndTree'
import {GridList, GridTile} from 'material-ui/GridList';
import { Grid, Row, Col } from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';



export default class DndTreeContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			tableData: [],
			tableTitle: ''
		};

		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen(title) {
		axios.get('/csv/reports?drug=' + title)
			.then(response => {
				this.setState({ tableData: response.data })	
			});

		this.setState({
			open: true,
			tableTitle: 'Reports for ' + title
		});
  }

  handleClose() {
    this.setState({open: false});
  }

	render() {
		const colsWidth = this.props.cols == 4 ? 12 : 3;

		const styles = {
			root: {
				overflow: 'auto',
				height: 500,
				paddingTop: 75
			},
			title: {
				// textAlign: 'center'
				// height: 30,
				padding: '20px 0',
				background: 'black',
				margin: 0,
				color: 'white'
			},
			titleText: {
				position: 'relative',
				left: 10
			},
			row: {
				margin: '0 20px'
			},
			cols: {
				marginBottom: 30
			},
			cardButtons: {
				position: 'relative',
				top: -15
			}
		};

		const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />
    ];

		return (
			<div>
				<Grid fluid style={styles.root}>
					<Row style={styles.row}>
						{
							this.props.currentDrugs.map(drug => (
								<Col lg={colsWidth} md={colsWidth} style={styles.cols}>
									<div className="card" key={drug[0]} style={{
											height: 300,
											border: this.props.selectedDrug == drug[0] ? '3px solid #29ACBF' : '3px solid grey'
										}}
									>
										<h5 className="card-title" style={styles.title}>
											<span style={styles.titleText}>{drug[0]}</span>
											<span className="pull-right" style={styles.cardButtons}>

												<IconButton tooltip="Show Profile"
													iconStyle={{ color: 'white' }}
													onClick={() => this.props.onClickNode(drug[0])}	
												>
													<ActionOpenInNew />
												</IconButton>

												<IconButton tooltip="Show Reports"
													iconStyle={{ color: 'white' }}
													onClick={() => {this.handleOpen(drug[0])}}

													// onClick={() => onClickNode(drug[0])}	
												>
													<EditorInsertChart />
												</IconButton>

												<IconButton tooltip="Close Window"
													iconStyle={{ color: 'white' }}
													onClick={() => this.props.onDeleteNode(drug[0])}	
												>
													<NavigationClose />
												</IconButton>
											</span>
										</h5>	
										<div className="card-body" style={{ position: 'relative', top: -13 }}>
											<DndTree currentDrug={drug[0]} data={drug[1]} filter={this.props.filter} minScore={this.props.minScore} maxScore={this.props.maxScore} />
										</div>
									</div>
								</Col>
							))
						}
					</Row>
				</Grid>
				<Dialog
					title={this.state.tableTitle}
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.handleClose}
					autoScrollBodyContent={true}
					contentStyle={{width: "90%", maxWidth: "none", overflow: 'auto' }}
				>
					<Table
						autoDetectWindowHeight={false} 
						autoScrollBodyContent={true}
						fixedFooter={false}
						fixedHeader={false} 
						style={{ width: "auto",  overflow: 'auto' }}
						bodyStyle={{overflow:'visible'}}
						striped={true}
						displayBorder={true}
					>
					<TableHeader>
						<TableRow>
							<TableHeaderColumn>PRIMARYID</TableHeaderColumn>
							<TableHeaderColumn>EVENT_DT</TableHeaderColumn>
							<TableHeaderColumn>REPT_DT</TableHeaderColumn>
							<TableHeaderColumn>REPT_COD</TableHeaderColumn>
							<TableHeaderColumn>OCCR_COUNTRY</TableHeaderColumn>
							<TableHeaderColumn>AGE</TableHeaderColumn>
							<TableHeaderColumn>AGE_COD</TableHeaderColumn>
							<TableHeaderColumn>AGE_GRP</TableHeaderColumn>
							<TableHeaderColumn>SEX</TableHeaderColumn>
							<TableHeaderColumn>WT</TableHeaderColumn>
							<TableHeaderColumn>WT_COD</TableHeaderColumn>
							<TableHeaderColumn>LIST OF DRUG NAMES</TableHeaderColumn> 
							<TableHeaderColumn>ADVERSARY EFFECTS</TableHeaderColumn>
							<TableHeaderColumn>OCCP_COD</TableHeaderColumn>
							<TableHeaderColumn>REPORTER COUNTRY</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							this.state.tableData.map(data => {
								return (
									<TableRow selectable={false} displayBorder={true}
									>
										<TableRowColumn>{data.primaryId}</TableRowColumn>
										<TableRowColumn>{data.event_dt}</TableRowColumn>
										<TableRowColumn>{data.rept_dt}</TableRowColumn>
										<TableRowColumn>{data.rept_cod}</TableRowColumn>
										<TableRowColumn>{data.occr_country}</TableRowColumn>
										<TableRowColumn>{data.age}</TableRowColumn>
										<TableRowColumn>{data.age_cod}</TableRowColumn>
										<TableRowColumn>{data.age_grp}</TableRowColumn>
										<TableRowColumn>{data.sex}</TableRowColumn>
										<TableRowColumn>{data.wt}</TableRowColumn>
										<TableRowColumn>{data.wt_cod}</TableRowColumn>
										<TableRowColumn style={{
											whiteSpace: 'normal',
											wordWrap: 'break-word',
											padding: 10,
											}}
										>
											{data.drugname}
										</TableRowColumn>

										<TableRowColumn style={{
											whiteSpace: 'normal',
											padding: 10,
											wordWrap: 'break-word'
											}}
										>
											{data.SideEffect}
										</TableRowColumn>
										<TableRowColumn>{data.occp_cod}</TableRowColumn>
										<TableRowColumn>{data.reporter_country}</TableRowColumn>
									</TableRow>
								)
							})
						}
					</TableBody>
					</Table>
				</Dialog>
			</div>
		)

	}
}