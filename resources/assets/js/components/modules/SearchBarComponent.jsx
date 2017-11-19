import React from 'react'
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar'

export default class SearchBarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateInput  = this.onUpdateInput.bind(this);
        this.onNewRequest  = this.onNewRequest.bind(this);
    }

    onUpdateInput() {

    }

    onNewRequest(searchTerm) {
        alert('test123!');
    }

    render() {
        return (
            <SearchBar
            onChange={() => console.log('onChange')}
            onRequestSearch={() => console.log('onRequestSearch')}
            dataSource={this.props.drugs}
            filter={AutoComplete.caseInsensitiveFilter}
            />    
            )
    }
}
