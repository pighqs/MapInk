import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import moment from "moment";
import "moment/locale/fr";
// antd
import "antd/dist/antd.css";
import { DatePicker, Input, Row, Col } from "antd";
const { Search } = Input;
const { RangePicker } = DatePicker;


moment.locale("fr");



class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: "",
      startDate:"",
      endDate:""
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDate = this.handleDate.bind(this);
  }

  disabledDate(current) {
    // Can not select days before today
    return current < moment().add(-1, "days");
  }



  handleDate(date) {
    let startDate = moment(date[0]);
    let endDate = moment(date[1]);
    console.log(startDate.isBetween('2018-02-01', '2018-02-25') );
    console.log(endDate.isBetween('2018-02-01', '2018-02-25') );
    this.setState({
      startDate: startDate,
      endDate:endDate
    });
    this.props.sendSearchDates(startDate, endDate);
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
        let cityCoords = {
          lat: datas.results[0].geometry.location.lat,
          lng: datas.results[0].geometry.location.lng
        };
        this.setState({
          place: cityCoords
        });
        // send coords to the reducer :
        this.props.sendCityCoords(cityCoords);
      })
      .catch(error => console.log("erreur fetch geocode !!!", error));
  }

  render() {
    let redirect;
    if (this.state.place !== "") {
      redirect = <Redirect to="/searchResults" />;
    } 
    
    return (
      <Row type="flex">
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
          />
        </Col>
        <Col span={11} offset={1}>
          <Search
            placeholder="where ?"
            onSearch={value => this.handleSearch(value)}
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
    sendSearchDates: function(startValue, endValue) {
      dispatch({ type: "NEW_SEARCH_DATES", startDate: startValue, endDate: endValue})
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
