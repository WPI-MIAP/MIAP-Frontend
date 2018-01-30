import * as _ from 'lodash';

export const addRules = (state = [], action) => {
	switch (action.type) {
    case 'ADD_RULES':
      return _.uniqBy([...state, action.rule], item => JSON.stringify(item)); 
    default:
      return state
	}
}