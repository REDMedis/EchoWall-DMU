/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  return {
    mysql: {
      client: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'Ln/y&aF37vBnmdt4',
        database: 'echo',
      },
      app: true,
    },
  }
}
