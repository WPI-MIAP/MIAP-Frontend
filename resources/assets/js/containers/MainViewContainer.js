import { connect } from 'react-redux'
import { fetchRules, fetchDrugs, setFilter } from '../actions'
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
			return drugs.all.items
		case 'known':
			return drugs.known.items
		case 'unknown':
			return drugs.unknown.items 
	}
}

const mapStateToProps = state => {
	return {
		links: getVisibleRules(state.rulesByStatus, state.visibilityFilter),
		nodes: getVisibleDrugs(state.drugsByStatus, state.visibilityFilter)
	}
}

const MainViewContainer = connect(
  mapStateToProps,
)(MainView)

export default MainViewContainer


