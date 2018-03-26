import React from "react";
import { connect } from "react-redux";

import SessionItem from "./SessionItem";
import moment from "moment";
//import "moment/locale/fr";
moment.locale("fr");

class SessionsList extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionsListFromBack: [],
      sessionsSinceLog: []
    };
  }

  componentWillMount() {
    let mySessionsData = new FormData();
    mySessionsData.append(
      "artistID",
      sessionStorage.getItem("id artist logged")
    );

    fetch("/mysessions", {
      method: "POST",
      body: mySessionsData
    })
      .then(response => response.json())
      .then(answerMySessions => {
        this.setState({
          sessionsListFromBack: answerMySessions.sessionsList
        });
      })
      .catch(error => {
        console.log("Request mysessions failed", error);
      });
  }

  componentWillReceiveProps(nextProps) {
    let sessionsFromBackPlusNew = this.state.sessionsListFromBack.concat(
      nextProps.newSession
    );
    this.setState({
      sessionsListFromBack: sessionsFromBackPlusNew
    });
  }

  render() {
    return (
      <div>
        {this.state.sessionsListFromBack.map(
          ({ tattooShop, shopAddress, startDate, endDate }, index) => (
            <SessionItem
              key={index}
              tattooShop={tattooShop}
              shopAddress={shopAddress}
              startDate={moment(startDate).format("LL")}
              endDate={moment(endDate).format("LL")}
            />
          )
        )}
        <p className="white">you have no sessions registered</p>
      </div>
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
    newSession: state.sendNewSession
  };
};

const SessionsListRedux = connect(mapStateToProps, mapDispatchToProps)(
  SessionsList
);

export default SessionsListRedux;
