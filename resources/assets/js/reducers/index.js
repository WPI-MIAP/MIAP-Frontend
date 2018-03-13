import visibilityFilter from './visibilityFilter'
import { combineReducers } from 'redux'
import { currentDrugs } from './fetchCurrentDrug'
import { rulesByStatus } from './fetchRules'
import { selectDrug } from './selectDrug'
import { selectMinScore } from './selectMinScore'
import { selectMaxScore } from './selectMaxScore'
import { treeViewSorting } from './treeViewSorting'
import { selectRule } from './selectRule'
import { isUpdating } from './isUpdating'
import { status } from './status'

/* 
 * All states in React container 
 */
const drugInteractionApp = combineReducers({
	visibilityFilter,
	rulesByStatus,
	currentDrugs,
	selectDrug,
	treeViewSorting,
	selectMinScore,
	selectMaxScore,
	selectRule,
	isUpdating,
	status
})

export default drugInteractionApp