export const addRules = (state = [], action) => {
	switch (action.type) {
    case 'ADD_RULES':
      return action.rule 
    default:
      return state
	}
}