// reducer appelé par fonction sendCityCoords(cityCoords) dans component SearchForm
// il renvoie state.cityCoords en mapStateToProps

const sendCityCoords = (state = {cityCoords:""}, action) => {
    if (action.type === "NEW_CITY_COORDS") {
      return action.cityCoords;
    } else {
      return state;
    }
  }
  
  export default sendCityCoords;