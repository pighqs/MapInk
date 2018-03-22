// reducer appelé par fonction sendActiveLink(e.key) dans component Navbar
// il renvoie state.cityCoords en mapStateToProps

const sendActiveLink = (state = { activeLink:"home" }, action) => {
    if (action.type === "ACTIVE_LINK") {
      return action.activeLink;
    } else {
      return state;
    }
  }
  
  export default sendActiveLink;