import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'
import { selectDrug } from './selectDrug'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
	selectDrug
})

export default drugInteractionApp