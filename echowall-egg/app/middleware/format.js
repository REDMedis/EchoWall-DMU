'use strict'

const moment = require('moment')

module.exports = option => {
  // 日期格式化中间件 仅在返回数据存在 time 字段的路由启用
  return async function format(ctx, next) {
    await next()
    const { body } = ctx
    let formatBody = body
    if (Array.isArray(body)) {
      formatBody = body.map(val => {
        return {
          ...val,
          time: moment(val.time).format(option.template),
        }
      })
    } else if (body.time) {
      formatBody = {
        ...body,
        time: moment(body.time).format(option.template),
      }
    }
    ctx.body = formatBody
  }
}
