import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Tree from 'react-d3-tree';
import D3Tree from './D3Tree';
import _ from 'lodash'

const InteractionProfile = ({ mainDrug = '', rules = ['', { drugs: [], rules: [], drugDMEs: [] } ]}) => {
  let myTreeData = [
    {
      name: _.capitalize(mainDrug),
      children: rules[1].drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
    }
  ]

	for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
    let child = myTreeData[0].children[i]

    const interactions = rules[1].rules
    .filter(rule => _.capitalize(rule.Drug1.name) == child.name || _.capitalize(rule.Drug2.name) == child.name)
    .map(rule => ({ name: rule.ADR, Score: rule.Score, Rank: rule.Rank, critical: _.includes(rules[1].drugDMEs, rule.ADR), status: rule.status }))

    child.children = interactions;
    child.maxScore = _.maxBy(interactions, o => o.Score).Score;
    child.maxScoreStatus = _.maxBy(interactions, o => o.Score).status;
  }

  return (
    <div id="treeWrapper" width="100%">
      <D3Tree treeData={myTreeData} mainDrug={mainDrug} />
    </div>
  )
}

export default InteractionProfile;