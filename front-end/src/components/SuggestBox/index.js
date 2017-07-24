import React, { Component } from 'react'

import Pig from '../../images/Pig_Icon.png'

class SuggestBox extends Component {
  onClick = () => {
    const { data, onClick } = this.props

    onClick(data.name)
  }

  render() {
    const { data } = this.props

    return (
      <div className="suggest-box" onClick={this.onClick}>
        <div className="icon">
          <img src={Pig} alt="" />
        </div>
        <div className="desc">{data.name}</div>
        <div className="clearfix"></div>
      </div>
    )
  }
}

export default SuggestBox