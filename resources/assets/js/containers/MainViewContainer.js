import { connect } from 'react-redux'
import { fetchRules, fetchRulesByDrugName, clearSearchTerm, selectDrug, deleteDrug, selectRule, isUpdating, clearRule, fetchStatus } from '../actions'
import MainView from '../components/layouts/MainView'

const getIsFetching = (rules, filter) => {
		return rules.all.isFetching
}

const filterTreeView = (currentDrugs, sortByTerm) => {
	const currentDrugsArray = Object.keys(currentDrugs).map(function(key) {
		return [key, currentDrugs[key]];
	});

	switch (sortByTerm) {
		case 'latest':
			return currentDrugsArray.reverse()
		case 'name':
			return _.sortBy(currentDrugsArray, [function(o) { return o[0]; }]);
		case 'count':
			return _.sortBy(currentDrugsArray, [function(o) { return o[1].rules.length; }]).reverse();
		case 'severity':
			return _.sortBy(currentDrugsArray, [function(o) { return o[1].drugDMEs ? o[1].drugDMEs.length : 0; }]).reverse();
	}
}

const mapStateToProps = state => {
	return {
		isFetching: getIsFetching(state.rulesByStatus, state.visibilityFilter),
		links: state.rulesByStatus.all.rules,
		nodes: state.rulesByStatus.all.drugs,
		currentDrugs: filterTreeView(state.currentDrugs, state.treeViewSorting),
		selectedDrug: state.selectDrug,
		selectedRule: state.selectRule,
		filter: state.visibilityFilter,
		minScore: state.selectMinScore,
		maxScore: state.selectMaxScore,
		scoreRange: state.rulesByStatus.all.scoreRange,
		dmeRange: state.rulesByStatus.all.dmeRange,
		status: state.status,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onClickNode: drug => {
			dispatch(clearSearchTerm())
			dispatch(clearRule())
			dispatch(selectDrug(drug))
			dispatch(fetchRulesByDrugName(drug))
		},
		onClickEdge: rule => {
			dispatch(clearRule())
			dispatch(clearSearchTerm())
			dispatch(selectRule(rule));
		},
		showDetailNode: drug => {
			dispatch(clearSearchTerm())
			dispatch(selectDrug(drug))
		},
		deleteNode: drug => {
			dispatch(deleteDrug(drug))
		},
		isUpdating: value => {
			dispatch(isUpdating(value))
		},
		clearRule: () => {
			dispatch(clearRule());
		},
		clearSearchTerm: () => {
			dispatch(clearSearchTerm());
		},
		getStatus: () => {
			dispatch(fetchStatus())
		}
	}
}

const MainViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)

export default MainViewContainer


