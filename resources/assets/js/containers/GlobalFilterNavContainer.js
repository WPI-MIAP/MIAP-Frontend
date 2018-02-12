import { connect } from 'react-redux'
import { setFilter, clearSearchTerm, selectMinScore, selectMaxScore, isUpdating } from '../actions'
import GlobalFilterNav from '../components/modules/GlobalFilterNav'


const mapStateToProps = state => {
  return {
		rules: state.rulesByStatus.all.rules,
		updating: state.isUpdating,
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClick: filter => {
			dispatch(setFilter(filter))
		},

		updateMinScore: score => {
			dispatch(selectMinScore(score))
		},

		updateMaxScore: score => {
			dispatch(selectMaxScore(score))
		},

		isUpdating: value => {
			dispatch(isUpdating(value))
		}
	}
}

const GlobalFilterNavContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GlobalFilterNav)

export default GlobalFilterNavContainer 