export const selectScore = (state = '', action) => {
	switch (action.type) {
		case 'SELECT_SCORE':
			return action.score
		default:
			return state
	}
}

