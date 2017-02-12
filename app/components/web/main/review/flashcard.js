import React from 'react'
import autobind from 'autobind-decorator'
import css from './flashcard.scss'

class Card extends React.Component {
  state = {
    showFront: false
  };

  render() {
    const msgs = this.props.messages;

    const message = msgs.length ? msgs[1].content : 'no content';

    const submessages = msgs[0] && msgs[0].messages[0] ?
      msgs[0].messages[0].content :
      null;

    return (
      <div className={css.flashcard}>
        {this.state.showFront ? message : submessages}
      </div>
    );
  }
}

export default Card;