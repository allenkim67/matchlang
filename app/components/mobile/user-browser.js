import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import reject from 'lodash/reject'
import { connect } from 'react-redux'
import { fetch } from '../../actions/users'
import { usersSelector } from '../../selectors/users'
import { View } from 'react-native'
import routeTo from '../../route-action'
import { Text, List, ListItem } from 'native-base'

function mapStateToProps(state) {
  return {
    users: state.users.users,
    session: state.session,
    usersList: usersSelector(state)
  }
}

@connect(mapStateToProps, {fetch})
class Auth extends Component {
  state = {
    learningLang: null,
    speakingLang: null
  };

  componentDidMount() {
    this.props.fetch();
  }

  render() {
    return (
      <List
        removeClippedSubviews={false}
        dataArray={this.props.usersList}
        renderRow={this.user}
      />
    );
  }

  @autobind
  user(user) {
    return (
      <ListItem onPress={() => routeTo('chat', {convoType: 'private', id: user.id}, user.username)}>
        <View style={style} key={user.id}>
          <Text>{user.username}</Text>
          <Text note>{user.lastSeen}</Text>
        </View>
      </ListItem>
    );
  }
}

const style = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between'
};

export default Auth