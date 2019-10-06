/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1567692575823_1252'

  // add your middleware config here
  config.middleware = []

  // close egg's csrf use wx token to valid
  config.security = {
    csrf: {
      enable: false,
    },
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    mainBoxes: [
      '所有信箱',
      '校领导信箱',
      '后勤保障处信箱',
      '教务处信箱',
      '网络信息与综合服务中心信箱',
      '学生处信箱',
      '创新创业学院信箱',
      '财务处信箱',
      '人事处信箱',
      '图书馆信箱',
      '学生就业指导中心',
      '保卫处信箱',
      '信息处信箱',
      '后勤集团',
      '研究生信箱',
    ],
  }

  return {
    ...config,
    ...userConfig,
  }
}
