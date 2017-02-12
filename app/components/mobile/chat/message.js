import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { TouchableOpacity, View, Text } from 'react-native'
import Submessages from './submessages'

class Message extends Component {
  state = {
    expand: false
  };

  render() {
    const message = this.props.message;
    const submessages =  <Submessages
      message={this.props.message}
      submessages={this.props.submessages}
      sendMessage={this.props.sendMessage}
    />;

    return (
      <View>
        <TouchableOpacity onPress={this.toggle}>
          <View style={[style.message, this.props.submessages.length ? style.highlight : null]}>
            <Text style={style.username}>{message.sender.username}: </Text>
            <Text>{message.content}</Text>
          </View>
        </TouchableOpacity>
        {this.state.expand ? submessages : null}
      </View>
    );
  }

  @autobind
  toggle() {
    this.setState({expand: !this.state.expand});
  }
}

const style = {
  username: {
    fontWeight: 'bold'
  },
  message: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede'
  },
  highlight: {
    backgroundColor: 'pink'
  }
};

export default Message