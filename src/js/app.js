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
    // this.ballot.deployed().then((ballotInstance) => {
    //   this.ballotInstance = ballotInstance;
    //   console.log("u have initialized contract---",this.ballotInstance.proposalsCount());
    //   this.ballotInstance.proposals().then((proposals) => {
    //     console.log("====got proposal count====", proposals.length);});
    // })

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
          console.log("====got proposal count====", proposals);
          for (var i = 1; i <= proposals; i++) {
            console.log("u r counting=====", i);
              this.ballotInstance.proposals(i-1).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                  id: candidate[0],
                  voteCount: candidate[1]
              });
              console.log("before saving=====", candidates);
              this.setState({ candidates: candidates })
              console.log("after saving=====", this.state.candidates);
            });
          }
        })
        this.ballotInstance.voters(this.state.account).then((hasVoted) => {
          let temp = hasVoted[0];
          // console.log("before changing ====", this.state);
          this.setState({ temp, loading: false })
          // console.log("after changing====", this.state);
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
    this.ballotInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true })
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
