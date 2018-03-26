import React from "react";
import { connect } from "react-redux";

import { Table, Icon, Divider, Popconfirm } from "antd";

import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

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
    const locale = {
      filterConfirm: "Ok",
      filterReset: "Reset",
      emptyText: "No sessions registered"
    };
    const columns = [
      {
        title: "tattoo Shop",
        dataIndex: "tattooShop",
        key: "tattooShop"
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate"
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate"
      },
      {
        title: "Address",
        dataIndex: "shopAddress",
        key: "shopAddress"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record._id, record.artistID)}
            >
              <Icon className="white clickable" type="delete" />
            </Popconfirm>
          </span>
        )
      }
    ];

    return (
      <Table
        columns={columns}
        rowKey={record => record._id}
        dataSource={this.state.sessionsListFromBack}
        pagination={false}
        locale={locale}
      />
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
