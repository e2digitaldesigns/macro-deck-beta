const { networkInterfaces } = require("os");

const fetchIPAddress = (type = "ethernet") => {
  const nets = networkInterfaces();
  const results = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        const newName = name.split(" ")[0].toLowerCase();
        if (!results[newName]) {
          results[newName] = net.address;
        }
      }
    }
  }

  return results[type] || "127.0.0.1";
};

const ip = fetchIPAddress();
console.log(12, ip);

module.exports = fetchIPAddress;
