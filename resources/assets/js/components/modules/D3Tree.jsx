import React, { Component } from 'react'
import * as d3 from 'd3'
import ReactDOM from 'react-dom';
import * as _ from 'lodash'
import { generateColor, generateScoreBorderColor } from '../../utilities/functions';
import { baseNodeColor, baseNodeBorderColor, adrBorderColor, severeADRColor, regularADRColor } from '../../utilities/constants';


export default class D3Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previousDrug: '',
      previousData: ''
    }
  }
  componentDidMount() {
    // const width = ReactDOM.findDOMNode(this).parentNode.clientWidth
    removeTree(ReactDOM.findDOMNode(this));
    // Render the tree usng d3 after first component mount
    if (this.props.treeData) {
      if (this.props.treeData[0].name !== "") {
        renderTree(this.props.treeData[0], ReactDOM.findDOMNode(this), this.props.scoreRange);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.treeData[0].children.length > 0) {
      if (this.state.previousDrug.toLowerCase() !== nextProps.treeData[0].name.toLowerCase() ||
        (this.state.previousDrug.toLowerCase() === nextProps.treeData[0].name.toLowerCase() && 
        ! _.isEqual(this.state.previousData.children, nextProps.treeData[0].children)
        ) 
      ) {
        this.setState({ previousDrug: nextProps.treeData[0].name, previousData: nextProps.treeData[0] });
        removeTree(ReactDOM.findDOMNode(this));
        renderTree(nextProps.treeData[0], ReactDOM.findDOMNode(this), this.props.scoreRange);
      }
    // }
  }

  render() {
    // Render a blank svg node
    return (
      <svg></svg>
    );
  }

}

const removeTree = (svgDomNode) => {
  d3.select(svgDomNode).selectAll("*").remove();
}

const renderTree = (treeData, svgDomNode, scoreRange) => {
  const margin = {top: 20, right: 10, bottom: 20, left: 100};
  const height = svgDomNode.parentNode.parentNode.parentNode.parentNode.parentNode.clientHeight
  // console.log(treeData);
  const width = '100%';
  const duration = 750;

  let svg = d3.select(svgDomNode)
    .attr("width", width)
    .attr("height", height)
  
  let i = 0;
  let root;

  function zoom () {
    svgGroup.attr("transform", d3.event.transform);
  }

  var childCount = function(level, n) {
    if (n.children && n.children.length > 0) {
      if (levelWidth.length <= level + 1) levelWidth.push(0);

      levelWidth[level + 1] += n.children.length;
      n.children.forEach(function(d) {
        childCount(level + 1, d);
      });
    }
  };


  var levelWidth = [1];
  
  const zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  let zoomer = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoomListener);

  let svgGroup = svg.append("g");

  // svg.call(zoomListener);
  root = d3.hierarchy(treeData, d => d.children);

  childCount(0, root);

  let newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
  let treemap = d3.tree().size([newHeight, width]);
  root.x0 = height / 2;
  root.y0 = 0;

  const collapse = d => {
    if(d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
  }

  function centerNode(source) {
    let t = d3.zoomTransform(zoomer.node());
  
    let x =  t.x;
    let y = source.x0;
  
    y = -y *t.k + height / 2;
  
    svgGroup.transition()
     .duration(duration)
     .attr("transform", "translate(" + x + "," + y + ")scale(" + t.k + ")")
     .on("end", function(){ zoomer.call(zoomListener.transform, d3.zoomIdentity.translate(x,y).scale(t.k))});
  }

  function toggleChildren(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else if (d._children) {
        d.children = d._children;
        d._children = null;
    }
    return d;
  }

  const click = (d) => {
    d = toggleChildren(d);
    update(d);
    centerNode(d);
  };

  const update = source => {
    const treeData = treemap(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    treemap = treemap.size([newHeight, width]);

    const diagonal = (s, d) => {

      const path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`
  
      return path
    }

    d3.select('body').selectAll(".tooltip").remove();

    let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("display", "none")

    

    nodes.forEach(d => d.y = d.depth * 180);

    // Update the nodes...
    const node = svgGroup.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });


    // Enter any new modes at the parent's previous position.
    let nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 0)
      .style("fill", d => {
        return d._children ? "#5EAFEE" : "#fff";
      })


    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", d => {
          return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", d => {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });


    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', d => {
        if (d.data.maxScoreStatus === 'unknown' || d.data.name === root.data.name) {
          return 9;
        }
        return 4.5;
      })
      .style("stroke", d => {
        if(d.data.Score) {
          //border for ADR
          return adrBorderColor;
        }
        else if(d.data.name === root.data.name) {
          //border for base node
          return baseNodeBorderColor;
        }
        else if(d.data.maxScore) {
          //border for interior nodes
          return generateScoreBorderColor(d.data.maxScore, scoreRange);
        }
        else{
          return 'none';
        }
      })
      .on("mouseover", function (d) {
        if (d.depth === 0) return;
        div.transition().duration(500)
        div.style("left", (d3.event.pageX - 30) + "px")
          .style("top", (d3.event.pageY - 40) + "px")
          .style('display', 'block')
          .html(`Reports count: ${d.depth === 1 ? d.data.totalCount : d.data.count}`)
      })
      .on("mouseout", function (d) {
        console.log('mouseout')
        div.style("display", 'none');
      })

      .style("fill", d => {
        if (d.data.name === root.data.name) {
          //fill for base node
          return baseNodeColor;
        }

        if (d.data.maxScore) {
          //fill for interior nodes
          return generateColor(d.data.maxScore, scoreRange);
        }

        if (d.data.critical) {
          //fill for severe ADRs
          return severeADRColor;
        }

        //fill for regular ADRs
        return regularADRColor;
      })

      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", d => {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 0);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 0);

    // Update the links...
    let link = svgGroup.selectAll('path.link')
      .data(links, d => d.id);

    // Enter any new links at the parent's previous position.
    let linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', d => {
        const o = { x: source.x0, y: source.y0 }
        return diagonal(o, o)
      })
      
      .style("stroke", d => {
        if (d.data.maxScore) {
          return generateColor(d.data.maxScore, scoreRange);
        }

        if (d.data.Score) {
          return generateColor(d.data.Score, scoreRange);
        }
      })
      .style("stroke-width",
        d => d.data.maxScoreStatus === 'known' || d.data.status === 'known' ? "1px" : "3px"
      )
      .style("stroke-dasharray", 
        d => d.data.maxScoreStatus === 'known' || d.data.status === 'known' ? '5, 5' : 'none'
      )
      .style("fill", "none");

    // UPDATE
    let linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(duration)
      .attr('d', d => diagonal(d, d.parent));

    // Remove any exiting links
    var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', d => {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  svgGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  zoomer.call(zoomListener.transform, d3.zoomIdentity.translate(150, 0)); //This is to pad my svg by a 150px on the left hand side

  update(root);
  centerNode(root);
}