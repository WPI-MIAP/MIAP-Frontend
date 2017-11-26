import { connect } from 'react-redux'
import { selectDrug } from '../actions'
import DndTree from '../components/modules/DndTree'

const getDrugs = rules => {
	if (! rules) return []
	// Flatten the array
	let drugs = [].concat.apply([], rules.map(rule => {
		return [rule.Drug1.name, rule.Drug2.name];
	}))

	// Unique items
	return drugs.filter((v, i, a) => a.indexOf(v) === i);
}

const mapStateToProps = state => {
  return {
  	nodes: getDrugs(state.drugsByStatus.all.items[state.drugSelector[0]]),
  	links: state.drugSelector.length > 0 ? state.drugsByStatus.all.items[state.drugSelector] : []
  }
}

const DndTreeContainer = connect(
	mapStateToProps,
)(DndTree)

export default DndTreeContainer 