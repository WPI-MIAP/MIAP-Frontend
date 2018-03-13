import { connect } from 'react-redux'
import { setFilter, clearSearchTerm, selectMinScore, selectMaxScore, isUpdating, fetchStatus } from '../actions'
import GlobalFilterNav from '../components/layouts/GlobalFilterNav'

/**
 * This file is the container for the GlobalFilterNav
 */

const mapStateToProps = state => {
  return {
		rules: state.rulesByStatus.all.rules,
		updating: state.isUpdating,
		scoreRange: state.rulesByStatus.all.scoreRange,
		dmeRange: state.rulesByStatus.all.dmeRange,
		minScore: state.selectMinScore,
		maxScore: state.selectMaxScore,
		filter: state.visibilityFilter,
		status: state.status,
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
		},

		getStatus: () => {
			dispatch(fetchStatus())
		}
	}
}

const GlobalFilterNavContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GlobalFilterNav)

export default GlobalFilterNavContainer 