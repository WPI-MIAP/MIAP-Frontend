import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List'; 
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Files from 'react-files';
import axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import { Row, Col } from 'react-flexbox-grid';
import {StatusInformation} from './StatusInformation';
import PropTypes from 'prop-types';

/**
 * This component is used to upload FAERS data zip files and show status information about the last analysis ran.
 */
class UploadFAERS extends Component {
	constructor(props) {
		super(props)
	
		this.state = { 
			uploadDialog: false,
			uploadFiles: [],
			prevFiles: [],
			uploadSnackbar: false,
			uploadSnackbarMessage: '',
			currentlyRunning: props.status.status === 'inprogress'
		};

		this.openUploadDialog = this.openUploadDialog.bind(this);
		this.closeUploadDialog = this.closeUploadDialog.bind(this);
		this.beginMARAS = this.beginMARAS.bind(this);
		this.onFilesChange = this.onFilesChange.bind(this);
		this.createRemoveFileHandler = this.createRemoveFileHandler.bind(this);
	}

	/*
	 * When new props are received, check whether they are undefined before 
	 * updating the state.
	 */
	componentWillReceiveProps(nextProps) {
		if(nextProps.status.status !== undefined) {
			if(nextProps.status.status === 'inprogress') {
				this.setState({currentlyRunning: true});
			}
			else {
				this.setState({currentlyRunning: false});
			}
		}
	}
	
	/*
	 * Called when the iconbutton is clicked to open the upload dialog.
	 */
	openUploadDialog(){
		this.props.getStatus();
		this.setState({uploadDialog: true});
	};
	
	/*
	 * Called when the the upload dialog is closed.
	 */
	closeUploadDialog(){
		this.setState({uploadDialog: false, uploadFiles: []});
	};
	
	/*
	 * Begin the MARAS analysis using whatever data files have been added.
	 */
	beginMARAS(){
		const files = this.state.uploadFiles;
		if(this.state.uploadFiles.length > 0) {
			// start MARAS process on current files
		
			var formData = new FormData();
			files.forEach((f) => {
				formData.append('file', f);
			});
		
			axios.post('/csv/reports', formData).then(
				(response) => {
				this.setState({
					uploadSnackbar: true,
					uploadSnackbarMessage: (response.data.success) ? "File(s) uploaded, your visualization will be updated when analysis is completed" : "Error uploading files",
				});
				},
				(error) => {console.log(error);}
			);
		
			this.closeUploadDialog();
		}
		else{
			this.setState({
				uploadSnackbar: true,
				uploadSnackbarMessage: "Add one or more file(s) to begin analysis",
			});
		}
	};
	
	/*
	 * Callback for when a file is added. Checks for new files added, removes duplicates, and adds
	 * the resulting files to the list of files to be uploaded.
	 * 
	 * @param files List of all files added
	 */
	onFilesChange(files){
		var newFiles = [];
		//find any new files that have been added
		for(var i = files.length-1; i > files.length-1-(files.length - this.state.prevFiles.length); i--) {
		  	newFiles.push(files[i]);
		}
	
		var filesWithoutDuplicates = this.state.uploadFiles;
		var found = false;
		//check to see if each new file is a duplicate, otherwise add it to the list of files to upload
		newFiles.forEach((newFile) => {
		  	filesWithoutDuplicates.forEach((addedFile) => {
				if(newFile.name === addedFile.name) {
					found = true;
				}
		  	});
			if(!found) {
				filesWithoutDuplicates.push(newFile);
			}
		});
		
		this.setState({
			uploadFiles: filesWithoutDuplicates,
			prevFiles: files,
		});
	};
	
	/*
	 * Callback on error adding a file.
	 * 
	 * @param error The error being thrown
	 * @param file The file causing the error
	 */
	onFilesError(error, file){
		console.log(error.message);
	};
	
	/*
	 * Creates a function when a file is added to the list that can be used to remove that file from the
	 * list of files to be uploaded.
	 * 
	 * @param file The file to be removed
	 */
	createRemoveFileHandler(file){
		return function() {
			var files = this.state.uploadFiles;
			for(var i=0; i < files.length; i++) {
				if(files[i].name === file) {
					files.splice(i, 1);
					break;
				}
			}
			this.setState({
				uploadFiles: files,
			});
		}.bind(this);
	}

	/*
	 * Render this component.
	 */
	render() {

		return (
			<div>
				<IconButton 
					tooltip="Upload FAERS data"
					iconStyle={{ color: 'white' }}
					tooltipPosition='bottom-left'
					onClick={this.openUploadDialog}>
					<FileUpload />
				</IconButton>
				<Snackbar
					open={this.state.uploadSnackbar}
					message={this.state.uploadSnackbarMessage}
					autoHideDuration={4000}
					style={{zIndex: 1400}}
					onRequestClose={() => {this.setState({uploadSnackbar: false})}}/>
				<Dialog
					title="Upload FAERS data"
					contentStyle={{width: "80%", maxWidth: "none"}}
					actions={[
						<FlatButton
						  label="Cancel"
						  primary={false}
						  onClick={this.closeUploadDialog}
						/>, 
						<FlatButton
						  label="Upload"
						  primary={true}
						  onClick={this.beginMARAS}
						  disabled={this.state.currentlyRunning}
						/>
					]}
					modal={false}
					open={this.state.uploadDialog}
					onRequestClose={this.closeUploadDialog}
					autoScrollBodyContent={true}>
						{
							(this.state.currentlyRunning) ? (
								<div style={{textAlign: 'center'}}>
									Analysis is currently in progress. Please wait for analysis to complete before uploading
									any more files.
								</div>
							) : (
								<Row>
									<Col md={8}>
										<Files
											className='files-dropzone'
											onChange={this.onFilesChange}
											onError={this.onFilesError}
											accepts={['application/x-zip-compressed']}
											multiple
											maxFileSize={1000000000}
											minFileSize={0}
											clickable
											>
											<Paper zDepth={1} style={{height: 114, lineHeight: '38px', textAlign: 'center'}}>
											<div>
												Drop files here or click to upload (File format must be .zip)<br/>
												Zip files can be downloaded from&nbsp;
												<a target="_blank" onClick={(event) => {event=event || window.event; event.stopPropagation();}} href="https://www.fda.gov/Drugs/GuidanceComplianceRegulatoryInformation/Surveillance/AdverseDrugEffects/ucm082193.htm">
													this link
												</a>. <br/>
												Note: Please upload the ASCII version.
											</div>
											</Paper>
										</Files>
										<List>
											<ListItem primaryText={'Example:'} disabled={true}/>
											<ListItem
												leftAvatar={<Avatar icon={<FileCreateNewFolder/>}/>}
												rightIconButton={<IconButton onClick={() => {}}><NavigationClose/></IconButton>}
												primaryText={'faers_ascii_2013q1.zip'}
												disabled={true}
												/>
											<ListItem primaryText={'Files to Upload:'} disabled={true}/>
											{
												(this.state.uploadFiles.length == 0) ? (
													<ListItem primaryText={'No files have been added.'} disabled={true}/>
												) :
												(this.state.uploadFiles.map((file) => (
													<ListItem
														key={file.name}
														leftAvatar={<Avatar icon={<FileCreateNewFolder/>}/>}
														rightIconButton={<IconButton onClick={this.createRemoveFileHandler(file.name)}><NavigationClose/></IconButton>}
														primaryText={file.name}
														/>
												)))
											}
										</List>
									</Col>
									<Col md={4}>
										<StatusInformation status={this.props.status} />
									</Col>
								</Row>
							)
						}
				</Dialog>
			</div>
		);
	}
}

UploadFAERS.propTypes = {
	/**
	 * The status of the last analysis ran.
	 */
	status: PropTypes.object.isRequired,
	/**
	 * A function that can be called to get the updated analysis status.
	 */
	getStatus: PropTypes.func.isRequired,
  };

export default UploadFAERS;