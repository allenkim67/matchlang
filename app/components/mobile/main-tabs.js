import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view'
import Icon from 'react-native-vector-icons/Entypo'
import UserBrowser from './user-browser'
import Convos from './convos'
import { primaryColor } from './style-theme'
import PushNotification from './push-notification'
import { registerMobile } from '../../actions/push-notification'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 54
  },

  tabbar: {
    backgroundColor: primaryColor,
    height: 48
  },

  iconStyle: {
    height: 8,
    fontSize: 8
  },

  labelStyle: {
    height: 8,
    fontSize: 8
  }
});

function mapStateToProps(state) {
  return {}
}

@connect(mapStateToProps, {registerMobile})
export default class MainTabs extends Component {
  state = {
    index: 0,
    routes: [
      { key: 'search', icon: 'magnifying-glass' },
      { key: 'convos', icon: 'chat' },
      { key: 'study', icon: 'graduation-cap' },
      { key: 'more', icon: 'dots-three-horizontal' }
    ]
  };

  _renderScene({route}) {
    switch (route.key) {
      case 'search':
        return <UserBrowser/>;
      case 'convos':
        return <Convos/>;
      case 'study':
        return null;
      case 'more':
        return null;
      default:
        return null;
    }
  };

  _renderIcon({route}) {
    return <Icon name={route.icon} size={30} color="#fff" />
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={props => <TabBarTop
                                   {...props}
                                   style={styles.tabbar}
                                   renderIcon={this._renderIcon}
                                 />}
          onRequestChangeTab={i => this.setState({index: i})}
        />
        <PushNotification registerMobile={this.props.registerMobile}/>
      </View>
    );
  }
}