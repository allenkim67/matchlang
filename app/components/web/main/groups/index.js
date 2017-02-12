import React from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { createGroupConvo, fetchGroupConvos, setChatType } from '../../../../actions/group-convos'
import { currentUserSelector } from '../../../../selectors/session'
import css from './groups.scss'
import NewGroupForm from './new-group-form'
import MultiToggle from 'react-multi-toggle'
import 'react-multi-toggle/style.css'
import moment from 'moment'
import { GroupConvo, ScheduledConvo } from './convo'
import routeTo from '../../../../route-action'
import ReactPaginate from 'react-paginate'
import config from '../../../../../global-config'

function mapStateToProps(state) {
  return {
    currentUser: currentUserSelector(state),
    chatType: state.groupConvos.chatType,
    groupConvos: state.groupConvos.groupConvos,
    groupConvosCount: state.groupConvos.count,
    scheduledConvos: state.groupConvos.scheduledConvos,
    groupsLoading: state.groupConvos.loading
  }
}

@connect(mapStateToProps, {createGroupConvo, fetchGroupConvos, setChatType})
class Groups extends React.Component {
  state = {
    displayForm: false
  };

  componentDidMount() {
    let mode;

    if (this.props.params.mode === 'past' || this.props.params.mode === 'upcoming') {
      this.props.setChatType(this.props.params.mode);
      mode = this.props.params.mode;
    } else {
      this.props.setChatType(this.props.chatType);
      mode = this.props.chatType;
    }

    this.props.fetchGroupConvos({
      scheduled: mode === 'upcoming',
      offset: +this.props.params.page - 1 || 0
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.page !== this.props.params.page) {
      this.props.fetchGroupConvos({
        scheduled: nextProps.chatType === 'upcoming',
        offset: +nextProps.params.page - 1 || 0
      });
    }
  }

  @autobind
  toggleMode(value) {
    routeTo('/groups/' + value);
    this.props.setChatType(value);
    this.props.fetchGroupConvos({scheduled: value === 'upcoming'});
  }

  render() {
    const groupOptions = [
      {
        displayName: 'Upcoming',
        value: 'upcoming'
      },
      {
        displayName: 'Past',
        value: 'past'
      }
    ];

    const newGroupFormToggler = (
      <a href='#' onClick={this.toggleForm}>
        {this.state.displayForm ? '- Cancel New Group Chat' : '+ Create New Group Chat'}
      </a>
    );

    const newGroupForm = (
      <NewGroupForm
        hideForm={this.hideForm}
        toggleForm={this.toggleForm}
        createGroupConvo={this.props.createGroupConvo}
        setChatType={this.props.setChatType}
      />
    );

    const convosList = this.props.chatType === 'past' ?
      this.props.groupConvos.map(c => <GroupConvo convo={c} key={c.id}/>) :
      this.props.scheduledConvos.map(c => <ScheduledConvo convo={c} key={c.date}/>);

    const loading =  <div className={css.groupsLoading}>Loading...</div>;

    return (
      <div>
        <div className={css.header}>
          <div>
            <h1 className={css.title}>Group Chat</h1>
            {newGroupFormToggler}
          </div>

          <div className={css.togglerContainer}>
            <MultiToggle
              className={css.toggler}
              options={groupOptions}
              selectedOption={this.props.chatType}
              onSelectOption={this.toggleMode}
            />
          </div>
        </div>

        {this.state.displayForm ? newGroupForm : null}

        <div className={css.groupContainer}>
          {this.props.groupsLoading ? loading : convosList}
        </div>

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
      </div>
    );
  }

  @autobind
  toggleForm(evt) {
    evt.preventDefault();
    this.setState({displayForm: !this.state.displayForm});
  }

  @autobind
  handlePageClick(data) {
    if (data.selected || data.selected === 0) {
      const page = data.selected + 1;
      routeTo(`/groups/${this.props.chatType}/${page}`);
    }
  }

  totalNumberOfPages = () => Math.ceil(this.props.groupConvosCount / config.groupsPerPage);
}

export default Groups