import React from 'react'
import css from './badge.scss'

class Badge extends React.Component {
  render() {
    return (
      <div className={[css.badge, this.props.className].join(' ')}>
        <div className={css.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Badge