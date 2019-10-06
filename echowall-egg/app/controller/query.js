'use strict'

const Controller = require('egg').Controller

class QueryController extends Controller {
  async index() {
    const { ctx, service } = this
    const { page } = ctx.query
    const res = await service.query.index(page)
    ctx.body = res
  }
  async useId() {
    const { ctx, service } = this
    const { id } = ctx.query
    const res = await service.query.useId(id)
    ctx.body = res
  }
  async useBox() {
    const { ctx, service } = this
    const { box, page } = ctx.request.body
    const res = await service.query.useBox(box, page)
    ctx.body = res
  }
}

module.exports = QueryController
