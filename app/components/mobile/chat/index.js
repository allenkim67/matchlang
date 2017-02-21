import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { parentMessages } from '../../../selectors/messages'
import { currentConvo } from '../../../selectors/convos'
import { sendMessage } from '../../../actions/messages'
import { setCurrentConvo } from '../../../actions/convos'
import { Content, Input, Item } from 'native-base'
import { View, Dimensions, ListView, TouchableOpacity } from 'react-native'
import Message from './message'
import Spinner from 'react-native-loading-spinner-overlay'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import Icon from 'react-native-vector-icons/Entypo'
import questions from './questions.json'

function mapStateToProps(state) {
  return {
    parentMessages: parentMessages(state),
    currentConvo: currentConvo(state),
    childMessages: state.messages.messages.children,
    loading: state.messages.loading
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
    const input = (
      <View style={{flexDirection: 'row'}}>
        <Item regular style={style.inputContainer}>
          <Input
            style={style.input}
            onSubmitEditing={this.send}
            onChangeText={this.onChangeHandler}
            placeholder='Write message...'
            value={this.state.inputValue}
          />
        </Item>

        <TouchableOpacity onPress={this.generateTopic}>
          <Icon name='new' size={30} style={style.iceBreaker}/>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={style.container}>
        <ListView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          enableEmptySections={true}
          style={style.list}
          contentContainerStyle={style.listContent}
          dataSource={ds.cloneWithRows(this.props.parentMessages)}
          renderRow={this.message}
        />
        {input}
        <Spinner visible={this.props.loading} textContent={'Loading messages...'} textStyle={{color: '#FFF'}}/>
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

  @autobind
  generateTopic() {
    const rand = questions[Math.floor(Math.random() * questions.length)];

    this.setState({inputValue: rand});
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
  listContent: {
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  inputContainer: {
    flex: 1,
    margin: 4
  },
  input: {
    padding: 10,
    height: 40
  },
  iceBreaker: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  }
};

export default Chat