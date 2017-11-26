import { connect } from 'react-redux'
import { fetchRules, fetchDrugs, setFilter } from '../actions'
import SearchBarComponent from '../components/modules/SearchBarComponent'

const mapStateToProps = state => {
	return {
		drugs: Object.keys(state.drugsByStatus.all.items)
	}
}

const SearchBarContainer = connect(
	mapStateToProps,
)(SearchBarComponent)

export default SearchBarContainer 