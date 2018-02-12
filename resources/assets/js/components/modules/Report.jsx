import React from 'react';
import ReactDOM from 'react-dom';
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


export default class Report extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <Dialog
        className="report"
        title={_.upperFirst(this.props.tableTitle)}
        actions={this.props.actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        autoScrollBodyContent={true}
        contentStyle={{width: "90%", maxWidth: "none", overflow: 'auto' }}
      >
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
          stripedRows={true}
          showRowHover={true}
          preScanRows={true}
        >
          {
            (this.props.tableData === null || this.props.tableData === undefined || this.props.tableData.length == 0) ? (
                <span>
                  <i className="MainView__Loading fa fa-spinner fa-spin fa-3x fa-fw" style={{ marginTop: 100, marginBottom: 100, marginLeft: ((window.innerWidth * 0.6) / 2) - 25}}></i>
                </span>
            ) : (
              this.props.tableData.map(data => {
                if (data == null) return null;
                return (
                  <TableRow key={data.primaryId} selectable={false} displayBorder={true}
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
                      {data.drugname}
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
            )
          }
        </TableBody>
        </Table>
      </Dialog>
      )
    }
}
