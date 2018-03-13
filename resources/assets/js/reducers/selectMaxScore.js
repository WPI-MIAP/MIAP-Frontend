/**
 * Select the max score or set default to 2
 * @param {number} state 
 * @param {*} action 
 */
export const selectMaxScore = (state = 2, action) => {
	switch (action.type) {
		case 'SELECT_MAX_SCORE':
			return action.score !== '' ? Number(action.score) : 2
		default:
			return state
	}
}

