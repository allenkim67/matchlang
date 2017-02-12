import React from 'react'
import { Link } from 'react-router'
import axios from '../../../../axios'
import autobind from 'autobind-decorator'
import langsISO from 'language-list'
import sortBy from 'lodash/sortBy'
import take from 'lodash/take'
import { connect } from 'react-redux'
import css from './public.scss'
import moment from 'moment'
import { GroupConvo, ScheduledConvo } from '../groups/convo'
import { groupedScheduledGroups } from '../../../../normalizers/group-convos'
import Linkify from '../../linkify'

class Profile extends React.Component {
  state = {
    user: {groupConvos: []}
  };

  @autobind
  fetchProfile(username) {
    axios
      .get('users/profile/' + username)
      .then(user => this.setState({user: user.data}));
  }

  componentWillMount() {
    this.fetchProfile(this.props.params.username);
  }

  componentWillReceiveProps(newProps) {
    this.fetchProfile(newProps.params.username);
  }

  render() {
    const username = (
      <div>
        <h1 className={css.username}>{this.state.user.username}</h1>
        <Link to={"/chat/private/" + this.state.user.id} className={css.messageMe}>message me</Link>
      </div>
    );

    const learningLangs = (
      <div>
        <label>I'm learning: </label>
        {
          sortBy(this.state.user.learningLangs, 'lang')
            .filter(l => l.lang !== '')
            .map(l => langsISO().getLanguageName(l.lang) + take(['*', '*', '*'], l.level).join(''))
            .join(' ')
          || 'none'
        }
      </div>
    );

    const speakingLangs = (
      <div>
        <label>I can speak: </label>
        {
          sortBy(this.state.user.speakingLangs, 'lang')
            .filter(l => l.lang !== '')
            .map(l => langsISO().getLanguageName(l.lang))
            .join(' ')
          || 'none'
        }
      </div>
    );

    const scheduledGroups = groupedScheduledGroups(
      this.state.user.groupConvos.filter(c => c.start && moment(c.start) > moment())
    );

    const upcoming = scheduledGroups.length ?
      <div>
        <h2>Upcoming</h2>
        <ul className={css.groupList}>
          {scheduledGroups.map(c => <ScheduledConvo convo={c} key={c.date}/>)}
        </ul>
      </div> :
      null;

    const regularGroups = this.state.user.groupConvos
      .filter(c => !c.start || moment(c.start) <= moment())
      .map(c => (<GroupConvo convo={c} key={c.id}/>));

    const groups = regularGroups.length ?
      <div>
        <h2>Regular</h2>
        <ul className={css.groupList}>
          {regularGroups}
        </ul>
      </div> :
      null;

    const allGroups = scheduledGroups.length || regularGroups.length ?
      <div>{upcoming}{groups}</div> :
      <div className={css.noGroups}>No group chats yet!</div>;

    return (
      <div>
        {username}
        <div className={css.userDetails}>
          {learningLangs}
          {speakingLangs}
          <div>Location: {this.state.user.location}</div>
          <div>Birth Date: {moment(this.state.user.birthdate).format("MMMM Do, YYYY")}</div>
          <div>Description: <Linkify>{this.state.user.description}</Linkify></div>
        </div>
        <div>
          <h1>Groups</h1>
          {allGroups}
        </div>
      </div>
    );
  }
}

export default Profile