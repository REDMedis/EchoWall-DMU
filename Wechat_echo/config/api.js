
//var WxApiRoot = "http://localhost:3000/";
var WxApiRoot = "https://www.dashwoodoc.com/"
// var WxApiRoot = "https://www.echowall.xin/"

module.exports = {
  listUrl: WxApiRoot + "query",
  contextUrl: WxApiRoot + "query/byid?",
  listBoxUrl: WxApiRoot + "query/bybox?"
};