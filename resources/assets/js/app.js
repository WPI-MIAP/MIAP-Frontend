import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import drugInteractionApp from './reducers'
import { fetchRules, fetchDrugs, setFilter } from './actions'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

/**
 * Entry point of the React App
 */
const loggerMiddleware = createLogger()

let store = createStore(
	drugInteractionApp,
	applyMiddleware(
		thunkMiddleware, // lets us dispatch() functions
		loggerMiddleware // neat middleware that logs actions
	)
);

store.dispatch(setFilter('all'));
store.dispatch(fetchRules('all'));
store.dispatch(fetchDrugs('all'));

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);