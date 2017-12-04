import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'
import { selectDrug } from './selectDrug'
import { treeViewSorting } from './treeViewSorting'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
	selectDrug,
	treeViewSorting
})

export default drugInteractionApp