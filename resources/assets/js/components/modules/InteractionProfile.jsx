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
        .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(dummyData.currentDrugs[0][1].drugDMEs, rule.ADR), status: rule.status }))

        child.children = interactions;
        child.maxScore = _.maxBy(interactions, o => o.Score).Score;
        child.maxScoreStatus = _.maxBy(interactions, o => o.Score).status;
      }

      this.state = {
        myTreeData
      };
    }
    else {
      this.state = {
        myTreeData: [{name: '', children: []}]
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    
    if(!nextProps.helpExample) {
      let mainDrug, myTreeData, rules, drugs, drugDMEs;
      if (nextProps.mainDrug != '') {
        mainDrug = nextProps.mainDrug
        axios.get('/csv/rules?drug=' + mainDrug).then(res => {
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
            .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
            .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status }))
  
            child.children = interactions;
            child.maxScore = _.maxBy(interactions, o => o.Score).Score;
            child.maxScoreStatus = _.maxBy(interactions, o => o.Score).status;
          }
  
          this.setState({
            myTreeData
          });
        });
      } 
  
      else if (nextProps.mainRule != '') {
        const drugNames = nextProps.mainRule.split(' --- ');
        mainDrug = drugNames[0];
        axios.get('/csv/rules?drug=' + drugNames[0] + '&drug=' + drugNames[1]).then(res => {
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
            .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
            .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(drugDMEs, rule.ADR), status: rule.status }))

            child.children = interactions;
            child.maxScore = _.maxBy(interactions, o => o.Score).Score;
            child.maxScoreStatus = _.maxBy(interactions, o => o.Score).status;
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
      <div id="treeWrapper" width="100%" style={{position: 'relative', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {(this.props.mainDrug != '' || this.props.mainRule != '') ?
          <D3Tree scoreRange={this.props.scoreRange} treeData={this.state.myTreeData}/> :
          <h4 style={{color: 'grey'}}>No interaction profiles are being selected</h4>
        }
      </div>
    )
  }
  // let myTreeData = [
  //   {
  //     name: _.capitalize(mainDrug),
  //     children: rules[1].drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
  //   }
  // ]


  // return (
  //   <div id="treeWrapper" width="100%" style={{position: 'relative', minHeight: '100%'}}>
  //     <D3Tree treeData={myTreeData} mainDrug={mainDrug} fullscreen={fullscreen}/>
  //   </div>
  // )
}
export default InteractionProfile;