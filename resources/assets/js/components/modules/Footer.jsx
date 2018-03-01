import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Row, Col} from 'react-flexbox-grid';
import {teamPhoto} from '../../utilities/constants';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
			aboutUs: false,
    }
  }

  render() {
		const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={() => {this.setState({aboutUs: false});}}
      />
    ];

    return (
      <Row style={{background: '#2D3E46', color: 'white', position: 'absolute', bottom: 0, left: 0, width: '100%', paddingLeft: 50, paddingRight: 50, paddingTop: 8, height: 40, margin: '0 auto'}}>
        <Col sm={6}>
          <p style={{textAlign: 'left'}}>
            © 2018. Worcester Polytechnic Institute. All Rights Reserved.
          </p>
        </Col>
        <Col sm={6} style={{textAlign: 'right'}}>
          <a onClick={() => {this.setState({aboutUs: true})}} style={{color: 'white'}}>About Us</a>
        </Col>
        <Dialog
            title="About Us"
            contentStyle={{width: "60%", maxWidth: "none"}}
            actions={actions}
            modal={false}
            open={this.state.aboutUs}
            onRequestClose={() => {this.setState({aboutUs: false})}}
            autoScrollBodyContent={true}
        >
          <Row>
            <Col sm={12} md={6}>
              <br/>
              This system for analysis and visualization of multi-drug interactions was developed at Worcester Polytechnic Institute as part of a Major Qualifying Project. The project team
              was composed of: <br/><br/>
              <b>Undergraduate Students:</b> 
              <ul>
                <li><b>Brian McCarthy</b>, Senior, CS '18</li>
                <li><b>Andrew Schade</b>, Senior, CS '18</li>
                <li><b>Huy Tran</b>, Senior, CS '18</li>
                <li><b>Brian Zylich</b>, BS/MS Candidate, CS '19</li>
              </ul>
              <b>Graduate Student Mentors:</b>
              <ul>
                <li><b>Xiao Qin</b>, PhD Candidate</li>
                <li><b>Tabassum Kakar</b>, PhD Candidate</li>
              </ul>
              <b>Faculty:</b> <b>Prof. Rundensteiner</b> and <b>Prof. Harrison</b><br/>
              </Col>
              <Col sm={12} md={6}>
                <br/>
                {teamPhoto}
              </Col>
          </Row>
          <b>FDA:</b>
          <ul>
            <li><b>Suranjan De</b>, MS, MBA.<br/>{'Deputy Director, Regulatory Science Staff (RSS), Office of Surveillance & Epidemiology, CDER, FDA'}</li>
            <li><b>Sanjay K. Sahoo</b>, MS, MBA<br/>{'Team Lead (Acting) Regulatory Science Staff (RSS), Office of Surveillance & Epidemiology, CDER, FDA'}</li>
            <li><b>FDA Safety Evaluators:</b></li>
            <ul>
              <li><b>Christian Cao</b></li>
              <li><b>Monica Munoz</b></li>
              <li><b>Tingting Gao</b></li>
              <li><b>Jo Wyeth</b></li>
              <li><b>Oanh Dang</b></li>
              <li><b>Cathy Miller</b></li>
              <li><b>Madhuri Patel</b></li>
            </ul>
          </ul>
          
          Tabassum and Xiao are thankful to Oak Ridge Institute for Science and Education (ORISE) managed for the U.S. Department of Energy (DOE) by Oak Ridge Associated Universities (ORAU) for supporting this work.
          <br/>
          <br/>
          To contact us, email the team at <a href="mailto:diva-support@wpi.edu">diva-support@wpi.edu</a> or Prof. Rundensteiner at <a href="mailto:rundenst@cs.wpi.edu">rundenst@cs.wpi.edu</a>.
        </Dialog>
      </Row>
    )
  }
}
