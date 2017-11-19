const drugSelector = (state = '', action) => {
	switch (action.type) {
		case 'SELECT_DRUG':
			return action.drug
		default: 
			return state
	}
}

export default drugSelector