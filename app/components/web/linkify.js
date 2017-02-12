import React from 'react'
import Linkify from 'react-linkify'

export default class extends React.Component {
  render() {
    return (
      <Linkify properties={{target: "_blank", onClick: this.clickHandler}}>
        {this.props.children}
      </Linkify>
    );
  }

  clickHandler(evt) {
    evt.stopPropagation();
  }
}