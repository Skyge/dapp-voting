import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Ballot from '../../build/contracts/Ballot.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      votedFor: 0
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.ballot = TruffleContract(Ballot)
    this.ballot.setProvider(this.web3Provider)

    console.log("---you login in----");

    this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.ballot.deployed().then((ballotInstance) => {
        this.ballotInstance = ballotInstance
        this.watchEvents()
        this.ballotInstance.proposalsCount().then((proposals) => {
          for (var i = 1; i <= proposals; i++) {
              this.ballotInstance.proposals(i-1).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                  id: candidate[0],
                  voteCount: candidate[1]
              });
              this.setState({ candidates: candidates })
            });
          }
        })
        this.ballotInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted:hasVoted[0], loading: false, votedFor: hasVoted[1].toNumber() })
        })
      })
    })
  }

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.ballotInstance.VotingEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  castVote(candidateId) {
    this.setState({ voting: true })
    this.ballotInstance.vote(candidateId-1, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true, votedFor: candidateId })
    )
  }

  render() {
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>Select The Most Suitable One!</h1>
          <br/>
          { this.state.loading || this.state.voting
            ? <p class='text-center'>Loading...</p>
            : <Content
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                votedFor={this.state.votedFor}
                castVote={this.castVote} />
          }
        </div>
      </div>
    )
  }
}

ReactDOM.render(
   <App />,
    document.getElementById('root')
)
