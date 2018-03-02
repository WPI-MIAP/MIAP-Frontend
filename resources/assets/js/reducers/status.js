export const status = (state = {}, action) => {
	switch (action.type) {
	    case 'RECEIVE_STATUS':
	    case 'REQUEST_STATUS':
			return Object.assign({}, state, {
				status: action.status,
				updated: action.updated,
				sources: action.sources
			})
	    default:
			return state
	}
}