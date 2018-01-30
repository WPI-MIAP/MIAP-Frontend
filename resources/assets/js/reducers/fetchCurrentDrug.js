import _ from 'lodash'

export const drugs = (
	state = {
		isFetching: false,
		rules: [],
		drugs: []
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
				rules: action.rules,
				drugs: action.drugs,
				lastUpdated: action.receivedAt
			})
		default:
			return state;
	}
}

export const currentDrugs = (state = {}, action) => {
	switch (action.type) {
	    case 'RECEIVE_DRUGS':
	    case 'REQUEST_DRUGS':
	    	if (! action.drug) { return state }
				return Object.assign({}, state, {
					[action.drug]: drugs(state[action.drug], action)
				})
			case 'DELETE_DRUG':
				return _.omit(state, [action.drug])
	    default:
				return state
	}
}
