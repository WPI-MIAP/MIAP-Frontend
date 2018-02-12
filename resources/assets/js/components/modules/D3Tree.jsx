import React, { Component } from 'react'
import * as d3 from 'd3'
import ReactDOM from 'react-dom';

export default class D3Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previousDrug: ''
    }
  }
  componentDidMount() {
    // const width = ReactDOM.findDOMNode(this).parentNode.clientWidth
    removeTree(ReactDOM.findDOMNode(this));
    // Render the tree usng d3 after first component mount
    if (this.props.treeData) {
      if (this.props.treeData[0].name !== "") {
        renderTree(this.props.treeData[0], ReactDOM.findDOMNode(this));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.treeData[0].children.length > 0) {
      if (this.state.previousDrug.toLowerCase() !== nextProps.treeData[0].name.toLowerCase()
      ) {
        console.log("state changed");
        this.setState({ previousDrug: nextProps.treeData[0].name });
        removeTree(ReactDOM.findDOMNode(this));
        renderTree(nextProps.treeData[0], ReactDOM.findDOMNode(this));
      }
    }
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

const renderTree = (treeData, svgDomNode) => {
  const margin = {top: 20, right: 10, bottom: 20, left: 100};
  const height = svgDomNode.parentNode.parentNode.parentNode.parentNode.parentNode.clientHeight
  console.log(svgDomNode.parentNode.parentNode.parentNode);
  const width = '100%';
  const duration = 750;
  const low_color="#fecc5c", low_med_color="#fd8d3c",  med_color="#f03b20", high_color= "hsl(0, 100%, 25%)"

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
          return "#A9B0B7";
        }
        else if(d.data.name === root.data.name) {
          return "#0069C0";
        }
        else if(d.data.maxScore) {
          const score = d.data.maxScore;
          if (score < 0 || score <= 0) {
            return "#E8BA54";
          }
          else if (score > 0 && score <= 0.01) {
            return "#E37E36";
          }
          else if (score > 0.01 && score <= 0.2) {
            return "#C2230C";
          }
          else if (score > 0.2) {
            return "#610000";
          }
        }
        else{
          return 'none';
        }
        // return d.data.Score ? "#A9B0B7" : "none";
      })

      .style("fill", d => {
        if (d.data.name === root.data.name) {
          // return '#5eafee';
          return '#2C98F0';
        }

        if (d.data.maxScore) {
          const score = d.data.maxScore;
          if (score < 0 || score <= 0) {
            return low_color;
          }
          else if (score > 0 && score <= 0.01) {
            return low_med_color;
          }
          else if (score > 0.01 && score <= 0.2) {
            return med_color;
          }
          else if (score > 0.2) {
            return high_color;
          }
        }

        if (d.data.critical) {
          return 'black';
        }

        return "white"
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
          const score = d.data.maxScore;
          if (score < 0 || score <= 0) {
            return low_color;
          }
          else if (score > 0 && score <= 0.01) {
            return low_med_color;
          }
          else if (score > 0.01 && score <= 0.2) {
            return med_color;
          }
          else if (score > 0.2) {
            return high_color;
          }
        }

        if (d.data.Score) {
          const score = d.data.Score;
          if (score < 0 || score <= 0) {
            return low_color;
          }
          else if (score > 0 && score <= 0.01) {
            return low_med_color;
          }
          else if (score > 0.01 && score <= 0.2) {
            return med_color;
          }
          else if (score > 0.2) {
            return high_color;
          } 
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

// var renderTree = function(treeData, svgDomNode) {
//     // Add the javascript code that renders the tree from
//     // http://bl.ocks.org/d3noob/8329404
//     // And replace the line that reads
//     // var svg = d3.select("body").append("svg")
//     // with 
//     // var svg = d3.select(svgDomNode)
// }