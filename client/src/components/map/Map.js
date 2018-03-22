import React from "react";
import { connect } from "react-redux";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      center: {
        lat: null,
        lng: null
      }
    };
  }
  
  componentWillReceiveProps(nextProps) {
    //nouvelles props reçues via mapStateToProps
    console.log(
      "Map reçoit nextProps: ",
      nextProps.newCity
    );
    this.setState({
      center: nextProps.newCity
    });
  }




  handleMarkerClick() {
    //console.log(`coucou`);
  }

  render() {
    console.log("center de la map", this.state.center)
    const MapWithAMarker = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap defaultZoom={12} defaultCenter={this.state.center}>
          <Marker position={this.state.center} onClick={props.onMarkerClick} />
        </GoogleMap>
      ))
    )

    return (
      <MapWithAMarker
        isMarkerShown
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDH5y_hZ25iSR87OMKrt9TFLH1IuO1ULrE"
        loadingElement={<div style={{ height: `100vh`}} />}
        containerElement={<div style={{ height: `100vh`, width: `100%` }} />}
        mapElement={<div style={{ height: `100vh`}} />}
        onMarkerClick={this.handleMarkerClick}
      />

    );
  }
}

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    newCity: state.sendCityCoords
  };
};

const MapRedux = connect(mapStateToProps, null)(Map);

export default MapRedux;
