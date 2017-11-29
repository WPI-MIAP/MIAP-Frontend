export const selectDrug = (state = '', action) => {
	switch (action.type) {
		case 'SELECT_DRUG':
			return action.drug
		case 'CLEAR_SEARCH_TERM':
			return ''
		default:
			return state
	}
}

