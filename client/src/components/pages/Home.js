import Navbar from '../header/Navbar'
import SearchForm from "../forms/SearchForm";

import React from "react";

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
    

    return (
      <Layout className="layout" id="home">
      <Navbar/>
        <Row type="flex" justify="center">
          <Col span={8} align="middle">
            <h1 className="mapInk">MAPINK</h1>
            <h2 className="white">
              find the best tattoo artists around you
            </h2>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={10}>
          <SearchForm />
          </Col>
        </Row>
      </Layout>
    );
  }
}


export default Home;
