import React, { Component } from 'react'
import Tree from 'react-d3-tree';
import _ from 'lodash'

const svgNode = {
  shape: 'circle',
  shapeProps: {
    r: 10,
    x: -10,
    y: -10,
    fill: '#2c98f0',
    stroke: 'white'
  }
}

const styles = {
  links: {},
  nodes: {
    node: {
      circle: {
        r: 10,
        x: -10,
        y: -10,
        fill: '#2c98f0',
        stroke: 'white'
      },
      name: {},
      attributes: {},
    },
    leafNode: {
      circle: {
        r: 10,
        x: -10,
        y: -10,
        fill: 'red',
        stroke: 'white' 
      },
      name: {},
      attributes: {},
    },
  },
}

const InteractionProfile = ({ mainDrug = '', rules = ['', { drugs: [], rules: [] } ] }) => {
  let myTreeData = [
    {
      name: mainDrug,
      children: rules[1].drugs.filter(el => el != mainDrug).map(el => ({ name: el}))
    }
  ]

	for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
    let child = myTreeData[0].children[i]

    const interactions = rules[1].rules
    .filter(rule => rule.Drug1.name == child.name || rule.Drug2.name == child.name)
    .map(rule => rule.ADR)

    child.children = interactions.map(el => ({ name: el }))
  }

  return (
    <div id="treeWrapper">

      {
      mainDrug != '' &&
      <Tree data={myTreeData} 
        translate={{x: 50, y: 250}}
        styles={styles}
      />
      }

    </div>
  )
}

export default InteractionProfile;