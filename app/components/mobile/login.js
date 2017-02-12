import React, {Component} from 'react'
import { connect } from 'react-redux'
import { login } from '../../actions/session'
import autobind from 'autobind-decorator'
import {Actions} from 'react-native-router-flux'
import { Content, Button, Form, Item, Input, Text } from 'native-base'

@connect(null, {login})
class Login extends Component {
  state = {
    username: 'allen',
    password: 'asdfasdf'
  };

  render() {
    return (
      <Content style={{marginTop: 70}}>
        <Form>
          <Item>
            <Input
              style={style.input}
              onChangeText={text => this.setState({username: text})}
              placeholder='Username'
            />
          </Item>

          <Item>
            <Input
              style={style.input}
              onChangeText={text => this.setState({password: text})}
              placeholder='Password'
              secureTextEntry={true}
            />
          </Item>

          <Button style={style.button} block primary onPress={this.login}>
            <Text>Log in</Text>
          </Button>

          <Button style={style.button} block primary onPress={() => Actions.signup()}>
            <Text>Sign up</Text>
          </Button>
        </Form>
      </Content>
    );
  }

  @autobind
  login() {
    this.props.login(this.state);
  }
}

const style = {
  input: {},
  button: {
    margin: 10,
    marginBottom: 0
  }
};

export default Login