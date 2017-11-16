import { connect } from 'react-redux'
import { setFilter } from '../actions'
import ChooseStatus from '../components/modules/ChooseStatus'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
	return {
		onClickRadio: filter => {
			dispatch(setFilter(filter))
		}
	}
}

const ChooseStatusContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChooseStatus)

export default ChooseStatusContainer 