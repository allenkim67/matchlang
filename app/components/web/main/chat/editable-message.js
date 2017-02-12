import css from './editable-message.scss'
import React from 'react'
import autobind from 'autobind-decorator'

class EditableMessage extends React.Component {
  render() {
    return (
      <form className={css.editableMessage} onSubmit={this.editMessage}>
        <input className={css.editInput} defaultValue={this.props.message.content} ref="editInput"/>
        <button className={css.editButton}>Edit</button>
        <button className={css.cancelButton} onClick={this.cancelEdit}>Cancel</button>
      </form>
    );
  }

  @autobind
  editMessage(evt) {
    evt.preventDefault();
    this.props.updateMessage(this.props.message, {content: this.refs.editInput.value});
    this.props.cancelEdit();
  }

  @autobind
  cancelEdit(evt) {
    evt.preventDefault();
    this.props.cancelEdit();
  }
}

export default EditableMessage;