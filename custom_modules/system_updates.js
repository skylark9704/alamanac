var os = require('os');

exports.arch = function(){
  return os.arch();
}

exports.cpu = function(){
  return os.cpus();
}

exports.freemem = function(){
  var memory = os.freemem()/Math.pow(1024, 3);
  return memory.toFixed(1);
}

exports.totalmem = function(){
  var memory = os.totalmem()/Math.pow(1024, 3);
  return memory.toFixed(1);
}

exports.nics = function(){
  return os.networkInterfaces();
}
