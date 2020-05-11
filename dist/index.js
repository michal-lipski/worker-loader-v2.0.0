'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _schemaUtils = require('@webpack-contrib/schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');

var _NodeTargetPlugin2 = _interopRequireDefault(_NodeTargetPlugin);

var _SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);

var _WebWorkerTemplatePlugin = require('webpack/lib/webworker/WebWorkerTemplatePlugin');

var _WebWorkerTemplatePlugin2 = _interopRequireDefault(_WebWorkerTemplatePlugin);

var _Error = require('./Error');

var _Error2 = _interopRequireDefault(_Error);

var _supportWebpack = require('./supportWebpack5');

var _supportWebpack2 = _interopRequireDefault(_supportWebpack);

var _supportWebpack3 = require('./supportWebpack4');

var _supportWebpack4 = _interopRequireDefault(_supportWebpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader() {} /* eslint-disable
                       import/first,
                       import/order,
                       comma-dangle,
                       linebreak-style,
                       no-param-reassign,
                       no-underscore-dangle,
                       prefer-destructuring
                     */
function pitch(request) {
  const options = _loaderUtils2.default.getOptions(this) || {};

  (0, _schemaUtils2.default)({ name: 'Worker Loader', schema: _options2.default, target: options });

  if (!this.webpack) {
    throw new _Error2.default({
      name: 'Worker Loader',
      message: 'This loader is only usable with webpack'
    });
  }

  this.cacheable(false);

  const cb = this.async();

  const filename = _loaderUtils2.default.interpolateName(this, options.name || '[hash].worker.js', {
    context: options.context || this.rootContext || this.options.context,
    regExp: options.regExp
  });

  const worker = {};

  worker.options = {
    filename,
    chunkFilename: `[id].${filename}`,
    namedChunkFilename: null
  };

  worker.compiler = this._compilation.createChildCompiler('worker', worker.options);

  // Tapable.apply is deprecated in tapable@1.0.0-x.
  // The plugins should now call apply themselves.
  new _WebWorkerTemplatePlugin2.default(worker.options).apply(worker.compiler);

  if (this.target !== 'webworker' && this.target !== 'web') {
    new _NodeTargetPlugin2.default().apply(worker.compiler);
  }

  new _SingleEntryPlugin2.default(this.context, `!!${request}`, 'main').apply(worker.compiler);

  if (worker.compiler.cache && typeof worker.compiler.cache.get === 'function') {
    _supportWebpack2.default.call(this, worker, options, cb);
  } else {
    _supportWebpack4.default.call(this, worker, request, options, cb);
  }
}