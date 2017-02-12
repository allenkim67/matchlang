import React from 'react'
import autobind from 'autobind-decorator'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import range from 'lodash/range'
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import css from './new-group-form.scss'
import includes from 'lodash/includes'

class NewGroupForm extends React.Component {
  state = {
    scheduled: false,
    name: '',
    description: ''
  };

  render() {
    const scheduledForm = (
      <div>
        <div className={css.controlGroup}>
          <label>
            <span>Start Date: </span>
            <DatePicker
              selected={this.state.start || moment()}
              placeholderText="Start date"
              filterDate={date => moment().subtract(1, 'day') < date}
              onChange={date => {
                const start = this.state.start ? this.state.start.clone().set({
                  year: date.get('year'),
                  month: date.get('month'),
                  date: date.get('date')
                }) : date.clone().hours(0).minutes(0);
                this.setState({start: start.local()});
              }}
            />
          </label>
        </div>
        <div className={css.controlGroup}>
          <label>
            <span>Start Time: </span>
            <TimePicker
              disabledMinutes={() => range(60).filter(n => n % 15 !== 0)}
              hideDisabledOptions={true}
              format='hh:mm a'
              showSecond={false}
              defaultValue={moment().hours(0).minutes(0)}
              onChange={date => {
                const start = this.state.start ? this.state.start.clone().set({
                  hour: date.get('hour'),
                  minute: date.get('minute')
                }) : date;
                this.setState({start: start.local()});
              }}
            />
          </label>
        </div>
        <div className={css.controlGroup}>
          <label>
            <span>Max users: </span>
            <input type="number" placeholder="No limit" onChange={evt => this.setState({limit: evt.target.value})}/>
          </label>
        </div>
      </div>
    );

    return (
      <div className={css.container}>
        <h2 className={css.header}>Create Group</h2>
        <form onSubmit={this.submitHandler}>
          <div className={css.controlGroup}>
            <label>
              Name:<br/>
              <input className={css.input} onChange={evt => this.setState({name: evt.target.value})}/>
            </label>
          </div>
          <div className={css.controlGroup}>
            <label>
              Description:<br/>
              <textarea className={css.textarea} onChange={evt => this.setState({description: evt.target.value})}/>
            </label>
          </div>
          <div className={css.controlGroup}>
            <label>
              <input type="checkbox" onChange={() => this.setState({scheduled: !this.state.scheduled})}/>
              <span> Schedule Chat</span>
              <br/>
            </label>
          </div>
          {this.state.scheduled ? scheduledForm : null}
          <button className={css.createButton}>Create</button>
          <button className={css.cancelButton} onClick={this.cancel}>Cancel</button>
        </form>
      </div>
    );
  }

  @autobind
  submitHandler(evt) {
    evt.preventDefault();

    const input = evt.target.querySelector('input');
    if (input.value === '') return;
    this.props.createGroupConvo(this.state, true);
    this.props.toggleForm(evt);
    this.props.setChatType(this.state.scheduled ? 'scheduled' : 'regular');
  }

  @autobind
  cancel(evt) {
    evt.preventDefault();
    this.props.toggleForm(evt);
  }
}

export default NewGroupForm