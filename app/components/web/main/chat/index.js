import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import css from './chat.scss'
import path from 'path'
import MessageComponent from './message'
import { currentConvo, currentConvoType, currentId, typerNames } from '../../../../selectors/convos'
import { currentUserSelector } from '../../../../selectors/session'
import { messagesSelector } from '../../../../selectors/messages'
import { fetchMessages, sendMessage, updateMessage, setFavorite, translate } from '../../../../actions/messages'
import { leaveConvo, isTyping, stopTyping, clearCurrentConvo, setCurrentConvo } from '../../../../actions/convos'
import config from '../../../../../global-config'
import Countdown from './countdown'
import moment from 'moment'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import keys from 'lodash/keys'
import isEqual from 'lodash/isEqual'

function mapStateToProps(state) {
  return {
    convosLoading: state.convos.loading,
    messagesLoading: state.messages.loading,
    messages: messagesSelector(state),
    currentConvo: currentConvo(state) || {users: {}, messages: []},
    currentUser: currentUserSelector(state),
    onlineUsers: state.users.onlineUsers,
    convoType: currentConvoType(state),
    currentId: currentId(state),
    typers: typerNames(state)
  };
}

const mapDispatchToProps = {
  fetchMessages,
  sendMessage,
  updateMessage,
  setFavorite: setFavorite.bind(null, 'chat'),
  translate,
  leaveConvo,
  isTyping,
  stopTyping,
  setCurrentConvo,
  clearCurrentConvo
};

@connect(mapStateToProps, mapDispatchToProps)
class Chat extends React.Component {
  messagesOffset = 0;
  forceScrollBottom = true;
  state = {
    menuDisplayId: null
  };

  render() {
    const messages = this.props.messages;
    //const freeLeft = config.freeMessages - this.props.sentCount;
    const freeLeft = config.freeMessages + Infinity;

    const price = <div className={css.price}>
      {
        this.props.currentConvo.price !== 0 && !this.props.convosLoading && freeLeft > 0 ?
          <div>Free: {freeLeft} {freeLeft === 1 ? 'message' : 'messages'}</div> :
          null
      }
      Price: {this.props.currentConvo.price} credits
    </div>;

    const header = (
      <div className={css.header}>
        <h1 className={css.partnerName}>Chat : {this.props.currentConvo.name}</h1>
        {
          this.props.convoType === 'group' ?
            <a href="" className={css.leave} onClick={this.leaveConvo}>Leave Convo</a> :
            null
        }
        {false && price}
      </div>
    );

    const createMessage = (m, prevMessage={}) => (
      <MessageComponent
        key={m.id || m.key}
        message={m}
        submessages={messages.children}
        sameSender={m.sender.id === prevMessage.sender_id}
        send={this.send.bind(this, m.id)}
        keyPressSend={this.keyPressSend.bind(this, m.id)}
        updateMessage={this.props.updateMessage}
        toggleMenu={this.toggleMenu}
        menuDisplayId={this.state.menuDisplayId}
        currentUser={this.props.currentUser}
        setFavorite={this.props.setFavorite}
        translate={this.props.translate}
        mode={this.props.mode}
        online={this.props.onlineUsers.has(m.sender.id)}
      />
    );

    const countdown = this.props.currentConvo.start && moment(this.props.currentConvo.start) > moment() ?
      <div className={css.countdown}>
        This chat will start in <b><Countdown start={this.props.currentConvo.start}/></b>
      </div> :
      null;

    const allMessages = messages.parentOrder.map((p, i) => {
      const prevMessage = messages.parentOrder[i - 1];
      return createMessage(messages.parents[p], messages.parents[prevMessage])
    });

    const typers = (
      <div className={css.isTyping}>
        {this.props.typers.join(', ')} {this.props.typers.length === 1 ? 'is' : 'are'} typing.
      </div>
    );

    return (
      <div>
        {header}
        <div className={[css.chat, 'chat'].join(' ')} onScroll={this.infiniteScrollFetch} ref="chatbox">
          {
            this.props.messagesLoading ?
              <div className={css.loadingMessage}>Loading...</div> :
                this.props.currentConvo.full ?
                  <div className={css.loadingMessage}>Sorry, you were not able to join. User limit reached.</div>:
                  <div>{countdown}{allMessages}</div>
          }
        </div>

        <div>
          <textarea
            className={css.input}
            onKeyDown={this.keyDownHandler}
            onKeyUp={this.keyUpHandler}
            placeholder={'Write message...'}
          />
          <button className={css.sendButton} onClick={this.send.bind(this, null)}>Send</button>
        </div>
        {this.props.typers.length ? typers : null}
      </div>
    );
  }

  @autobind
  leaveConvo(evt) {
    evt.preventDefault();
    this.props.leaveConvo(this.props.currentConvo.id);
  }

  isTypingThrottled = throttle(this.props.isTyping, 4000, {trailing: false});
  stopTyping = debounce(this.props.stopTyping, 4000);

  isTyping() {
    this.isTypingThrottled();
    this.stopTyping();
  };

  @autobind
  keyDownHandler(evt) {
    const input = evt.target.parentElement.querySelector('textarea');

    if (!(input.value === '' && evt.key === 'Backspace')) {
      this.isTyping();
    }

    this.keyPressSend(null, evt);
  }

  @autobind
  keyUpHandler(evt) {
    const empty = evt.target.parentElement.querySelector('textarea').value === '';

    if (empty) {
      this.props.stopTyping();
    }
  }

  @autobind
  keyPressSend(parentId, evt) {
    if (evt.key === 'Enter') {
      this.send(parentId, evt);
    }
  }

  async send(parentId, evt) {
    evt.preventDefault();

    const input = evt.target.parentElement.querySelector('textarea');

    if (input.value === '') return;

    this.props.sendMessage({
      content: input.value,
      parentId
    });

    input.value = '';
  }

  @autobind
  infiniteScrollFetch(evt) {
    if (evt.target.scrollTop === 0 && evt.target.scrollHeight > evt.target.clientHeight) {
      this.messagesOffset += 1;
      this.saveScrollPosition();
      const convoType = this.props.convoType === 'group' ? 'group' : 'private';
      this.props.fetchMessages(convoType, this.props.currentConvo.id, this.messagesOffset);
    }
  }

  saveScrollPosition() {
    this.shouldAdjustScroll = true;
    this.savedScrollHeight = this.refs.chatbox.scrollHeight;
  }

  componentWillUpdate() {
    const node = this.refs.chatbox;
    this.shouldScrollBottom = this.forceScrollBottom || node.scrollTop + node.offsetHeight >= node.scrollHeight;
  }

  componentDidUpdate() {
    const node = this.refs.chatbox;

    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
      this.forceScrollBottom = false;
    }

    if (this.shouldAdjustScroll && this.savedScrollHeight !== this.refs.chatbox.scrollHeight) {
      node.scrollTop = node.scrollTop + (node.scrollHeight - this.savedScrollHeight);
      this.shouldAdjustScroll = false;
    }
  }

  componentDidMount () {
    window.addEventListener('click', this._onWindowClick );
  }

  componentWillUnmount () {
    window.removeEventListener('click', this._onWindowClick );
    this.props.clearCurrentConvo();
  }

  @autobind
  _onWindowClick() {
    if (this.state.menuDisplayId) this.setState({menuDisplayId: null});
  }

  @autobind
  toggleMenu(id) {
    this.setState({menuDisplayId: this.state.menuDisplayId === id ? null : id});
  }

  componentWillMount() {
    this.props.setCurrentConvo({
      convoType: this.props.params.type,
      id: +this.props.params.id
    });
  }

  componentWillReceiveProps(newProps) {
    if (!isEqual(newProps.params, this.props.params)) {
      this.props.setCurrentConvo({
        convoType: newProps.params.type,
        id: +newProps.params.id
      });
    }
  }
}

export default Chat