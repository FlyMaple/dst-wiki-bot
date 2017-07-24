const Immutable = require('immutable')
const foods = Immutable.fromJS(require('./foods'))
const foodNames = Immutable.fromJS(foods.keySeq().toArray())

const sortFoodsOfName = (foods) => {
  const foodNames = Immutable.fromJS(foods.keySeq().toArray())
  let foodNamesOfArray = []

  foodNames.forEach((foodName) => {
    foodNamesOfArray.push(foods.get(foodName).set('name', foodName))
  })

  foodNamesOfArray = foodNamesOfArray.sort((a, b) => {
    if (a.get('order') < b.get('order'))
      return -1;
    if (a.get('order') > b.get('order'))
      return 1;
    return 0;
  }).map(food => food.get('name'))

  return Immutable.fromJS(foodNamesOfArray)
}

const findFood = (text) => {
  if (text.indexOf('精準搜尋') !== -1) {
    return Immutable.fromJS([sortFoodsOfName(foods).find(foodName => {
      return foodName === text.split('精準搜尋 ')[1]
    })])
  } else {
    return sortFoodsOfName(foods).filter(foodName => {
      return foodName.indexOf(text) !== -1
    })
  }
}

const findBloodFood = () => {
  return foods.filter(food => {
    return food.get('blood') >= 25
  })
}

const findFullnessFood = () => {
  return foods.filter(food => {
    return food.get('fullness') >= 50
  })
}

const findReasonFood = () => {
  return foods.filter(food => {
    return food.get('reason') >= 10
  })
}

const messageToClient = (socket, text) => {
  const matchFoods = findFood(text)
  if (text === '補血') {
    const bloodFoods = findBloodFood()
    const bloodFoodNames = Immutable.fromJS(bloodFoods.keySeq().toArray())

    socket.emit('message', {
      type: 'json',
      data: bloodFoodNames.map(foodName => (
        bloodFoods.get(foodName).set('name', foodName)
      )).toJS().sort((a, b) => {
        if (a.blood < b.blood)
          return 1;
        if (a.blood > b.blood)
          return -1;
        return 0;
      })
    })
  } else if (text === '補理智') {
    const reasonFoods = findReasonFood()
    const reasonFoodNames = Immutable.fromJS(reasonFoods.keySeq().toArray())

    socket.emit('message', {
      type: 'json',
      data: reasonFoodNames.map(foodName => (
        reasonFoods.get(foodName).set('name', foodName)
      )).toJS().sort((a, b) => {
        if (a.reason < b.reason)
          return 1;
        if (a.reason > b.reason)
          return -1;
        return 0;
      })
    })
  } else if (text === '補飽食度') {
    const fullnessFoods = findFullnessFood()
    const fullnessFoodNames = Immutable.fromJS(fullnessFoods.keySeq().toArray())

    socket.emit('message', {
      type: 'json',
      data: fullnessFoodNames.map(foodName => (
        fullnessFoods.get(foodName).set('name', foodName)
      )).toJS().sort((a, b) => {
        if (a.fullness < b.fullness)
          return 1;
        if (a.fullness > b.fullness)
          return -1;
        return 0;
      })
    })
  } else {
    socket.emit('message', {
      type: 'json',
      data: matchFoods.map(foodName => (
        foods.get(foodName).set('name', foodName)
      )).toJS()
    })
  }
}

const getAllFoodName = () => {
  return sortFoodsOfName(foods).toJS().join('\n')
}

const isMe = (text) => {
  const foods = findFood(text)

  if ((foods.size > 0) ||
    (text === '補血') ||
    (text === '補理智') ||
    (text === '補飽食度')) {
    return true
  }

  return false
}

module.exports = {
  isMe,
  messageToClient,
  getAllFoodName
}