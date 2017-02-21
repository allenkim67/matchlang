import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Text, List, ListItem } from 'native-base'
import { fetchGroupConvos } from '../../actions/group-convos'
import routeTo from '../../route-action'
import { SegmentedControls } from 'react-native-radio-buttons'

function mapStateToProps(state) {
  return {
    groupConvos: state.groupConvos.groupConvos,
    scheduledConvos: state.groupConvos.scheduledConvos
  }
}

@connect(mapStateToProps, {fetchGroupConvos})
class Groups extends Component {
  state = {
    selectedOption: 'past'
  };

  componentDidMount() {
    this.props.fetchGroupConvos({scheduled: false});
  }

  render() {
    const options = [
      "upcoming",
      "past"
    ];

    function setSelectedOption(selectedOption){
      this.setState({selectedOption});
      this.props.fetchGroupConvos({scheduled: selectedOption === 'upcoming'});
    }

    const convos = this.state.selectedOption === 'past'
      ? this.pastGroups()
      : this.upcomingGroups();

    return (
      <View>
        <View style={{margin: 10}}>
          <SegmentedControls
            options={options}
            onSelection={setSelectedOption.bind(this)}
            selectedOption={this.state.selectedOption}
          />
        </View>
        {convos}
      </View>
    );
  }

  @autobind
  pastGroups() {
    return (
      <List
        removeClippedSubviews={false}
        dataArray={this.props.groupConvos}
        renderRow={this.pastGroup}
      />
    );
  }

  @autobind
  pastGroup(group) {
    return (
      <ListItem onPress={() => routeTo('chat', {convoType: 'group', id: group.id}, group.name)}>
        <Text>{group.name}</Text>
      </ListItem>
    );
  }

  @autobind
  upcomingGroups() {
    const convos = this.props.scheduledConvos.reduce((acc, c) => {
      acc.push(
        <ListItem itemDivider key={c.date}>
          <Text>{c.date}</Text>
        </ListItem>
      );

      acc = acc.concat(c.groups.map(g => (
        <ListItem key={g.id}  onPress={() => routeTo('chat', {convoType: 'group', id: g.id}, g.name)}>
          <Text>{g.name}</Text>
        </ListItem>
      )));

      return acc;
    }, []);

    return (
      <View>
        {convos}
      </View>
    );
  }
}

export default Groups