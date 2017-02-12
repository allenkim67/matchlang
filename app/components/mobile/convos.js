import React, {Component} from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { View } from 'react-native'
import { orderedPrivate } from '../../selectors/convos'
import routeTo from '../../route-action'
import { Badge, Text, List, ListItem } from 'native-base'

function mapStateToProps(state) {
  return {
    privateConvos: orderedPrivate(state)
  }
}

@connect(mapStateToProps, {})
class Convos extends Component {
  render() {
    return (
      <List
        removeClippedSubviews={false}
        dataArray={this.props.privateConvos}
        renderRow={this.convo}
      />
    );
  }

  @autobind
  convo(convo) {
    return (
      <ListItem onPress={() => this.routeToChat(convo)}>
        <View style={style.row} key={convo.id || convo.key}>
          {convo.unread ? <Badge style={style.badge}><Text>{convo.unread}</Text></Badge> : null}
          <Text>{convo.users[0].username}</Text>
        </View>
      </ListItem>
    );
  }

  routeToChat(convo) {
    const params = {
      convoType: 'private',
      id: convo.users[0].id
    };
    const title = convo.users[0].username;
    routeTo('chat', params, title);
  }
}

const style = {
  badge: {
    marginRight: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
};
export default Convos