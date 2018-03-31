import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { List, Card, Alert } from "antd";

import moment from "moment";

//const { Meta } = Card;

class SearchResultsList extends React.Component {
  constructor() {
    super();
    this.state = {
      resultsList: []
    };
  }
 
  componentWillReceiveProps(nextProps) {
    let searchDatas = new FormData();
    //searchDatas.append("startDate", nextProps.searchDates.startDate)
    //searchDatas.append("endDate", nextProps.searchDates.endDate)
    searchDatas.append("searchPlace_lat", nextProps.searchPlace.lat)
    searchDatas.append("searchPlace_lng", nextProps.searchPlace.lng)
    searchDatas.append("searchPlace_country", nextProps.searchPlace.country)

    fetch("/gettattooers", {
      method: "POST",
      body: searchDatas
    })
      .then(response => {
        return response.json();
      })
      .then(results => {
        this.setState({
          resultsList: results.tattooersList
        });
      })
      .catch(error => {
        console.log("Request failed", error);
      });
  }

  // arrow function to bind this
  clickOnCard = city => {
    console.log(city);
  };

  render() {

      const StyledAlert = styled(Alert)`
        width:40%;
        background-color: rgba(255, 255, 255, 0.4);
        color:white;
        border: none;
        border-radius: 10px;
        .ant-alert-message {
          color: #4834d4
        }
      `

      const StyledCard = styled(Card)`
      width: 100%;
       height: 400px
      `
    return (
      <div>
        {this.state.resultsList.length > 0 ? (
          <List
            grid={{ gutter: 4, xs: 1, sm: 2, md: 3 }}
            dataSource={this.state.resultsList}
            renderItem={item => (
              <List.Item>
                <StyledCard
                  hoverable
                  onClick={() => this.props.sendCityCoords(item.shopCoords)}
                  title={item.artistName || "artist unknown"}
                  style={{  }}
                  cover={
                    <img
                      alt="example"
                      src="http://via.placeholder.com/350x200"
                    />
                  }
                >
                  {item.tattooShop}
                  <br />
                  {item.shopAddress}
                  <br />
                  from : {moment(item.startDate).format("LL")} to{" "}
                  {moment(item.endDate).format("LL")}
                </StyledCard>
              </List.Item>
            )}
          />
        ) : (
          <StyledAlert
            closable
            message="No matching results"
            description="please try with another dates or place"
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: value => {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    },
    sendDelSession: value => {
      dispatch({ type: "SESSION_DELETED", sessionID: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artistID: state.sendLoggedArtist,
    newSession: state.sendNewSession,
    searchDates: state.sendSearchDates,
    searchPlace: state.sendCityCoords
  };
};

const SearchResultsListRedux = connect(mapStateToProps, mapDispatchToProps)(
  SearchResultsList
);

export default SearchResultsListRedux;
