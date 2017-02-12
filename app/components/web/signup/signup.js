import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { signup } from '../../../actions/session'
import { LearningLangs, SpeakingLangs } from '../lang-select'
import { learningStub, speakingStub } from '../lang-select/lang-stubs'
import Flatpickr from 'flatpickr'
import 'flatpickr/dist/themes/material_green.css';
import css from './signup.scss'

function mapStateToProps(state) {
  return {session: state.session};
}

@connect(mapStateToProps, {signup})
class Signup extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    location: '',
    description: '',
    learningLangs: [learningStub()],
    speakingLangs: [speakingStub()],
    emailsub: false
  };

  componentDidMount() {
    new Flatpickr(this.refs.birthdate, {altInput: true});
  }

  render() {
    return (
      <div className={css.signup}>
        <h2 className={css.title}>Sign up</h2>

        <div className={css.errors}>
          {this.props.session.signupErrors.map(({field, message}) =>
            <p key={field}>{message}</p>
          )}
        </div>

        <form onSubmit={this.signup}>
          <input onChange={evt => this.setState({username: evt.target.value})} placeholder="Username"/>
          <input onChange={evt => this.setState({email: evt.target.value})} placeholder="Email" type="email"/>
          <input onChange={evt => this.setState({location: evt.target.value})} placeholder="Location (city, country)"/>
          <input onChange={evt => this.setState({password: evt.target.value})} placeholder="Password" type="password"/>

          <input ref='birthdate' className='js-birthdate' id={css.birthdate} placeholder="Birth Date"/>

          <label>I am learning:</label>
          <LearningLangs langs={this.state.learningLangs} setState={this.setState.bind(this)}/>

          <label>I can speak:</label>
          <SpeakingLangs langs={this.state.speakingLangs} setState={this.setState.bind(this)}/>

          <label htmlFor="description">Description:</label>
          <textarea
            onChange={evt => this.setState({description: evt.target.value})}
            id="description"
            className={css.textarea}
            placeholder="Tell us about yourself!"
          />

          <label>
            <input onChange={evt => this.setState({emailsub: evt.target.checked})} type="checkbox" className={css.subscribeOpt}/> Subscribe to our email list
          </label>

          <button className={css.button}>Sign up</button>
          <br/>
          <div>
            By signing up, you agree to our <a href="/terms.html">Terms</a> and that you have read our <a href="/privacy.html">Privacy Policy</a>
          </div>
        </form>
      </div>
    );
  }

  @autobind
  signup(evt) {
    evt.preventDefault();
    this.props.signup({
      ...this.state,
      birthdate: this.refs.birthdate.value
    });
  }
}

export default Signup