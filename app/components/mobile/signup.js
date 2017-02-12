import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { signup } from '../../actions/session'
import { Content, Button, Form, Item, Input, Text } from 'native-base'


@connect(null, {signup})
class Signup extends Component {
  state = {
    username: '',
    email: '',
    location: '',
    password: ''
  };

  render() {
    return (
      <Content style={{marginTop: 64}}>
        <Form>
          <Item>
            <Input
              onChangeText={this.setUser.bind(this, 'username')}
              placeholder='Username'
            />
          </Item>
          <Item>
            <Input
              onChangeText={this.setUser.bind(this, 'email')}
              placeholder='Email'
            />
          </Item>
          <Item>
            <Input
              onChangeText={this.setUser.bind(this, 'location')}
              placeholder='Location'
            />
          </Item>
          <Item>
            <Input
              onChangeText={this.setUser.bind(this, 'password')}
              placeholder='Password'
              secureTextEntry={true}
            />
          </Item>
          <Button style={style.button} block primary onPress={this.signup}>
            <Text>Sign up</Text>
          </Button>
        </Form>
      </Content>
    );
  }

  setUser(p, val) {
    this.setState({[p]: val});
  }

  @autobind
  signup() {
    this.props.signup(this.state);
  }
}

const style = {
  button: {
    margin: 10
  }
};

export default Signup