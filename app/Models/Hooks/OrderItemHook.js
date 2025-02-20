'use strict'

const OrderItemHook = exports = module.exports = {}

const Product = use('App/Models/Product')
OrderItemHook.method = async (model) => {
  const product = await Product.find(model.product_id)
  model.subtotal = model.quantiy * product.price
}
