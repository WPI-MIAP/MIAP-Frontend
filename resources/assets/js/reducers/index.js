import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
})

export default drugInteractionApp