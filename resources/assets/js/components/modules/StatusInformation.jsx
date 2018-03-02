import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconInfoOutline from 'material-ui/svg-icons/action/info-outline';
import { Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';

export default class StatusInformationButton extends Component {
    constructor(props) {
		super(props);

		this.state = {
			dialog: false,
		};
	}

	render() {
		const actions = [
			<FlatButton
			  label="Close"
			  primary={false}
			  onClick={() => {this.setState({dialog: false})}}
			/>
		];

		return (
			<div>
				<IconButton 
					tooltip="Data Information"
					iconStyle={{ color: 'white' }}
					tooltipPosition='bottom-left'
					onClick={() => {
						this.props.getStatus();
						this.setState({dialog: true});
					}}>
					<IconInfoOutline />
				</IconButton>
				<Dialog
					title="Data Information"
					contentStyle={{width: "60%", maxWidth: "none"}}
					actions={actions}
					modal={false}
					open={this.state.dialog}
					onRequestClose={() => {this.setState({dialog: false})}}
					autoScrollBodyContent={true}>
					<StatusInformation status={this.props.status}/>
				</Dialog>
			</div>
		)
	}
}

export class StatusInformation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			status: props.status.status,
			updated: props.status.updated,
			sources: props.status.sources,
		};
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.status.status !== undefined) {
			this.setState({
				status: nextProps.status.status,
				updated: nextProps.status.updated,
				sources: nextProps.status.sources
			});
		}
	}

	render() {
		var statusText;
		var statusColor;
		if(this.state.status === 'inprogress'){
			statusText = 'In progress';
			statusColor = 'black';
		}
		else if(this.state.status === 'completed'){
			statusText = 'Completed successfully';
			statusColor = 'green';
		}
		else{
			statusText = 'Exited with errors';
			statusColor = 'red';
		}

		return (
			<Col sm={12}>
				{
					(this.state.status !== undefined && this.state.updated !== undefined && this.state.sources !== undefined) ? (
						<div style={{width: '100%', padding: 20, paddingTop: 30, color: 'black', borderStyle: 'solid', borderColor: statusColor, borderRadius: 25}}>
							<Row style={{margin: 0}}>
								Status of last analysis:&nbsp;<p style={{color: statusColor}}>{statusText}</p>
							</Row>
							<Row style={{margin: 0}}>
								Last updated:&nbsp;<p>{this.state.updated}</p>
							</Row>
							<Row style={{margin: 0}}>
								<p>Current datasets:</p>
							</Row>
							<ul>
								{
									this.state.sources.map(source => (
										<li key={source}>
											{source}
										</li>
									))
								}
							</ul>
						</div>
					) : (
						<div style={{paddingTop: 30, paddingBottom: 30, textAlign: 'center', color: 'black', borderStyle: 'solid', borderColor: 'black', borderRadius: 25}}>No status information is available for prior analyses.</div>
					)
				}
			</Col>
		)
	}
}