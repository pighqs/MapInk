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
      linkClicked: ""
    };
  }

  handleClick(e) {
    sessionStorage.removeItem('search address');
    sessionStorage.removeItem('start date');
    sessionStorage.removeItem('end date');
    sessionStorage.removeItem("user position name");
 
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
        artistID: nextProps.sendLoggedArtist,
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
        color: ${colors.grey}
        display: inline !important;
        border-bottom: 3px solid ${colors.grey}
        &:hover {
          border-bottom: 3px solid ${colors.hoverViolet};
          color: ${colors.hoverViolet};
          > .ant-menu-submenu-title {
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
      }
    `;

    const StyledModal = styled(Modal)`
      position: absolute;
      top: 49px;
      left: 0px;
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

    let logOutItem, logItem, sessionsIsDisabled;
    if (sessionStorage.getItem("id artist logged")) {
      logOutItem = (
        <Menu.Item key="logout">
          <Icon type="logout" /> logout
        </Menu.Item>
      );
      sessionsIsDisabled = false;
    } else {
      logItem = (
        <SubMenu
          title={
            <span>
              <Icon type="login" />Artist Access
            </span>
          }
        >
          <StyledDropItem key="register">register</StyledDropItem>
          <StyledDropItem key="login">Login</StyledDropItem>
        </SubMenu>
      );
      sessionsIsDisabled = true;
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
            <Icon type="home" />
            <Link to="/">Home</Link>
          </Menu.Item>
          {logOutItem}
          {logItem}
          <Menu.Item disabled={sessionsIsDisabled} key="guestsessions">
            <Icon type="calendar" />
            <Link to="/guestsessions">your guest spots</Link>
          </Menu.Item>
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
