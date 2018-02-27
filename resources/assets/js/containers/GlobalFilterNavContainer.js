import { connect } from 'react-redux'
import { setFilter, clearSearchTerm, selectMinScore, selectMaxScore, isUpdating } from '../actions'
import GlobalFilterNav from '../components/modules/GlobalFilterNav'


const mapStateToProps = state => {
  return {
		rules: state.rulesByStatus.all.rules,
		numDrugs: state.rulesByStatus.all.drugs.length,
		updating: state.isUpdating,
		scoreRange: state.rulesByStatus.all.scoreRange,
		dmeRange: state.rulesByStatus.all.dmeRange,
		minScore: state.selectMinScore,
		maxScore: state.selectMaxScore,
		filter: state.visibilityFilter
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