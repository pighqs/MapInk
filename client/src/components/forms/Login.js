import React from "react";
import { connect } from "react-redux";

// antd
import "antd/dist/antd.css";
import { Form, Icon, Input, Button, Alert } from "antd";
const FormItem = Form.Item;

class Login extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      logMessage: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      logMessage: false
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let loginDatas = new FormData();
        loginDatas.append("mail", values.emailLogin);
        loginDatas.append("password", values.passwordLogin);

        fetch("/login", {
          method: "POST",
          body: loginDatas
        })
          .then(response => response.json())
          .then(answerLogin => {
            if (answerLogin.testLogin) {
              sessionStorage.setItem("id artist logged", answerLogin.testLogin);
              sessionStorage.setItem(
                "name artist logged",
                answerLogin.artistName
              );
              this.props.sendLoggedArtist(answerLogin.testLogin);
              this.setState({ logMessage: false }); // redirection
            } else {
              this.setState({ logMessage: answerLogin.errLogin });
              this.props.form.resetFields(["password"]);
            }
          })
          .catch(error => {
            console.log("Request failed", error);
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    let errorMessage;
    if (this.state.logMessage) {
      errorMessage = (
        <Alert
          className="alertMessage ant-col-xs-24 ant-col-sm-16"
          message={this.state.logMessage}
          type="error"
        />
      );
    }

    return (
      <div ref="loginForm">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem {...formItemLayout}>
            {getFieldDecorator("emailLogin", {
              rules: [
                {
                  type: "email",
                  message: "invalid Email!"
                },
                {
                  required: true,
                  message: "Please enter your Email!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator("passwordLogin", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button
              className="registerLoginBTN login-form-button roundBTN"
              htmlType="submit"
            >
              Login
            </Button>
          </FormItem>
        </Form>
        {errorMessage}
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);

// send artistID to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artistID: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artistID: state.sendLoggedArtist
  };
};

const LoginFormRedux = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default LoginFormRedux;
