'use strict'

const Service = require('egg').Service
const DATABASE = 'echowall'
const PAGESIZE = 10

class QueryService extends Service {
  async index(start) {
    const { app } = this
    const offset = start ? (start - 1) * PAGESIZE : 0
    const result = await app.mysql.select(DATABASE, {
      columns: ['id', 'title', 'box', 'time'],
      orders: [['time', 'desc']],
      limit: PAGESIZE,
      offset,
    })
    return result
  }
  async useId(id) {
    const { app } = this
    const result = await app.mysql.select(DATABASE, {
      where: { id },
      columns: ['title', 'box', 'problem', 'reply', 'time'],
    })
    return result
  }
  async useBox(box, page) {
    const { app } = this
    const offset = page ? (page - 1) * PAGESIZE : 0
    let result
    if (box === '其他') {
      const { mainBoxes } = app.config
      // 拼下字符串
      const Boxes = mainBoxes.map(val => `'${val}'`).join(',')
      const SQL = `SELECT id, title, box, time FROM echowall WHERE box not in (${Boxes})\
       ORDER BY time DESC limit ${offset}, ${PAGESIZE};`
      result = await app.mysql.query(SQL)
    } else {
      result = await app.mysql.select(DATABASE, {
        where: { box },
        columns: ['id', 'title', 'box', 'time'],
        orders: [['time', 'desc']],
        limit: PAGESIZE,
        offset,
      })
    }
    return result
  }
}

module.exports = QueryService
