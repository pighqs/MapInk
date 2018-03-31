import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { Row, Col, Table, Icon, Popconfirm } from "antd";

import moment from "moment";


class SessionsList extends React.Component {
  constructor() {
    super();
    this.state = {
      sessionsListFromBack: [],
      sessionsSinceLog: []
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    let mySessionsData = new FormData();
    mySessionsData.append(
      "artistID",
      sessionStorage.getItem("id artist logged")
    );

    fetch("/mysessions", {
      method: "POST",
      body: mySessionsData
    })
      .then(response => response.json())
      .then(answerMySessions => {
        this.setState({
          sessionsListFromBack: answerMySessions.sessionsList
        });
      })
      .catch(error => {
        console.log("Request mysessions failed", error);
      });
  }

  componentWillReceiveProps(nextProps) {
    let sessionsFromBackPlusNew = this.state.sessionsListFromBack.concat(
      nextProps.newSession
    );
    this.setState({
      sessionsListFromBack: sessionsFromBackPlusNew
    });
  }

  handleDelete(id, artistID) {
    fetch(`deleteguestsession/${id}/${artistID}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(result => {
        this.setState({
          sessionsListFromBack: result.sessionsList
        });

      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const colors = {
      grey: '#7d88a1 !important',
      inactiveGrey: 'rgba(0, 0, 0, 0.25) !important',
      activeViolet: '#4834d4 !important',
      hoverViolet: '#686de0 !important',
      tranparentWhite: 'rgba(255,255,255, 0.4) !important'
    };

    const StyledTable = styled(Table)`
    .ant-table-thead > tr > th {
      color: ${colors.activeViolet};
    }
    .session-row {
      border-collapse: collapse;
      > td {
        border-bottom: 1px solid ${colors.tranparentWhite};
      }
      &:hover {
        color: ${colors.activeViolet};
        background-color: ${colors.tranparentWhite};
        > td {
          background-color: ${colors.tranparentWhite};
        }
      } 
    }
    `;

    const StyledIcon = styled(Icon)`
      cursor: pointer;
      font-size: 1.1rem
    `;

    const locale = {
      filterConfirm: "Ok",
      filterReset: "Reset",
      emptyText: "No sessions registered"
    };
    const columns = [
      {
        title: "tattoo Shop",
        dataIndex: "tattooShop",
        key: "tattooShop",
        width: '25%',
        sorter: (a, b) => {if(a.tattooShop < b.tattooShop) return -1;
        if(a.tattooShop > b.tattooShop) return 1;
        return 0}
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        width: '13%',
        defaultSortOrder: 'ascend',
        render: (text, record) => (
          <span>{moment(record.startDate).format('LL')}</span>
        ),
        sorter: (a, b) => {if(a.startDate < b.startDate) return -1;
          if(a.startDate > b.startDate) return 1;
          return 0}
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        width: '13%',
        render: (text, record) => (
          <span>{moment(record.endDate).format('LL')}</span>
        ),
        sorter: (a, b) => {if(a.startDate < b.startDate) return -1;
          if(a.startDate > b.startDate) return 1;
          return 0}
      },
      {
        title: "Address",
        dataIndex: "shopAddress",
        key: "shopAddress",
        width: '44%',

      },
      {
        width: '5%',
        render: (text, record) => (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record._id, record.artistID)}
            >
              <StyledIcon type="delete" />
            </Popconfirm>
        )
      }
    ];

   

    return (
      <Row type="flex" justify="center">
      <Col xs={24} md={22}>      
      <StyledTable
        className='sessionTableList'
        columns={columns}
        rowKey={record => record._id}
        dataSource={this.state.sessionsListFromBack}
        pagination={false}
        locale={locale}
        rowClassName='session-row'
        onRow={(record) => {
          return {
            onClick: () => {this.props.sendCityCoords(record.shopCoords)},       // click row
          }
        }}
      />
      </Col>
      </Row>
    );
  }
}

// send cityCoords to the reducer
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
  };
};

const SessionsListRedux = connect(mapStateToProps, mapDispatchToProps)(
  SessionsList
);

export default SessionsListRedux;
