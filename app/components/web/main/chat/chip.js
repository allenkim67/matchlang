import React from 'react'
import css from './chip.scss'
import IoCloseCircled from 'react-icons/io/close-circled'
import autobind from 'autobind-decorator'

class Chip extends React.Component {
  render() {
    const chipText = {
      u: 'What does this mean?',
      h: 'How do I say this?',
      c: 'Is this correct?'
    }[this.props.tag];

    const chipColor = {
      u: css.dontUnderstand,
      h: css.howSay,
      c: css.correctPlz
    }[this.props.tag];

    return <div className={[css.chip, chipColor].join(' ')} onClick={this.clickHandler}>
      {chipText}
      <IoCloseCircled className={css.close} onClick={this.props.close}/>
    </div>;
  }

  @autobind
  clickHandler(evt) {
    evt.stopPropagation();
  }
}

export default Chip