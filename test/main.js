const assert = require('assert');
const fs = require('fs');
const path = require('path');
const transformPugx = require('../transform');

describe('transform-pugx', () => {
  it('测试是否转换正确', async function () {
    let sourceCode = fs.readFileSync(
      path.join(__dirname, './test.pugx'),
      'utf-8'
    );
    let targetCode = fs.readFileSync(
      path.join(__dirname, './test.pugx.transformed'),
      'utf-8'
    );
    const transformdCode = await transformPugx(sourceCode, {
      root: __dirname,
    });
    assert.equal(transformdCode.trim(), targetCode.trim());
  });

  it('测试js/less压缩', async function () {
    let sourceCode = fs.readFileSync(
      path.join(__dirname, './test.pugx'),
      'utf-8'
    );
    let targetCode = `extends ./share/_layout
link(href="./link-test.css?v=902311db9b")
block content
  h1= site.title
  p Welcome to #{site.title}
  ul
    each item,index in news
      li.wow.bounceInUp(data-wow-delay="#{index*0.2}")= item
  div=l

  style(lang="less").
    h1{color:red}h1 .a{color:red}
  script.
    "use strict";var a=1,b=null!=a?a:1;`;

    const transformdCode = await transformPugx(sourceCode, {
      root: __dirname,
      js: {
        compress: true,
      },
      less: {
        compress: true,
      },
    });
    assert.equal(transformdCode.trim(), targetCode.trim());
  });

  it('测试换行符', async function () {
    const sourceCode = `extends ./share/_layout\r\nlink(href="./link-test.css?v={hash}")\r\nblock content\r\n  h1= site.title\r\n  p Welcome to #{site.title}\r\n  ul\r\n    each item,index in news\r\n      li.wow.bounceInUp(data-wow-delay="#{index*0.2}")= item\r\n  div=l\r\n\r\n  style(lang="less").\r\n    h1 {\r\n      color: red;\r\n      .a {\r\n        color: red;\r\n      }\r\n    }\r\n\r\n  script.\r\n    const a = 1;\r\n    const b = a ?? 1;\r\n\r\n`;
    const targetCode = `extends ./share/_layout\r\nlink(href="./link-test.css?v=902311db9b")\r\nblock content\r\n  h1= site.title\r\n  p Welcome to #{site.title}\r\n  ul\r\n    each item,index in news\r\n      li.wow.bounceInUp(data-wow-delay="#{index*0.2}")= item\r\n  div=l\r\n\r\n  style(lang="less").\r\n    h1 {\n      color: red;\n    }\n    h1 .a {\n      color: red;\n    }\r\n  script.\r\n    "use strict";\n    \n    var a = 1;\n    var b = a !== null && a !== void 0 ? a : 1;`;

    const transformdCode = await transformPugx(sourceCode, {
      root: __dirname,
    });
    assert.equal(transformdCode.trim(), targetCode.trim());
  });
});
