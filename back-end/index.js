const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const mc = require('./mc')
const FoodTools = require('./foodTools')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Socket.io')
})

// io.set('origins', '*:*')
io.sockets.on('connection', (socket) => {
  socket.emit('connection_Success', {
    type: 'text',
    messages: [`
      Welcome Don't Starve Together 食物料理小幫手 ^_^\n
      指令集:\n
      幫助
      全部
      料理名稱
      食材名稱
      補血
      補理智
      補飽食度
    `]
  })

  socket.emit('global_vars', {
    type: 'json',
    data: {
      mc
    }
  })

  socket.on('message', (text) => {
    const isFood = FoodTools.isMe(text)

    if (isFood) {
      FoodTools.messageToClient(socket, text)
    } else if (text === '幫助') {
      socket.emit('connection_Success', {
        type: 'text',
        messages: [`
          指令集:\n
          幫助
          全部
          料理名稱
          食材名稱
          補血
          補理智
          補飽食度
        `]
      })
    } else if (text === '全部') {
      const messages = [`${FoodTools.getAllFoodName()}`]

      socket.emit('connection_Success', {
        type: 'text',
        messages
      })
    } else {
      socket.emit('message', {
        type: 'text',
        messages: [`沒有找到相關資料`]
      })
    }
  })
})

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
server.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});