'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {

  //relacionamento entre Produto e Imagem de destaque
  image() {
    return this.belongsTo('App/Models/Image')
  }

  //relacionamento entre Produto e Imagens (galeria de Imagens)
  images() {
    return this.belongsToMany('App/Models/Image')
  }

  //relacionamento entre Produto e Categorias
  categories() {
    return this.belongsToMany('App/Models/Category')
  }

  //Relacionamento entre Produto e Cupons de Desconto
  coupons() {
    return this.belongsToMany('App/Models/Coupons')
  }
}

module.exports = Product
