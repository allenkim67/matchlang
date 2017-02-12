import React from 'react'
import moment from 'moment'
import css from './convo.scss'
import { Link } from 'react-router'
import StartCounter from './start-counter'

export class GroupConvo extends React.Component {
  render() {
    const convo = this.props.convo || 'past';

    const admins = convo.groupUsers
      .filter(u => u.admin)
      .map(u => (
        <span key={u.id}>
          <Link className={css.admin} to={'/' + u.username}>{u.username} </Link>
          <img className={css.crown} src="/crown4.png"/>
        </span>
      ));

    const startTime = (
      <div className={css.startTime}>
        {moment(convo.start).format('hh:mm a')}<br/>
        <StartCounter convo={convo}/>
      </div>
    );

    return (
      <li key={convo.id} className={css.groupConvo}>
        {convo.start && this.props.chatType === 'upcoming' ? startTime : null}

        <div className={css.groupConvoContent}>
          <Link to={'/chat/group/' + convo.id}>
            <b className={css.groupName}>{convo.name}</b>
          </Link>
          <br/>
          <hr/>
          Teacher: {admins}
          <br/>
          {convo.start ? 'Members:' : 'Users joined:'} {convo.groupUsers.length}
          {convo.limit ? <div>Room limit: {convo.limit}</div> : <br/>}
          {convo.description ? <div><br/>Description: {convo.description}</div> : null}
          <br/>
          {
            convo.limit && convo.limit <= convo.groupUsers.length ?
              <span className={css.chatFull}>Sorry! Chat is full.</span> :
              <Link to={'/chat/group/' + convo.id} className={css.join}>
                Join chat!
              </Link>
          }
        </div>
      </li>
    );
  }
}

export class ScheduledConvo extends React.Component {
  render() {
    const convo = this.props.convo;

    return (
      <li key={convo.date}>
        <h3>{convo.date}</h3>
        <ul className={css.scheduledGroups}>
          {convo.groups.map(c => <GroupConvo chatType='upcoming' convo={c} key={c.id}/>)}
        </ul>
      </li>
    );
  }
}