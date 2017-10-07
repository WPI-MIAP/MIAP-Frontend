/*function to build the galaxy view*/
/*as there is a pin option, before loading anything, it checks for th pinned drugs and try to visualize them on their location first*/

var pinned_drugs=[];

/**
 * Function to build the galaxy view
 * @param list List of the data to include in the galaxy view
 * @param check Whether the drugs are selected
 */
function build_Galaxy(list,check) {
  // console.log("Hi")
  var selected_drugs;

  /*check local storage of the browser if any drug was pinned last time*/
  if(localStorage['pinned_drug']!=null || localStorage['pinned_drug']!=undefined){

         d3.select("#pinned_graphs").style("border-bottom","3px solid #0f5753");
    // console.log("pinned")
         d3.select("#pinned_heading").style("display","block");
         pinned_drugs =  JSON.parse(localStorage['pinned_drug']);
  }       
       
 /*if function is called for the selected drugs then prepare the list of that drugs*/        
 if(check=="selected"){
    for (var z =0; z<list.length;z++){
      list[z]= list[z].toLowerCase();
    }
    selected_drugs=list
    // console.log(selected_drugs)
 }
 /*if there were any pinned drugs in browsers storage, extract them and comma sparate them */
  if(pinned_drugs){
    // console.log(pinned_drugs)
      for (var d=0; d<pinned_drugs.length;d++){
        if(selected_drugs.indexOf(pinned_drugs[d])!=-1){
          // console.log(selected_drugs, pinned_drugs[d], selected_drugs.splice(pinned_drugs[d],1))
          selected_drugs.splice(selected_drugs.indexOf(pinned_drugs[d]),1)
        }
          
      }
    }

  var SmallMultiples, plotData, setupIsoytpe, transformData, menu,  data_all, DME_LIST=[];

/*part of code taken from internet, bascially builds those small multiples, so sets the skeleton for it first*/
SmallMultiples = function() {

  var link_distance = 50;
  var next_cluster =0

  var main_drug_radius = 5;
  var known_r = 3;
  var unknown_r = 6;
  var main_drug_color= "#2196f3" ;//"green"
  var default_link_color = '#d8d7d8';//'#FAEBD7'; //'#fe9929';
  // var low_color="hsl(0, 100%, 80%)", med_color="hsl(0, 100%, 64%)", high_color= "hsl(0, 100%, 25%)"
  // var low_color="#fd8d3c", med_color="#f03b20", high_color= "#9c1111";
  var low_color="#fecc5c", low_med_color="#fd8d3c",  med_color="#f03b20", high_color= "hsl(0, 100%, 25%)"



  chart = function(selection) {
      return selection.each(function(rawData) {
   var 
    width = 150,
    height = 150,
    margin = 20,
    data = [];
    n = 50;  // to converge the force layout to make it static

    data = rawData

    // var focus_drug;
    var div, gi, lines, svg, box_menu, graph_rect;
  
   
    var default_node_color = "#2196f3" // "#E8CDDC"; 
    var nominal_base_node_size = 4;
    var nominal_text_size = 12;
    var max_text_size = 24;
    var nominal_stroke = 2.5;
    var max_stroke = 5;
    var max_base_node_size = 36;
    var min_zoom = 0.1;
    var max_zoom = 7;
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
    var highlight_node = null;
    var text_center = false;
    var outline = false;
    var min_score = -0.1;
    var max_score = 1;

    var color = d3.scale.linear()
                  .domain([min_score, (min_score+max_score)/2, max_score])
                  // .range(["grey", "#fb6a4a", "red"]);
                  // .domain([min_score, max_score])
                  // .range(["#fee0d2","#fc9272", "#de2d26"]);
                 .range(["#fcae91","#de2d26", "#a50f15"]);
                  // .range(["#cb181d","#fcae91","#fee5d9"])  


    var color_severity = d3.scale.linear()
                          .domain([1,5])
                          // .range(["hsl(252, 48%, 82%)", "hsl(255, 79%, 28%)"])
                          .range([ "hsl(129, 64%, 69%)","hsl(129, 64%, 15%)"])


                          // .range(["#a6bddb", "#2b8cbe"]); //blue
                          // .range(["#ffffcc", "#a1dab4"]);
                        // .range(["#cb181d","#fcae91","#fee5d9"])  
                        // .range(['#2f4f4f', '#609f9f'])  //green
                       // .range(['#a3a3c2', '#666699']) //purple 
                        // .range(['#8856a7', '#810f7c'])   // dark purple




     // var low_sev_color="hsl(252, 79%, 73%)", med_sev_color="hsl(252, 48%, 47%)", high_sev_color= "hsl(255, 79%, 28%)"

    var highlight_color = "#006d2c";
    var highlight_trans = 0.1;
      
    var size = d3.scale.pow().exponent(1)
      .domain([1,100])
      .range([8,24]);         

    var tooltip = d3.select("body") 
          .append("div")
          .attr("class", "toolTip");

    var data_l = data.length 
    var menu_height = 30;

    var div, gr, lines, svg;
    data = rawData;
    div = d3.select(this).selectAll(".chart").data(data);
    div.enter().append("div").attr("class", "chart").append("svg").attr("id", function(d,i){return "svg"+ i}).append("g");
    var defaultStyle = {
      padding: "0px 1px 0px 1px",
      margin: "1px",
      "border-radius": "1px",
      "background-color": "white",
      "stroke": "none",
      "cursor": "pointer"
    };

    new ResizeSensor($('#galaxy'), function(){
      // console.log("resizeedd")
      $('#vis').isotope('reloadItems'); 
            return $("#vis").isotope({
              sortBy: 'severity'
            });
    }); 

    // function iconClicked(icon){
    //   console.log(icon + " clicked");
    // }

    /*what happens when galaxy is closed.. it is removed from the drugs list*/
    function close_galaxy(){
        tooltip.style("display", "none");
        var closed_drug = d3.select(this.parentNode.parentNode.parentNode).data()[0].key
         if(this.parentNode.parentNode.parentNode.parentNode.id == "pinned_graphs"){
                pinned_drugs.splice(pinned_drugs.indexOf(closed_drug),1)
                console.log(pinned_drugs)
                d3.select(this.parentNode.parentNode.parentNode).remove()
                if(pinned_drugs.length==0){
                  d3.select("#pinned_heading").style("display","none");
                  d3.select("#pinned_graphs").style("border-bottom","none");
                  window.localStorage.removeItem("pinned_drug");
                }
                  
                // else if(pinned_drugs.length==1)
                //   localStorage.setItem('pinned_drug',JSON.stringify(pinned_drugs));
                else
                  localStorage.setItem('pinned_drug',JSON.stringify(pinned_drugs));
         } 
        else{
              d3.select(this.parentNode.parentNode.parentNode).remove()
            // console.log(d3.select('#vis'))
            $('#vis').isotope('reloadItems'); 
            return $("#vis").isotope({
              sortBy: 'severity'
            });
        }  
        
    }

  /*preparing data into the format*/  

  function prepare_children(){
     var data_copy = JSON.parse(JSON.stringify(data_all));
        var row_data = d3.nest()
                        .key(function(d){
                            return d.Drug1
                        })
                        .sortKeys(d3.ascending)
                        .key(function(d){
                          return d.Drug2
                        })
                        .sortKeys(d3.ascending)
                        .entries(data_copy)

        return row_data

  }   

/*when zoomed, profile is updated for this drug.. So update data for the profile and update the reports as well*/
  function zoom_view(d){
      var drug_name = d3.select(this.parentNode.parentNode.parentNode).data()[0].key   
      var row_data = prepare_children()
      drug_name = drug_name.toLowerCase()
         if(row_data){
             row_data.forEach(function(d){
                if (d.key == drug_name){
                    d3.select("#zoom_heading").text("Interaction Profile for Drug: " + drug_name);
                    d3.select("#report_heading").text("Reports for selected Drug: " + drug_name);
                  draw_zoom_tree (d,"#div_profile","")
                  prepare_reports(drug_name,"drug")  
                  return false;       
                } 
            });
        }
  }    

  /*when pin icon is clicked, find which drug it is?  then if is pin symbol */
  function pin_clicked(d){
    var pinned_icon = d3.select(this).text();
    var div_pinned=d3.select(this.parentNode.parentNode.parentNode);
    var pinned_drug = d3.select(this.parentNode.parentNode.parentNode).data()[0].key
    // console.log(div_pinned,pinned_drug)
    /* if it is pin symbol  then fidn the data related to this galaxy and store it*/
    if (pinned_icon== '\uf13e'){    
       d3.select("#pinned_graphs").style("border-bottom","3px solid #0f5753");
       d3.select("#pinned_heading").style("display","block");
       div_pinned.style("position","relative").style("left",0).style("top",0);
       var x = div_pinned.data()[0]
       d3.select('#pinned_graphs').datum(x).append(function(){return div_pinned.node();})
       // to move the selected div to the pinned area
       // d3.select('#pinned_graphs').append(function(){return div_pinned.node();});

       // console.log(d3.select("#pinned_graphs"), div_pinned)

       d3.select(this).text(function(d) { return '\uf09c'; }); 

       selected_drugs.splice( selected_drugs.indexOf(pinned_drug),1)
       store_pinned_divs(pinned_drug);

    }
    /*if it is unpinned icon then remove the drug and put it back with the other drugs into the unpin section*/
    else if(pinned_icon== '\uf09c'){
      // d3.select(this.parentNode.parentNode.parentNode.parentNode).datum([])

      if(this.parentNode.parentNode.parentNode.parentNode.id == "pinned_graphs"){
                // console.log(this.parentNode.parentNode.parentNode.parentNode.id )
                pinned_drugs.splice(pinned_drugs.indexOf(pinned_drug),1)
                // console.log(pinned_drugs)
                if(pinned_drugs.length==0){
                  d3.select("#pinned_heading").style("display","none");
                  d3.select("#pinned_graphs").style("border-bottom","none");
                  window.localStorage.removeItem("pinned_drug");
                }
                  
                // else if(pinned_drugs.length==1)
                //   localStorage.setItem('pinned_drug',JSON.stringify(pinned_drugs));
                else
                  localStorage.setItem('pinned_drug',JSON.stringify(pinned_drugs));
      } 

      var div_pinned1=d3.select(this.parentNode.parentNode.parentNode);
      // console.log(div_pinned1)
        div_pinned1.style("position","absolute")
        var x = div_pinned1.data()[0]
        var pinned_drug = d3.select(this.parentNode.parentNode.parentNode).data()[0].key
        // console.log(d3.select(this.parentNode.parentNode.parentNode).data()[0].key)
        d3.select('#vis').datum(x).append(function(){return div_pinned1.node();})
        // console.log(div_pinned1)
        d3.select(this).text(function(d) { return '\uf13e'; })
        // window.localStorage.removeItem("pinned_chart");
        // window.localStorage.removeItem("pinned_chart_data");
        // console.log(pinned_drug)
       // console.log (d3.select('#vis'))
                // console.log(this.parentNode.parentNode.parentNode.parentNode.id )

    }
    
    // re-arrange the charts inside the vis div as the drug from unpin action is added now
    $('#vis').isotope('reloadItems'); 
      return $("#vis").isotope({
        sortBy: 'severity'
      });
  }


  function store_pinned_divs(drug_pinned){
       // console.log(drug_pinned);
       tmp_chart = localStorage.getItem("pinned_drug");
       // console.log((tmp_chart === null) ? [] : JSON.parse(tmp_chart))
       tmp_chart = (tmp_chart === null) ? [] : JSON.parse(tmp_chart);
       tmp_chart.push( drug_pinned);
      
       // console.log(tmp_chart)
       localStorage.setItem("pinned_drug", JSON.stringify(tmp_chart))
  }

 // creating force layout for each data object          
 
 for (i =0; i< data_l; i++){
  // console.log(data[i])
  var aggr_score=-1;
  var aggr_status=null;
  var severity_count=0;
  var nodes=[]
  var nodes_data = data[i].nodes
  var links = data[i].links
  var focus_drug = data[i].key.toLowerCase();
  var child_array=[];
 // console.log(aggr_score,nodes_data)
  var row_data = prepare_children()
   row_data.forEach(function(f_drug){
        if (f_drug.key.toLowerCase() == focus_drug){
            f_drug.values.forEach(function(s_drug){
               // console.log(f_drug.key, s_drug.values)
                if(s_drug.values.length>1){
                   // console.log(f_drug.key)
                    child_array=f_drug.values 
                }

            })
        }

  }) 
  // console.log(focus_drug,child_array)      

  var svg_id = "#svg"+i;
  var svg = div.select(svg_id).attr("width", width + margin).attr("height", height + margin);


  var gr = svg.select("g");//.attr("transform", "translate(" + margin+ "," + margin + ")");

  gr.append("text")
     .attr("class", "heading_text")
     .attr("x", width/2)
     .attr("y", 30)
     .style("text-anchor", "middle")
     .text(focus_drug.toUpperCase()) 

   gr.append("text")
    .attr("class",  "close_button")
    .attr("x",width)
    .attr("y",15)
    .style("font-family","FontAwesome")
    .style('font-size', function(d) { return '15px';} )
    .style("fill", "red")
    .style("opacity", 0.5)
    .text(function(d) { return "\uf00d"; })
    .on("mousemove",function(event) {
            tooltip.style("left", d3.event.pageX + 20+"px");
            tooltip.style("top", d3.event.pageY+"px");
            tooltip.style("display", "inline-block");
            tooltip.html("Remove")
    })
    .on("mouseover", function(){
      d3.select(this).style("cursor","pointer")
      d3.select(this).style("font-size","25px")
      d3.select(this).style("fill", "#cb3434")
      d3.select(this).style("opacity", 1)
      d3.select(this).attr("x",width-5)
      d3.select(this).attr("y",20)
    })
    .on("mouseout", function(d){
      tooltip.style("display", "none");
      d3.select(this).style("font-size","15px")
      d3.select(this).attr("x",width)
      d3.select(this).attr("y",15)
      d3.select(this).style("fill", "red")
      d3.select(this).style("opacity", 0.5)
    })    
    .on("click", close_galaxy); 

  gr.append("text")
    .attr("class",  "pinn_button")
    .attr("x",width-40)
    .attr("y",15)
    .style("font-family","FontAwesome")
    .style('font-size', function(d) { return '15px';} )
    .style("fill", "#cfe2e2")
    .text(function(d) {
        // console.log(this.parentNode.parentNode.parentNode.parentNode)
       if(this.parentNode.parentNode.parentNode.parentNode.id == "pinned_graphs") 
         return '\uf09c';
       else
         return '\uf13e';
    })
    .on("mousemove",function(event) {
            // console.log(event)
            tooltip.style("left", d3.event.pageX + 20+"px");
            tooltip.style("top", d3.event.pageY+"px");
            tooltip.style("display", "inline-block");
            if(d3.select(this).text() == '\uf13e')
                 tooltip.html("Pin")
            else
                 tooltip.html("Unpin")
    })
    .on("mouseover", function(d){
      // console.log("Mouseover")
      d3.select(this).style("cursor","pointer")
      d3.select(this).style("font-size","25px")
      d3.select(this).attr("x",width-45)
      d3.select(this).attr("y",20)    
      d3.select(this).style("fill", "#33bbff")
    })
    .on("mouseout", function(d){
      tooltip.style("display", "none");
      d3.select(this).style("font-size","15px")
      d3.select(this).attr("x",width-40)
      d3.select(this).attr("y",15)
      d3.select(this).style("fill", "#cfe2e2")
    })
    .on("click", pin_clicked);
    

  gr.append("text")
    .attr("class",  "zoom_button")
    .attr("x",width-20)
    .attr("y",15)
    .style("font-family","FontAwesome")
    .style('font-size', function(d) { return '15px';} )
    .style("fill", "#cfe2e2")
    .text(function(d) { return '\uf00e'; })
    .on("mousemove",function(event) {
            tooltip.style("left", d3.event.pageX + 20+"px");
            tooltip.style("top", d3.event.pageY+"px");
            tooltip.style("display", "inline-block");
            tooltip.html("Zoom")
    })
    .on("mouseover", function(){
      d3.select(this).style("cursor","pointer")
      d3.select(this).style("font-size","25px")
      d3.select(this).style("fill", "#33bbff")
      d3.select(this).attr("x",width-25)
      d3.select(this).attr("y",20)
    })
    .on("mouseout", function(d){
      tooltip.style("display", "none");
      d3.select(this).style("font-size","15px")
      d3.select(this).attr("x",width-20)
      d3.select(this).attr("y",15)
      d3.select(this).style("fill", "#cfe2e2")
    })    
    .on("click", zoom_view); 

    
   
  // console.log(d3.select("#pinned_graphs .chart"))

    /* To reoder the nodes data so that focus drug is the last one*/
      var focus_node =null;
      nodes_data.forEach(function(d,e){
        if (d.id!== focus_drug){
          nodes.push(d)
        }
        else
          focus_node = d

      }) 
      if (focus_node)
        nodes.push(focus_node) 

      // console.log(nodes)
      /* to cound aggregate severity count of drug interactions of a drug*/
      nodes.forEach(function(d,e){  
          // console.log(d)
          if (d.id!= focus_drug){
            if(d.severity=='severe'){
              severity_count= severity_count+1
            }
          }  
          // console.log(d, i,severity_count)

          if(e==nodes.length-1 && d.id==focus_drug){
              // console.log(severity_count)
              d['severity_count']=severity_count
              data[i]['severity_count'] =severity_count
              // console.log(data[i])
              severity_count=0
          }
    })
         
  var g = svg.append("g").attr("class", "group");
 
    var force = d3.layout.force()
      .linkDistance(20)
      .linkStrength(2)
      .charge(-200)
      .size([width+margin,height-menu_height])

  var drag = d3.behavior.drag()
                  .on("dragstart", dragstart)
                  .on("drag", dragmove)
                  .on("dragend", dragend);

     function dragstart(d, i) {
          force.stop() // stops the force auto positioning before you start dragging
      }

      function dragmove(d, i) {

          d.px += d3.event.dx;
          d.py += d3.event.dy;
          d.x += d3.event.dx;
          d.y += d3.event.dy; 
          tick(); // this is the key to make it work together with updating both px,py,x,y on d !
      }

      function dragend(d, i) {
          // d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
          tick();
          // force.resume();
      }
        
    force
      .nodes(nodes)
      .links(links)
      .start();
    
    // console.log(nodes)

    var link = g.selectAll(".link")
                .data(links) //function(d){ return d.links})
                .enter().append("line")
                .attr("class", "link")
                .style("stroke", function(d){
                  // console.log(d)
                  // if (d.status=='known')
                  //   return default_link_color;
                  // else
                    return default_link_color;
                    // return "white"
                })
                .style("stroke-width", function(d) { 
                  // console.log(d.Score, isNumber(d.Score))
                  // if (isNumber(d.Score) && d.Score>0.1) 
                  //   return 5;
                  // else 
                    return  2; 
                })
                // .style("stroke-width",function(d,i){
                //         console.log(d,d.target.status)

                //         if (!d.target.children && d.target.status){
                //           console.log(d)
                //                 // if(d.target.parent.status == "unknown")
                //                 //     d.target.parent.status = "unknown"
                //                 // else
                //                 //     d.target.parent.status = d.target.status                               

                //         }

                //          if (d.target.status=='known')
                //             return 2;
                //          else 
                //             if(d.target.status=='unknown')
                //             return 5;
                //         })

                //     .style("stroke", function(d,i){

                //          if( d.target.Score!==null){
                //             d.source.Score = +(d.target.Score)
                //         }
                //         // console.log(d.target.score)

                //             // if (d.target.Score && d.target.Score>=0.1) 
                //                 return color(d.target.Score);
                //             // else return 2; 
                //     })


    var node = g.selectAll(".node")
      .data(nodes)  //function(d){ return d.nodes})
      .enter().append("g")
      .attr("class", "node")
      .call(drag)

       
    var circle = node.append("circle")
                     // .attr("r", 6)
                 .attr("r", function(d){
                  // console.log(d, d.status)
                      if(d.id==focus_drug){
                         d3.select(this).attr("class","focus_drug")
                         return main_drug_radius;
                      }
                      else{
                          if(child_array.length>1){
                              child_array.forEach(function(s_drug){
                                          // console.log(s_drug,d.id)
                                          if(d.id==s_drug.key){
                                             if(s_drug.values.length>1){
                                                  s_drug.values.forEach(function(ddi, e){
                                                  // console.log(ddi) 
                                                  if(ddi.status=='unknown')
                                                    d.status='unknown'
                                                      // return unknown_r
                                                  
                                              })
                                             }
                                          }
                              })
                          }
                      } 

                        if (d.status=='known'){
                           d3.select(this).attr("class","inter_drugs")
                           return known_r; 
                        }
                     else {
                       d3.select(this).attr("class","inter_drugs")
                       return unknown_r;
                       }
                  })
                 .style("fill", function(d,t){
                    
                   // console.log(d.Score)
                                       
                  // console.log(e, d, d.Score, aggr_score)
                      // if(d.id==focus_drug)
                      //    aggr_score = d.Score

                      if(d3.select(this).attr("class")=='focus_drug' && t==nodes.length-1){
                          // console.log(d.severity_count)
                          if(d.severity_count==0)
                              var x = "#A9A9A9";  //"#fed98e"; // yellow "#74a9cf"   //  
                          // else 
                          //     var x = color_severity(d.severity_count)
                          else if(d.severity_count==1)
                              var x = "#bcbddc";
                          else if(d.severity_count==2)
                              var x = "#9e9ac8";
                          else if(d.severity_count==3)
                              var x = "#807dba";
                          else if(d.severity_count==4)
                              var x = "#6a51a3";
                          else if(d.severity_count>=5)
                            // console.log("5555555")
                              var x = "#4a1486";
                          // else if(d.severity_count>=1 && d.severity_count<=3 )
                          //     var x = low_sev_color
                          // else if(d.severity_count>=4 && d.severity_count<=5 )
                          //     var x = high_sev_color
                          d3.select(this.parentNode.parentNode.parentNode.parentNode).attr("style", "outline: thick solid "+x+ ";")
                      }
                      if(d.id==focus_drug)
                         return main_drug_color
                      else{
                        if(child_array.length>1){
                        child_array.forEach(function(s_drug){
                                    // console.log(s_drug,d.id)
                                    if(d.id==s_drug.key){
                                       if(s_drug.values.length>1){
                                          aggr_score=-1;
                                          s_drug.values.forEach(function(ddi, e){
                                              // console.log(ddi) 
                                              if(e==0){

                                                aggr_score= ddi.Score
                                                // console.log(aggr_score,e)  
                                              }
                                                
                                              else if(ddi.Score>=aggr_score){
                                                aggr_score = ddi.Score
                                                // console.log(aggr_score)  
                                              }
                                                    
                                              else{
                                                aggr_score =aggr_score
                                                // console.log(aggr_score)  
                                              }
                                                
                                            // console.log(aggr_score,ddi.Score)  
                                            d.Score=aggr_score
                                        })
                                      }
                                      
                                    }
                                    else{
                                      // console.log(aggr_score,s_drug.values[0].Score)
                                      aggr_score=s_drug.values[0].Score
                                    }
                                      
                        // console.log(aggr_score, d.Score, d)
                        
                        })
                        // console.log(d.Score)
                        if (d.Score<0 || d.Score==0)
                            return low_color;
                        else if (d.Score>0 && d.Score<=0.01)
                            return low_med_color;
                        else if (d.Score>0.01 && d.Score<=0.2)
                            return med_color;
                        else if (d.Score>0.2)
                            return high_color;
                      }
                      
                    // }
                    else {
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
                  })
                 .style("stroke","none");  

    var tooltip = d3.select("body")
            .append("div")
            .attr("class", "toolTip");                

    var prev_radius= 0 ;

    circle.on("mouseover", function(d){
        // // console.log(d)
        // prev_radius=  d3.select(this).attr("r");
        // // console.log(prev_radius)
        // // console.log(d.id)

        // d3.selectAll(".node circle").style("fill", function(e){
        //     // console.log(e)
        //     if (e!=undefined && e.id == d.id){
        //       // console.log("e.id")
        //         return "blue";
        //     }  
        //      else return color(e.Score)
        // })
    })
    .on("mouseout", function(d){
        tooltip.style("display", "none");
        // d3.select(this).attr("r", prev_radius)
        // // console.log(d3.select(this).attr("class"))

        // d3.selectAll(".node circle.focus_drug").style("fill", function(x){
        //         // console.log(d3.select(this).attr("class"))
        //         return main_drug_color;
        // })

        // d3.selectAll(".node circle.inter_drugs").style("fill", function(x){
        //         return color(x.Score)
        // })

    })
    .on("mousemove", function(d){
      // console.log(d3.select(this).attr("r"))
      // d3.select(this).attr("r", 20)
      tooltip.style("left", d3.event.pageX+10+"px");
      tooltip.style("top", d3.event.pageY-25+"px");
      tooltip.style("display", "inline-block");
      if(d3.select(this).attr("class")==='focus_drug')
          tooltip.html("Drugname: "+ (d.id));
      else
           tooltip.html("Drugname: "+ (d.id)+"<br>"+ "ADR: " + d.ADR +"<br>"+ "Score: " + (d.Score) +"<br>");

    })
    .on("click", function(d){
          // d3.select(this).select("circle").style("fill","blue").style("stroke", "green");
                  // console.log(d3.select(this).select("circle"))
                  var selected_node = d.id;
                  // console.log(selected_node)

                  
                  if(selected_node){
                    d3.selectAll("#div_profile > *").remove()
                    // prepare_profile(selected_node,"node")
                    prepare_reports(selected_node, "drug")
                    d3.select("#report_heading").text("Reports for selected Drug: " + selected_node);

                    // selected_node = selected_node.toLowerCase()
                    //  if(row_data){
                    //      row_data.forEach(function(d){
                    //       // console.log(d.key, selected_node)
                    //         if (d.key == selected_node){
                    //           // console.log(d)
                    //             // selected_Drug = d
                    //             // console.log(drugname)
                    //             // draw_tree(d,"check")
                    //           draw_zoom_tree (d,"#div_profile","")  
                    //           return false;       
                    //         } 
                    //     });

                    // }
                  };  

    });
            
    // var text = g.selectAll(".text")
    //             .data(nodes)
    //             .enter().append("text")
    //             .attr("dy", "-.15em")
    //             .style("font-size", nominal_text_size + "px")
    //             .style("opacity",0)

    //   if (text_center)
    //    text.text(function(d) { return d.id; })
    //        .style("text-anchor", "middle");
    //   else 
    //   text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
    //       .text(function(d) { return '\u2002'+d.id; });

     
    zoom.on("zoom", function() {
        var stroke = nominal_stroke;
        if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();

        var t = d3.event.translate,
            s = d3.event.scale;

          t[0] = Math.max(0, Math.min(t[0], width - s*50));
          t[1] = Math.max(0, Math.min(t[1], height - s*50));

          d3.selectAll(".group").attr("transform", "translate(" + t + ")scale(" + d3.event.scale + ")");
       
      // d3.selectAll(".group")
      // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

    });
    svg.call(zoom)
 

    force.start()
        .on("tick", tick);

    for (let i = 0; i < n; ++i)  force.tick();
        force.stop();

    
    // console.log(nodes, nodes_l, nodes[nodes_l])
     
     function tick(){
          var radius = 10;

          var nodes_l = nodes.length-1 
          // console.log(nodes, nodes_l)

          nodes[nodes_l].x = (width+margin) / 2;
          nodes[nodes_l].y = (height+menu_height +margin) / 2;

          node.attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y+ ")"; 
          });

           // text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      
           link.attr("x1", function(d) { return d.source.x; })
               .attr("y1", function(d) { return d.source.y; })
               .attr("x2", function(d) { return d.target.x; })
               .attr("y2", function(d) { return d.target.y; });

       }
    
     } //end For
      
   });
   }  //console.log(chart);
    return chart ;  
  };

transformData = function(rData) {
    // console.log(rData)
     // rData.map(function(d,i){
     //               // console.log(d,i)
     //            var charArr =[];
     //             charArr.push(d.id.split(','));
     //             // console.log(d.id, charArr)
     //             d.id = charArr
                 
     //  })
     // console.log(DME_LIST)
     data_copy = JSON.parse(JSON.stringify(rData));
      /*  to create double sided links a-> b and x -> a */
     var drug1_array= []
     data_copy.forEach(function(d,i){
          d.Drug1= d.Drug1.toLowerCase();
          d.Drug2= d.Drug2.toLowerCase();
          d.Rank = +d.Rank
          d.Score = d3.round (d.Score,3)
          // if(d.Score<0)
          // console.log(d.Score)
           d.ADR=  d.ADR.toLowerCase();
           // console.log(d.ADR.split(','), xx++)
           var splitted_ADR= d.ADR.split(',')
           var splitted_ADR_len= splitted_ADR.length
           // console.log(splitted_ADR, xx++)
           var severity_check = 0
           for(var ad=0; ad<splitted_ADR_len; ad++){
              if (DME_LIST.indexOf(splitted_ADR[ad])!==-1){
                 severity_check = severity_check+ 1
                 // console.log("yes", splitted_ADR[ad])              
              }            
           }

          if(severity_check>0){
                d.severity = "severe"
                severity_check=0
                // console.log(d)
          } 
          else{
            d.severity="not severe"
          }

          // if((i-1)%2 == 0)
          //     d.status = 'known';
          //   else
          //     d.status ='unknown';             

          if (i== 0 || drug1_array.indexOf(d.Drug1) == -1)
               drug1_array.push(d.Drug1)

          if (drug1_array.indexOf(d.Drug2) != -1){
                // console.log(d)
                var obj_copy= JSON.parse(JSON.stringify(d));
                var temp = obj_copy.Drug1;
                obj_copy.Drug1 = obj_copy.Drug2;
                obj_copy.Drug2 = temp
                /* Do change the support and conf of individual drugs too*/
                // console.log(obj_copy)
                data_copy.push(obj_copy)
          }

          if (drug1_array.indexOf(d.Drug2)==-1){
                    // console.log(d)
                var obj_copy= JSON.parse(JSON.stringify(d));
                var temp = obj_copy.Drug1;
                obj_copy.Drug1 = obj_copy.Drug2;
                obj_copy.Drug2 = temp
                /* Do change the support and conf of individual drugs too*/
                data_copy.push(obj_copy)

          }

    }) //end foreach

    return data_copy

};  // end transform data



  function set_rules_data(data,p_Drugs){
       var all_drugs_list=[];
       var sel_drugs;
       for ( i in data){
             all_drugs_list.push(data[i].Drug1)
      }

      all_drugs_list= remove_duplicates(all_drugs_list)
      all_drugs_list.sort();

      if(p_Drugs)  
            sel_drugs=p_Drugs
      else
            sel_drugs= selected_drugs

      return set_data_with_menu (data, sel_drugs)

  } //end set rules_data

  function set_data_with_menu(data, sel_drugs){

      // console.log(data, sel_drugs)
      var data_overall=[], drug_list_to_object={}, data_overall_array=[];
      var sub_data=[], nodes=[], n_l=0;
      var all_drugs_list = [], drugs_list=[]
      var d_l= sel_drugs.length;

      var row_data ={};
      var values =[];
      // console.log(d_l)
      for (var j = 0; j<d_l  ; j++){
          var focus_drug = sel_drugs[j] 
          // console.log(focus_drug)
          for ( i in data){
            // console.log(data[i].Drug1, selected_drugs[j])
              if (data[i].Drug1 == sel_drugs[j]){
                drugs_list.push(data[i].Drug1)
                drugs_list.push(data[i].Drug2)
                // if(data[i].Drug2=='revlimid') console.log("hi")
                sub_data.push(data[i])
                // console.log(data[i])
              }
          }
          // console.log(sub_data.length)

          var drugs_list_no_duplicates = remove_duplicates(drugs_list)


          var nodes =[];
          // var g = svg;

          var drug_list_to_object= {};
          var n_l = drugs_list_no_duplicates.length

          // var severity_count = 0


      /************  Add the node.push inside loop if we want all rules for one drug interaction******/

             for (var x = 0; x<n_l; x++){
                      // console.log(i)
                    drug_list_to_object['id']=drugs_list_no_duplicates[x]
                    // drug_list_to_object['severity_count'] = Math.floor((Math.random() * 10) + 1)
                    // console.log(sub_data)
                    for(y in sub_data){
                      // console.log(links[j])
                        if (sub_data[y].Drug2 == drugs_list_no_duplicates[x]){
                            drug_list_to_object['Score'] = sub_data [y].Score
                            drug_list_to_object['status'] = sub_data[y].status
                            drug_list_to_object['ADR'] = sub_data[y].ADR
                            drug_list_to_object['severity'] = sub_data[y].severity
                            // if(sub_data[y].severity=='yes')
                            //   severity_count= severity_count +1
                            
                        }
                    }
                    // drug_list_to_object['severity_count']=severity_count
                    nodes.push(drug_list_to_object)
                    drug_list_to_object={}
                    // severity_count=0
             }
                  // console.log(drugs_list_no_duplicates)
               
                // console.log(nodes)

              var hash_lookup = [];

              nodes.forEach(function(d, i) {
                hash_lookup[d.id] = d;
              });


              sub_data.forEach(function(d, i) {
                d.source = hash_lookup[d.Drug1];
                d.target = hash_lookup[d.Drug2];
              });


              row_data['key']=focus_drug
              row_data['nodes']= nodes
              row_data['links']= sub_data
              row_data['severity_count'] = null;
              // values.push(row_data)
              // data_overall['key'] = focus_drug
              // data_overall['values'] = values
              data_overall.push(row_data)
              drugs_list = [];
              sub_data=[], values= [];
              row_data={} 
              // console.log(data_overall)
              // data_overall_array.push(data_overall)
              // data_overall={}
          }
      // console.log(data_overall)

      return data_overall; //data_overall_array

}  //end set_data

function remove_duplicates(data){
                // console.log(data)
                /* To remove the duplicate drug names */
        uniqueArray = data.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
        })
        // console.log(uniqueArray)
        return uniqueArray
        
    } //end remove_duplicates


  plotData = function(selector, data, plot) {
    // console.log(selector, data)
    // console.log(d3.select(selector))
    return d3.select(selector).datum(data).call(plot);
  };  //end plot_data

  setupIsoytpe = function() {
    // console.log("Bye")
   
    $("#vis").isotope({
      itemSelector: '.chart',
      layoutMode: 'fitRows',
      sortAscending: false,
        getSortData: {
        name: function(e) {
          // console.log("name")
          // console.log(e)
          var d, len;
          d = d3.select(e).datum();
          // console.log(d)
          return d.key;

        },
        count:function(e){
          var d
          d = d3.select(e).datum();
          // console.log(d)
          return d.nodes.length;
        },

        severity:function(e){
          sortAscending: false;
          // console.log(e)
          var d
          d = d3.select(e).datum();
          // console.log(d)
          return d.severity_count;
        }
      }
    });
  
    return $("#vis").isotope({
      sortBy: 'severity'
    });
  };   //end setupIsoytpe

    $(function() {
      var display, plot;
      plot = SmallMultiples();
      // console.log("plot")

      display = function(error, rawData, DME_list) {
        
        DME_list.forEach(function(d){
          // console.log(d)
          DME_LIST.push(d.ADR.toLowerCase())
        })

        // console.log(DME_LIST)


        var //data_all, 
        sel_data, data;
        if (error) {
          console.log(error);
        }
        data_all= transformData(rawData);
        data = set_rules_data(data_all);

        if(pinned_drugs){
          // console.log("pinned")
          
          var pin_data = set_rules_data(data_all,pinned_drugs);
          // console.log(pin_data)
          plotData("#pinned_graphs", pin_data, plot);
        }
        plotData("#vis", data, plot);
        return setupIsoytpe();
      };  // end display

      
      queue().defer(d3.tsv, "data/Q4_2014_rules_new.txt").defer(d3.csv, "data/DME.csv").await(display);
      return  d3.select("#button-wrap").selectAll("div").on("click", function() {
        var id;
        id = d3.select(this).attr("id");
        console.log(id)
        d3.select("#button-wrap").selectAll("div").classed("active", false);
        $('#vis').isotope('reloadItems'); 
        d3.select("#" + id).classed("active", true);
        return $("#vis").isotope({
          sortBy: id
        });
      });

  });    // end function

}
// ).call(this);  //end function

/**
 * Determines whether a value is a number or not
 * @param n
 */
function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
}



