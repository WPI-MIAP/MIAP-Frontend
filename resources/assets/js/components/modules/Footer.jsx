import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const styles = {
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'red'
  }
}

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
        onClick={this.handleClose}
      />
    ];

    return (
      <div>
        <div style={styles.footer}>Hello</div>
        <Dialog
          title="About Us"
          contentStyle={{width: "60%", maxWidth: "none"}}
          actions={actions}
          modal={false}
          open={this.state.aboutUs}
          onRequestClose={() => {this.setState({aboutUs: false})}}
          autoScrollBodyContent={true}
        >
        <br/>
          This system for analysis and visualization of multi-drug interactions was developed at Worcester Polytechnic Institute as part of a Major Qualifying Project. The project team
          was composed of: <br/><br/>
        <b>Undergraduate Students:</b> 
        <ul>
          <li>Brian McCarthy, Senior, CS '18</li>
          <li>Andrew Schade, Senior, CS '18</li>
          <li>Huy Tran, Senior, CS '18</li>
          <li>Brian Zylich, BS/MS Candidate, CS '19</li>
        </ul>
          <b>Graduate Student Mentors:</b>
        <ul>
          <li>Xiao Qin, PhD Candidate</li>
          <li>Tabassum Kakar, PhD Candidate</li>
        </ul>
          <b>Faculty Advisor:</b> Elke Rundensteiner<br/>
          <b>Visualization Expert:</b> Lane Harrison<br/>
          <b>FDA Consultants:</b>
        <ul>
          <li>Sanjay K. Sahoo MS. MBA.</li>
          <li>Suranjan De MS. MBA.</li>
        </ul>
        <br/>
        To contact us, email the team at <a href="mailto:diva-support@wpi.edu">diva-support@wpi.edu</a> or Professor Rundensteiner at <a href="mailto:rundenst@cs.wpi.edu">rundenst@cs.wpi.edu</a>.
        </Dialog>
      </div>
    )
  }
}
