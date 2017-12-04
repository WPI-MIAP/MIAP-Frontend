export const treeViewSorting = (state = 'latest', action) => {
  switch (action.type) {
  case 'SORT_BY':
    return action.sortBy
  default:
    return state
  } 
}
