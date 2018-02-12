export const addRules = (state = [], action) => {
	switch (action.type) {
    case 'ADD_RULES':
      return action.rule === undefined ? state : action.rule; 
    default:
      return state;
	}
}