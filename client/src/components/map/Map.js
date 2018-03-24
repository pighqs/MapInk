import React from "react";
import { connect } from "react-redux";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import { Spin, Icon } from 'antd';


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
  
  componentWillMount() {
    var options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    function success(pos) {
      var crd = pos.coords;
    
      console.log('Votre position actuelle est :');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`Plus ou moins ${crd.accuracy} mètres.`);
    };
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  componentWillReceiveProps(nextProps) {
    //nouvelles props reçues via mapStateToProps
    console.log(
      "Map reçoit nextProps: ",
      nextProps.newCoords
    );
    this.setState({
      center: nextProps.newCoords
    });
  }




  handleMarkerClick() {
    //console.log(`coucou`);
  }

  render() {
    console.log("this.state.center", this.state.center)
    const MapWithAMarker = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap defaultZoom={12} defaultCenter={this.state.center}>
          <Marker position={this.state.center} onClick={props.onMarkerClick} />
        </GoogleMap>
      ))
    )
    const styles = {
      spinContainer: {
        height:'100vh',
        backgroundColor: '#e7ecf7'
      },
      spin: {
        lineHeight:'90vh',
        color:'#4834d4',
        fontSize: '64px'
      }
    }
    const spinIcon = <Icon type="loading" spin />;

    if(!this.state.center.lat) {
      return (
        <div style={styles.spinContainer}>
          <Spin indicator={spinIcon} style={styles.spin}/>
        </div>
      );

    } else {
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
}

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCoords
  return {
    newCoords: state.sendCityCoords
  };
};

const MapRedux = connect(mapStateToProps, null)(Map);

export default MapRedux;
