import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

// antd 
import { Col, Form, Icon, Input, Button } from "antd";
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
            if (answerLogin.artist) {
              this.props.sendLoggedArtist(answerLogin.artist)
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
      wrapperCol: {
        xs: { span: 24 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 10,
          offset: 9
        }
      }
    };

    const RoundButton = styled(Button)`
      border-radius: 20px
      border: none;
      margin: 0 auto;
      padding: 10px 25px;
      line-height: 0;
      &:hover {
        color: #4f4db3
      }
    `;

    const WhiteText = styled.p`
    color: white;
    `;

   
   
    return (
      <div>
        <Form 
        layout='vertical'
        onSubmit={this.handleSubmit}>
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
                  <Icon type="mail" style={{color: "rgba(0,0,0,.25)"}} />
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
                  <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <RoundButton
              htmlType="submit"
            >
              Login
            </RoundButton>
          </FormItem>
        </Form>
        {this.state.logMessage && (<Col span={18} align='middle'><WhiteText>{this.state.logMessage}</WhiteText></Col>)}
      </div>
    );
  }
}

const LoginForm = Form.create()(Login);

// send artistID to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendLoggedArtist: function(value) {
      dispatch({ type: "ARTIST_IS_LOG", artist: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artist: state.sendLoggedArtist
  };
};

const LoginFormRedux = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default LoginFormRedux;
