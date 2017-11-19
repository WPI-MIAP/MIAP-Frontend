import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import drugSelector from './drugSelector'
import { rulesByStatus } from './fetchRules'
import { drugsByStatus } from './fetchDrugs'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	drugsByStatus,
	drugSelector
})

export default drugInteractionApp