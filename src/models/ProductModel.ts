import { model, Schema } from 'mongoose'
import ProductInterface from '../types/productType'

const ProductModel: Schema = new Schema({
  product_name: {
    type: String
  },
  product_image: {
    type: Schema.Types.Array,
    required: false,
  },
  description: {
    type: String
  },
  grid_color: {
    type: Boolean,
    required: false,
    default: false
  },
  product_number: {
    type: Number,
    required: false
  },
  product_users : [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }]
})

export default model<ProductInterface>('products', ProductModel)

