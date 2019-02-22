import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
  render() {
    return (
      <div>
        <Table candidates={this.props.candidates} />
        <hr/>
        { !this.props.hasVoted ?
          <Form candidates={this.props.candidates} castVote={this.props.castVote} />
          : null
        }
        <p>Your account: <b>{this.props.account}</b></p>
        { this.props.hasVoted ?
          <p>You have voted for: <b>{this.props.votedFor}</b></p>
          : null
        }
      </div>
    )
  }
}

export default Content