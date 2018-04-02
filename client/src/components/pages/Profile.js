import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import styled from "styled-components";

import Navbar from "../header/Navbar";

// antd
import { Layout, Row, Col } from "antd";
import { Card, Icon, Popconfirm, Upload, message  } from 'antd';
const { Meta } = Card;
const { Dragger }= Upload;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.artist.name,
      mail: this.props.artist.mail,
      website: this.props.artist.website,
      pic: this.props.artist.pic
    };
    this.handleEditProfile = this.handleEditProfile.bind(this);
    this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
    this.cancelDeleteProfile = this.cancelDeleteProfile.bind(this);   
  }

  handleEditProfile() {
  console.log('this.state.mail', this.state.mail)
//   let updateDatas = new FormData();
//       updateDatas.append("newMail", values.emailLogin);
//       updateDatas.append("newPassword", values.passwordLogin);
//       updateDatas.append("newArtistName", values.passwordLogin);
//       updateDatas.append("newWebsite", values.passwordLogin);
//       updateDatas.append("newPic", values.passwordLogin);
//   fetch(`/updateprofile/${this.props.artist._id}`, {
//   method: 'PUT',
//   body: updateDatas
// }).then(function(response) {
//     return response.json();
// })
// .then(function(data) {
//     console.log(data);
// }).catch(function(error) {
//     console.log('Request failed', error)
// });

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
    const NoProfilePic = styled.div`
    width:500px;
    height: 400px;
    background-Color: #ddd;
    color: white;
    line-Height:400px;
    font-size: 1.2rem;
    font-family: "Lato", "Monospaced Number";
    font-style: italic;
  `;

    let redirect;
    if (!this.props.artist._id) {
      redirect = <Redirect to="/" />;
    }
    let website = <a href={this.state.website}>{this.state.website}</a>

    const props = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    let profilePic = this.state.pic || <NoProfilePic> No Profile Picture </NoProfilePic>

    return (
      <StyledLayout>
        <Navbar />
        <Row type="flex" justify="center">
          <Col span={24} align="middle">
            <SubTitle>Profile</SubTitle>
            <Card
              style={{ width: 500 }}
              cover={profilePic}
              actions={[
                <Popconfirm placement='left' title="Do you want to delete your profile?" onConfirm={this.handleDeleteProfile} onCancel={this.cancelDeleteProfile} okText="Yes, delete my Profile" cancelText="Cancel">
                  <p ><Icon type="setting" /> delete profile</p>
                </Popconfirm>,
                <p onClick={this.handleEditProfile}><Icon type="user-delete" /> edit profile</p>,
              ]}
            >
              <Meta
                title={this.state.name}
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
