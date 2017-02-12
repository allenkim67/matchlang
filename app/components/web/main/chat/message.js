import React from 'react'
import { Link } from 'react-router'
import EditableMessage from './editable-message'
import Chip from './chip'
import Menu from './menu'
import { emojify } from 'react-emoji'
import Linkify from '../../linkify'
import autobind from 'autobind-decorator'
import closest from 'dom-closest'
import css from './message.scss'
import diff from './diff'
import IoIosHeartOutline from 'react-icons/io/ios-heart-outline'
import IoIosHeart from 'react-icons/io/ios-heart'
import IoClose from 'react-icons/io/close'
import IoCheckmark from 'react-icons/io/checkmark'
import IoRecord from 'react-icons/io/record'
import Languages from 'language-list'
import moment from 'moment'

const {getLanguageName} = Languages();

class Message extends React.Component {
  state = {
    expand: false,
    editable: false
  };

  render() {
    const message = this.props.message;
    const senderName = <div>
      {this.props.online ? <IoRecord className={css.online}/> : <IoRecord className={css.offline}/>}
      <Link to={'/' + message.sender.username} className={css.senderName}>{message.sender.username} </Link>
      {message.sender.admin ? <img className={css.crown} src="/crown4.png"/> : null}
      <span className={css.speakingLangs}>
        {message.sender.speakingLangs.map(l => getLanguageName(l.lang)).join(', ')}
      </span>
    </div>;
    const editableMessage = (
      <EditableMessage
        message={message}
        cancelEdit={this.cancelEdit}
        updateMessage={this.props.updateMessage}
      />
    );
    const buildMenu = (message, ctx=this) => (
      <Menu
        message={message}
        currentUser={this.props.currentUser}
        displayMenu={this.props.menuDisplayId === message.id}
        toggleMenu={this.props.toggleMenu.bind(null, message.id)}
        setTag={tag => this.props.updateMessage(message, {tag})}
        isEditable={this.props.currentUser.id === message.sender.id}
        makeEditable={() => ctx.setState({editable: true})}
        translate={this.props.translate.bind(null, message)}
      />
    );
    const sentAt = moment(message.sent_at);
    const timestamp = <span className={css.timestamp}>
      {sentAt > moment().subtract(1, 'day') ? sentAt.format('HH:mm'): sentAt.format('MMM D')}
    </span>;

    const heart = message.favorite ?
      <IoIosHeart className={css.tagUnsave} onClick={this.setFav.bind(this, message)}/> :
      <IoIosHeartOutline className={css.tagSave} onClick={this.setFav.bind(this, message)}/>;

    const buildSubmessage = (submId, i, parentMessage) => {
      const subm = this.props.submessages[submId];
      const prevSubm = this.props.submessages[message.messages[i - 1]] || {};

      return <SubMessage
        key={subm.id || subm.key}
        parentMessage={parentMessage}
        message={subm}
        sameSender={subm.sender.id === prevSubm.sender_id}
        menu={buildMenu.bind(this, subm)}
        updateMessage={this.props.updateMessage}
      />
    };
    const parentClass = [css.parentMessage, tagClassName(message), this.props.sameSender ? '' : css.topPadding].join(' ');
    const formClass = this.state.expand ? css.subchat : css.hidden;
    const chip = message.tag ? <Chip tag={message.tag} close={() => this.props.updateMessage(message, {tag: null})}/> : null;

    const messageContent = (
      <div className={css.emoji}>
        <Linkify>{emojify(message.content)}</Linkify>
        {chip}
      </div>
    );

    return (
      <div>
        <div className={parentClass} onClick={this.toggle}>
          <div className={css.mText}>
            {this.props.sameSender ? null : senderName}
            <div>{this.state.editable ? editableMessage : messageContent}</div>
            {message.translation ? <span> => {message.translation}</span> : null}
          </div>
          {timestamp}
          {heart}
          {buildMenu(message)}

          {message.error ? <div className={css.error}>{message.error}</div> : null}
        </div>

        <div className={formClass} ref="message">
          {message.messages.map((submId, i) => buildSubmessage(submId, i, message))}

          <img className={css.arrow} src="/arrow.png"/>
          <textarea
            className={css.submessageInput}
            placeholder={this.props.mode === 'teacher' ? 'Correct this message...' : 'Ask a question about this message...'}
            onKeyDown={this.props.keyPressSend}
          />
          <button className={css.sendButton} onClick={this.props.send}>Send</button>
        </div>
      </div>
    )
  }
  
  @autobind
  async toggle() {
    if (!this.state.editable) {
      this.setState({expand: !this.state.expand}, () => {
        if (this.state.expand) this.refs.message.querySelector('textarea').focus();
      });
    }
  }

  setFav(message, evt) {
    evt.stopPropagation();
    this.props.setFavorite(message);
  }

  @autobind
  cancelEdit() {
    this.setState({editable: false});
  }

  componentDidUpdate() {
    this.autoscroll();
  }

  autoscroll() {
    if (this.state.expand) {
      const subchat = this.refs.message;
      const chat = closest(subchat, '.chat');
      const subchatBottom = subchat.getBoundingClientRect().bottom;
      const chatBottom = chat.getBoundingClientRect().bottom;

      if (subchatBottom > chatBottom) {
        chat.scrollTop = chat.scrollTop + (subchatBottom - chatBottom);
      }
    }
  }
}

class SubMessage extends React.Component {
  state = {editable: false};

  render() {
    const message = this.props.message;

    const senderName = <div className={css.senderName}>
      <span>{message.sender.username} </span>
      {message.sender.admin ? <img className={css.crown} src="/crown4.png"/> : null}
    </div>;

    const editableMessage = (
      <EditableMessage
        message={message}
        cancelEdit={this.cancelEdit}
        updateMessage={this.props.updateMessage}
      />
    );

    const extraTopPadding = this.props.sameSender ? '' : css.topPadding;

    const chip = message.tag ? <Chip tag={message.tag} close={() => this.props.updateMessage(message, {tag: null})}/> : null;
    const diffed = (
      this.props.parentMessage.content !== message.content &&
      diff(this.props.parentMessage.content, message.content)
    );
    const diffedContent = (
      <div>
        <IoClose className={css.wrongIcon}/>
        <span dangerouslySetInnerHTML={{__html: diffed}}/>
      </div>
    );
    const normalContent = (
      <div>
        {diffed ? <IoCheckmark className={css.correctIcon}/> : null}
        <Linkify>{emojify(message.content)}</Linkify>
      </div>
    );
    const messageContent = (
      <div>
        {diffed ? diffedContent : null}
        {normalContent}
        {chip}
      </div>
    );

    return (
      <div className={[css.submessage, tagClassName(this.props.message), extraTopPadding].join(' ')}>
        <div className={css.mText}>
          {this.props.sameSender ? null : senderName}
          {this.state.editable ? editableMessage : messageContent}
          {message.translation ? <span> => {message.translation}</span> : null}
        </div>
        {this.props.menu(this)}
      </div>
    );
  }

  @autobind
  cancelEdit() {
    this.setState({editable: false});
  }
}

function tagClassName(message) {
  return message.messages && message.messages.length ? css.hasSubmessage : css.noTag;
}

export default Message;