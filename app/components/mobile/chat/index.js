import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { parentMessages } from '../../../selectors/messages'
import { currentConvo } from '../../../selectors/convos'
import { sendMessage } from '../../../actions/messages'
import { setCurrentConvo } from '../../../actions/convos'
import { Content, Input, Item } from 'native-base'
import { View, Dimensions, ListView } from 'react-native'
import Message from './message'

function mapStateToProps(state) {
  return {
    parentMessages: parentMessages(state),
    currentConvo: currentConvo(state),
    childMessages: state.messages.messages.children
  }
}

@connect(mapStateToProps, {setCurrentConvo, sendMessage})
class Chat extends Component {
  state = {
    inputValue: ''
  };

  componentWillMount() {
    this.props.setCurrentConvo(this.props.routeParams);
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

    return (
      <View style={style.container}>
        <ListView
          enableEmptySections={true}
          style={style.list}
          dataSource={ds.cloneWithRows(this.props.parentMessages)}
          renderRow={this.message}
        />
        <View>
          <Item regular style={style.inputContainer}>
            <Input
              style={style.input}
              onSubmitEditing={this.send}
              onChangeText={this.onChangeHandler}
              placeholder='Write message...'
              value={this.state.inputValue}
            />
          </Item>
        </View>
      </View>
    );
  }

  @autobind
  message(m) {
    const submessages = m.messages.map(id => this.props.childMessages[id]);
    return <Message message={m} submessages={submessages} sendMessage={this.props.sendMessage}/>
  }

  @autobind
  send() {
    this.props.sendMessage({content: this.state.inputValue, parentId: null});
    this.setState({inputValue: ''});
  }

  @autobind
  onChangeHandler(text) {
    this.setState({inputValue: text});
  }
}

const style = {
  container: {
    flex: 1,
    paddingTop: 54
  },
  list: {
    flex: 1
  },
  inputContainer: {
    margin: 4
  },
  input: {
    padding: 10,
    height: 40
  }
};

export default Chat