import React from "react";
import { connect } from "react-redux";

import SessionItem from "./SessionItem";

import moment from "moment";
//import "moment/locale/fr";
//moment.locale("fr");


class SessionsList extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionsListFromBack: [],
      sessionsSinceLog: []
    };   
  }

  componentWillMount() {
    //console.log("componentWillMount, artist Logged :", this.props.artistID);
    let mySessionsData = new FormData();
    mySessionsData.append("artistID", this.props.artistID);

    fetch("/mysessions", {
      method: "POST",
      body: mySessionsData
    })
      .then(response => response.json())
      .then((answerMySessions) => {
        //console.log("liste sessions from back:", answerMySessions.sessionsList)
        this.setState({
          sessionsListFromBack: answerMySessions.sessionsList
        });
      })
      .catch(error => {
        console.log("Request mysessions failed", error);
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "nextProps newSession",nextProps.newSession
    );
    this.setState({
      sessionsSinceLog: nextProps.newSession
    });
  }

  render() {
    let sessionsList = [];
    if (this.state.sessionsListFromBack.length > 0) {
      sessionsList = this.state.sessionsListFromBack.map((session, index) => {
        return <SessionItem 
                key={index}
                tattooShop = {session.tattooShop}
                shopAddress = {session.shopAddress}
                startDate = {moment(session.startDate).format('LL')}
                endDate = {moment(session.endDate).format('LL')}
              />;
    });
  } else {
    console.log("tableau vide");
  }
   
      
    
    return (
      <ul>
        {sessionsList}
      </ul>
    );
  }
}

// send cityCoords to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: value => {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artistID: state.sendLoggedArtist,
    newSession: state.newSession
  };
};

const SessionsListRedux = connect(mapStateToProps, mapDispatchToProps)(
  SessionsList
);

export default SessionsListRedux;
