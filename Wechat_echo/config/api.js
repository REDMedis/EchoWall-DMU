
const WxApiRoot = "http://127.0.0.1:7001/";
// const WxApiRoot = "https://www.echowall.xin/"

module.exports = {
  listUrl: WxApiRoot + "query",
  contextUrl: WxApiRoot + "query/byid",
  listBoxUrl: WxApiRoot + "query/bybox",
  loginUrl: WxApiRoot + "user/login"
};