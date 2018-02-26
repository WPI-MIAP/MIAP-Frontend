import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ContentFilterList from 'material-ui/svg-icons/content/filter-list';
import IconButton from 'material-ui/IconButton';

export default class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
        this.setState({ dialogOpen: true });
    };

    handleClose() {
        this.setState({ dialogOpen: false });
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={true}
                onClick={this.handleClose}
            />,
        ];

        return (
            <div>
                <IconButton
                    tooltip="Filters"
                    iconStyle={{ color: 'white' }}
                    tooltipPosition='bottom-left'
                    onClick={() => { this.setState({ dialogOpen: true }) }}
                >
                    <ContentFilterList />
                </IconButton>
                <Dialog
                    title="Dialog With Actions"
                    actions={actions}
                    modal={true}
                    open={this.state.dialogOpen}
                >
                    Only actions can close this dialog.
                </Dialog>
            </div>
        )
    }
}