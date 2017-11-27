import React from 'react'
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar'

export default class SearchBarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateInput  = this.onUpdateInput.bind(this);
        this.onNewRequest  = this.onNewRequest.bind(this);
        this.state = {
            value: ''
        }
    }

    onUpdateInput(input) {
        this.setState({ value: input }) 
    }

    onNewRequest() {
        this.props.handleSearchRequest(this.state.value)
    }

    render() {
        return (
            <SearchBar
            onChange={this.onUpdateInput}
            onRequestSearch={this.onNewRequest}
            dataSource={this.props.drugs}
            filter={AutoComplete.caseInsensitiveFilter}
            />    
            )
    }
}
