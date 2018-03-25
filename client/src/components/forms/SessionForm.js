import React from "react";
import { connect } from "react-redux";

import moment from "moment";
import "moment/locale/fr";

// antd
import "antd/dist/antd.css";
import { DatePicker, Button, Icon, Input, Row, Col, Alert, message } from "antd";
const { RangePicker } = DatePicker;

moment.locale("fr");



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
    this.handleNewSpot = this.handleNewSpot.bind(this);
    this.handleAddressName = this.handleAddressName.bind(this);
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().add(-1, "days");
  }

  handleDate(date) {
    let startDate = moment(date[0]);
    let endDate = moment(date[1]);
    console.log(startDate.isBetween("2018-02-01", "2018-02-25"));
    console.log(endDate.isBetween("2018-02-01", "2018-02-25"));
    this.setState({
      startDate: startDate,
      endDate: endDate,
      errorMessage: false,
      successMessage: false
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
          let cityCoords = {
            lat: datas.results[0].geometry.location.lat,
            lng: datas.results[0].geometry.location.lng
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
            "artistID",
            sessionStorage.getItem("id artist logged")
          );
          SessionDatas.append("tattooShop", this.state.tattooShop);
          SessionDatas.append(
            "shopAddress",
            datas.results[0].formatted_address
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

    ///
  }

  render() {
    let alertMessage;
    if (this.state.errorMessage) {
      alertMessage = (
        <Alert
          className="alertMessage ant-col-xs-24 ant-col-sm-16"
          message={this.state.errorMessage}
          type="error"
        />
      );
    }

    return (
      <div>
        <Row type="flex" justify="center">
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
            className="cal customInput"
          />
        </Row>
        <Row type="flex" justify="space-around">
          <Col span={11}>
            <Input
              placeholder="name of the tattoo shop"
              prefix={<Icon type="shop" style={{ color: "#606c88" }} />}
              onChange={this.handleShopName}
              className="customInput"
            />
          </Col>
          <Col span={11}>
            <Input
              placeholder="where ?"
              prefix={<Icon type="environment" style={{ color: "#606c88" }} />}
              onChange={this.handleAddressName}
              className="customInput"
            />
          </Col>
        </Row>
          <Button className="roundBTN" onClick={this.handleNewSpot}>
            submit{" "}
          </Button>
          {alertMessage}
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
    artistID: state.sendLoggedArtist
  };
};

const SessionFormRedux = connect(mapStateToProps, mapDispatchToProps)(
  SessionForm
);

export default SessionFormRedux;
