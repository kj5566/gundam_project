import users from '../models/users.js'
import products from '../models/products.js'
import biddings from '../models/biddings.js'

import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        bidcart: req.user.bidcart.reduce((total, current) => total + current.bidprice, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        bidcart: req.user.bidcart.reduce((total, current) => total + current.bidprice, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editCart = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      console.log(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.cart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.cart[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.cart.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const editbidcart = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.bidcart.findIndex(bidcart => bidcart.b_id.toString() === req.body.b_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const bidprice = req.user.bidcart[idx].bidprice + parseInt(req.body.bidprice)
      console.log(req.body.bidprice)
      if (bidprice <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.bidcart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.bidcart[idx].bidprice = bidprice
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const bidding = await biddings.findById(req.body.b_id)
      // 如果不存在，回應 404
      if (!bidding) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.bidcart.push({
        b_id: req.body.b_id,
        bidprice: parseInt(req.body.bidprice)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.bidcart.reduce((total, current) => total + current.bidcart, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
export const getbidcart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'bidcart').populate('bidcart.b_id')
    res.status(200).json({ success: true, message: '', result: result.bidcart })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const bidAmount = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const amount = req.body.amount
    if (!amount) {
      res.status(400).send('Missing bid amount')
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.cart.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
