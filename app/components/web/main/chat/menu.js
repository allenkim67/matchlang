import React from 'react'
import IoAndroidMoreHorizontal from 'react-icons/io/android-more-horizontal'
import IoStop from 'react-icons/io/stop'
import IoEdit from 'react-icons/io/edit'
import IoChatboxWorking from 'react-icons/io/chatbox-working'
import autobind from 'autobind-decorator'
import includes from 'lodash/includes'
import map from 'lodash/map'
import intersection from 'lodash/intersection'
import css from './menu.scss'
import closest from 'dom-closest'
import Languages from 'language-list'

const {getLanguageName} = Languages();

class Menu extends React.Component {
  render() {
    return (
      <div className={css.iconContainer} onClick={this.toggle}>
        <IoAndroidMoreHorizontal className={css.iconMore}/>
        <div className={this.props.displayMenu ? css.menuShow : css.menuHidden} ref="menu">
          {
            this.props.isEditable ?
              <div className={css.menuOption} onClick={this.props.makeEditable.bind(this)}>
                <IoEdit className={css.tagEdit}/> <span className={css.tagLabel}>Edit</span>
              </div> :
              null
          }
          {
            this.props.message.sender.id !== this.props.currentUser.id ?
              intersection(window.GOOGLE_LANGS, map(this.props.currentUser.speakingLangs, 'lang')).map(l =>
                <div key={l} className={css.menuOption} onClick={this.props.translate.bind(null, l)}>
                  <IoChatboxWorking/> <span className={css.tagLabel}>Translate: {getLanguageName(l)}</span>
                </div>
              ) :
              null
          }
          {
            this.props.isEditable || this.props.message.sender.id !== this.props.currentUser.id ?
              <div className={css.hr}></div> :
              null
          }
          <div className={css.menuOption} onClick={this.props.setTag.bind(null, 'h')}>
            <IoStop className={css.tagHowSay}/> <span className={css.tagLabel}>How do I say...?</span>
          </div>
          <div className={css.menuOption} onClick={this.props.setTag.bind(null, 'c')}>
            <IoStop className={css.tagCorrectPlz}/> <span className={css.tagLabel}>Is this correct?</span>
          </div>
          <div className={css.menuOption} onClick={this.props.setTag.bind(null, 'u')}>
            <IoStop className={css.tagDontUnderstand}/> <span className={css.tagLabel}>What does this mean?</span>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  toggle(evt) {
    evt.stopPropagation();
    this.props.toggleMenu();
  }

  componentWillUpdate() {
    this.refs.menu.style.top = 0;
  }

  componentDidUpdate() {
    this.adjustMenuPosition();
  }

  @autobind
  adjustMenuPosition() {
    if (this.props.displayMenu) {
      const menu = this.refs.menu;
      const chat = closest(menu, '.chat');
      const menuBottom = menu.getBoundingClientRect().bottom;
      const chatBottom = chat.getBoundingClientRect().bottom;

      if (menuBottom > chatBottom) {
        menu.style.top = menu.offsetTop - (menuBottom - chatBottom) + 'px';
      }
    }
  }
}

export default Menu;