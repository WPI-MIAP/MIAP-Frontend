import { connect } from 'react-redux'
import { sortBy, clearSearchTerm } from '../actions'
import TreeViewFilter from '../components/modules/TreeViewFilter'

/**
 * Container for the TreeViewFilter
 */

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClickRadio: sortByTerm => {
			dispatch(sortBy(sortByTerm))
		}
	}
}

const TreeViewFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeViewFilter)

export default TreeViewFilterContainer 