import React from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar';
import * as _ from 'lodash';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell, Label} from 'recharts';
import {barColor, barSelectedColor} from '../../utilities/constants';


export default class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          drugFreqs: [],
          selectedDrug: '-',
        };

        this.highlight = this.highlight.bind(this);
        this.handleBarClick = this.handleBarClick.bind(this);
        this.createOnClickDrugListener = this.createOnClickDrugListener.bind(this);
    }

    handleBarClick(data, index) {
      this.highlight(data['name']);
    }

    highlight(drugName) {
      this.setState({
        selectedDrug: _.toLower(_.replace(drugName,/\W+/g,'')),
      });
    }

    createOnClickDrugListener(drug){
      return function() {
        this.highlight(drug);
      }.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      
      if(nextProps.tableData !== null && nextProps.tableData !== undefined && nextProps.tableData != this.props.tableData) {
        //calculate frequencies of each drug other than the drug(s) that the reports are focused on
        var drugFreqs = {};
        nextProps.tableData.forEach((row) => {
          if(row === null)
            return;
          _.split(row.drugname,',').forEach((drug) => {
            var standardizedDrugName = _.toLower(_.replace(drug, /\W+/g, ''));
            var drugName = _.capitalize(_.trim(_.replace(drug, '.', '')));
            if(standardizedDrugName !== _.toLower(_.replace(nextProps.drugs[0], /\W+/g, '')) && (nextProps.drugs.length === 1 || standardizedDrugName !== _.toLower(_.replace(nextProps.drugs[1], /\W+/g, '')))) {
              if(drugFreqs[standardizedDrugName] !== undefined) {
                drugFreqs[standardizedDrugName]['freq']++;
              }
              else{
                drugFreqs[standardizedDrugName] = {name: drugName, freq: 1};
              }
            }
          });
        });

        var freqs = [];
        _.each(drugFreqs, (value, key, collection) => {
          freqs.push({name: value['name'], freq: value['freq']});
        });

        //sort drug frequencies in descending order
        freqs = _.sortBy(freqs, [(d) => (d['freq'])]).reverse();

        //select up to top 30 drugs for visualization in bar graph
        var graphData = [];
        var i = 0;
        while(i < 30 && i < freqs.length) {
          graphData.push(freqs[i]);
          i++;
        }
        this.setState({
          drugFreqs: graphData,
        });
      }
    }

    render() {
      const actions = [
        <FlatButton
          label="Close"
          primary={true}
          onClick={this.props.handleClose}
        />
      ];

      return (
        <Dialog
          title={_.upperFirst(this.props.tableTitle) + ' (' + this.props.tableData.length + ' results)'}
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          autoScrollBodyContent={true}
          contentStyle={{width: "90%", maxWidth: "none", overflow: 'auto' }}
          className="report"
        >
        {
          (this.props.tableData === null || this.props.tableData === undefined || this.props.tableData.length == 0) ? (
            <span>
              <i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw" style={{ marginTop: 100, marginBottom: 100, marginLeft: ((window.innerWidth * 0.2) / 2) - 25}}></i>
            </span>
          ) : (
            <div>
              <BarChart style={{margin: '0 auto'}} width={this.props.windowWidth * 0.8} height={100} data={this.state.drugFreqs}>
                <XAxis tick={false} hide={false} dataKey="name">
                  <Label value="Drug Co-occurrences" offset={10} position="insideBottom" />
                </XAxis>
                <YAxis />
                <Tooltip />
                <Bar dataKey="freq" onClick={this.handleBarClick}>
                  {
                    this.state.drugFreqs.map((entry, index) => (
                      <Cell cursor="pointer" fill={_.toLower(_.replace(entry['name'], /\W+/g, '')) === this.state.selectedDrug ? barSelectedColor : barColor} key={`cell-${index}`}/>
                    ))
                  }
                </Bar>
              </BarChart>
              <Table
                autoDetectWindowHeight={false} 
                autoScrollBodyContent={true}
                fixedFooter={false}
                fixedHeader={false} 
                style={{ width: "auto",  overflow: 'auto' }}
                bodyStyle={{overflow:'visible'}}
                displayBorder={true}
              >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
              >
                <TableRow>
                  <TableHeaderColumn style={{color: 'black'}}>ID</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>EVENT_DT</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>REPT_DT</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>REPT_COD</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>OCCR_COUNTRY</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>AGE</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>AGE_COD</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>AGE_GRP</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>SEX</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>WT</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>WT_COD</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>LIST OF DRUG NAMES</TableHeaderColumn> 
                  <TableHeaderColumn style={{color: 'black'}}>ADVERSARY EFFECTS</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>OCCP_COD</TableHeaderColumn>
                  <TableHeaderColumn style={{color: 'black'}}>REPORTER COUNTRY</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
                stripedRows={false}
                showRowHover={true}
                preScanRows={true}
              >
                {
                  this.props.tableData === null ? [] :
                  this.props.tableData.map((data, index) => {
                    if (data == null) {
                      return null;
                    }
                    return (
                      <TableRow style={(_.toLower(_.replace(data.drugname, /\W+/g, '')).indexOf(this.state.selectedDrug) !== -1) ? {background: barSelectedColor, color: 'black'} : (index % 2 == 0) ? {background: 'white'} : {background: 'white'}} key={data.primaryId} selectable={false} displayBorder={true}
                      >
                        <TableRowColumn>{data.primaryId}</TableRowColumn>
                        <TableRowColumn>{data.event_dt}</TableRowColumn>
                        <TableRowColumn>{data.rept_dt}</TableRowColumn>
                        <TableRowColumn>{data.rept_cod}</TableRowColumn>
                        <TableRowColumn>{data.occr_country}</TableRowColumn>
                        <TableRowColumn>{data.age}</TableRowColumn>
                        <TableRowColumn>{data.age_cod}</TableRowColumn>
                        <TableRowColumn>{data.age_grp}</TableRowColumn>
                        <TableRowColumn>{data.sex}</TableRowColumn>
                        <TableRowColumn>{data.wt}</TableRowColumn>
                        <TableRowColumn>{data.wt_cod}</TableRowColumn>
                        <TableRowColumn style={{
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          padding: 10,
                          }}
                        >
                          {
                            _.split(data.drugname, ',').map((drug, index, array) => (
                              <div>
                                <a style={(_.toLower(_.replace(data.drugname, /\W+/g, '')).indexOf(this.state.selectedDrug) !== -1) ? {color: 'black'} : {}} onClick={this.createOnClickDrugListener(drug)} key={drug}>{_.capitalize(_.trim(drug))}</a>
                                {(index !== array.length-1) ? ',' : ''}
                              </div>
                            ))
                          }
                        </TableRowColumn>

                        <TableRowColumn style={{
                          whiteSpace: 'normal',
                          padding: 10,
                          wordWrap: 'break-word'
                          }}
                        >
                          {data.SideEffect}
                        </TableRowColumn>
                        <TableRowColumn>{data.occp_cod}</TableRowColumn>
                        <TableRowColumn>{data.reporter_country}</TableRowColumn>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
              </Table>
            </div>
          )
        }
      </Dialog>
      )
    }
}
