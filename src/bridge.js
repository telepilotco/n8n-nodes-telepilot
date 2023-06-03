"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLibraryFile = exports.BridgeLib = void 0;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = (0, _debug.default)('bridge');

class BridgeLib {
  constructor(libraryFile, addonPath) {
    _defineProperty(this, "_addon", void 0);

    debug('constructor');

    this._addon = require(addonPath);

    this._addon.load_tdjson(libraryFile);
  }

  create() {
    debug('create');
    return this._addon.td_client_create();
  }

  send(client, query) {
    this._addon.td_client_send(client, JSON.stringify(query));
  }


  receive(client, timeout) {
    return new Promise((resolve, reject) => {
      this._addon.td_client_receive(client, timeout, (err, res) => {
        if (err) return reject(err);
        if (!res) return resolve(null);
        resolve(JSON.parse(res));
      });
    });
  }

  execute(client, query) {
    const res = this._addon.td_client_execute(client, JSON.stringify(query));

    if (!res) return null;
    return JSON.parse(res);
  }

  destroy(client) {
    debug('destroy');

    this._addon.td_client_destroy(client);
  }

  setLogFatalErrorCallback(fn) {
    this._addon.td_set_fatal_error_callback(fn);
  }

}

exports.BridgeLib = BridgeLib;
