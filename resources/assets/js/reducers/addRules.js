export const addRules = (state = [], action) => {
	switch (action.type) {
    case 'ADD_RULES':
      return action.rule === undefined ? state : action.rule; 
    case 'CLEAR_RULE':
      return '';
    default:
      return state;
	}
}