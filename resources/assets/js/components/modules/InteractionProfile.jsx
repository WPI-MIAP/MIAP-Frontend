import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Tree from 'react-d3-tree'
import D3Tree from './D3Tree'
import axios from 'axios'
import _ from 'lodash'

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

export class InteractionProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTreeData: [{ name: '', children: [] }]
    }
  }

  componentDidMount() {
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

  componentWillReceiveProps(nextProps) {

    
    if(!nextProps.helpExample) {
      let mainDrug, myTreeData, rules, drugs, drugDMEs;
      if (nextProps.mainDrug != '' || 
        this.props.filter !== nextProps.filter || 
        this.props.maxScore !== nextProps.maxScore || 
        this.props.minScore !== nextProps.minScore
      ) {
        console.log('change');
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
              .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status, count: rule.id.split(',').length }))

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

          myTreeData[0].children = myTreeData[0].children.filter(c => ! _.isEmpty(c));

          console.log(myTreeData[0].children);
  
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
        console.log('change rule');
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
              .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status, count: rule.id.split(',').length }))


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
        });
  
      }
    }
  }

  render() {
    return (
      <div id="treeWrapper" width="100%" style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(this.props.mainDrug != '' || this.props.mainRule != '') ?
          <D3Tree scoreRange={this.props.scoreRange} 
            treeData={this.state.myTreeData}
            filter={this.props.filter}
            minScore={this.props.minScore}
            maxScore={this.props.maxScore}
          /> :
          <h4 style={{color: 'grey'}}>No interaction profiles are being selected</h4>
        }
      </div>
    )
  }
}
export default InteractionProfile;