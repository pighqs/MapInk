import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import RegisterForm from "../forms/Register";
import LoginFormRedux from "../forms/Login";
import Navbar from "../header/Navbar";

// antd
import { Layout } from "antd";
import { Row, Col } from "antd";

class RegisterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logStatus: false,
      center: {
        lat: null,
        lng: null
      }
    };
  }

  

  componentWillReceiveProps(nextProps) {
    this.setState({
      logStatus: nextProps.artistID
    });
  }

  render() {
    let redirect;
    if (sessionStorage.getItem("id artist logged")) {
      redirect = <Redirect to="/guestsessions" />;
    }

    return (
      <Layout className="layout" id="registerLogin">
        <Navbar />
        {redirect}
        <Row type="flex" justify="center">
          <h2 className="white">Register or Log here</h2>
        </Row>
        <Row type="flex" justify="space-around" align="middle" gutter={4}>
          <Col span={10} offset={2}>
            <LoginFormRedux />
          </Col>
          <Col span={10} offset={2}>
            <RegisterForm />
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

const RegisterLoginRedux = connect(mapStateToProps, mapDispatchToProps)(RegisterLogin);
export default RegisterLoginRedux;
