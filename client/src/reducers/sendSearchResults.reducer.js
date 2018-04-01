// reducer appelé par fonction sendCityCoords(cityCoords) dans component SearchForm
// il renvoie state.cityCoords en mapStateToProps

const sendSearchResults = (state = {searchResults:{}}, action) => {
    if (action.type === "NEW_SEARCH_RESULTS") {
      return action.searchResults
    } else {
      return state;
    }
  }
  
  export default sendSearchResults;