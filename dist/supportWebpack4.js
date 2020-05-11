'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (worker, request, options, cb) {
  const subCache = `subcache ${__dirname} ${request}`;

  worker.compilation = compilation => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }

      compilation.cache = compilation.cache[subCache];
    }
  };

  worker.compiler.hooks.compilation.tap('WorkerLoader', worker.compilation);
  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) return cb(err);

    if (entries[0]) {
      worker.file = entries[0].files[0];

      worker.factory = (0, _workers2.default)(worker.file, compilation.assets[worker.file].source(), options);

      if (options.fallback === false) {
        delete this._compilation.assets[worker.file];
      }

      return cb(null, `module.exports = function() {\n  return ${worker.factory};\n};`);
    }

    return cb(null, null);
  });
};

var _workers = require('./workers');

var _workers2 = _interopRequireDefault(_workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }