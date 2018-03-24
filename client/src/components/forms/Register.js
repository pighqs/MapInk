import React from "react";
import { connect } from "react-redux";
// antd
import "antd/dist/antd.css";
import {
  Form, Input, Icon, Button, Alert, message
} from "antd";
const FormItem = Form.Item;



class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      confirmDirty: false,
      registerMessage: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      registerMessage: false
    })
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let registrationDatas = new FormData();
        registrationDatas.append("mail", values.email);
        registrationDatas.append("password", values.password);
        registrationDatas.append("artistName", values.artistName);
        registrationDatas.append("website", values.website);

        fetch("/register", {
          method: "POST",
          body: registrationDatas
        })
          .then(response => response.json())
          .then(answerRegistration => {
            //console.log("testRegister", answerRegistration.testRegister);
            //console.log("errRegister", answerRegistration.errRegister);
            if (answerRegistration.testRegister) {
              sessionStorage.setItem("id artist logged", answerRegistration.testRegister);
              sessionStorage.setItem("name artist logged", answerRegistration.artistName);
              this.props.sendLoggedArtist(answerRegistration.testRegister);
              this.setState({ registerMessage: false });
              message.success("your account has been saved");

            } else {
              this.setState({ registerMessage: answerRegistration.errRegister });
              this.props.form.resetFields(["password", "confirm", "artistName"]);
              message.error("something went wrong, registration failed!");
            }
          })
          .catch(error => {
            console.log("Request failed", error);
          });
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Passwords doesn't match!");
    } else {
      callback();
    }
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
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
        sm: { span: 18 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 8
        }
      }
    };


    let errorMessage;
    if (this.state.registerMessage) {
      errorMessage = (
        <Alert
          className="alertMessage ant-col-xs-24 ant-col-sm-16"
          message={this.state.registerMessage}
          type="error"
        />
      );
    }

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout}>
            {getFieldDecorator("email", {
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
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Please enter your password!"
                },
                {
                  validator: this.checkConfirm
                }
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
          <FormItem {...formItemLayout}>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "Please confirm your password!"
                },
                {
                  validator: this.checkPassword
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Confirm Password"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout}>
            {getFieldDecorator("artistName", {
              rules: [
                {
                  required: true,
                  message: "Please enter your Artist Name!",
                  whitespace: true
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="name"
                placeholder="Your name as a Tatto Artist"
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout}>
            {getFieldDecorator("website", {
              rules: [{ required: false, message: "Please input website!" }]
            })(
              <Input
                prefix={
                  <Icon type="global" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="website"
                placeholder="Website"
              />
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button className="registerLoginBTN roundBTN" htmlType="submit">
              Register
            </Button>
          </FormItem>
        </Form>
        {errorMessage}
      </div>
    );
  }
}

const RegisterForm = Form.create()(Register);

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

const RegisterFormRedux = connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

export default RegisterFormRedux;