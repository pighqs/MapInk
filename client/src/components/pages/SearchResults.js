import React from "react";
import styled from "styled-components";

import Map from "../map/Map";
import SearchForm from "../forms/SearchForm";
import Navbar from "../header/Navbar";

// antd
import { Layout } from "antd";
import { Row, Col } from "antd";

class SearchResults extends React.Component {
  render() {
    const StyledLayout = styled(Layout)`
      min-height: 100vh;
      background: #606c88;
      background: -webkit-linear-gradient(to top, #4834d4, #606c88);
      background: linear-gradient(to top, #4834d4, #606c88);
    `;
    const SubTitle = styled.h2`
      color: white;
      margin: 1rem 0 2rem 0;
      font-size: 2rem;
      font-family: "Lato", "Monospaced Number";
      font-style: italic;
    `;
    return (
      <StyledLayout>
        <Navbar />
        <Row type="flex" justify="center">
          <Col span={14} align="middle">
            <Row type="flex" justify="center">
              <SubTitle className="white">These are the tattooers available</SubTitle>
              <SearchForm />
            </Row>
          </Col>
          <Col span={10} align="middle">
            <Map />
          </Col>
        </Row>
      </StyledLayout>
    );
  }
}

export default SearchResults;
