import React from "react";
import styled from "styled-components";

import Navbar from "../header/Navbar";
import SearchForm from "../forms/SearchForm";

// antd
import { Layout, Row, Col } from "antd";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    sessionStorage.clear();
    this.setState({
      logStatus: false
    });
  }

  render() {
    const StyledLayout = styled(Layout)`
      min-height: 100vh;
      background: url("../imgs/alex-hockett-41555_NB.jpg") no-repeat fixed top;
      background-size: 145%;
    `;
    const MapinkBigTitle = styled.h1`
      font-size: 6rem;
      letter-spacing: 0.5rem;
      color: white;
      margin: 7rem 0 0 0;
      background: #4834d4;
      border-radius: 100px;
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
          <Col span={8} align="middle">
            <MapinkBigTitle> MAPINK </MapinkBigTitle>
            <SubTitle>find the best tattoo artists around you</SubTitle>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={10}>
            <SearchForm />
          </Col>
        </Row>
      </StyledLayout>
    );
  }
}

export default Home;
