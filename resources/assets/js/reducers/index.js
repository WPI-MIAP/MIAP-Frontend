import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'
import { selectDrug } from './selectDrug'
import { selectMinScore } from './selectMinScore'
import { selectMaxScore } from './selectMaxScore'
import { treeViewSorting } from './treeViewSorting'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
	selectDrug,
	treeViewSorting,
	selectMinScore,
	selectMaxScore
})

export default drugInteractionApp