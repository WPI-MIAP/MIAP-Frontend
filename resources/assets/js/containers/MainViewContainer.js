import { connect } from 'react-redux'
import { fetchRules, fetchDrugs, setFilter, selectDrug } from '../actions'
import MainView from '../components/layouts/MainView'

const getVisibleRules = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.items
		case 'known':
			return rules.known.items
		case 'unknown':
			return rules.unknown.items
	}
}

const getVisibleDrugs = (drugs, filter) => {
	switch (filter) {
		case 'all':
			return Object.keys(drugs.all.items)
		case 'known':
			return Object.keys(drugs.known.items)
		case 'unknown':
			return Object.keys(drugs.unknown.items)
	}
}

const mapStateToProps = state => {
	return {
		links: getVisibleRules(state.rulesByStatus, state.visibilityFilter),
		nodes: getVisibleDrugs(state.drugsByStatus, state.visibilityFilter)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onClickNode: drug => {
			return dispatch(selectDrug(drug))
		}
	}
}

const MainViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)

export default MainViewContainer


