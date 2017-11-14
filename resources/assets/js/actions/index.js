import axios from 'axios';
/* =====================================================================
STATE SHAPE
{
	selectedRule: 'all' | 'unknown' | 'known'
	rules: {
		all: {
			isFetching
			items: [{},{},{}]
		},

		known: {
			isFetching
			items: []
		},

		unknown: {
			isFetching
			items: []
		},
	}
}
===================================================================== */
export const requestRules = (status) => {
	return {
		type: 'REQUEST_RULES',
		status
	}
}

export const requestDrugs = (drug) => {
	return {
		type: 'REQUEST_DRUGS',
		drug
	}
}

export const receiveRules = (status, json) => {
	return {
		type: 'RECEIVE_RULES',
		status,
		rules: json,
	    receivedAt: Date.now()
	}
}

export const selectRules = (status) => {
	return {
		type: 'SELECT_RULES',
		status
	}
}

export function fetchRules(status) {
	return function (dispatch) {
		dispatch(requestRules(status));

		return axios.get('/csv/rules')
			.then(response => {
				dispatch(receiveRules(status, response.data))
			})
	}
}
