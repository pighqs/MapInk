import React from "react";
import { Icon } from 'antd';


const SessionItem = () => (
  <li className="sessionItem">
           <h3>{this.props.tattooShop}</h3>
           <p>{this.props.shopAddress}</p>
           <p>du {this.props.startDate} au {this.props.endDate}</p>
   </li>
);




export default SessionItem;
