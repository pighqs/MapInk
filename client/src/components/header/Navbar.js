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
      artistLogged: false,
      modalVisible: false,
      linkClicked: ""
    };
  }

  handleClick(e) {
    sessionStorage.removeItem("search address");
    sessionStorage.removeItem("start date");
    sessionStorage.removeItem("end date");
    sessionStorage.removeItem("user position name");

    switch (e.key) {
      case "logout":
      sessionStorage.clear();
      this.props.sendLoggedArtist(false);
        this.setState({
          artistLogged: false
        });
        break;
      case "register":
        this.setState({
          modalVisible: true,
          linkClicked: "register"
        });
        break;
      case "login":
        this.setState({
          modalVisible: true,
          linkClicked: "login"
        });
        break;
      default:
        console.log("e.key handle by another way : ", e.key);
    }
  }

  handleCancel() {
    this.setState({
      modalVisible: false,
      linkClicked: ""
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sendLoggedArtist) {
      this.setState({
        artistLogged: nextProps.artist,
        modalVisible: false
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

    const colors = {
      grey: "#7d88a1 !important",
      inactiveGrey: "rgba(0, 0, 0, 0.25) !important",
      activeViolet: "#4834d4 !important",
      hoverViolet: "#686de0 !important"
    };

    const StyledMenuWrapper = styled.div`
      background: white !important;
    `;

    const StyledMenu = styled(Menu)`
      display:flex;
      justify-content: flex-end;
      .ant-menu-item > i {
        color: ${colors.grey}
      }
      .ant-menu-item > a {
        color: ${colors.grey}
        display: inline !important;
      }
      .ant-menu-item {
        color: ${colors.grey}
        border-bottom: 3px solid ${colors.grey}
        display: inline !important;

        &:hover {
          border-bottom: 3px solid ${colors.hoverViolet};
          color: ${colors.hoverViolet};
          > i {
            color: ${colors.hoverViolet};
          }
          > a {
            color: ${colors.hoverViolet};
          }
        }
      }
      .ant-menu-submenu {
        color: ${colors.grey};
        display: inline !important;
        border-bottom: 3px solid ${colors.grey}
        &:hover {
          border-bottom: 3px solid ${colors.hoverViolet};
          color: ${colors.hoverViolet};
          > .ant-menu-submenu-title {
            cursor: default;
            color: ${colors.hoverViolet};
          }
        }
      }

      .ant-menu-item-selected {
        border-bottom: 3px solid ${colors.activeViolet};
        > i {
          color: ${colors.activeViolet};
        }
        > a {
          color: ${colors.activeViolet};
        }
      }

      .ant-menu-item-disabled {
        border-bottom: 3px solid ${colors.inactiveGrey};
        > i {
          color: ${colors.inactiveGrey};
        }
        > a {
          color: ${colors.inactiveGrey};
        }
      }
    `;

    const StyledDropItem = styled(Menu.Item)`
      color: ${colors.grey}
      border-bottom: none !important;
      &:hover {
        color: ${colors.hoverViolet};
        border-bottom: none !important;
      }import SessionItem from '../lists/SessionItem';

    `;

    const StyledNavbarIcon = styled(Icon)`
    font-size: 1rem;
    `

    const StyledModal = styled(Modal)`
      position: absolute;
      top: 49px;
      right: 0px;
      font-family: "Lato", sans-serif;
      > div {
        width: 400px;
      }
      .ant-modal-header {
        text-align: center;
        .ant-modal-title {
          letter-spacing: 0.1em;
          color: ${colors.activeViolet};
        }
      }
    `;

    let logOutItem, logItem, profileItem, sessionsItem;
    if (this.props.artist._id) {
      profileItem = (
        <Menu.Item key="profile">
        <StyledNavbarIcon type="user" /> 
         <Link to="/profile">your profile</Link>
        </Menu.Item>
      );
      sessionsItem = (
        <Menu.Item key="guestsessions">
        <StyledNavbarIcon type="calendar" />
        <Link to="/guestsessions">your guest spots</Link>
      </Menu.Item>
      )
      logOutItem = (
        <Menu.Item key="logout">
          <StyledNavbarIcon type="logout" /> logout
        </Menu.Item>
      );
    } else {
      logItem = (
        <SubMenu
          title={
            <span>
              <StyledNavbarIcon type="login" />Artist Access
            </span>
          }
        >
          <StyledDropItem key="login"><Icon type="user" />Login</StyledDropItem>
          <StyledDropItem key="register"><Icon type="user-add" />register</StyledDropItem>
        </SubMenu>
      );
    }

    // afficher formulaire correspondant au lien cliqué ds modal:
    let modalForm;
    switch (this.state.linkClicked) {
      case "register":
        modalForm = <RegisterForm />;
        break;
      case "login":
        modalForm = <LoginForm />;
        break;
      default:
        modalForm = null;
    }

    return (
      <StyledMenuWrapper>
        <StyledMenu
          onClick={this.handleClick}
          selectedKeys={[href]}
          mode="horizontal"
        >
          <Menu.Item key="home">
            <StyledNavbarIcon type="home" />
            <Link to="/">Home</Link>
          </Menu.Item>
          {profileItem}
          {sessionsItem}
          {logOutItem}
          {logItem}
        </StyledMenu>
        <StyledModal
          bodyStyle={{ background: "#4f4db3" }}
          title={this.state.linkClicked.toUpperCase()}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          footer={null}
          wrapClassName="login-modal"
        >
          {modalForm}
        </StyledModal>
      </StyledMenuWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artist: value });
    },
    sendActiveLink: function(value) {
      dispatch({ type: "ACTIVE_LINK", activeLink: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artist: state.sendLoggedArtist,
    activeLink: state.sendActiveLink
  };
};

const NavbarRedux = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarRedux;
