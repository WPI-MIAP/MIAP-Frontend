/**
 * Select a rule or remove the currently selected rule
 * @param {string} state 
 * @param {*} action 
 */
export const selectRule = (state = '', action) => {
	switch (action.type) {
    case 'SELECT_RULE':
      return action.rule === undefined ? state : action.rule; 
    case 'CLEAR_RULE':
      return '';
    default:
      return state;
	}
}