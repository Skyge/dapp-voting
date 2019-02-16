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

// /**
//  * @title Ownable
//  * @dev The Ownable contract has an owner address, and provides basic authorization control
//  * functions, this simplifies the implementation of "user permissions".
//  */
// contract Ownable {
//     address private _owner;

//     /**
//      * @dev Throws if called by any account other than the owner.
//      */
//     modifier onlyOwner() {
//         require(isOwner(), "You do not have the permission");
//         _;
//     }

//     event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

//     /**
//      * @dev The Ownable constructor sets the original `owner` of the contract to the sender
//      * account.
//      */
//     constructor () internal {
//         _owner = msg.sender;
//         emit OwnershipTransferred(address(0), _owner);
//     }

//     /**
//      * @return the address of the owner.
//      */
//     function owner() public view returns (address) {
//         return _owner;
//     }

//     /**
//      * @return true if `msg.sender` is the owner of the contract.
//      */
//     function isOwner() public view returns (bool) {
//         return msg.sender == _owner;
//     }
// }

// /**
//  * @title Pausable
//  * @dev Base contract which allows admin to implement an emergency stop mechanism.
//  */
// contract Pausable is Ownable {
//     event Paused(address account);
//     event Unpaused(address account);

//     bool private _paused;

//     constructor () internal {
//         _paused = false;
//     }

//     /**
//      * @return true if the contract is paused, false otherwise.
//      */
//     function paused() public view returns (bool) {
//         return _paused;
//     }

//     /**
//      * @dev Modifier to make a function callable only when the contract is not paused.
//      */
//     modifier whenNotPaused() {
//         require(!_paused, "Only valid when does not paused!");
//         _;
//     }

//     /**
//      * @dev Modifier to make a function callable only when the contract is paused.
//      */
//     modifier whenPaused() {
//         require(_paused, "Only valid when pause!");
//         _;
//     }

//     /**
//      * @dev called by the owner to pause, triggers stopped state
//      */
//     function pause() public onlyOwner whenNotPaused {
//         _paused = true;
//         emit Paused(msg.sender);
//     }

//     /**
//      * @dev called by the owner to unpause, returns to normal state
//      */
//     function unpause() public onlyOwner whenPaused {
//         _paused = false;
//         emit Unpaused(msg.sender);
//     }
// }

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
    uint8[] public winningProposal_;

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
    function winningProposal() public whenPaused returns (uint8[] memory) {
        uint32 winningVoteCount = 0;
        for (uint8 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount == winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_.push(p);
            }else if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                for (uint8 i = uint8(winningProposal_.length)-1; i <= 0; i--) {
                    delete winningProposal_[i];
                    winningProposal_.length--;
                }
                winningProposal_.push(p);
            }
        }

        return winningProposal_;
    }
}