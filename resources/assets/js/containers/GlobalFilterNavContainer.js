import { connect } from 'react-redux'
import { setFilter, clearSearchTerm, selectMinScore, selectMaxScore } from '../actions'
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

		updateMinScore: score => {
			dispatch(selectMinScore(score))
		},

		updateMaxScore: score => {
			dispatch(selectMaxScore(score))
		}
	}
}

const GlobalFilterNavContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GlobalFilterNav)

export default GlobalFilterNavContainer 