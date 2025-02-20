'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Pagination {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    // call next to advance the request
    if (ctx.request.method() === 'GET') {
      const page = parseInt(ctx.request.input('page'))
      const limit = parseInt(ctx.request.input('limit'))
      //atribui os valores passados na rota GET para a propriedade do objeto ctx(context)
      ctx.pagination = {
        page,
        limit,
      }
    }

    const perpage = parseInt(ctx.request.input('perpage'))
    if (perpage) {
      ctx.pagination.limit = perpage
    }
    await next()
  }
}

module.exports = Pagination
