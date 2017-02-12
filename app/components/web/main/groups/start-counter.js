import React from 'react'
import moment from 'moment'
import countdown from 'countdown'
import css from './start-counter.scss'

class StartCounter extends React.Component {
  start = moment(this.props.convo.start);

  state = {time: this.timeLeft()};

  timeLeft() {
    const c = countdown(this.start, moment());
    const time = `${c.hours}:${c.minutes}:${c.seconds}`;
    return time.split(':').map(n => ('0' + n).slice(-2)).join(':');
  }

  componentDidMount() {
    if (this.props.convo.start) {
      this.interval = setInterval(() => {
        this.setState({time: this.timeLeft()});
      }, 1000);
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    if (!this.props.convo.start) return null;

    if (this.start < moment()) {
      return <span className={css.startedAlready}>
        {this.start.fromNow().replace('minute', 'min').replace('second', 'sec')}
      </span>;
    } else if (this.start.diff(moment(), 'hours') < 24) {
      return <div className={css.startingSoon}>in {this.state.time}</div>;
    } else {
      return <span className={css.willStart}>{this.start.fromNow()}</span>;
    }
  }
}

export default StartCounter;