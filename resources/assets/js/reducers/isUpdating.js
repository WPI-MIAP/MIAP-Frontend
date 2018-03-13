/*
 * Check if any component is updating
 */
export const isUpdating = (state = false, action) => {
	switch (action.type) {
		case 'IS_UPDATING':
			return Boolean(action.value)
		default:
			return state
	}
}