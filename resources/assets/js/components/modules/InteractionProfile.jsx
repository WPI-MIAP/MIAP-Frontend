import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Tree from 'react-d3-tree'
import D3Tree from './D3Tree'
import axios from 'axios'
import _ from 'lodash'

export class InteractionProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myTreeData: [{name: '', children: []}]
    };
  }

  componentWillReceiveProps(nextProps) {
    let mainDrug, myTreeData, rules, drugs;
    if (nextProps.mainDrug != '') {
      mainDrug = nextProps.mainDrug
      axios.get('/csv/rules?drug=' + mainDrug).then(res => {
        rules = res.data.rules;
        drugs = res.data.drugs;
        myTreeData = [{
          name: _.capitalize(mainDrug),
          children: drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
        }]

        for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
          let child = myTreeData[0].children[i]

          const interactions = rules
          .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
          .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(rules.drugDMEs, rule.ADR), status: rule.status }))

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
      const drugNames = nextProps.mainRule.split(' ');
      mainDrug = drugNames[0];
      axios.get('/csv/rules?drug=' + drugNames[0] + '&drug=' + drugNames[1]).then(res => {
        rules = res.data.rules;
        drugs = res.data.drugs;
        myTreeData = [{
          name: _.capitalize(mainDrug),
          children: drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
        }]

        for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
          let child = myTreeData[0].children[i]

          const interactions = rules
          .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
          .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(rules.drugDMEs, rule.ADR), status: rule.status }))

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

  render() {
    return (
      <div id="treeWrapper" width="100%">
        <D3Tree treeData={this.state.myTreeData}/>
      </div>
    )
  }
  // let myTreeData = [
  //   {
  //     name: _.capitalize(mainDrug),
  //     children: rules[1].drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
  //   }
  // ]

}

export default InteractionProfile;