import { combineReducers } from 'redux'
import visibilityFilter from './visibilityFilter'
import { rulesByStatus } from './fetchRules'

const drugInteractionApp = combineReducers({
  visibilityFilter,
  rulesByStatus
})

export default drugInteractionApp