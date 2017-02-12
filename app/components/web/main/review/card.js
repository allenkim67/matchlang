import React from 'react'
import autobind from 'autobind-decorator'
import IoIosHeartOutline from 'react-icons/io/ios-heart-outline'
import IoIosHeart from 'react-icons/io/ios-heart'
import IoClose from 'react-icons/io/close'
import IoCheckmark from 'react-icons/io/checkmark'
import { emojify } from 'react-emoji'
import diff from '../chat/diff'
import css from './card.scss'

class Card extends React.Component {
  state = {display: false};

  render() {
    return <div>
      <div className={css.container}>
        <div className={css.message} onClick={this.toggle}>
          <div className={css.messageContent}>
            <span className={css.username}>{this.props.message.sender.username}:</span>
            <div>{emojify(this.props.message.content)}</div>
          </div>
          {
            this.props.message.favorite !== false ?
              <IoIosHeart className={css.tagUnsave} onClick={this.setFav.bind(this, this.props.message)}/> :
              <IoIosHeartOutline className={css.tagSave} onClick={this.setFav.bind(this, this.props.message)}/>
          }
        </div>
        <div className={this.state.display ? '' : css.hidden}>
          {this.props.message.messages.map(subm => {
            const diffed = (
              this.props.message.content !== subm.content &&
              diff(this.props.message.content, subm.content)
            );
            return (
              <div key={subm.id} className={css.submessage}>
                <span className={css.username}>{subm.sender.username}:</span>
                {diffed ? <div><IoClose className={css.wrongIcon}/> <span dangerouslySetInnerHTML={{__html: diffed}}></span></div> : null}
                <div>{diffed ? <IoCheckmark className={css.correctIcon}/> : null} {subm.content}</div>
              </div>
            );
          })}
        </div>
      </div>
      {
        <a href='' className={css.showHide} onClick={this.toggle}>
          {this.state.display ? 'hide' : 'show'}
        </a>
      }
    </div>
  }

  setFav(message, evt) {
    evt.stopPropagation();
    this.props.setFavorite(message);
  }

  @autobind
  toggle(evt) {
    evt.preventDefault();
    this.setState({display: !this.state.display});
  }
}

export default Card;