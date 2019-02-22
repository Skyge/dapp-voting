import React from 'react'

class Form extends React.Component {
  render() {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.castVote(this.candidateId.value)
      }}>
        <div class='form-group'>
          <label>Select Your Favorite</label>
          <select ref={(input) => this.candidateId = input} class='form-control'>
            {this.props.candidates.map((candidate) => {
              return <option value={candidate.id.toNumber()+1}>{candidate.id.toNumber()+1}</option>
            })}
          </select>
        </div>
        <button type='submit' class='btn btn-primary'>Vote</button>
        <hr />
      </form>
    )
  }
}

export default Form
