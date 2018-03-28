import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

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

    const StyledLayout = styled(Layout)`
      min-height: 100vh;
      background: #606c88;
      background: -webkit-linear-gradient(to top, #4834d4, #606c88);
      background: linear-gradient(to top, #4834d4, #606c88);
    `;
    const SubTitle = styled.h2`
      color: white;
      margin: 1rem 0 2rem 0;
      font-size: 2rem;
      font-family: "Lato", "Monospaced Number";
      font-style: italic;
    `;

    return (
      <StyledLayout>
        <Navbar />
        {redirect}
        <Row type="flex" justify="center">
          <SubTitle >Register or Log here</SubTitle>
        </Row>
        <Row type="flex" justify="space-around" align="middle" gutter={4}>
          <Col span={10} offset={2}>
            <LoginFormRedux />
          </Col>
          <Col span={10} offset={2}>
            <RegisterForm />
          </Col>
        </Row>
      </StyledLayout>
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

const RegisterLoginRedux = connect(mapStateToProps, mapDispatchToProps)(
  RegisterLogin
);
export default RegisterLoginRedux;
