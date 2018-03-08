import React from 'react'
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';

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

/**
 * This component extends the SearchBar component to add search functionality when an autocomplete option is selected.
 */
class ModifiedSearchBar extends SearchBar {
    constructor(props) {
        super(props);
    }

    /**
     * Render the component.
     */
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
              ...style,
              background: 'rgba(255,255,255,0.9)'
            }}
            zDepth={1}
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

/**
 * This component allows users to search for drugs in the context of this application.
 */
class SearchBarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateInput  = this.onUpdateInput.bind(this);
        this.onNewRequest  = this.onNewRequest.bind(this);
        this.state = {
            value: ''
        }
    }

    /**
     * Update the state's search value whenever the text in the searchbar is changed.
     * 
     * @param {string} input New text in the search bar
     */
    onUpdateInput(input) {
        this.setState({ value: input }) 
    }

    /**
     * Perform the search actions for the drug name in the search bar.
     */
    onNewRequest() {
        var lowerCaseDrugs = this.props.drugs.map((drug) => (_.toLower(drug)));
        var index = lowerCaseDrugs.indexOf(_.toLower(this.state.value));
        if(index != -1) {
            this.props.handleSearchRequest(this.props.drugs[index]);
        }
    }

    /**
     * Render the component.
     */
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

SearchBarComponent.propTypes = {
  /**
   * Array of all drug names to be used for AutoComplete.
   */
  drugs: PropTypes.array.isRequired,
  
  /**
   * Function to handle the request for a given drug when it is searched. Takes the selected drug name as a parameter.
   */
  handleSearchRequest: PropTypes.func.isRequired
};

export default SearchBarComponent;
