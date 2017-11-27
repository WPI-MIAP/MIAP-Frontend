import { connect } from 'react-redux'
import { fetchRules, fetchDrugs, setFilter } from '../actions'
import SearchBarComponent from '../components/modules/SearchBarComponent'

const mapStateToProps = state => {
	return {
		drugs: state.rulesByStatus.all.drugs
	}
}

const SearchBarContainer = connect(
	mapStateToProps,
)(SearchBarComponent)

export default SearchBarContainer 