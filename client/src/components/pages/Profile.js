import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import styled from "styled-components";

import Navbar from "../header/Navbar";

// antd
import { Layout, Row, Col } from "antd";
import { Card, Icon, Popconfirm, message  } from 'antd';
const { Meta } = Card;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
    this.cancelDeleteProfile = this.cancelDeleteProfile.bind(this);   
  }

  handleEditProfile() {
  console.log('edit profile')
  }

  handleDeleteProfile(e) {
    console.log(e);
    fetch(`deleteprofile/${this.props.artist._id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(result => {
        this.props.sendLoggedArtist(false)
        message.success('Profile deleted');
      })
      .catch(error => {
        console.log(error);
      });
  
  }

  
  cancelDeleteProfile(e) {
    console.log(e);
    message.error('Cancel');
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
    let website = <a href={this.props.artist.website}>{this.props.artist.website}</a>

    return (
      <StyledLayout>
        <Navbar />
        <Row type="flex" justify="center">
          <Col span={24} align="middle">
            <SubTitle>Profile</SubTitle>
            <Card
              style={{ width: 500 }}
              cover={
                <img
                  alt="example"
                  src="https://placeimg.com/500/400/people"
                />
              }
              actions={[
                <Popconfirm placement='left' title="Do you want to delete your profile?" onConfirm={this.handleDeleteProfile} onCancel={this.cancelDeleteProfile} okText="Yes, delete my Profile" cancelText="Cancel">
                  <p ><Icon type="setting" /> delete profile</p>
                </Popconfirm>,
                <p onClick={this.handleEditProfile}><Icon type="edit" /> edit profile</p>,
              ]}
            >
              <Meta
                title={this.props.artist.name}
                description={website}
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
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artist: value });
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
