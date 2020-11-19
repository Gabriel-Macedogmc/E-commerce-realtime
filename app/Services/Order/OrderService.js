'use strict'

const Database = use('Database')
class OrderService {
  constructor(model, trx = null) {
    this.model = model
    this.trx = trx
  }

  async syncItems(items) {
    if (!Array.isArray(items)) {
      return false
    }

    await this.model.items().delete(this.trx)
    await this.model.items().createMany(items, this.trx)
  }

  async updateItems(items) {
    let currentItems = await this.model
      .items()
      .whereIn(
        'id',
        items.map(item => item.id)
      )
      .fetch()
    //deleta os itens que o user nao quer mais
    await this.model
      .items()
      .whereNotIn(
        'id',
        items.map(item => item.id)
      )
      .delete(this.trx)

    //atualizando os itens
    await Promise.all(
      currentItems.rows.map(async item => {
        item.fill(items.find(n => n.id === item.id))
        await item.save(this.trx)
      })
    )
  }

  async canApplyCoupon(coupon) {
    //verifica a validade por data
    const now = new Date().getTime()
    if (
      now > coupon.valid_from.getTime() ||
      (typeof coupon.valid_until == 'object' &&
        coupon.valid_until.getTime() < now)
    ) {
      //verifica se o cupom ja entrou em validade
      //verifica se ha uma data de expiracao
      //se houver data de expiracao verifica se o cupom expirou

      return false
    }
    const couponProducts = await Database.from('coupon_product')
      .where('coupon_id', coupon.id)
      .pluck('product_id')

    const counponClients = await Database.from('coupon_user')
      .where('coupon_id', coupon.id)
      .pluck('user_id')

    //verifica se o cupom não esta associado a produtos & clientes especificos
    if (
      Array.isArray(couponProducts) &&
      couponProducts.length < 1 &&
      Array.isArray(counponClients) &&
      counponClients.length < 1
    ) {
      //caso nao esteja associado a cliente ou produto especifico é de uso livre
      return true
    }

    let isAssociatedToProducts,
      isAssociatedToClients = false

    if (Array.isArray(couponProducts) && couponProducts.length > 0) {
      isAssociatedToProducts = true
    }

    if (Array.isArray(counponClients) && counponClients > 0) {
      isAssociatedToClients = true
    }

    const productsMatch = await Database.from('order_items')
      .whre('order_id', this.model.id)
      .whereIn('product_id', couponProducts)
      .pluck('product_id')

    /**
     * caso de uso 1 - o cupom esta associado a clientes & produtos
     */

    if (isAssociatedToClients && isAssociatedToProducts) {
      const clientMatch = counponClients.find(
        client => client === this.model.user_id
      )
      if (
        clientMatch &&
        Array.isArray(productsMatch) &&
        productsMatch.length > 0
      ) {
        return true
      }
    }

    /**
     * caso de uso 2 - o cupom esta associado apenas a produtos
     */

    if (
      isAssociatedToProducts &&
      Array.isArray(productsMatch) &&
      productsMatch.length > 0
    ) {
      return true
    }

    /**
     * caso de uso 3 - o cupom esta associado apeas 1 ou mais cliente e nenhum producto
     */

    if (
      isAssociatedToClients &&
      Array.isArray(counponClients) &&
      counponClients.length > 0
    ) {
      const match = counponClients.find(client => client === this.model.user_id)

      if (match) {
        return true
      }
    }

    /**
     * caso nenhuma das verificacoes acima deem positivas entao o cupom
     * esta asssociado a clientes ou produtos ou os dois porem nenhum
     * dos produtos deste pedido esta elegivel ao desconto e o cliente
     * que fez a compra tambem nao podera utilizar este cupom
     */

    return false
  }
}

module.exports = OrderService
