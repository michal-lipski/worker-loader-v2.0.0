'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (worker, options, cb) {
  worker.compiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return cb(err);
    }

    if (entries[0]) {
      worker.file = [...entries[0].files][0];

      const cacheIdent = `${worker.compiler.compilerPath}/worker-loader/${__dirname}/${this.resource}`;
      const cacheETag = (0, _getLazyHashedEtag2.default)(compilation.assets[worker.file]);

      return worker.compiler.cache.get(cacheIdent, cacheETag, (err, content) => {
        if (err) {
          return cb(err);
        }

        if (options.fallback === false) {
          delete this._compilation.assets[worker.file];
        }

        if (content) {
          return cb(null, content);
        }

        worker.factory = (0, _workers2.default)(worker.file, compilation.assets[worker.file].source(), options);

        const newContent = `module.exports = function() {\n  return ${worker.factory};\n};`;

        return worker.compiler.cache.store(cacheIdent, cacheETag, newContent, err => {
          if (err) {
            return cb(err);
          }

          return cb(null, newContent);
        });
      });
    }

    return cb(null, null);
  });
};

var _getLazyHashedEtag = require('webpack/lib/cache/getLazyHashedEtag');

var _getLazyHashedEtag2 = _interopRequireDefault(_getLazyHashedEtag);

var _workers = require('./workers');

var _workers2 = _interopRequireDefault(_workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }