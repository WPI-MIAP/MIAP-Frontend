export const selectedDrugs = (state = 'all', action) => {
	switch (action.type) {
		case 'SELECT_DRUGS':
			return action.status
		default:
			return state
	}
}

export const drugs = (
	state = {
		isFetching: false,
		items: []
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_DRUGS':
			return Object.assign({}, state, {
				isFetching: true
			})
		case 'RECEIVE_DRUGS':
			return Object.assign({}, state, {
				isFetching: false,
				items: action.drugs,
		        lastUpdated: action.receivedAt
			})
		default:
			return state;
	}
}

export const drugsByStatus = (state = {}, action) => {
	switch (action.type) {
	    case 'RECEIVE_DRUGS':
	    case 'REQUEST_DRUGS':
			return Object.assign({}, state, {
				[action.status]: drugs(state[action.status], action)
			})
	    default:
			return state
	}
}