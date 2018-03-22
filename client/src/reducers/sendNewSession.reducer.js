// reducer appelé par fonction sendNewSession(value) dans component SesssionForm
// il renvoie state.newSession en mapStateToProps

const sendNewSession = (state = { newSession:{} }, action) => {
        if (action.type === "NEW_SESSION") {
      return action.newSession;
    } else {
      return state;
    }
  }
  
  export default sendNewSession;