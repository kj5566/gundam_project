import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [false, '缺少名稱']
  },
  description: {
    type: String,
    required: [false, '缺少說明']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  }
}, { versionKey: false })

export default model('events', schema)
