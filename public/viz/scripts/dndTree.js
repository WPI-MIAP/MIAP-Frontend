/* to draw the profile view, can be based on a drug or an interaction so check variable is a flag to decide*/

function draw_zoom_tree(data, div_id, check){
    // console.log(data)

    var w = $(div_id).innerWidth()
    var h = $(div_id).innerHeight()

    new ResizeSensor($(div_id), function(){
        console.log('resize')
        resize();
    }); 

    /*before drawing new profle, remove previous*/
    d3.selectAll( div_id + " > svg").remove();

    /*define few variables*/
    var check_target =0, total_Score=0, source_node = 0, max_Score=0, local_st=null
    var global_st=null;
    var Score = null
    var stat= null
    var support=null
    var min_Score = -0.1;
    var max_Score = 1;
    var max_link_score=0;
    var treeData; 
            // var low_color="hsl(0, 100%, 80%)", med_color="hsl(0, 100%, 64%)", high_color= "hsl(0, 100%, 25%)"
            var low_color="#fecc5c", low_med_color="#fd8d3c",  med_color="#f03b20", high_color= "hsl(0, 100%, 25%)"

            // var color = d3.scale.linear()
            //               .domain([min_Score, (min_Score+max_Score)/2, max_Score])
            //               .range(["#fcae91","#de2d26", "#a50f15"]);

            var default_link_color = "grey";
            /*for profile view we need data in parent children format
            Note that--here only the last layer has information such as status and Score so we need to copy that to other layers*/

            /*A DDI has different data structure than a drug that is why we have if-else*/

            if(check=='DDI'){
               treeData = { "name": data.drug1, "Score":Score, "st":stat, "support": support, "children":
                                // data.values.map(function(drugs){
                                   [{ "name": data.drug2, "Score":Score, "st":stat,"support": support,"children": 
                                   data.values.map( function(ADRs){
                                        // console.log(ADRs)
                                        // Score = ADRs.Score;
                                        // stat = ADRs.st;
                                        // console.log("ADRs")
                                        return { "name": ADRs.ADR, "Score":+(d3.round(ADRs.Score,4)), "st":ADRs.status, "support":ADRs.Support, "severity":ADRs.severity
                                         }; //end of ADR
                                      }) //end of ADRs
                                    }] //end of drug_Values 
                                // })  //end of drugs
                              }  // end of root key

                          }
                          else{
                           treeData = { "name": data.key, "Score":Score, "st":stat,"support": support, "children":
                           data.values.map(function(drugs){
                            return { "name": drugs.key, "Score":Score, "support": support,"st":stat,"children": 
                            drugs.values.map( function(ADRs){
                                        // console.log(ADRs)fill
                                        // Score = ADRs.Score;
                                        // stat = ADRs.st;
                                        // console.log(ADRs.st)
                                        return { "name": ADRs.ADR, "Score":+(d3.round(ADRs.Score,4)), "st":ADRs.status, "support":ADRs.Support, "severity":ADRs.severity
                                         }; //end of ADR
                                      }) //end of ADRs
                                    } //end of drug_Values 
                                })  //end of drugs
                              }  // end of root key

                          }


            // Calculate total nodes, max label length
            var totalNodes = 0;
            var maxLabelLength = 0;
            // variables for drag/drop
            var selectedNode = null;
            var draggingNode = null;
            // panning variables
            var panSpeed = 200;
            var panBoundary = 20; // Within 20px from edges will pan when dragging.
            // Misc. variables
            var i = 0;
            var duration = 750;
            var root;

            // size of the diagram
            // var viewerWidth = $(div_id).width();
            // console.log(viewerWidth)

            // if ($(div_id).width() > 200)
            var viewerWidth =  $(div_id).width();
            // else
                // var viewerWidth =  1000;

                if ($(div_id).height() > 0)
                    var viewerHeight =  $(div_id).height()
                else
                    var viewerHeight =  $(div_id).height()

            // console.log(viewerWidth,viewerHeight)

            var tree = d3.layout.tree()
            .size([viewerHeight, viewerWidth-200]);
                // console.log(viewerWidth, $(div_id).width())

            // define a d3 diagonal projection for use by the node paths later on.
            var diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

            // A recursive helper function for performing some setup by walking through all nodes

            function visit(parent, visitFn, childrenFn) {
                if (!parent) return;

                visitFn(parent);

                var children = childrenFn(parent);
                if (children) {
                    var count = children.length;
                    for (var i = 0; i < count; i++) {
                        visit(children[i], visitFn, childrenFn);
                    }
                }
            }

            // Call visit function to establish maxLabelLength
            visit(treeData, function(d) {
                totalNodes++;
                maxLabelLength = Math.max(d.name.length, maxLabelLength);

            }, function(d) {
                return d.children && d.children.length > 0 ? d.children : null;
            });


            // sort the tree according to the node names

            function sortTree() {
                tree.sort(function(a, b) {
                    return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
                });
            }
            // Sort the tree initially incase the JSON isn't in a sorted order.
            sortTree();

            // TODO: Pan function, can be better implemented.

            var div = d3.select("body")
            .append("div")
            .attr("class", "toolTip");

            /*behavior on panning the visualization*/             

            function pan(domNode, direction) {
                var speed = panSpeed;
                if (panTimer) {
                    clearTimeout(panTimer);
                    translateCoords = d3.transform(svgGroup.attr("transform"));
                    if (direction == 'left' || direction == 'right') {
                        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                        translateY = translateCoords.translate[1];
                    } else if (direction == 'up' || direction == 'down') {
                        translateX = translateCoords.translate[0];
                        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                    }
                    scaleX = translateCoords.scale[0];
                    scaleY = translateCoords.scale[1];
                    scale = zoomListener.scale();
                    svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                    d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                    zoomListener.scale(zoomListener.scale());
                    zoomListener.translate([translateX, translateY]);
                    panTimer = setTimeout(function() {
                        pan(domNode, speed, direction);
                    }, 50);
                }
            }

            function resize() {
            // console.log('resize')
                // var width = window.innerWidth, height = window.innerHeight;
                var width = $('#div_profile').innerWidth()
                var height = $('#div_profile').innerHeight()
                baseSvg.attr("width", width).attr("height", height);
                
                // tree.size([tree.size()[0]+(width-w)/zoom.scale(),tree.size()[1]+(height-h)/zoom.scale()]);
                w = width;
                h = height;
            }

            // Define the zoom function for the zoomable tree

            function zoom() {
                svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }


            // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
            var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

            function initiateDrag(d, domNode) {
                draggingNode = d;
                d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
                d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
                d3.select(domNode).attr('class', 'node activeDrag');

                svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
                    if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                    else return -1; // a is the hovered element, bring "a" to the front
                });
                // if nodes has children, remove the links and nodes
                if (nodes.length > 1) {
                    // remove link paths
                    links = tree.links(nodes);
                    nodePaths = svgGroup.selectAll("path.link")
                    .data(links, function(d) {
                        return d.target.id;
                    }).remove();
                    // remove child nodes
                    nodesExit = svgGroup.selectAll("g.node")
                    .data(nodes, function(d) {
                        return d.id;
                    }).filter(function(d, i) {
                        if (d.id == draggingNode.id) {
                            return false;
                        }
                        return true;
                    }).remove();
                }

                // remove parent link
                parentLink = tree.links(tree.nodes(draggingNode.parent));
                svgGroup.selectAll('path.link').filter(function(d, i) {
                    if (d.target.id == draggingNode.id) {
                        return true;
                    }
                    return false;
                }).remove();
                dragStarted = null;
            }

            // define the baseSvg, attaching a class for styling and the zoomListener
            var baseSvg;

            baseSvg = d3.select(div_id).append("svg")
            .attr("width", viewerWidth+200)
            .attr("height", viewerHeight)
            .attr("class", "overlay")
            .call(zoomListener);

            
            // Define the drag listeners for drag/drop behaviour of nodes.
            dragListener = d3.behavior.drag()
            .on("dragstart", function(d) {
                if (d == root) {
                    return;
                }
                dragStarted = true;
                nodes = tree.nodes(d);
                d3.event.sourceEvent.stopPropagation();
                    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                })
            .on("drag", function(d) {
                if (d == root) {
                    return;
                }
                if (dragStarted) {
                    domNode = this;
                        // initiateDrag(d, domNode);
                    }

                    // get coords of mouseEvent relative to svg container to allow for panning
                    relCoords = d3.mouse($('svg').get(0));
                    if (relCoords[0] < panBoundary) {
                        panTimer = true;
                        pan(this, 'left');
                    } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                        panTimer = true;
                        pan(this, 'right');
                    } else if (relCoords[1] < panBoundary) {
                        panTimer = true;
                        pan(this, 'up');
                    } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                        panTimer = true;
                        pan(this, 'down');
                    } else {
                        try {
                            clearTimeout(panTimer);
                        } catch (e) {

                        }
                    }

                    d.x0 += d3.event.dy;
                    d.y0 += d3.event.dx;
                    var node = d3.select(this);
                    node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
                    updateTempConnector();
                }).on("dragend", function(d) {
                    if (d == root) {
                        return;
                    }
                    domNode = this;
                    if (selectedNode) {
                        // now remove the element from the parent, and insert it into the new elements children
                        var index = draggingNode.parent.children.indexOf(draggingNode);
                        if (index > -1) {
                            draggingNode.parent.children.splice(index, 1);
                        }
                        if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                            if (typeof selectedNode.children !== 'undefined') {
                                selectedNode.children.push(draggingNode);
                            } else {
                                selectedNode._children.push(draggingNode);
                            }
                        } else {
                            selectedNode.children = [];
                            selectedNode.children.push(draggingNode);
                        }
                        // Make sure that the node being added to is expanded so user can see added node is correctly moved
                        expand(selectedNode);
                        sortTree();
                        endDrag();
                    } else {
                        endDrag();
                    }
                });

                function endDrag() {
                    selectedNode = null;
                    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
                    d3.select(domNode).attr('class', 'node');
                // now restore the mouseover event or we won't be able to drag a 2nd time
                d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
                updateTempConnector();
                if (draggingNode !== null) {
                    update(root);
                    centerNode(draggingNode);
                    draggingNode = null;
                }
            }

            // Helper functions for collapsing and expanding nodes.

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            function expand(d) {
                if (d._children) {
                    d.children = d._children;
                    d.children.forEach(expand);
                    d._children = null;
                }
            }

            var overCircle = function(d) {
                selectedNode = d;
                updateTempConnector();
            };
            var outCircle = function(d) {
                selectedNode = null;
                updateTempConnector();
            };

            // Function to update the temporary connector indicating dragging affiliation
            var updateTempConnector = function() {
                var data = [];
                if (draggingNode !== null && selectedNode !== null) {
                    // have to flip the source coordinates since we did this for the existing connectors on the original tree
                    console.log("HI",selectedNode)
                    data = [{
                        source: {
                            x: selectedNode.y0,
                            y: selectedNode.x0,
                            // st: selectedNode.
                        },
                        target: {
                            x: draggingNode.y0,
                            y: draggingNode.x0
                        }
                    }];
                }
                var link = svgGroup.selectAll(".templink").data(data);

                link.enter().append("path")
                .attr("class", "templink")
                .attr("d", d3.svg.diagonal())
                .attr('pointer-events', 'none')


                link.attr("d", d3.svg.diagonal()/3);

                link.exit().remove();
            };

            // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

            function centerNode(source) {
                scale = zoomListener.scale();
                x = -source.y0;
                y = -source.x0;
                // x = x * scale + viewerWidth / 2;

                x = x * scale + viewerWidth / 2;
                y = y * scale + viewerHeight / 2;
                d3.select('g').transition()
                .duration(duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
                zoomListener.scale(scale);
                zoomListener.translate([x, y]);
            }

            // Toggle children function

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

            // Toggle children on click.

            function click(d) {
                if (d3.event.defaultPrevented) return; // click suppressed
                d = toggleChildren(d);
                update(d);
                centerNode(d);
            }

            function update(source) {
                // Compute the new height, function counts total children of root node and sets tree height accordingly.
                // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
                // This makes the layout more consistent.
                var levelWidth = [1];
                var childCount = function(level, n) {

                    if (n.children && n.children.length > 0) {
                        if (levelWidth.length <= level + 1) levelWidth.push(0);

                        levelWidth[level + 1] += n.children.length;
                        n.children.forEach(function(d) {
                            childCount(level + 1, d);
                        });
                    }
                };
                childCount(0, root);
                var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
                tree = tree.size([newHeight, viewerWidth-200]);

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

                // Set widths between levels based on maxLabelLength.
                nodes.forEach(function(d) {
                    // console.log(d.depth, maxLabelLength)
                    // d.y = (d.depth * (70));
                    if (maxLabelLength > 30)
                        d.y = d.depth * 150
                    else
                        d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                    // alternatively to keep a fixed scale one can set a fixed depth per level
                    // Normalize for fixed-depth by commenting out below line
                    // d.y = (d.depth * 500); //500px per level.
                });

                // Update the nodes…
                node = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    // .call(dragListener)
                    .attr("class", "node")
                    .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on('click', click);

                    /*color encoding for the layers.. as only children has the Score and status we need to copy it to the parents and decide which color*/    

                    nodeEnter.append("circle")
                    .attr('class', 'nodeCircle')
                    .attr("r", 0)
                    // .style("stroke","none")
                    .style("stroke", function(d, i){

                        if(source_node==0){
                            max_Score = d.Score;
                        }
                        
                        if(!d.children) {
                            total_Score = total_Score+d.Score 
                            d.parent.Score == total_Score 

                            if(d.Score> max_Score)
                                max_Score = d.Score
                            source_node =source_node+1 
                        }

                        if(d.parent && d.children){
                            // console.log(source_node, max_Score)
                            total_Score = 0
                            source_node =0
                            d.Score= max_Score
                            // max_Score = -1
                        }   

                        if (!d.parent) {
                            return "#2196f3"
                            source_node=0;
                        }

                        else{
                            if(!d.children && d.severity=='severe'){
                                     // console.log(d)
                                     return "#8585ad" //"#6a51a3" ;//"#8585ad"
                                     // return "#8856a7";
                                 }
                                 else if(!d.children && d.severity!=='severe'){
                                 // console.log(d)
                                 return "#A9A9A9";  // "#fed98e";
                                 // return "#2b8cbe"
                             }
                             else{
                                if(d.children || d._children ){
                                    if (d.Score<0 || d.Score<=0)
                                        return low_color;
                                    else if (d.Score>0 && d.Score<=0.01)
                                        return low_med_color;
                                    else if (d.Score>0.01 && d.Score<=0.2)
                                        return med_color;
                                    else if (d.Score>0.2)
                                        return high_color;
                                }
                                else
                                    return "#8585ad"; 

                            }
                        }
                    })
                    
                    nodeEnter.append("text")
                    .attr("x", function(d) {
                        return d.children || d._children ? -10 : 10;
                    })
                    .attr("dy", "-0.15em")
                    .attr('class', 'nodeText')
                    .attr("text-anchor", function(d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function(d) {
                        return d.name;
                    })
                    .style("fill-opacity", 0);

                // phantom node to give us mouseover in a radius around it
                nodeEnter.append("circle")
                .attr('class', 'ghostCircle')
                .attr("r", 30)
                    .attr("opacity", 0.2) // change this to zero to hide the target area
                    .style("fill", "red")
                    .attr('pointer-events', 'mouseover')
                    .on("mouseover", function(node) {
                        overCircle(node);
                    })
                    .on("mouseout", function(node) {
                        outCircle(node);
                    });

                // Update the text to reflect whether node has children or not.
                node.select('text')
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("font-size", function(d){
                    if (!d.parent)
                        return "16px"
                })  .style("font-weight", function(d){
                    if (!d.parent)
                        return "bold"
                });

                // Change the circle fill depending on whether it has children and is collapsed
                /*encoding for the size of the circle based on its status*/
                node.select("circle.nodeCircle")
                    // .attr("r", 15)
                    .attr("r", function(d,i) {
                      if(!d.children) {
                           // console.log(d)
                           if(d.st && d.st=="unknown")
                            d.parent.st = d.st 
                        return 5;

                    }
                    if(!d.parent){
                        return 5;
                    }
                    if(d.parent && d.children){
                        if(d.st=="unknown")
                            return 10;
                        else
                            return 5;
                    }  

                    if(!d.parent && d._children){
                            // return "green"
                            return 5;
                        }
                        if(!d.children &d.parent){
                            console.log(d)
                            if(d.parent.st==null){
                                if(d.st=="known")
                                    return 5;
                            }
                            
                        }
                        if (d.st=="unknown")
                            return 10;
                        else if (d.st=="known")
                            return 5;

                    })
                    .style("fill", function(d,i) {

                        if(source_node==0|| i==0){
                            max_Score = d.Score;
                        }
                        if(!d.children) {
                            total_Score = total_Score+d.Score 
                            if(parent.Score)
                               d.parent.Score == total_Score 

                           if(d.Score> max_Score)
                            max_Score = d.Score
                        source_node =source_node+1 
                    }
                    if(d.parent && d.children){
                            // console.log(source_node, max_Score)
                            total_Score = 0
                            source_node =0
                            d.Score= max_Score
                            // max_Score = -1
                        }  
                        if (!d.parent && !d._children) {
                            // console.log(d._children)
                            source_node=0;
                            // return "#fff"
                            return "#2196f3";
                            
                        }
                        else if(!d.parent && d._children){
                            // return "green"
                            return "#2196f3";
                        }
                        
                        else
                        {
                                    // console.log(d)
                                    if(!d.children && d.severity=='severe'){
                                     // console.log(d)
                                     return "#8585ad" //'#6a51a3'; 
                                     // return "#8856a7";
                                 }
                                 else if(!d.children && d.severity=='not severe'){
                                     // console.log(d)
                                     return "#fff" // "#A9A9A9"; //"#fed98e"
                                     // return "#fff"
                                 }
                                 else
                                    // return  color(d.Score) 
                                    //d._children  ? color(d.Score): "#fff"; 
                                    {
                                        if (d.Score<0 || d.Score<=0)
                                            return low_color;
                                        else if (d.Score>0 && d.Score<=0.01)
                                            return low_med_color;
                                        else if (d.Score>0.01 && d.Score<=0.2)
                                            return med_color;
                                        else if (d.Score>0.2)
                                            return high_color;
                                    }
                                }
                            });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

                // Fade the text in
                nodeUpdate.select("text")
                .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

                nodeExit.select("circle")
                .attr("r", 0);

                nodeExit.select("text")
                .style("fill-opacity", 0);
                
                
                // Update the links…
                var link = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0,

                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .style("stroke-width",function(d,i){
                        // console.log(d.target.st)

                        if (!d.target.children && d.target.st){
                            if(d.target.parent.st == "unknown")
                                d.target.parent.st = "unknown"
                            else
                                d.target.parent.st = d.target.st                               

                        }

                        if (d.target.st=='known')
                            return 2;
                        else 
                            if(d.target.st=='unknown')
                                return 5;
                        })
                .style("stroke-dasharray",function(d,i) {
                    if (!d.target.children && d.target.st){
                        if(d.target.parent.st == "unknown")
                            d.target.parent.st = "unknown"
                        else
                            d.target.parent.st = d.target.st                               

                    }

                    if (d.target.st=='known')
                        return ("3,3");
                         // else 
                         
                         //    return ("3,0");
                     })

                .style("stroke", function(d,i){
                    console.log(d)
                    if(i==0 && d.target.Score!==null){
                        max_link_score = +(d.target.Score)
                    }   

                    if(d.target.Score > max_link_score){
                        max_link_score = d.target.Score
                    }

                    if(d.source.Score==null && d.target.Score==null){
                        d.source.Score = max_link_score;
                        d.target.Score=  max_link_score;
                        max_link_score =0;
                    }   

                    if (d.target.Score<0 || d.target.Score<=0)
                          // console.log(d.Score)
                      return low_color;
                      else if (d.target.Score>0 && d.target.Score<=0.01)
                        return low_med_color;
                    else if (d.target.Score>0.01 && d.target.Score<=0.2)
                        return med_color;
                    else if (d.target.Score>0.2)
                        return high_color;
                            // else return 2; 

                        })
                .style('opacity', function(d){
                        // console.log(d.target.st)
                        // if (d.target.st=='known' && status == 'known')
                        //         return 1;
                        // else if(d.target.st=='unknown' && status == 'unknown')
                        //         return 1
                        // else
                        //     return 0;
                    })
                .on("mousemove", function(d){
                            // console.log(d)
                            if(!d.target.children){ //console.log(d.target.parent.support)
                                d.target.parent.support= d.target.support
                                if(d.target.parent.parent)
                                   d.target.parent.parent.support=d.target.support
                                // support = d.target.support
                            }
                            support = d.target.support
                            div.style("left", d3.event.pageX+10+"px");
                            div.style("top", d3.event.pageY-25+"px");
                            div.style("display", "inline-block");
                            div.html("Report Count: " + (support) +"<br>");
                        })

                .on("mouseout", function(d){
                    div.style("display", "none");
                });;




                // Transition links to their new position.
                link.transition()
                .duration(duration)
                .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            // Append a group which holds all nodes and which the zoom Listener can act upon.
            var svgGroup = baseSvg.append("g").attr("id","zoom");

            // Define the root
            root = treeData;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;

            // Layout the tree initially and center on the root node.
            update(root);
            centerNode(root);
        // });

    }