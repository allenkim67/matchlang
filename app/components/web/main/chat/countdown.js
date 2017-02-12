import React from 'react'
import moment from 'moment'
import countdown from 'countdown'

class StartCounter extends React.Component {
  start = moment(this.props.start);

  state = {time: countdown(this.start).toString()};

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({time: countdown(this.start).toString()});
    }, 1000);
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  render() {
    if (!this.props.start || this.start < moment()) return null;

    return <span>
      {this.state.time}
    </span>;
  }
}

export default StartCounter;