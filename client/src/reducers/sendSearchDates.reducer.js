// reducer appelé par fonction sendCityCoords(cityCoords) dans component SearchForm
// il renvoie state.cityCoords en mapStateToProps

const sendSearchDates = (state = {searchDates:{}}, action) => {
    if (action.type === "NEW_SEARCH_DATES") {
      return action.searchDates;
    } else {
      return state;
    }
  }
  
  export default sendSearchDates;