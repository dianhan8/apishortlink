function getClientIP() {
  var Ips = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  var IP = ''
  if (Ips.indexOf(":") !== -1) {
      IP += Ips.split(":")[Ips.split(":").length - 1]
  }
  return IP.split(",")[0]
}

console.log(getClientIP())