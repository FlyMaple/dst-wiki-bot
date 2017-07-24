import React, { Component } from 'react'

import cn from 'classnames'

import ServerAvatar from '../../images/Waxwell_portrait.png'
import ClientAvatar from '../../images/Wickerbottom_Portrait.png'

class MessageBox extends Component {
  getSiteAvatar = () => {
    const { site } = this.props.data

    if (site === 'server') {
      return ServerAvatar
    } else {
      return ClientAvatar
    }
  }

  renderMessage = () => {
    const { type, messages, data } = this.props.data

    if (type === 'text') {
      return messages[0].split('\n').map((message, i) => <div key={i}>{message}</div>)
    } else if (type === 'json') {
      if (data.length > 1) {
        return (
          <div>
            <p>你要找的資料是哪個呢(輸入編號)?</p>
            <div>0. 離開</div>
            {
              data.map((food, i) => {
                return (
                  <div key={i}>{`${i + 1}. ${food.name}`}</div>
                )
              })
            }
          </div>
        )
      } else {
        const { name, fullness, reason, blood, expire, mc, limit, recipe, examples, comment } = data[0]
        const detail = mc ? (
          <div>
            <hr />
            <p><b>配方係數: {'　'}</b>{mc}</p>
            <p><b>限制物品: {'　'}</b>{limit}</p>
            <p><b>食譜規則: {'　'}</b>{recipe}</p>
            {
              examples.map((example, i) => (
                <p key={i}>{'　'}<b>{`範例 ${i + 1}. `}{'　'}</b>{example}</p>
              ))
            }
            {
              comment ? (
                <div>
                  <br />
                  <b>備註:{'　'} </b>
                  <p>{comment ? comment : '無'}</p>
                </div>
              ) : null
            }
          </div>
        ) : null

        return (
          <div>
            <p>{`『${name}』`}</p>
            <div>
              <b>飢餓: </b>{fullness}{'　'}
              <b>理智: </b>{reason}{'　'}
              <b>血量: </b>{blood}{'　'}
              <b>天數: </b>{expire === 99 ? '無期限' : expire}{'　'}
              {
                detail
              }
            </div>
          </div>
        )
      }
    }

    return null
  }

  render() {
    const { site } = this.props.data
    const ClassName = cn({
      'message-box': true,
      [`message-${site}`]: true
    })

    return (
      <div className={ClassName}>
        <div className="icon">
          <img src={this.getSiteAvatar()} alt="" />
        </div>
        <div className="message-wrapper">
          <div className="message-container">
            {this.renderMessage()}
          </div>
        </div>
      </div>
    )
  }
}

export default MessageBox