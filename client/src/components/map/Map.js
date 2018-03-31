import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import { Spin, Icon, Tooltip } from "antd";

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      center: {
        lat: null,
        lng: null
      },
      spinActive: false
    };
    this.geolocate = this.geolocate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //nouvelles props reçues via mapStateToProps
    console.log("Map reçoit nextProps: ", nextProps.newCoords);
    this.setState({
      center: {
        lat: Number(nextProps.newCoords.lat),
        lng: Number(nextProps.newCoords.lng)
      }
    });
  }

  geolocate() {
    this.setState({
      spinActive: true
    });
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      });
      sessionStorage.setItem("user position lat", this.state.center.lat);
      sessionStorage.setItem("user position lng", this.state.center.lng);
      this.setState({
        spinActive: false
      });
    });
  }

  handleMarkerClick() {
    //console.log(`coucou`);
  }

  render() {
    const MapWithAMarker = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap defaultZoom={12} defaultCenter={this.state.center}>
          <Marker position={this.state.center} onClick={props.onMarkerClick} />
        </GoogleMap>
      ))
    );

    const StyledDiv = styled.div`
      height: 100vh;
      background-color: #b1b9d1;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const StyledSpin = styled(Spin)`
    color: white;
    font-size: 60px;
    `;

    const StyledTooltip = styled(Tooltip)`
    background-color: #4834d4;
    color: red
    `;

    const StyledGeolocateIcon = styled(Icon)`
        color: white;
        font-size: 64px;
        cursor: pointer
      },`
      
    const spinIcon = <Icon type="loading" spin />;

    if (!this.state.center.lat) {
      return (
        <StyledDiv>
          {!this.state.spinActive && (
            <StyledTooltip
              arrowPointAtCenter
              title="find my position"
            >
              <StyledGeolocateIcon
                type="environment-o"
                onClick={this.geolocate}
              />
            </StyledTooltip>
          )}
          {this.state.spinActive && (
            <StyledSpin indicator={spinIcon} />
          )}
        </StyledDiv>
      );
    } else {
      return (
        <MapWithAMarker
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDH5y_hZ25iSR87OMKrt9TFLH1IuO1ULrE"
          loadingElement={<div style={{ height: `100vh` }} />}
          containerElement={<div style={{ height: `100vh`, width: `100%` }} />}
          mapElement={<div style={{ height: `100vh` }} />}
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
