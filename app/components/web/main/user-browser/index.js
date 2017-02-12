import React from 'react'
import {connect} from 'react-redux'
import sortBy from 'lodash/sortBy'
import take from 'lodash/take'
import {Link} from 'react-router'
import langsISO from 'language-list'
import LangSelectBasic from '../../lang-select/lang-select-basic'
import autobind from 'autobind-decorator'
import ReactPaginate from 'react-paginate'
import IoRefresh from 'react-icons/io/refresh'
import IoRecord from 'react-icons/io/record'
import IoAndroidStar from 'react-icons/io/android-star'
import { fetch as fetchUsers } from '../../../../actions/users'
import { usersSelector } from '../../../../selectors/users'
import config from '../../../../../global-config'
import routeTo from '../../../../route-action'
import css from './user-browser.scss'
import Linkify from '../../linkify'

function mapStateToProps(state) {
  return {
    users: state.users,
    session: state.session,
    usersList: usersSelector(state)
  };
}

@connect(mapStateToProps, {fetchUsers})
class UserBrowser extends React.Component {
  state = {
    filters: {
      speakingLang: '',
      learningLang: ''
    }
  };

  componentWillMount() {
    this.props.fetchUsers({offset: +this.props.params.page - 1 || 0});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.page !== this.props.params.page) {
      this.props.fetchUsers({filters: this.state.filters, offset: +nextProps.params.page - 1 || 0});
    }
  }

  render() {
    const users = this.props.usersList;

    const title = (
      <div>
        <h1 className={css.header}>Search Users</h1>
        <IoRefresh className={css.refreshIcon} onClick={this.refresh}/>
      </div>
    );

    const paginate = (
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={'...'}
        pageCount={this.totalNumberOfPages()}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={css.paginator}
        activeClassName={css.active}
        forcePage={+this.props.params.page - 1 || 0}
      />
    );

    return (
      <div>
        {title}
        {this.languageFilters()}

        <ul className={css.userContainer}>
          {this.props.users.loading ? <div className={css.usersLoading}>Loading...</div> : users.map(this.user)}
        </ul>

        {paginate}
      </div>
    );
  }

  languageFilters() {
    return (
      <div className={css.filters}>
        <div className={css.langFilter}>
          <label htmlFor="learning-lang-select">Learning Langauge:</label>
          <LangSelectBasic onChange={this.filterUsers.bind(this, 'learningLang')}/>
        </div>

        <div className={css.langFilter}>
          <label htmlFor="speaking-lang-select">Speaking Langauge:</label>
          <LangSelectBasic onChange={this.filterUsers.bind(this, 'speakingLang')}/>
        </div>
      </div>
    );
  }

  @autobind
  user(user) {
    const header = (
      <div>
        <div>
          <div className={css.username}>
            {user.online ? <IoRecord className={css.online}/> : <IoRecord className={css.offline}/>}
            <Link to={'/' + user.username} className={css.name}><b>{user.username}</b></Link>
          </div>
          <div className={user.online ? css.onlineNow : css.lastLogin}>
            {user.online ? 'online now!' : 'last seen: ' + user.lastSeen}
          </div>
        </div>
        <hr className={css.hr}/>
      </div>
    );

    const price = false && this.props.mode === 'student' ? (
      <div>
        <label>Price:</label>
        {user.price} credits
        <br/><br/>
      </div>
    ) : null;

    const stars = [
      <IoAndroidStar className={css.star} key={1}/>,
      <IoAndroidStar className={css.star} key={2}/>,
      <IoAndroidStar className={css.star} key={3}/>
    ];

    const learningLangs = (
      <div>
        <label>I'm learning: </label>
        {
          user.learningLangs.length ?
            sortBy(user.learningLangs, 'lang')
              .filter(l => l.lang !== '')
              .map(l => <span key={l.lang}>{langsISO().getLanguageName(l.lang)}{take(stars, l.level)} </span>) :
            'none'
        }
      </div>
    );

    const speakingLangs = (
      <div>
        <label>I can speak: </label>
        {
          user.speakingLangs.length ?
            sortBy(user.speakingLangs, 'lang')
              .filter(l => l.lang !== '')
              .map(l => langsISO().getLanguageName(l.lang))
              .join(' ') :
            'none'
        }
      </div>
    );

    const age = user.age ? (
      <div>
        <label>Age: </label>
        {user.age}
      </div>
    ) : null;

    const location = user.location ? (
      <div>
        <label>Location: </label>
        {user.location}
      </div>
    ) : null;

    const about = user.description ? (
      <div>
        <label>About me: </label>
        <Linkify>{user.description}</Linkify>
      </div>
    ) : null;

    const sentMessages =
      <div>
        <label>Activity level: </label>
        {user.sentMessages || 0} messages sent
      </div>;

    return (
      <li key={user.id} className={css.user}>
        {header}
        {price}
        {learningLangs}
        {speakingLangs}
        {age}
        {location}
        {about}
        <br/>
        {sentMessages}
        <br/>
        <Link to={"/chat/private/" + user.id} className={css.messageMe}>
          Message me
        </Link>
      </li>
    );
  }

  filterUsers(type, evt) {
    this.setState({filters: {...this.state.filters, [type]: evt.target.value}}, () => {
      this.props.fetchUsers({filters: JSON.stringify(this.state.filters)});
    });
  }

  @autobind
  refresh() {
    this.props.fetchUsers({filters: this.state.filters})
  }

  @autobind
  handlePageClick(data) {
    if (data.selected || data.selected === 0) {
      const page = data.selected + 1;
      routeTo('/search/' + page);
    }
  }

  totalNumberOfPages = () => Math.ceil(this.props.users.count / config.usersPerPage);
}

export default UserBrowser