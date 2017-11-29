import { connect } from 'react-redux'
import { setFilter, clearSearchTerm } from '../actions'
import ChooseStatus from '../components/modules/ChooseStatus'

const getNumRules = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.rules.length
		case 'known':
			return rules.known.rules.length
		case 'unknown':
			return rules.unknown.rules.length
	}
}

const getNumDrugs = (drugs, filter) => {
	switch (filter) {
		case 'all':
			return drugs.all.drugs.length
		case 'known':
			return drugs.known.drugs.length
		case 'unknown':
			return drugs.unknown.drugs.length
	}
}

const mapStateToProps = state => {
  return {
  	numRules: getNumRules(state.rulesByStatus, state.visibilityFilter),
  	numDrugs: getNumDrugs(state.rulesByStatus, state.visibilityFilter),
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClickRadio: filter => {
			dispatch(setFilter(filter))
			dispatch(clearSearchTerm())
		}
	}
}

const ChooseStatusContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChooseStatus)

export default ChooseStatusContainer 