import React from 'react'
import { connect } from 'react-redux'
import { fetchFavs, setFavorite } from '../../../../actions/messages'
import Card from './card'
import Flashcard from './flashcard'

function mapStateToProps(state) {
  return {
    messages: state.review.favs
  };
}

@connect(mapStateToProps, {fetchFavs, setFavorite: setFavorite.bind(null, 'review')})
class Review extends React.Component {
  componentDidMount() {
    this.props.fetchFavs();
  }

  render() {
    return (
      <div>
        <h1>Study Guide</h1>
        <h3>Review saved messages</h3>
        <div>
          {this.props.messages.map(m => <Card message={m} key={m.id} setFavorite={this.props.setFavorite}/>)}
          {this.props.messages.length === 0 ? 'You have no saved messages yet. Try the chat!' : null}
        </div>
      </div>
    );
  }
}

module.exports = Review;