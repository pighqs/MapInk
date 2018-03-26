import React from "react";

import { Icon } from 'antd';


class SessionItem extends React.Component {
  constructor() {
    super();
    this.state = {
    };   
  }

  

  render() {
    return (
   <li className="sessionItem">
           <h3>{this.props.tattooShop}</h3>
           <p>{this.props.shopAddress}</p>
           <p>du {this.props.startDate} au {this.props.endDate}</p>
   </li>
    );
  }
}

// send cityCoords to the reducer



export default SessionItem;
