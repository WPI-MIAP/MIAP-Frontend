const drugSelector = (state = [], action) => {
	switch (action.type) {
		case 'SELECT_DRUG':
		if (action.drug) {
			return [action.drug]
		}
		return state

		case 'ADD_DRUG':
		return [...state, action.drug]

		default: 
		return state
	}
}

export default drugSelector