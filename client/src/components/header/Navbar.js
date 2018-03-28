import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import RegisterForm from "../forms/Register";
import LoginForm from "../forms/Login";

// antd
import { Menu, Icon, Modal } from "antd";
const SubMenu = Menu.SubMenu;

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      artistID: false,
      modalVisible: false,
      modalToShow: ""
    };
  }

  // showModal = () => {
  //   console.log('show it')
  //   this.setState({
  //     modalVisible: true
  //   });
  // };

  handleClick(e) {
    switch (e.key) {
      case "logout":
        this.props.sendLoggedArtist(false);
        sessionStorage.clear();
        this.setState({
          artistID: false
        });
        break;
      case "register":
      this.setState({
        modalVisible: true,
        modalToShow: "register"
      });
        break;
        case "login":
        this.setState({
          modalVisible: true,
          modalToShow: "login"
        });
        break;
      default:
        console.log("e.key handle by another way : ", e.key);
    }

  
  }

  handleCancel() {
    this.setState({
      modalVisible: false
    });
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.sendLoggedArtist) {
      let isModalVisible = this.state.modalVisible;
      this.setState({
        artistID: nextProps.sendLoggedArtist,
        modalVisible: !isModalVisible
      });
    }
  }

  render() {
    let href = window.location.href.split("/");
    // renvoie array ou la 4e position est l'adresse
    href = href[3];
    if (href.length === 0) {
      href = "home";
    }
    const StyledSubMenu = styled(SubMenu)`
      display: inline !important;
      &:hover {
        border-bottom: 3px solid #686de0 !important;
      }
    `;
    const MenuItem = styled(Menu.Item)`
      color: #7d88a1 !important;
      &:hover {
        color: #686de0 !important;
        border-bottom: 3px solid #686de0 !important;
      }
    `;
    const StyledLink = styled(Link)`
      display: inline !important;
      &:hover {
        color: #686de0 !important;
      }
    `;
    const StyledDropItem = styled(Menu.Item)`
      border-bottom: none !important;
      &:hover {
        border-bottom: none !important;
      }
    `;
    const StyledIcon = styled(Icon)`
    color: #7d88a1 !important;
    &:hover {
      color: #686de0 !important;
    }import RegisterFormRedux from '../forms/Register';

    `;
    const StyledModal = styled(Modal)`
      top: 49px;
    `;

    let logOutItem, logItem, SessionsItem;
    if (sessionStorage.getItem("id artist logged")) {
      logOutItem = (
        <MenuItem key="logout">
          <StyledIcon type="logout" /> logout{" "}
        </MenuItem>
      );
      SessionsItem = (
        <MenuItem key="guestsessions">
          <StyledIcon type="calendar" />
          <StyledLink to="/guestsessions">your sessions as guest</StyledLink>
        </MenuItem>
      );
    } else {
      logItem = (
        <StyledSubMenu
          title={
            <span>
              <StyledIcon type="login" />Artist Access
            </span>
          }
        >
          <StyledDropItem key="register">register</StyledDropItem>
          <StyledDropItem key="login">Login</StyledDropItem>
        </StyledSubMenu>
      );
      SessionsItem = (
        <MenuItem disabled key="guestsessions">
          <StyledIcon type="calendar" />
          <StyledLink to="/guestsessions">your sessions as guest</StyledLink>
        </MenuItem>
      );
    }

    let modalForm;
    switch (this.state.modalToShow) {
      case "register":
        modalForm = <RegisterForm />;
        break;
      case "login":
        modalForm = <LoginForm />;
        break;
      default:
        console.log("Sorry, no modal form");
    }

    return (
      <div>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[href]}
          mode="horizontal"
        >
          <MenuItem key="home">
            <StyledIcon type="home" />
            <StyledLink to="/">Home</StyledLink>
          </MenuItem>
          {logOutItem}
          {logItem}
          {SessionsItem}
        </Menu>
        <StyledModal
          bodyStyle={{ background: "#4f4db3" }}
          title="Your new Sessions infos"
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          footer={null}
          wrapClassName="login-modal"
        >
          {modalForm}
        </StyledModal>
      </div>
    );
  }
}

//send artistID to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: function(value) {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    },
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artistID: value });
    },
    sendActiveLink: function(value) {
      dispatch({ type: "ACTIVE_LINK", activeLink: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artistID: state.sendLoggedArtist,
    activeLink: state.sendActiveLink
  };
};

const NavbarRedux = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarRedux;
