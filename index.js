const transformPugx = require('./transform');
const { Transform } = require('readable-stream');
const { Readable } = require('node:stream');

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

function gulpPugx(options) {
  async function transform(file, enc, callback) {
    if (file.isStream()) {
      const rawCode = await streamToBuffer(file.contents).then((res) =>
        res.toString('utf-8')
      );
      const transedCode = await transformPugx(rawCode, options);
      file.contents = Readable.from(transedCode);
    }
    if (file.isBuffer()) {
      const rawCode = file.contents.toString('utf-8');
      const transdCode = await transformPugx(rawCode, options);
      file.contents = Buffer.from(transdCode, 'utf-8');
    }
    callback(null, file);
  }

  return new Transform({
    objectMode: true,
    transform,
  });
}

module.exports = gulpPugx;
