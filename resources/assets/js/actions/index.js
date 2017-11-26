import axios from 'axios';

export const selectDrug = drug => {
	return {
		type: 'SELECT_DRUG',
		drug
	}
}

export const addDrug = drug => {
	return {
		type: 'ADD_DRUG',
		drug
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
		rules: json,
	    receivedAt: Date.now()
	}
}

export const requestDrugs = status => {
	return {
		type: 'REQUEST_DRUGS',
		status
	}
}

export const receiveDrugs = (status, json) => {
	return {
		type: 'RECEIVE_DRUGS',
		status,
		drugs: json,
	    receivedAt: Date.now()
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

export function fetchDrugs(status) {
	return function (dispatch) {
		dispatch(requestDrugs(status));

		return axios.get('/csv/drugs?status=' + status)
			.then(response => {
				dispatch(receiveDrugs(status, response.data))
			})
	}
}
