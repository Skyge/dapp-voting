pragma solidity ^0.5.0;

import "./Pausable.sol";

/**
                        ██████           ██        ██          ██               ██      ████████████
                        ██   ██        ██  ██      ██          ██            ██    ██        ██
                        ██████        ██    ██     ██          ██           ██      ██       ██
                        ██   ███     ██████████    ██          ██           ██      ██       ██
                        ██     ██   ██        ██   ██          ██            ██    ██        ██
                        ████████   ██          ██  ██████████  ██████████       ██           ██

 * @title Voting to select which piture is better.
 * @author Yang Han, Lee.c, Skyge 
 */


contract Ballot is Pausable {
    // It will represent a single voter.
    struct Voter {
        bool hasVoted;      // if true, that person already voted
        uint8 voteFor;      // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        uint8 number;       // number of proposal
        uint32 voteCount;   // number of accumulated votes
    }

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    /// @dev Create a new ballot to choose one of `proposalNames`.
    constructor(uint8 proposalNumbers) public {
        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint8 i = 0; i < proposalNumbers; i++) {
            proposals.push(Proposal({
                number: i,
                voteCount: 0
            }));
        }
    }

    /// @dev Give your vote 
    /// to proposal `proposals[proposal].name`.
    function vote(uint8 proposal) public whenNotPaused returns (bool) {
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Already voted.");
        require(proposal <= proposals.length-1, "Please check your voting number!");
        sender.hasVoted = true;
        sender.voteFor = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += 1;

        return true;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public whenPaused view returns (uint8 winningProposal_) {
        uint32 winningVoteCount = 0;
        for (uint8 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @dev Calls winningProposal() function to get the index
    /// of the winner contained in the proposals array and then
    /// returns the number of the winner
    function winnerNumber() public whenPaused view returns (uint8 winnerNumber_) {
        winnerNumber_ = proposals[winningProposal()].number;
    }
}