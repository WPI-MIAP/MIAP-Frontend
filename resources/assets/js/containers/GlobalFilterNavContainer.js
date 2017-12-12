import { connect } from 'react-redux'
import { setFilter, clearSearchTerm, selectScore } from '../actions'
import GlobalFilterNav from '../components/modules/GlobalFilterNav'


const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClick: filter => {
			dispatch(setFilter(filter))
		},

		updateScore: score => {
			dispatch(selectScore(score))
		}
	}
}

const GlobalFilterNavContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GlobalFilterNav)

export default GlobalFilterNavContainer 