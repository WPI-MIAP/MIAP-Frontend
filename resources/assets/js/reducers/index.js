import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'
import { selectDrug } from './selectDrug'
import { selectMinScore } from './selectMinScore'
import { selectMaxScore } from './selectMaxScore'
import { treeViewSorting } from './treeViewSorting'
import { addRules } from './addRules'
import { isUpdating } from './isUpdating'

const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
	selectDrug,
	treeViewSorting,
	selectMinScore,
	selectMaxScore,
	addRules,
	isUpdating
})

export default drugInteractionApp