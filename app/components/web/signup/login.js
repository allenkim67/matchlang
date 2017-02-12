import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { login } from '../../../actions/session'
import css from './signup.scss'

function mapStateToProps(state) {
  return {session: state.session};
}

@connect(mapStateToProps, {login})
class Login extends React.Component {
  state = {
    username: '',
    password: ''
  };

  render() {
    return (
      <div className={css.login}>
        <h2 className={css.title}>Log in</h2>

        <div className={css.errors}>
          {this.props.session.loginErrors.map(({field, message}) =>
            <p key={field}>{message}</p>
          )}
        </div>

        <form onSubmit={this.login}>
          <input name="username" placeholder="Username" onChange={evt => this.setState({username: evt.target.value})}/>
          <input name="password" placeholder="Password" onChange={evt => this.setState({password: evt.target.value})} type="password" />
          <button className={css.button}>Log in</button>
        </form>
      </div>
    );
  }

  @autobind
  login(evt) {
    evt.preventDefault();
    this.props.login(this.state);
  }
}

export default Login