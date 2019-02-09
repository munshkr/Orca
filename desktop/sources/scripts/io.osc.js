'use strict'

const osc = require('osc')

function Osc (terminal) {
  this.stack = []
  this.port = 49162
  this.ip = '127.0.0.1'

  this.start = function () {
    console.info('Starting OSC..')
    this.setup()
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function (now) {
    for (const id in this.stack) {
      const { path, msg } = this.stack[id];

      // Build args array
      let args = [];
      for (var i = 0; i < msg.length; i++) {
        const value = terminal.orca.valueOf(msg.charAt(i));
        args.push({ type: 'i', value: value });
      }

      this.udpPort.send({ address: path, args: args }, this.ip, this.port);
    }
  }

  this.send = function (path, msg) {
    this.stack.push({ path, msg })
  }

  this.select = function (port) {
    if (port < 1000) { console.warn('Unavailable port'); return }
    this.port = port
    this.setup()
    console.log(`OSC Port: ${this.port}`)
    return this.port
  }

  this.setup = function () {
    if (this.udpPort) this.udpPort.close();

    this.udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      metadata: true
    });

    this.udpPort.open();
  }
}

module.exports = Osc
