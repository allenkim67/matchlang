import React from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
//import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import Flatpickr from 'flatpickr'
import { update } from '../../../../actions/users'
import { SpeakingLangs, LearningLangs } from '../../lang-select'
import { speakingStub, learningStub } from '../../lang-select/lang-stubs'
import validator from '../../../../validators/user'
import config from '../../../../../global-config'
import css from './profile.scss'

@connect(state => ({session: state.session}), {update})
class Account extends React.Component {
  constructor(props) {
    super(props);

    const learningLangs = props.session.user.learningLangs;
    const speakingLangs = props.session.user.speakingLangs;

    this.state = {
      errors: [],
      price: props.session.user.price,
      email: props.session.user.email,
      location: props.session.user.location || '',
      description: props.session.user.description || '',
      learningLangs: isEmpty(learningLangs) ? [learningStub()] : learningLangs,
      speakingLangs: isEmpty(speakingLangs) ? [speakingStub()] : speakingLangs
    };
  }

  componentDidMount() {
    new Flatpickr(this.refs.birthdate, {altInput: true, defaultDate: this.props.session.user.birthdate});
  }
  
  render() {
    //const deposit = <div>
    //  <h2>Credits</h2>
    //  <div className={css.errors}>
    //    {this.state.errors.map(({field, message}) =>
    //      <p key={field}>{message}</p>
    //    )}
    //  </div>
    //
    //  <div className={css.controlGroup}>
    //    <label htmlFor="amount">Amount: </label>
    //    <input
    //      className={css.depositAmount}
    //      value={this.state.amount}
    //      onChange={evt => this.setState({amount: evt.target.value})}
    //      placeholder="Amount"
    //      type="number"
    //      id="amount"
    //    />
    //    <StripeCheckout
    //      label='Deposit'
    //      name='Matchlang'
    //      description={`Deposit ${this.state.amount} credits`}
    //      email={this.props.session.user.email}
    //      image='https://stripe.com/img/documentation/checkout/marketplace.png'
    //      token={this.onToken}
    //      stripeKey={process.env.STRIPE_PUBLIC_KEY}
    //      amount={this.state.amount}
    //      zipCode={true}
    //      allowRememberMe={false}
    //    >
    //      <button className={css.button} onClick={this.submitDeposit}>Deposit!</button>
    //    </StripeCheckout>
    //  </div>
    //  <h2>Profile</h2>
    //</div>;

    return (
      <div>
        <h1>{this.props.session.user.username}'s Account</h1>

        <div className={css.container}>
          <form className={css.form} onSubmit={this.submit}>
            <div className={css.errors}>
              {this.props.session.profileErrors.map(({field, message}) =>
                <p key={field}>{message}</p>
              )}
            </div>

            {false && this.props.teacher ? <div className={css.controlGroup}>
              <label htmlFor="price">Price: </label>
              <input
                value={this.state.price}
                onChange={evt => this.setState({price: +evt.target.value})}
                placeholder="Price"
                type="number"
                id="price"
              />
            </div> : null}

            <div className={css.controlGroup}>
              <label htmlFor="email">Email: </label>
              <input
                value={this.state.email}
                onChange={evt => this.setState({email: evt.target.value})}
                placeholder="Email"
                type="email"
                id="email"
              />
            </div>

            <div className={css.controlGroup}>
              <label htmlFor="location">Location: </label>
              <input
                value={this.state.location}
                onChange={evt => this.setState({location: evt.target.value})}
                placeholder="City, Country"
                id="location"
              />
            </div>

            <div className={css.controlGroup}>
              <label>Birth Date: </label>
              <input className="js-birthdate " id={css.birthdate} ref="birthdate" placeholder="Birth date"/>
            </div>

            <div className={css.controlGroup}>
              <label id={css.langSelectLabel}>I am learning: </label>
              <LearningLangs langs={this.state.learningLangs} setState={this.setState.bind(this)} css={css}/>
            </div>

            <div className={css.controlGroup}>
              <label id={css.langSelectLabel}>I can speak:</label>
              <SpeakingLangs langs={this.state.speakingLangs} setState={this.setState.bind(this)} css={css}/>
            </div>

            <div className={css.controlGroup}>
              <label htmlFor="description">Description: </label>
              <textarea
                value={this.state.description}
                onChange={evt => this.setState({description: evt.target.value})}
                placeholder="Tell us about yourself!"
                id="description"
              />
            </div>
            <br/>
            <button className={css.button}>Update</button> {this.props.session.alertUpdated ? 'update successful!' : null}
          </form>
        </div>
        <br/>
        <br/>
      </div>
    );
  }

  @autobind
  submit(evt) {
    evt.preventDefault();

    this.props.update({
      ...this.state,
      birthdate: this.refs.birthdate.value
    });
  }

  @autobind
  onToken(token) {
    this.props.incrCredits({token, amount: +this.state.amount});
  }

  //@autobind
  //submitDeposit(evt) {
  //  this.setState({errors: []});
  //  if (this.state.amount < config.minDeposit) {
  //    this.setState({errors: [{field: 'credits', message: `You must deposit at least ${config.minDeposit} credits.`}]});
  //    evt.stopPropagation();
  //  }
  //}
}

export default Account