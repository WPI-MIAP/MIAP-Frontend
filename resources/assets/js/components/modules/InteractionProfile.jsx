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
      name: {
        fontFamily: "Helvetica",
        fontWeight: 200,
        fontSize: 10
      },
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
      name: {
        fontFamily: "Helvetica",
        fontWeight: 200,
        fontSize: 10
      },
      attributes: {},
    },
  },
}

const InteractionProfile = ({ mainDrug = '', rules = ['', { drugs: [], rules: [] } ] }) => {
  let myTreeData = [
    {
      name: _.capitalize(mainDrug),
      children: rules[1].drugs.filter(el => el != mainDrug).map(el => ({ name: _.capitalize(el)}))
    }
  ]

	for (let i = 0; i < myTreeData[0].children.length; i = i + 1) {
    let child = myTreeData[0].children[i]

    const interactions = rules[1].rules
    .filter(rule => rule.Drug1.name == child.name || rule.Drug2.name == child.name)
    .map(rule => rule.ADR)

    child.children = interactions.map(el => ({ name: _.capitalize(el) }))
  }

  return (
    <div id="treeWrapper">

      {
      mainDrug != '' &&
      <Tree data={myTreeData} 
        translate={{x: 50, y: 250}}
        styles={styles}
        depthFactor={200}
        seperation={{ siblings: 1, nonSiblings: 2}}
      />
      }

    </div>
  )
}

export default InteractionProfile;