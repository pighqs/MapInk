// reducer appelé par fonction sendCityCoords(cityCoords) dans component SearchForm
// il renvoie state.cityCoords en mapStateToProps

const sendLoggedArtist = (state = { loggedArtist:false }, action) => {
    if (action.type === "ARTIST_IS_LOG") {
      return action.artistID;
    } else {
      return state;
    }
  }
  
  export default sendLoggedArtist;