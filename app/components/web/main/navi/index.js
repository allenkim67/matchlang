import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import isArray from 'lodash/isArray'
import { logout, toggleMode } from '../../../../actions/session'
import { leaveConvo } from '../../../../actions/convos'
import css from './navi.scss'
import Switch from 'rc-switch'
import 'rc-switch/assets/index.css'
import includes from 'lodash/includes'
import IoCloseCircled from 'react-icons/io/close-circled'
import IoAndroidPerson from 'react-icons/io/android-person'
import IoIosHeart from 'react-icons/io/ios-heart'
import IoHelp from 'react-icons/io/help-circled'
import IoChatboxes from 'react-icons/io/chatboxes'
import IoSearch from 'react-icons/io/search'
import IoRecord from 'react-icons/io/record'
import Badge from '../../shared/badge'
import isRegExp from 'lodash/isRegExp'
import some from 'lodash/some'

function mapStateToProps(state) {
  return {
    session: state.session,
    privateConvos: state.convos.convos.private,
    groupConvos: state.convos.convos.group,
    teacher: state.session.user.teacher,
    onlineUsers: state.users.onlineUsers
  };
}

@connect(mapStateToProps, {logout, toggleMode, leaveConvo})
class Navi extends React.Component {
  render() {
    const credits = (
      <div className={css.credits}>
        credits: {this.props.session.user.credits}
      </div>
    );

    const logo = <img className={css.logo} src="/MatchLang-logo-beta.png"/>;

    const social = (
      <div className={css.socialContainer}>
        <a href="https://www.instagram.com/matchlang/"><img className={css.social} src='/social/instagram.svg'/></a>
        <a href="https://twitter.com/matchlang"><img className={css.social} src='/social/twitter.svg'/></a>
        <a href="https://www.facebook.com/matchlang"><img className={css.social} src='/social/facebook.svg'/></a>
      </div>
    );

    const subtitle = (
      <div className={css.subtitle}>
        <Link to={"/" + this.props.session.user.username}>{this.props.session.user.username}</Link>
        <form className={css.logout} action="/session/logout" method="post" ref="logout">
          <a href="" onClick={this.logout}>log out</a>
        </form>
      </div>
    );

    const modeToggler = (
      <div className={css.modeToggler} onClick={this.toggleTeach}>
        <span className={css.mode}>{this.props.teacher ? 'Teacher' : 'Student'} Mode</span>
        <Switch onChange={() => {}} checked={this.props.teacher}/>
      </div>
    );
    
    const menuLink = (icon, route, title, matchedPaths) => {
      return (
        <li className={this.menuItemStyle(matchedPaths || route)}>
          <Link to={route} className={css.menuLink} onClick={this.props.closeSidebar}>
            {icon}<span className={css.menuItemContent}>{title}</span>
          </Link>
        </li>
      )
    };

    const menuLinks = (
      <ul className={css.menu}>
        {menuLink(
          <IoChatboxes className={css.menuIcon}/>,
          '/groups/upcoming',
          'Group Chat',
          [/^\/groups/, '/', '']
        )}
        {menuLink(
          <IoSearch className={css.menuIcon}/>,
          '/search',
          `Search Users`,
          [/\/search/]
        )}
        {menuLink(<IoIosHeart className={css.menuIcon}/>, '/review', 'Study Guide')}
        {menuLink(<IoAndroidPerson className={css.menuIcon}/>, '/account', 'My Account')}
        {menuLink(<IoHelp className={css.menuIcon}/>, '/tutorial', 'Tutorial')}
      </ul>
    );

    const menuHeader = title => <span className={css.menuHeader}>{title}</span>;
    
    return (
      <div className={css.navi}>
        {logo}
        {social}
        {subtitle}
        {null && credits}

        {modeToggler}

        {menuHeader('MENU')}
        {menuLinks}

        <div>
          {menuHeader('GROUP CHATS')}
          <ul className={css.menu}>
            {this.props.groupConvos.order.map(id =>
              this.convo(this.props.groupConvos.convos[id], 'group')
            )}
          </ul>

          {menuHeader('PRIVATE CHATS')}
          <ul className={css.menu}>
            {this.props.privateConvos.order.map(id =>
              this.convo(this.props.privateConvos.convos[id], 'private')
            )}
          </ul>
        </div>

        <br/>
      </div>
    );
  }

  @autobind
  menuItemStyle(matchedPaths) {
    if (!isArray(matchedPaths)) matchedPaths = [matchedPaths];

    const selected = some(matchedPaths, path => {
      const pathname = this.props.location.pathname;
      if (isRegExp(path)) return pathname.match(path);
      if (typeof path === 'string') return pathname === path;
      return false;
    });

    return css.menuItem + ' ' + (selected ? css.menuItemSelected : '');
  }

  @autobind
  convo(convo, type) {
    const id = type === 'group' ? convo.id : convo.users[0].id;

    const style = [css.convoListing, this.menuItemStyle(`/chat/${type}/` + id)].join(' ');

    const onlineStatus = type === 'group' ?
      null :
      this.props.onlineUsers.has(id) ?
        <IoRecord className={css.online}/> :
        <IoRecord className={css.offline}/>;

    return (
      <li key={convo.id || convo.key} className={style}>
        <Link to={`/chat/${type}/${id}`} className={css.menuLink} onClick={this.props.closeSidebar}>
          {convo.unread ? <Badge className={css.badge}>{convo.unread}</Badge> : null}
          {convo.newlyCreated ? <span className={css.newlyCreated}>New!</span> : null}
          {onlineStatus}
          <span className={css.convoName}> {convo.name}</span>
        </Link>
        {
          type === 'group' ?
            <IoCloseCircled className={css.leave} onClick={this.props.leaveConvo.bind(this, convo.id)}/> :
            null
        }
      </li>
    );
  }

  @autobind
  logout(evt) {
    evt.preventDefault();
    this.props.logout();
  }

  @autobind
  toggleTeach() {
    this.props.toggleMode(!this.props.teacher, this.props.location.pathname);
  }
}

export default Navi