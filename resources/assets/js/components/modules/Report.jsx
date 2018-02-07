import React from 'react'
import { AutoComplete } from 'material-ui';
import SearchBar from 'material-ui-search-bar'
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
          striped={true}
          displayBorder={true}
        >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>EVENT_DT</TableHeaderColumn>
            <TableHeaderColumn>REPT_DT</TableHeaderColumn>
            <TableHeaderColumn>REPT_COD</TableHeaderColumn>
            <TableHeaderColumn>OCCR_COUNTRY</TableHeaderColumn>
            <TableHeaderColumn>AGE</TableHeaderColumn>
            <TableHeaderColumn>AGE_COD</TableHeaderColumn>
            <TableHeaderColumn>AGE_GRP</TableHeaderColumn>
            <TableHeaderColumn>SEX</TableHeaderColumn>
            <TableHeaderColumn>WT</TableHeaderColumn>
            <TableHeaderColumn>WT_COD</TableHeaderColumn>
            <TableHeaderColumn>LIST OF DRUG NAMES</TableHeaderColumn> 
            <TableHeaderColumn>ADVERSARY EFFECTS</TableHeaderColumn>
            <TableHeaderColumn>OCCP_COD</TableHeaderColumn>
            <TableHeaderColumn>REPORTER COUNTRY</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {
            this.props.tableData.map(data => {
              return (
                <TableRow selectable={false} displayBorder={true}
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
          }
        </TableBody>
        </Table>
      </Dialog>
      )
    }
}
