import React from "react";
import { Link } from 'react-router-dom'
import { connect } from "react-redux";



// antd 
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;



class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      artistID: false,
    }
  }



  handleClick(e) {
     if (e.key === "logout") {
       console.log("cliqué sur logout");
       this.props.sendLoggedArtist(false);
       sessionStorage.clear();
       this.setState({
         artistID:false
       })
     } 
  }

  componentWillReceiveProps(nextProps) {
     //console.log(nextProps)
     if(nextProps.sendLoggedArtist) {
      this.setState({
       artistID: nextProps.sendLoggedArtist
      })
     }
  }

  render() {
    let href=window.location.href.split('/')
    // renvoie array ou la 4e position est l'adresse
    href=href[3];
    if (href.length === 0) {
      href ="home"
    }
    let logOutItem, logItem, SessionsItem;
    if (sessionStorage.getItem("id artist logged")) {
      logOutItem = <Menu.Item key="logout"><Icon type="logout" /> logout </Menu.Item>
      SessionsItem = <Menu.Item key="guestsessions"><Icon type="calendar" /><Link className="link" to="/guestsessions">your sessions as guest</Link></Menu.Item>
    } else {
      logItem = <SubMenu title={<span><Icon type="login" />Artist Access</span>} className="link">
      <Menu.Item className="submenu-link" key="login" ><Link to="/login">Login</Link></Menu.Item>
      <Menu.Item className="submenu-link" key="register" ><Link to="/register">register</Link></Menu.Item>
    </SubMenu >
      // <Menu.Item key="registerlogin"><Icon type="login" /><Link className="link" to="/registerlogin">Artist Access</Link></Menu.Item>
      SessionsItem = <Menu.Item disabled key="guestsessions"><Icon type="calendar" /><Link className="link" to="/guestsessions">your sessions as guest</Link></Menu.Item>
    }


    return (
      
      <Menu
        onClick={this.handleClick}
        selectedKeys={[href]}
        mode="horizontal"
      >
        <Menu.Item key="home">
        <Icon type="home" /><Link className="link" to="/">Home</Link>
        </Menu.Item>
        {logOutItem}
        {logItem}
        {SessionsItem}
      </Menu>
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
