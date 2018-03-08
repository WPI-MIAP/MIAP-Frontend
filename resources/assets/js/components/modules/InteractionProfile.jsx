import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tree from 'react-d3-tree';
import D3Tree from './D3Tree';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * This data is used to construct the simplified version of the Interaction Profile found in the help menu.
 */
const dummyData = {
  currentDrugs: [
    ['Drug 2', {drugs: ['Drug 1', 'Drug 2', 'Drug 3'], 
      rules: [
        {
          Rank: "408",
          Score: 0.089384071,
          ADR: "ADR 1",
          r_Drugname: "[Drug 1] [Drug 2]",
          Support: 15,
          Confidence: 30,
          Drug1: {
            id: 0,
            name: "Drug 1"
          },
          Support1: 12,
          Confidence1: 21.8182,
          Drug2: {
            id: 1,
            name: "Drug 2"
          },
          Support2: 34,
          Confidence2: 9.65909,
          status: "unknown",
          id: "1, 2, 4, 6"
        },
        {
          Rank: "702",
          Score: 0.314159265,
          ADR: "ADR 2",
          r_Drugname: "[Drug 2] [Drug 3]",
          Support: 45,
          Confidence: 60,
          Drug1: {
            id: 1,
            name: "Drug 2"
          },
          Support1: 19,
          Confidence1: 21.8182,
          Drug2: {
            id: 2,
            name: "Drug 3"
          },
          Support2: 56,
          Confidence2: 11.1241,
          status: "known",
          id: "3, 5, 7, 9, 11, 37"
        }
      ],
    drugDMEs: ["ADR 2"]}]
  ],
  selectedDrug: 'Drug 2',
};

/**
 * This component is a wrapper for the D3Tree component. It controls what nodes/links are passed to the D3Tree, applying all filters.
 */
class InteractionProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTreeData: [{ name: '', children: [] }],
      domNode: null
    }
  }

  /**
   * If this is the version used in the help example, populate the view using dummy data.
   */
  componentDidMount() {
    this.setState({domNode: ReactDOM.findDOMNode(this)});
    if(this.props.helpExample) {
      //use dummy data if it is the help example
      let mainDrug, myTreeData, rules, drugs;
      myTreeData = [{
        name: _.capitalize(dummyData.selectedDrug),
        children: dummyData.currentDrugs[0][1].drugs.filter(el => el != dummyData.selectedDrug).map(el => ({ name: _.capitalize(el)}))
      }]

      rules = dummyData.currentDrugs[0][1].rules;

      for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
        let child = myTreeData[0].children[i];

        const interactions = rules
        .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
        .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(dummyData.currentDrugs[0][1].drugDMEs, rule.ADR), status: rule.status, count: rule.id.split(',').length }))

        if (interactions.length === 0) {
          myTreeData[0].children[i] = {}
        } else {
          child.children = interactions; 
          let sortedInteractions = _.orderBy(interactions, ['status', 'Score'], ['desc', 'desc']);
          child.maxScore = sortedInteractions[0] ? sortedInteractions[0].Score : -2;
          child.maxScoreStatus = sortedInteractions[0] ? sortedInteractions[0].status : -2;
          child.totalCount = _.sumBy(interactions, i => i.count);
        }
      }

      this.setState({
        myTreeData
      });
    }

  }

  /**
   * If this is the version not in the help menu, retrieve the relevant rules and drugs to display whenever props are received.
   */
  componentWillReceiveProps(nextProps) {
    
    if(!nextProps.helpExample) {
      let mainDrug, myTreeData, rules, drugs, drugDMEs;
      if (nextProps.mainDrug != '' || 
        this.props.filter !== nextProps.filter || 
        this.props.maxScore !== nextProps.maxScore || 
        this.props.minScore !== nextProps.minScore
      ) {
        mainDrug = nextProps.mainDrug
        axios.get('/csv/rules?drug=' + mainDrug + '&status=' + nextProps.filter).then(res => {
          rules = res.data.rules;
          drugs = res.data.drugs;
          drugDMEs = res.data.drugDMEs;
          myTreeData = [{
            name: _.capitalize(mainDrug),
            children: drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
          }]
  
          for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
            let child = myTreeData[0].children[i]
  
            const interactions = rules
              .filter(rule => (_.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name) &&
                rule.Score >= nextProps.minScore && rule.Score <= nextProps.maxScore
              )
              .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status, reports: _.filter(_.map(rule.id.split(','), r => _.trim(r)), r => (r !== '')), count: _.filter(rule.id.split(','), r => (r !== '')).length }))

            if (interactions.length === 0) {
              myTreeData[0].children[i] = {}
            } else {
              child.children = interactions; 
              let sortedInteractions = _.orderBy(interactions, ['status', 'Score'], ['desc', 'desc']);
              child.maxScore = sortedInteractions[0] ? sortedInteractions[0].Score : -2;
              child.maxScoreStatus = sortedInteractions[0] ? sortedInteractions[0].status : -2;

              // perform set union of all reports for any ADR between two drugs
              var allReports = [];
              interactions.forEach(i => {
                i.reports.forEach(r => {
                  if(allReports.indexOf(r) == -1) {
                    allReports.push(r);
                  }
                });
              });
              child.totalCount = allReports.length;//_.sumBy(interactions, i => i.count);
            }
          }

          myTreeData[0].children = myTreeData[0].children.filter(c => ! _.isEmpty(c));
  
          this.setState({
            myTreeData
          });
        });
      } 
  
      else if(nextProps.mainRule != '' ||
        this.props.filter !== nextProps.filter ||
        this.props.maxScore !== nextProps.maxScore ||
        this.props.minScore !== nextProps.minScore
      ) {        
        const drugNames = nextProps.mainRule.split(' --- ');
        mainDrug = drugNames[0];
        axios.get('/csv/rules?drug=' + drugNames[0] + '&drug=' + drugNames[1] + '&status=' + nextProps.filter).then(res => {
          rules = res.data.rules;
          drugDMEs = res.data.drugDMEs;
          drugs = res.data.drugs;
          myTreeData = [{
            name: _.capitalize(mainDrug),
            children: drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
          }]
  
          for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
            let child = myTreeData[0].children[i]
  
            const interactions = rules
              .filter(rule => (_.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name) &&
                rule.Score >= nextProps.minScore && rule.Score <= nextProps.maxScore
              )
              .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status, reports: _.filter(_.map(rule.id.split(','), r => _.trim(r)), r => (r !== '')), count: _.filter(rule.id.split(','), r => (r !== '')).length }))


            if (interactions.length === 0) {
              myTreeData[0].children[i] = {}
            } else {
              child.children = interactions;
              let sortedInteractions = _.orderBy(interactions, ['status', 'Score'], ['desc', 'desc']);
              child.maxScore = sortedInteractions[0] ? sortedInteractions[0].Score : -2;
              child.maxScoreStatus = sortedInteractions[0] ? sortedInteractions[0].status : -2;
              // perform set union of all reports for any ADR between two drugs
              var allReports = [];
              interactions.forEach(i => {
                i.reports.forEach(r => {
                  if(allReports.indexOf(r) == -1) {
                    allReports.push(r);
                  }
                });
              });
              child.totalCount = allReports.length;
            }
          }
  
          this.setState({
            myTreeData
          });
        });
  
      }
    }
  }

  render() {
    return (
      <div id="treeWrapper" width="100%" style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(this.props.mainDrug != '' || this.props.mainRule != '') ?
          <D3Tree 
            scoreRange={this.props.scoreRange} 
            treeData={this.state.myTreeData}
            filter={this.props.filter}
            minScore={this.props.minScore}
            maxScore={this.props.maxScore}
            width={(this.state.domNode !== null) ? this.state.domNode.clientWidth : 0}
            height={(this.state.domNode !== null) ? this.state.domNode.clientHeight : 0}
          /> :
          <h4 style={{color: 'grey'}}>No interaction profiles are being selected</h4>
        }
      </div>
    )
  }
}

InteractionProfile.propTypes = {
  /**
   * Indicates whether this is the version found in the help menu (defaults to false).
   */
  helpExample: PropTypes.bool,

  /**
	 * Array of score boundaries, indicating how to color nodes/edges based on score.
	 */
  scoreRange: PropTypes.array.isRequired,

  /**
	 * Name of the currently selected drug.
	 */
  mainDrug: PropTypes.string,
 
  /**
	 * Name of the currently selected rule (of format: drug_1 --- drug_2).
	 */
  mainRule: PropTypes.string,

  /**
	 * Can be 'all', 'known', or 'unkown'. Corresponds to filtering interactions by known/unknown.
	 */
  filter: PropTypes.string,

  /**
	 * Minimum score for filtering interactions.
	 */
  minScore: PropTypes.number,

  /**
	 * Maximum score for filtering interactions.
	 */
  maxScore: PropTypes.number
};

InteractionProfile.defaultProps = {
  helpExample: false,
  filter: 'all',
  minScore: -50,
  maxScore: 50
};

export default InteractionProfile;