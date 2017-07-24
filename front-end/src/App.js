import React, { Component } from 'react'

import PerfectScrollbar from 'react-perfect-scrollbar'
import io from 'socket.io-client'

import MessageBox from './components/MessageBox'
import SuggestBox from './components/SuggestBox'

import Donate from './images/donate.png'

const socket = io()

// import 'perfect-scrollbar/dist/css/perfect-scrollbar.min.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      height: document.documentElement.clientHeight * 0.8,
      globalVars: null,
      historyList: []
    }
  }


  componentWillMount() {
    socket.on('connection_Success', (data) => {
      localStorage.clear()

      this.messageToState(data, 'server')
    })

    socket.on('global_vars', (globalVars) => {
      this.setState({
        globalVars
      })
    })

    socket.on('message', (data) => {
      const { type, data: foods } = data

      if (type === 'json') {
        if (foods.length > 1) {
          localStorage.foods = JSON.stringify(foods)
        } else if (foods.length === 1) {
          this.setHistoryList(foods[0])
        }
      }

      this.messageToState(data, 'server')
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { contentContainer } = this.refs
    const scrollbarContainer = contentContainer.querySelector('.scrollbar-container')

    setTimeout(() => {
      scrollbarContainer.scrollTop = scrollbarContainer.scrollHeight
    }, 30)
  }


  messageToState = (message, site) => {
    this.setState({
      messages: [...this.state.messages, { site, ...message }]
    })
  }


  onInputKeyPress = (event) => {
    //  Enter
    if (event.which === 13) {
      this.sendInputRequest()
    }
  }

  onInputButtonClick = () => {
    this.sendInputRequest()
  }

  sendInputRequest = () => {
    const { input } = this.refs
    const { value: message } = input
    const { foods } = localStorage

    if (foods && message) {
      if (isNaN(message)) {
        this.messageToState({
          type: 'text',
          messages: ['請輸入正確的編號唷...']
        }, 'server')
      } else if (parseInt(message, 10) === 0) {
        localStorage.clear()

        this.messageToState({
          type: 'text',
          messages: ['請重新輸入查詢...']
        }, 'server')
      } else {
        const food = JSON.parse(foods)[parseInt(message, 10) - 1]

        if (food) {
          localStorage.clear()

          this.setHistoryList(food)

          this.messageToState({
            type: 'json',
            data: [food]
          }, 'server')
        } else {
          this.messageToState({
            type: 'text',
            messages: ['請輸入正確的編號唷...']
          }, 'server')
        }
      }
    } else if (message) {
      this.messageToState({
        type: 'text',
        messages: [message]
      }, 'client')

      socket.emit('message', message)
    }

    input.value = ''
  }


  getMessages = () => {
    const { messages } = this.state
    let count

    return messages.map((message, i) => {
      const { type } = message
      if (type === 'text') {

        return (
          message.messages.map((_message, j) => {
            if (count === undefined) {
              count = 0
            } else {
              count = count + 1
            }

            const data = {
              ...message,
              messages: [_message]
            }

            return <MessageBox key={count} type={type} data={data} />
          })
        )
      } else if (type === 'json') {
        if (count === undefined) {
          count = 0
        } else {
          count = count + 1
        }

        return <MessageBox key={count} type={type} data={message} />
      }
    })
  }

  onSuggestBoxClick = (foodName) => {
    localStorage.clear()

    socket.emit('message', `精準搜尋 ${foodName}`)
  }

  setHistoryList = (food) => {
    const { historyList } = this.state
    const isExist = historyList.find(_ => _.name === food.name)

    if (!isExist) {
      this.setState({
        historyList: [...historyList, food]
      })
    }
  }

  render() {
    const { height, historyList } = this.state

    return (
      <div className="App">
        <div className="bot-wrapper" style={{ height: `${height}px` }}>
          <div className="main-wrapper">
            <div className="content-wrapper">
              <div className="content-container" ref="contentContainer">
                <PerfectScrollbar>
                  {this.getMessages()}
                </PerfectScrollbar>
              </div>
            </div>
            <div className="input-wrapper">
              <input type="text" className="input" ref="input" onKeyPress={this.onInputKeyPress} />
              <button className="submit" onClick={this.onInputButtonClick}>
                <i className="material-icons">send</i>
              </button>
            </div>
          </div>
          <div className="suggest-wrapper">
            <div className="suggest-container" ref="suggestContainer">
              <PerfectScrollbar>
                {
                  historyList.map(food => {
                    return (
                      <SuggestBox key={food.name} data={food} onClick={this.onSuggestBoxClick} />
                    )
                  })
                }
              </PerfectScrollbar>
            </div>
          </div>
          {/*<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style={{ textAlign: 'center' }}>
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="S44US5M6VKLXY" />
            <input type="image" src={Donate} name="submit" alt="PayPal － 更安全、更簡單的線上付款方式！" style={{ marginTop: '20px' }} />
            <img alt="" src="https://www.paypalobjects.com/zh_TW/i/scr/pixel.gif" width="1" height="1" />
          </form>*/}
        </div>
      </div>
    )
  }
}

export default App
