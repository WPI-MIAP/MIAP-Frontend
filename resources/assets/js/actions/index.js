import axios from 'axios';

export const addDrug = drug => {
	return {
		type: 'ADD_DRUG',
		drug
	}
}

export const selectDrug = drug => {
	return {
		type: 'SELECT_DRUG',
		drug
	}
}

export const selectRule = rule => {
	return {
		type: 'SELECT_RULE',
		rule
	}
}

export const selectMinScore = score => {
	return {
		type: 'SELECT_MIN_SCORE',
		score
	}
}

export const selectMaxScore = score => {
	return {
		type: 'SELECT_MAX_SCORE',
		score
	}
}

export const isUpdating = value => {
	return {
		type: 'IS_UPDATING',
		value
	}
}

export const clearSearchTerm = () => {
	return {
		type: 'CLEAR_SEARCH_TERM'
	}
}

export const clearRule = () => {
	return {
		type: 'CLEAR_RULE'
	}
}

export const deleteDrug = drug => {
	return {
		type: 'DELETE_DRUG',
		drug
	}
}

export const sortBy = sortBy => {
	return {
		type: 'SORT_BY',
		sortBy
	}
}

export const setFilter = filter => {
	return {
		type: 'SET_FILTER',
		filter
	}
}

export const requestRules = status => {
	return {
		type: 'REQUEST_RULES',
		status
	}
}

export const receiveRules = (status, json) => {
	return {
		type: 'RECEIVE_RULES',
		status,
		rules: json.rules,
		drugs: json.drugs,
		scoreRange: json.scoreRange,
		dmeRange: json.dmeRange,
	    receivedAt: Date.now()
	}
}

export const requestDrugs = drug => {
	return {
		type: 'REQUEST_DRUGS',
		drug
	}
}

export const receiveDrugs = (drug, json) => {
	return {
		type: 'RECEIVE_DRUGS',
		drug,
		rules: json.rules,
		drugDMEs: json.drugDMEs,
		drugs: json.drugs,
	    receivedAt: Date.now()
	}
}

export const requestStatus = () => {
	return {
		type: 'REQUEST_STATUS'
	}
}

export const receiveStatus = (json) => {
	return {
		type: 'RECEIVE_STATUS',
		status: json.status,
		updated: json.updated,
		sources: json.sources
	}
}

export function fetchStatus() {
	return function (dispatch) {
		dispatch(requestStatus());

		return axios.get('/csv/status')
			.then(response => {
				dispatch(receiveStatus(response.data))
			})
	}
}

export function fetchRules(status) {
	return function (dispatch) {
		dispatch(requestRules(status));

		return axios.get('/csv/rules?status=' + status)
			.then(response => {
				dispatch(receiveRules(status, response.data))
			})
	}
}

export function fetchRulesByDrugName(drug) {
	return function (dispatch) {
		dispatch(requestDrugs(drug));

		return axios.get('/csv/rules?drug=' + drug)
			.then(response => {
				dispatch(receiveDrugs(drug, response.data))
			})
	}
}