import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import moment from "moment";
import "moment/locale/fr";

// antd
import { DatePicker, Button, Icon, Input, Alert, message } from "antd";
const { RangePicker } = DatePicker;

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: false,
      successMessage: false,
      startDate: null,
      endDate: null,
      addressFormatted: null,
      addressCoords: {
        lat: null,
        lng: null
      },
      tattooShop: null
    };

    this.disabledDate = this.disabledDate.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleShopName = this.handleShopName.bind(this);
    this.handleAddressName = this.handleAddressName.bind(this);
    this.handleNewSpot = this.handleNewSpot.bind(this);
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().add(-1, "days");
  }

  handleDate(date) {
    let startDate = moment(date[0], "YYYY MM DD");
    let endDate = moment(date[1], "YYYY MM DD");

    this.setState({
      startDate: startDate,
      endDate: endDate,
      errorMessage: false,
      successMessage: false,
      addressCoords:{}
    });
  }

  handleShopName(e) {
    this.setState({
      tattooShop: e.target.value,
      errorMessage: false,
      successMessage: false
    });
  }

  handleAddressName(e) {
    this.setState({
      addressFormatted: e.target.value,
      errorMessage: false,
      successMessage: false
    });
  }

  handleNewSpot(event) {
    event.preventDefault();

    if (
      this.state.startDate &&
      this.state.endDate &&
      this.state.addressFormatted &&
      this.state.tattooShop
    ) {
      const keyGoogle = "AIzaSyDH5y_hZ25iSR87OMKrt9TFLH1IuO1ULrE";
      let geocodeURL =
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        this.state.addressFormatted +
        "&key=" +
        keyGoogle;

      fetch(geocodeURL)
        .then(response => response.json())
        .then(datas => {
          let country;
          let address = datas.results[0].address_components;
          for (var p = address.length - 1; p >= 0; p--) {
            if (address[p].types.indexOf("country") !== -1) {
              country = address[p].short_name;
            }
          }
          let cityCoords = {
            lat: datas.results[0].geometry.location.lat,
            lng: datas.results[0].geometry.location.lng,
            country: country
          };
          this.setState({
            addressCoords: cityCoords,
            addressFormatted: datas.results[0].formatted_address
          });
          // send coords to the reducer :
          this.props.sendCityCoords(this.state.addressCoords);

          // send form to the back
          let SessionDatas = new FormData();
          SessionDatas.append(
            "artistName",
            sessionStorage.getItem("name artist logged")
          );
          SessionDatas.append(
            "artistID",
            sessionStorage.getItem("id artist logged")
          );
          SessionDatas.append("tattooShop", this.state.tattooShop);
          SessionDatas.append(
            "shopAddress",
            datas.results[0].formatted_address
          );
          SessionDatas.append(
            "shopCountry",
            country
          );
          SessionDatas.append(
            "shopLat",
            datas.results[0].geometry.location.lat
          );
          SessionDatas.append(
            "shopLng",
            datas.results[0].geometry.location.lng
          );
          SessionDatas.append("startDate", this.state.startDate);
          SessionDatas.append("endDate", this.state.endDate);

          fetch("/addguestsession", {
            method: "POST",
            body: SessionDatas
          })
            .then(response => response.json())
            .then(answerSessionSave => {
              if (answerSessionSave.sessionSaved) {
                this.props.sendNewSession(answerSessionSave.sessionSaved);
                message.success("your new spot has been saved");
              } else {
                message.error(
                  "something went wrong, your spot hasn't been saved!"
                );
              }
            });
        })

        .catch(error => console.log("erreur fetch geocode !!!", error));
    } else {
      this.setState({
        errorMessage: "all the fields must be completed"
      });
    }
  }

  render() {
    const StyledAlert = styled(Alert)`
      text-align: center;
      color: red;
      width: 250px;
      border-radius: 20px;
      margin-top: 8px;
    `;

    const RoundButton = styled(Button)`
      border-radius: 20px
      border: none;
      margin: 0 auto;
      padding: 10px 25px;
      line-height: 0;
      &:hover {
        color: #4f4db3
      }
    `;

    const styles = {
      formsContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "250px"
      },
      icon: {
        color: "#606c88"
      }
      // je dois garder styles dans css .ant-input
      // input: {
      //   borderRadius: "50px !important",
      //   height: "50px !important",
      //   fontFamily: "lato",
      //   fontStyle: "italic",
      //   fontSize: "1rem",
      //   textAlign: "center"
      // }
    };

    return (
      <div style={styles.formsContainer}>
        <RangePicker
          disabledDate={this.disabledDate}
          size="large"
          placeholder={["from", "to"]}
          onChange={this.handleDate}
          format="DD-MM-YYYY"
          allowClear={true}
          showToday={true}
          ranges={{
            Today: [moment(), moment()],
            "This Week": [moment(), moment().endOf("week")]
          }}
        />
        <Input
          style={styles.input}
          placeholder="name of the tattoo shop"
          prefix={<Icon type="shop" style={styles.icon} />}
          onChange={this.handleShopName}
        />
        <Input
          style={styles.input}
          placeholder="where ?"
          prefix={<Icon type="environment" style={styles.icon} />}
          onChange={this.handleAddressName}
        />
        <RoundButton onClick={this.handleNewSpot}>submit </RoundButton>
        {this.state.errorMessage && (
          <StyledAlert
            className="ant-col-xs-24 ant-col-sm-16"
            message={this.state.errorMessage}
            type="error"
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: function(value) {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    },
    sendNewSession: function(value) {
      dispatch({ type: "NEW_SESSION", newSession: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artist: state.sendLoggedArtist
  };
};

const SessionFormRedux = connect(mapStateToProps, mapDispatchToProps)(
  SessionForm
);

export default SessionFormRedux;
