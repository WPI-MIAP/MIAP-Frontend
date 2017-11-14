import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import MainView from '../components/layouts/MainView2'

const getVisibleDrugInteractions = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.items
		case 'known':
			return rules.known.items
		case 'unknown':
			return rules.unknown.items
	}
}

const mapStateToProps = state => {
	return {
		links: getVisibleDrugInteractions(state.rulesByStatus, state.visibilityFilter),
		width: 500,
		height: 500,
		drugLinks: {}
	}
}

const VisibleDrugInteraction = connect(
  mapStateToProps,
)(MainView)

export default VisibleDrugInteraction


