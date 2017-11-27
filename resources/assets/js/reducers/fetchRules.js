export const selectedRules = (state = 'all', action) => {
	switch (action.type) {
		case 'SELECT_RULES':
			return action.status
		default:
			return state
	}
}

export const rules = (
	state = {
		isFetching: false,
		rules: [],
		drugs: []
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST_RULES':
			return Object.assign({}, state, {
				isFetching: true
			})
		case 'RECEIVE_RULES':
			return Object.assign({}, state, {
				isFetching: false,
				rules: action.rules,
				drugs: action.drugs,
		        lastUpdated: action.receivedAt
			})
		default:
			return state;
	}
}

export const rulesByStatus = (state = {}, action) => {
	switch (action.type) {
	    case 'RECEIVE_RULES':
	    case 'REQUEST_RULES':
			return Object.assign({}, state, {
				[action.status]: rules(state[action.status], action)
			})
	    default:
			return state
	}
}