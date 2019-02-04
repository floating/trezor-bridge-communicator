'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var protobufjs = _interopDefault(require('protobufjs'));
var request = _interopDefault(require('request'));
var debug = _interopDefault(require('debug'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var nested = {
	LoadDevice: {
		fields: {
			mnemonic: {
				rule: "optional",
				options: {
				},
				type: "string",
				id: 1
			},
			pin: {
				rule: "optional",
				options: {
				},
				type: "string",
				id: 3
			},
			passphrase_protection: {
				rule: "optional",
				options: {
				},
				type: "bool",
				id: 4
			},
			language: {
				rule: "optional",
				options: {
					"default": "english"
				},
				type: "string",
				id: 5
			},
			label: {
				rule: "optional",
				options: {
				},
				type: "string",
				id: 6
			},
			skip_checksum: {
				rule: "optional",
				options: {
				},
				type: "bool",
				id: 7
			},
			u2f_counter: {
				rule: "optional",
				options: {
				},
				type: "uint32",
				id: 8
			}
		}
	}
};
var messages = {
	nested: nested
};

var compose = function compose(buf, type) {
  var header = Buffer.alloc(6);
  header.writeUInt16BE(type, 0);
  header.writeUInt32BE(buf.length, 2);
  return Buffer.concat([header, buf]);
};

var TYPES = {
  LOAD_DEVICE: 13
};
var ACTIONS = {
  ACK: '001b00000000',
  CONFIRM: '0064000000020801'
};
var constants = {
  ACTIONS: ACTIONS,
  TYPES: TYPES
};

var postHexDebug =
function () {
  var _ref = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee(session, hex) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              debug('calling post', hex, 'with sesion', session);
              request.post("http://127.0.0.1:21325/debug/post/".concat(session), {
                body: hex,
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  resolve(res.toJSON().body);
                }
              });
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function postHexDebug(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var loadDevice =
function () {
  var _ref2 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee3(session) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              var root = protobufjs.Root.fromJSON(messages);
              var LoadDeviceMessage = root.lookupType('LoadDevice');
              var message = LoadDeviceMessage.encode({
                mnemonic: 'all all all all all all all all all all all all'
              }).finish();
              var composedMessage = compose(message, constants.TYPES.LOAD_DEVICE);
              request.post("http://127.0.0.1:21325/call/".concat(session), {
                body: composedMessage.toString('hex'),
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              },
              function () {
                var _ref3 = _asyncToGenerator(
                regeneratorRuntime.mark(function _callee2(error, res) {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (error) {
                            reject(error);
                          } else {
                            resolve(res.toJSON().body);
                          }
                        case 1:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));
                return function (_x4, _x5) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }));
          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function loadDevice(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var acquire =
function () {
  var _ref4 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee4(path, previousSession) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              debug('start acquiring session on path', path);
              request.post("http://127.0.0.1:21325/acquire/".concat(path, "/").concat(previousSession), {
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  resolve(JSON.parse(res.toJSON().body));
                }
              });
            }));
          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function acquire(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
var acquireDebug =
function () {
  var _ref5 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee5(path, previousSession) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise(function (resolve, reject) {
              debug('start acquiring debug session on path', path);
              request.post("http://127.0.0.1:21325/debug/acquire/".concat(path, "/").concat(previousSession), {
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  debug('successfully acquired debug session with path', path);
                  resolve(JSON.parse(res.toJSON().body));
                }
              });
            }));
          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function acquireDebug(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
var release =
function () {
  var _ref6 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee6(session) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", new Promise(function (resolve, reject) {
              debug('start release session', session);
              request.post("http://127.0.0.1:21325/release/".concat(session), {
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  debug('successfully released session', session);
                  resolve(res.toJSON().body);
                }
              });
            }));
          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function release(_x10) {
    return _ref6.apply(this, arguments);
  };
}();
var releaseDebug =
function () {
  var _ref7 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee7(session) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", new Promise(function (resolve, reject) {
              debug('start release debug session', session);
              request.post("http://127.0.0.1:21325/debug/release/".concat(session), {
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  debug('successfully released debug session', session);
                  resolve(res.toJSON().body);
                }
              });
            }));
          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function releaseDebug(_x11) {
    return _ref7.apply(this, arguments);
  };
}();
var callHex =
function () {
  var _ref8 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee8(session, hex) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", new Promise(function (resolve, reject) {
              debug('calling hex', hex, 'with sesion', session);
              request.post("http://127.0.0.1:21325/call/".concat(session), {
                body: hex,
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  resolve(res.toJSON().body);
                }
              });
            }));
          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return function callHex(_x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();

var isBridgeConnected =
function () {
  var _ref = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              console.log('[trezor-bridge-communicator] Bridge is connected');
              request.get('http://127.0.0.1:21325/status/', function (error, response) {
                if (error || response.statusCode !== 200) {
                  reject(error);
                } else {
                  debug('Bridge is connected');
                  resolve(true);
                }
              });
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function isBridgeConnected() {
    return _ref.apply(this, arguments);
  };
}();

var getDevices =
function () {
  var _ref = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              request.post('http://127.0.0.1:21325/enumerate', {
                headers: {
                  Origin: 'https://wallet.trezor.io'
                }
              }, function (error, res) {
                if (error) {
                  reject(error);
                } else {
                  resolve(res.toJSON().body);
                }
              });
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getDevices() {
    return _ref.apply(this, arguments);
  };
}();
var initSeedAllDevice =
function () {
  var _ref2 = _asyncToGenerator(
  regeneratorRuntime.mark(function _callee2() {
    var devices, _devices$, path, session, debugSession, acquiredDevice, acquiredDebugDevice;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return isBridgeConnected();
          case 3:
            _context2.t0 = JSON;
            _context2.next = 6;
            return getDevices();
          case 6:
            _context2.t1 = _context2.sent;
            devices = _context2.t0.parse.call(_context2.t0, _context2.t1);
            if (!(devices.length <= 0)) {
              _context2.next = 10;
              break;
            }
            throw Error('No connected devices');
          case 10:
            _devices$ = devices[0], path = _devices$.path, session = _devices$.session, debugSession = _devices$.debugSession;
            _context2.next = 13;
            return acquire(path, session);
          case 13:
            acquiredDevice = _context2.sent;
            _context2.next = 16;
            return acquireDebug(path, debugSession);
          case 16:
            acquiredDebugDevice = _context2.sent;
            _context2.next = 19;
            return loadDevice(acquiredDevice.session);
          case 19:
            _context2.next = 21;
            return postHexDebug(acquiredDebugDevice.session, constants.ACTIONS.CONFIRM);
          case 21:
            _context2.next = 23;
            return callHex(acquiredDevice.session, constants.ACTIONS.ACK);
          case 23:
            _context2.next = 25;
            return release(acquiredDevice.session);
          case 25:
            _context2.next = 27;
            return releaseDebug(acquiredDebugDevice.session);
          case 27:
            _context2.next = 32;
            break;
          case 29:
            _context2.prev = 29;
            _context2.t2 = _context2["catch"](0);
            console.error(_context2.t2);
          case 32:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 29]]);
  }));
  return function initSeedAllDevice() {
    return _ref2.apply(this, arguments);
  };
}();

exports.initSeedAllDevice = initSeedAllDevice;
exports.getDevices = getDevices;
