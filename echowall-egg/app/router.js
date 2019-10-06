'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const format = app.middleware.format({ template: 'YYYY-MM-DD HH:mm' })
  router.get('/', controller.home.index)
  router.get('/query', format, controller.query.index)
  router.get('/query/byid', format, controller.query.useId)
  router.post('/query/bybox', format, controller.query.useBox)
}
