import Map from "../map/Map";
import SearchForm from "../forms/SearchForm";
import Navbar from '../header/Navbar'

import React from "react";

// antd
import { Layout } from "antd";
import { Row, Col } from "antd";


class SearchResults extends React.Component {


  render() {
    return (
      <Layout className="layout" id="searchResults">
      <Navbar/>
        <Row type="flex" justify="center">
          <Col span={14} align="middle">
            <Row type="flex" justify="center">
              <h2 className="white">These are the tattooers available</h2>
              <SearchForm />
            </Row>
          </Col>
          <Col span={10} align="middle">
            <Map />
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default SearchResults;
