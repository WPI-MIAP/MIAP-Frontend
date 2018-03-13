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
import PropTypes from 'prop-types';

/**
 * This component shows all reports for a given drug or interaction in a Dialog box.
 */
class Report extends React.Component {
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

  /**
   * Called when a bar on the barchart is clicked.
   * 
   * @param data Object containind data pertaining to the bar
   * @param index Index of the bar
   */
  handleBarClick(data, index) {
    this.highlight(data['name']);
  }

  /**
   * Updates the state to enable highlighting of all reports containing the given drug name.
   * 
   * @param {string} drugName The drug name to highlight
   */
  highlight(drugName) {
    this.setState({
      selectedDrug: _.toLower(_.replace(drugName,/\W+/g,'')),
    });
  }

  /**
   * Creates a function that, when called, will highlight all reports containing that drug name.
   * 
   * @param {string} drug The drug's name
   */
  createOnClickDrugListener(drug){
    return function() {
      this.highlight(drug);
    }.bind(this);
  }

  /**
   * Calculate the frequency distribution for the other drugs that also appear in the reports.
   */
  componentWillReceiveProps(nextProps) {
    if(nextProps.tableData !== null && !_.isEqual(this.props.tableData, nextProps.tableData)) {
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

  /**
   * Render the component.
   */
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.handleClose}
      />
    ];

    var numReports = 0;
    this.props.tableData.forEach(row => {
      if(row !== null) {
        numReports += 1;
      }
    });

    return (
      <Dialog
        title={_.upperFirst(this.props.tableTitle) + ' (' + numReports + ' results)'}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={false}
        contentStyle={{width: "90%", maxWidth: "none"}}
        bodyStyle={{paddingBottom: 0}}
        titleStyle={{paddingBottom: 10, paddingTop: 10}}
        className="report"
      >
      {
        (! this.props.tableData || this.props.tableData.length == 0) ? (
          <span>
            <i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw" style={{ marginTop: 100, marginBottom: 100, marginLeft: ((window.innerWidth * 0.2) / 2) - 25}}></i>
          </span>
        ) : (
          <div>
            {
              (numReports === 0) ? (
                <div style={{textAlign: 'center'}}>No reports were found.</div>
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
                  <div style={{height: 'calc(90% - 100px - 76px - 52px)', width: '100%', overflow: 'auto'}}>
                    <div style={{height: 'fit-content', width: 'fit-content'}}>
                      <Table
                        fixedFooter={false}
                        fixedHeader={false}
                        style={{width: 'auto', overflow: 'auto'}}
                        // bodyStyle={{overflow: 'visible'}}
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
                                      <div  key={drug + ' ' + index}>
                                        <a style={(_.toLower(_.replace(data.drugname, /\W+/g, '')).indexOf(this.state.selectedDrug) !== -1) ? {color: 'black'} : {}} onClick={this.createOnClickDrugListener(drug)}>{_.capitalize(_.trim(drug))}</a>
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
                  </div>
                </div>
              )
            }
          </div>
        )
      }
    </Dialog>
    )
  }
}

Report.propTypes = {
  /**
   * Array of the reports to display.
   */
  tableData: PropTypes.array.isRequired,

  /**
   * Array of the drug (if there is only one) or drugs (if the reports are for a pair of drugs) pertaining to this report.
   */
  drugs: PropTypes.array.isRequired,

  /**
   * Width of the browser window (used to make components responsive).
   */
  windowWidth: PropTypes.number.isRequired,

  /**
   * Indicates whether the report view should be open or not.
   */
  open: PropTypes.bool.isRequired,
  
  /**
   * Called when the report view should be closed.
   */
  handleClose: PropTypes.func.isRequired,

  /**
   * Title for the report view.
   */
  tableTitle: PropTypes.string.isRequired,
};

export default Report;