import { connect } from 'react-redux'
import { fetchRules, fetchRulesByDrugName, clearSearchTerm, selectDrug } from '../actions'
import MainView from '../components/layouts/MainView'

const getVisibleRules = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.rules
		case 'known':
			return rules.known.rules
		case 'unknown':
			return rules.unknown.rules
	}
}

const getVisibleDrugs = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.drugs
		case 'known':
			return rules.known.drugs
		case 'unknown':
			return rules.unknown.drugs
	}
}

const getIsFetching = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.isFetching
		case 'known':
			return rules.known.isFetching
		case 'unknown':
			return rules.unknown.isFetching
	}
}

const mapStateToProps = state => {
	return {
		isFetching: getIsFetching(state.rulesByStatus, state.visibilityFilter),
		links: getVisibleRules(state.rulesByStatus, state.visibilityFilter),
		nodes: getVisibleDrugs(state.rulesByStatus, state.visibilityFilter),
		currentDrugs: state.currentDrugs,
		selectedDrug: state.selectDrug
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onClickNode: drug => {
			dispatch(clearSearchTerm())
			dispatch(selectDrug(drug))
			dispatch(fetchRulesByDrugName(drug))
		}
	}
}

const MainViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)

export default MainViewContainer


