import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import drugInteractionApp from './reducers'
import { fetchRules, setFilter } from './actions'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


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

render(
	<MuiThemeProvider>
	<Provider store={store}>
		<App />
	</Provider>
	</MuiThemeProvider>,
	document.getElementById('root')
);