import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { List, ListItem, Item, Input, Text } from 'native-base'
import { View } from 'react-native'

const style = {
  submessages: {
    marginLeft: 15
  },
  inputContainer: {
    margin: 4,
    marginLeft: 12
  },
  input: {
    padding: 10,
    height: 40
  }
};

class Submessages extends Component {
  state = {
    inputValue: ''
  };

  render() {
    return (
      <View style={style.submessages}>
        <List
          enableEmptySection={true}
          dataArray={this.props.submessages}
          renderRow={this.submessage}
        />
        <Item regular style={style.inputContainer}>
          <Input
            style={style.input}
            onSubmitEditing={this.send}
            placeholder='Write message...'
            value={this.state.inputValue}
            onChangeText={this.onChangeHandler}
          />
        </Item>
      </View>
    );
  }

  submessage(m) {
    return (
      <ListItem>
        <Text>
          {m.sender.username}: {m.content}
        </Text>
      </ListItem>
    );
  }

  @autobind
  send() {
    this.props.sendMessage({content: this.state.inputValue, parentId: this.props.message.id});
    this.setState({inputValue: ''});
  }

  @autobind
  onChangeHandler(text) {
    this.setState({inputValue: text});
  }
}

export default Submessages