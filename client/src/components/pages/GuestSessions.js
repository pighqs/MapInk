import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

// antd
 import { Layout, Row, Col } from "antd";

import SessionForm from "../forms/SessionForm";
import SessionsList from "../lists/SessionsList";
import Map from "../map/Map";
import Navbar from '../header/Navbar'


class GuestSessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: null,
        lng: null
      }
    };
  }



  

  render() {
    let artistName = sessionStorage.getItem("name artist logged");
    let redirect;
    if (!sessionStorage.getItem("id artist logged")) {
      redirect = <Redirect to="/" />;
    } 
    return (
      <Layout className="layout" id="guestsessions">
      <Navbar/>
        {redirect}
        <Row type="flex" justify="center">
          <Col span={14} align="middle">
            <h2 className="white">Welcome, {artistName}!</h2>
            <h3 className="white">add a new guest spot :</h3>
            <SessionForm />
            <SessionsList />
          </Col>
          <Col span={10} align="middle">
            <Map />
          </Col>
        </Row>
      </Layout>
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
    artistID: state.sendLoggedArtist
  };
};

const GuestSessionsRedux = connect(mapStateToProps, mapDispatchToProps)(
  GuestSessions
);

export default GuestSessionsRedux;
