import biddings from '../models/biddings.js'

export const createbiddings = async (req, res) => {
  try {
    const result = await biddings.create({
      name: req.body.name,
      sell: req.body.sell,
      price: req.body.price,
      description: req.body.description,
      image: req.file?.path || '',
      category: req.body.category
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getSellbiddings = async (req, res) => {
  try {
    const result = await biddings.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllbiddings = async (req, res) => {
  try {
    const result = await biddings.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getbiddings = async (req, res) => {
  try {
    const result = await biddings.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const editbiddings = async (req, res) => {
  try {
    const result = await biddings.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      sell: req.body.sell,
      description: req.body.description,
      image: req.file?.path,
      category: req.body.category
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到1' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 監聽
