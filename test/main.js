const assert = require('assert');
const fs = require('fs');
const path = require('path');
const transformPugx = require('../transform');

describe('transform-pugx', () => {
  let sourceCode = null;
  let targetCode = null;
  beforeEach(function () {
    sourceCode = fs.readFileSync(path.join(__dirname, './test.pugx'), 'utf-8');
    targetCode = fs.readFileSync(
      path.join(__dirname, './test.pugx.target'),
      'utf-8'
    );
  });

  it('测试是否转换正确', async function () {
    const transformdCode = await transformPugx(sourceCode, {
      root: __dirname,
    });
    assert.equal(transformdCode.trim(), targetCode.trim());
  });
});
