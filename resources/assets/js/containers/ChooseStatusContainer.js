import { connect } from 'react-redux'
import { setFilter } from '../actions'
import ChooseStatus from '../components/modules/ChooseStatus'

const getNumRules = (rules, filter) => {
	switch (filter) {
		case 'all':
			return rules.all.items.length
		case 'known':
			return rules.known.items.length
		case 'unknown':
			return rules.unknown.items.length
	}
}

const getNumDrugs = (drugs, filter) => {
	switch (filter) {
		case 'all':
			return drugs.all.items.length
		case 'known':
			return drugs.known.items.length
		case 'unknown':
			return drugs.unknown.items.length
	}
}

const mapStateToProps = state => {
  return {
  	numRules: getNumRules(state.rulesByStatus, state.visibilityFilter),
  	numDrugs: getNumDrugs(state.drugsByStatus, state.visibilityFilter),
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClickRadio: filter => {
			dispatch(setFilter(filter))
		}
	}
}

const ChooseStatusContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChooseStatus)

export default ChooseStatusContainer 