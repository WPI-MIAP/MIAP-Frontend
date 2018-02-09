import React from 'react'
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';

const getStyles = (props, state) => {
    const {disabled, iconButtonStyle} = props
    const {value} = state
    const nonEmpty = value.length > 0
  
    return {
      root: {
        height: 48,
        display: 'flex',
        justifyContent: 'space-between'
      },
      iconButtonClose: {
        style: {
          opacity: !disabled ? 0.54 : 0.38,
          transform: nonEmpty ? 'scale(1, 1)' : 'scale(0, 0)',
          transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          ...iconButtonStyle
        },
        iconStyle: {
          opacity: nonEmpty ? 1 : 0,
          transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
        }
      },
      iconButtonSearch: {
        style: {
          opacity: !disabled ? 0.54 : 0.38,
          transform: nonEmpty ? 'scale(0, 0)' : 'scale(1, 1)',
          transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          marginRight: -48,
          ...iconButtonStyle
        },
        iconStyle: {
          opacity: nonEmpty ? 0 : 1,
          transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
        }
      },
      input: {
        width: '100%'
      },
      searchContainer: {
        margin: 'auto 16px',
        width: '100%'
      }
    }
}

class ModifiedSearchBar extends SearchBar {
    constructor(props) {
        super(props);
    }

    render () {
        const styles = getStyles(this.props, this.state)
        const {value} = this.state
        const {
          closeIcon,
          disabled,
          onRequestSearch,
          searchIcon,
          spellCheck,
          style,
          ...inputProps
        } = this.props
    
        return (
          <Paper
            style={{
              ...styles.root,
              ...style
            }}
          >
            <div style={styles.searchContainer}>
              <AutoComplete
                ref={(ref) => { this.autoComplete = ref }}
                onBlur={() => this.handleBlur()}
                searchText={value}
                onUpdateInput={(e) => this.handleInput(e)}
                onNewRequest={onRequestSearch}
                onFocus={() => this.handleFocus()}
                fullWidth
                style={styles.input}
                underlineShow={false}
                disabled={disabled}
                spellCheck={spellCheck}
                {...inputProps}
              />
            </div>
            <IconButton
              onClick={onRequestSearch}
              iconStyle={styles.iconButtonSearch.iconStyle}
              style={styles.iconButtonSearch.style}
              disabled={disabled}
            >
              {searchIcon}
            </IconButton>
            <IconButton
              onClick={() => this.handleCancel()}
              iconStyle={styles.iconButtonClose.iconStyle}
              style={styles.iconButtonClose.style}
              disabled={disabled}
            >
              {closeIcon}
            </IconButton>
          </Paper>
        )
    }
}

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
        if(this.props.drugs.indexOf(this.state.value) != -1) {
            this.props.handleSearchRequest(this.state.value);
        }
    }

    render() {
        return (
            <ModifiedSearchBar
            onChange={this.onUpdateInput}
            onRequestSearch={this.onNewRequest}
            dataSource={this.props.drugs}
            filter={AutoComplete.caseInsensitiveFilter}
            />    
            )
    }
}
