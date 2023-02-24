import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },

  price: {
    type: Number,
    min: [0, '價格錯誤'],
    required: [true, '缺少價格']
  },

  sales: {
    type: Number,
    min: [0, '銷量錯誤'],
    required: [true, '缺少銷量']
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  sell: {
    type: Boolean,
    required: [true, '缺少狀態']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['模型', '遊戲王卡', '公仔', '景品', '其他'],
      message: '分類錯誤'
    }
  }
}, { versionKey: false })

export default model('products', schema)
