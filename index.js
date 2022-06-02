const transformPugx = require('./transform');
const { Transform } = require('readable-stream');

function gulpPugx(options) {
  async function a(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(null, file);
    }
    if (file.isBuffer()) {
      const transdCode = await transformPugx(
        file.contents.toString('utf-8'),
        options
      );
      file.contents = Buffer.from(transdCode, 'utf-8');
    }
    this.push(file);
    callback(null, file);
  }

  return new Transform({
    objectMode: true,
    transform(file, enc, callback) {
      a.call(this, file, enc, callback);
    },
  });
}

module.exports = gulpPugx;
