export const generateColor = score => {
	if (score <= 0.0) {
		return '#fecc5c'
	} 
	else if (score > 0.0 && score <= 0.01) {
		return '#fd8d3c'
	}
	else if (score > 0.01 && score <= 0.2) {
		return '#f03b20'
	}
	else if (score > 0.2) {
		return 'hsl(0, 100%, 25%)'
	}
}