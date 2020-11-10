'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CuoponOrderSchema extends Schema {
  up () {
    this.create('cuopon_order', (table) => {
      table.increments()
      table.integer('cuopon_id').unsigned()
      table.integer('order_id').unsigned()
      table.decimal('discount', 12, 2).defaultTo(0.0)
      table.timestamps()

      table.foreign('cuopon_id').references('id').inTable('cuopons').onDelete('cascade')
      table.foreign('order_id').references('id').inTable('orders').onDelete('cascade')
    })
  }

  down () {
    this.drop('cuopon_order')
  }
}

module.exports = CuoponOrderSchema
