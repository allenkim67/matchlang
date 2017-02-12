import React from 'react'
import autobind from 'autobind-decorator'
import Sidebar from 'react-sidebar'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Navi from './navi'
import css from './main.scss'
import { titleSelector } from '../../../selectors/title'
import { currentConvo, totalUnread } from '../../../selectors/convos'
import { forceUnreadStatus } from '../../../actions/session'
import Badge from '../shared/badge'

const mapPropsToState = state => {
  return {
    title: titleSelector(state),
    currentConvo: currentConvo(state) || {},
    unread: totalUnread(state)
  }
};

@connect(mapPropsToState, {forceUnreadStatus})
class Main extends React.Component {
  state = {
    sidebarOpen: false,
    sidebarDocked: false
  };

  render() {
    return (
      <div>
        <Helmet title={this.props.title}/>

        <Sidebar
          sidebar={<Navi location={this.props.location} closeSidebar={this.closeSidebar}/>}
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={this.onSetSidebarOpen}
          shadow={false}
        >
          <div className={css.header}>
            <a className={css.menuLink} onClick={this.onSetSidebarOpen}>
              MENU
              {this.props.unread ? <Badge className={css.badge}>{this.props.unread}</Badge> : null}
            </a>
            <div className={css.convoName}>{this.props.currentConvo.name}</div>
          </div>
          <div className={css.main}>{this.props.children}</div>
        </Sidebar>
      </div>
    );
  }

  @autobind
  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  @autobind
  closeSidebar() {
    this.setState({sidebarOpen: false});
  }

  componentWillMount() {
    const mql = window.matchMedia(`(min-width: 700px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
    window.addEventListener('focus', this.forceUnreadStatusFalse );
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
    window.removeEventListener('focus', this.forceUnreadStatusFalse );
  }

  @autobind
  forceUnreadStatusFalse() {
    this.props.forceUnreadStatus(false);
  }

  @autobind
  mediaQueryChanged() {
    this.setState({sidebarDocked: this.state.mql.matches});
  }
}

export default Main;