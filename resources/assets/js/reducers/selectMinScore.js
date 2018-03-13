/**
 * Select the min score or set default to 2
 * @param {number} state 
 * @param {*} action 
 */
export const selectMinScore = (state = -2, action) => {
	switch (action.type) {
		case 'SELECT_MIN_SCORE':
			return action.score !== '' ? Number(action.score) : -2
		default:
			return state
	}
}

