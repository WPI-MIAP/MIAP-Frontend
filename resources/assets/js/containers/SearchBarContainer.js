import { connect } from 'react-redux'
import { fetchRules, fetchDrugs, setFilter } from '../actions'
import SearchBar from '../components/modules/SearchBar'

const mapStateToProps = state => {
	return {
		drugs: state.drugsByStatus.all.items
	}
}

const SearchBarContainer = connect(
	mapStateToProps,
)(SearchBar)

export default SearchBarContainer 