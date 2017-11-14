import { combineReducers } from 'redux'
import visibilityFilter from './visibilityFilter'
import { rulesByStatus } from './fetchRules'
import { drugsByStatus } from './fetchDrugs'

const drugInteractionApp = combineReducers({
  visibilityFilter,
  rulesByStatus,
  drugsByStatus
})

export default drugInteractionApp