import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import Share from 'material-ui/svg-icons/social/share';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';
import { generateColor } from '../../utilities/functions';
import { complementaryColor, baseNodeColor } from '../../utilities/constants';
import PropTypes from 'prop-types';

const styles = {
	chip: {
		margin: 4,
		height: 32
	}
};

/**
 * This component holds chips that link to the report view for any drug or interaction that has been selected.
 */
class ReportChipContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reportChips: [],
			hover: false,
		};

		this.toggleHover = this.toggleHover.bind(this);
		this.renderChip = this.renderChip.bind(this);
		this.handleRequestDelete = this.handleRequestDelete.bind(this);
	}

	/**
	 * Determines whether a new chip should be added. Also determines whether chips representing drugs should be removed.
	 */
	componentWillReceiveProps(nextProps) {
		nextProps.currentDrugs.forEach(drug => {
			if (! _.find(this.state.reportChips, chip => (chip.drugs[0] == _.toLower(_.trim(drug[0])) && ! chip.drugs[1]))) {
				let chips = this.state.reportChips;
				chips.unshift({type: 'drug', drugs: [_.toLower(_.trim(drug[0]))]});
				this.setState({reportChips: chips});
			}
		})

		this.setState((prevState, props) => {
			return {
				reportChips: prevState.reportChips.filter(chip => {
					return _.find(props.currentDrugs, drug => (drug[0] == _.toLower(_.trim(chip.drugs[0])))) || chip.type == "adr"
				})
			}
		});

		if(this.props.selectedRule !== nextProps.selectedRule && nextProps.selectedRule !== undefined && 
			nextProps.selectedRule !== '') {
			var drugs = _.split(nextProps.selectedRule, '---').map((drug) => (_.toLower(_.trim(drug))));
			if(_.find(this.state.reportChips, chip => ((chip.drugs[0] == drugs[0] && chip.drugs[1] == drugs[1]) || (chip.drugs[0] == drugs[1] && chip.drugs[1] == drugs[0]))) == undefined) {
				var chips = this.state.reportChips;
				chips.unshift({type: 'adr', drugs: drugs});
				this.setState({reportChips: chips});
			}
		}	
	}

	/**
	 * Update state when hovering.
	 */
	toggleHover() {
		this.setState({ hover: !this.state.hover });
	}

	/**
	 * Remove the indicated chip from the container.
	 * 
	 * @param {object} key Object representing the chip to remove
	 */
	handleRequestDelete(key) {	
		this.reportChips = this.state.reportChips;
		const chipToDelete = this.reportChips.indexOf(key);
		this.reportChips.splice(chipToDelete, 1);
		this.setState({reportChips: this.reportChips});

		/**
		 * Clear rule or drug when deleting the currently selected one
		 */
		if (key.type === "drug") {
			this.props.deleteNode(key.drugs[0]);
			if (this.props.selectedDrug === key.drugs[0]) {
				this.props.clearSearchTerm();
			}
		}
		if (key.type === "adr" && this.props.selectedRule === key.drugs.join(' --- ')) {
			this.props.clearRule();
		}
	}

	/**
	 * Render an individual chip.
	 * 
	 * @param {object} report Object representing the drug or interaction.
	 */
	renderChip(report) {
		const title = report.type === 'drug' ? _.startCase(report.drugs[0]) : report.drugs.map((drug) => (_.startCase(drug))).join(" - ");
		const drug1 = report.drugs[0];
		const drug2 = report.drugs[1];

		const avatarColor = report.type === 'drug' ? baseNodeColor : generateColor(this.props.links.filter((link) => {
			var match = ((_.toLower(link.Drug1.name) === drug1 && _.toLower(link.Drug2.name) === drug2) || 
			(_.toLower(link.Drug1.name) === drug2 && _.toLower(link.Drug2.name) === drug1));
			return match;
		})[0].Score, this.props.scoreRange);
		return (
			<Chip
				key={title}
				onRequestDelete={() => this.handleRequestDelete(report)}
				style={styles.chip}
				onClick={() => this.props.handleOpen(report)}
				>
				{ report.type == 'drug' ?
				<Avatar backgroundColor={avatarColor} color="white" /> :
				<Avatar backgroundColor={avatarColor} color="white" icon={<Share />} />
				}
				{title}
			</Chip>
		);
	}

	/**
	 * Render the container component and all chips within it.
	 */
	render() {

		return (
			<Paper className='chipContainer' zDepth={1} style={{marginBottom: 10, display: 'flex'}}>
				<EditorInsertChart color={complementaryColor} style={{height: 52, width: 52}}/>
				<h4 style={{margin: 'auto', marginRight: 10}}>Reports</h4>
				<div style={{ 
					height: 52, 
					width: '100%', 
					overflowX: 'auto',
					overflowY: 'hidden', 
					whiteSpace: 'nowrap', 
					display: 'flex', 
				}}
					onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}
				>
					{this.state.reportChips.map(this.renderChip, this)}
				</div>
			</Paper>
		);
	}
}

ReportChipContainer.propTypes = {
	/**
	 * Array of the currently selected drugs (i.e. the drugs found in the Galaxy View)
	 */
	currentDrugs: PropTypes.array.isRequired,

	/**
	 * Array of the links between all drugs that interact with eachother.
	 */
	links: PropTypes.array.isRequired,

	/**
	 * Name of the currently selected drug.
	 */
	selectedDrug: PropTypes.string.isRequired,

	/**
	 * Name of the currently selected rule.
	 */
	selectedRule: PropTypes.string.isRequired,

	/**
	 * Removes the drug from the Galaxy View.
	 */
	deleteNode: PropTypes.func.isRequired,

	/**
	 * Remove the currently selected drug from the Interaction Profile.
	 */
	clearSearchTerm: PropTypes.func.isRequired,

	/**
	 * Remove the currently selected rule from the Interaction Profile.
	 */
	clearRule: PropTypes.func.isRequired,

	/**
	 * Distribution of scores used to generate color.
	 */
	scoreRange: PropTypes.array.isRequired,

	/**
	 * Open reports for a given drug or interaction.
	 */
	handleOpen: PropTypes.func.isRequired
};
  
  export default ReportChipContainer;