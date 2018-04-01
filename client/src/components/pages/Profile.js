import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import styled from "styled-components";

import Navbar from "../header/Navbar";

// antd
import { Layout, Row, Col } from "antd";
import { Card, Icon, Avatar } from 'antd';
const { Meta } = Card;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    sessionStorage.clear();
    this.setState({
      logStatus: false
    });
  }

  render() {
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

    let redirect;
    if (!this.props.artist._id) {
      redirect = <Redirect to="/" />;
    }

    return (
      <StyledLayout>
        <Navbar />
        <Row type="flex" justify="center">
          <Col span={24} align="middle">
            <SubTitle>Profile</SubTitle>
            <Card
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <Icon type="setting" />,
                <Icon type="edit" />,
                <Icon type="ellipsis" />
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title="Card title"
                description="This is the description"
              />
            </Card>
          </Col>
        </Row>

        {redirect}
      </StyledLayout>
    );
  }
}

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
    artist: state.sendLoggedArtist,
  };
};

const ProfileRedux = connect(mapStateToProps, mapDispatchToProps)(Profile);

export default ProfileRedux;
