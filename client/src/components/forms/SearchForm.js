import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import moment from "moment";
import "moment/locale/fr";
// antd
import { DatePicker, Input, Row, Col, Icon } from "antd";
const { Search } = Input;
const { RangePicker } = DatePicker;

moment.locale("fr");

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: null,
      startDate: null,
      endDate: null,
      geoLocateplace: {}
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleGeolocate = this.handleGeolocate.bind(this);
  }
  handleGeolocate() {
    const getPosition = options => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    getPosition().then(position => {
      const latlng = `${position.coords.latitude},${position.coords.longitude}`;
      const keyGoogle = "AIzaSyDH5y_hZ25iSR87OMKrt9TFLH1IuO1ULrE";
      const geocodeURL =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        latlng +
        "&key=" +
        keyGoogle;

      fetch(geocodeURL)
        .then(response => response.json())
        .then(datas => {
          this.setState({
            geoLocateplace: {
              name: datas.results[0].formatted_address
            }
          });
        });
    });
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
      endDate: endDate
    });
  }

  handleSearch(searchValue) {
    let city = searchValue;
    const keyGoogle = "AIzaSyDH5y_hZ25iSR87OMKrt9TFLH1IuO1ULrE";
    let geocodeURL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      city +
      "&key=" +
      keyGoogle;

    fetch(geocodeURL)
      .then(response => response.json())
      .then(datas => {
        sessionStorage.setItem(
          "search address",
          datas.results[0].formatted_address
        );
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
          place: cityCoords
        });
        // send coords to the reducer :
        this.props.sendCityCoords(cityCoords);
        console.log(moment(this.state.startDate).format() === "Invalid date");
        let searchDatas = new FormData();
        if (!this.state.startDate || !this.state.startDate) {
          searchDatas.append("searchStartDate",moment().format());
          searchDatas.append("searchEndDate",moment().add(1, 'months').format());
        } else {
          searchDatas.append("searchStartDate",moment(this.state.startDate).format());
          searchDatas.append("searchEndDate",moment(this.state.endDate).format());
        }
          searchDatas.append("searchPlace_lat", cityCoords.lat);
          searchDatas.append("searchPlace_lng", cityCoords.lng);
          searchDatas.append("searchPlace_country", country);

          fetch("/gettattooers", {
            method: "POST",
            body: searchDatas
          })
            .then(response => {
              return response.json();
            })
            .then(searchResults => {
              this.props.sendSearchResults(searchResults.tattooersList);
            })
            .catch(error => {
              console.log("Request failed", error);
            });
        
      })

      .catch(error => console.log("erreur fetch geocode !!!", error));
  }

  render() {
    let redirect;
    if (this.state.place !== null) {
      redirect = <Redirect to="/searchResults" />;
    }

    // let defaultDates;
    // sessionStorage.getItem("start date")
    //   ? (defaultDates = [
    //       moment(sessionStorage.getItem("start date"), "YYYY MM DD"),
    //       moment(sessionStorage.getItem("end date"), "YYYY MM DD")
    //     ])
    //   : (defaultDates = this.props.placeholder);

    const styles = {
      formsContainer: {
        marginBottom: "50px"
      }
    };

    const StyledClickableIcon = styled(Icon)`
      cursor: pointer;
      font-size: 1.2rem;
      color: #686de0;
    `;

    return (
      <Row type="flex" justify="center" style={styles.formsContainer}>
        <Col span={12}>
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
            className="cal"
            //defaultValue={defaultDates}
          />
        </Col>
        <Col span={11}>
          <Search
            prefix={
              <StyledClickableIcon
                type="environment-o"
                onClick={this.handleGeolocate}
              />
            }
            placeholder={"where ?"}
            onSearch={value => this.handleSearch(value)}
            // defaultValue={
            //   this.state.geoLocateplace.name ||
            //   sessionStorage.getItem("search address") ||
            //   null
            // }
          />
          {redirect}
        </Col>
      </Row>
    );
  }
}

// send cityCoords to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: function(value) {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    },
    sendSearchResults: function(value) {
      dispatch({ type: "NEW_SEARCH_RESULTS", searchResults: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    newCity: state.sendCityCoords
  };
};

const SearchFormRedux = connect(mapStateToProps, mapDispatchToProps)(
  SearchForm
);

export default SearchFormRedux;
