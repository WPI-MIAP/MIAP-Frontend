export const selectDrug = (state = '', action) => {
	switch (action.type) {
		case 'SELECT_DRUG':
			return action.drug != undefined ? action.drug : state
		case 'CLEAR_SEARCH_TERM':
			return ''
		default:
			return state
	}
}

