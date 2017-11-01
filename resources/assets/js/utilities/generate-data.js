import axios from 'axios';

export function prepareData() {
	axios.get('/csv/rules')
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
		});
}