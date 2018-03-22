import React, { Component } from "react";
import { createStore } from "redux";

class ReduxDemo extends Component {
  render() {

    // step_2 Reducer : state et action
    const reducer = (state, action) => {
      if (action.type === "ATTACK") {
        return action.payload;
      }
      if (action.type === "GREEN ATTACK") {
        return action.payload;
      }
      return state;
    }

    // step_1 Store : reducer et state
    const store = createStore(reducer, "Peace");

    // step_3 Suscribe
    let etatStore;
    store.subscribe(() => {
      console.log("etat du store maintenant : ", store.getState());
    etatStore = store.getState();
    return etatStore;
    });

    // step_4 Dispatch Action
    store.dispatch({ type: "popo", payload: "Iron Man" });
    store.dispatch({ type: "ATTACK", payload: "Iron Man" });
    store.dispatch({ type: "GREEN ATTACK", payload: "Hulk" });



    return <div>{etatStore}</div>;
  }
}

export default ReduxDemo;
