import { connect } from 'react-redux'
import { selectDrug, fetchRulesByDrugName } from '../actions'
import SearchBarComponent from '../components/modules/SearchBarComponent'

const mapStateToProps = state => {
	return {
		drugs: state.rulesByStatus.all.drugs
	}
}

const mapDispatchToProps = dispatch => {
	return {
		handleSearchRequest: searchTerm => {
			dispatch(selectDrug(searchTerm))
			dispatch(fetchRulesByDrugName(searchTerm))
		}
	}
}

const SearchBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchBarComponent)


export default SearchBarContainer 