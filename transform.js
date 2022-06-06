const less = require('less');
const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const MD5 = require('crypto-js/md5');

async function replaceAsync(str, reg, replacer) {
  const matches = [...str.matchAll(reg)];
  let tempStr = str;
  for (let i = 0; i < matches.length; i++) {
    const matchItem = matches[i];
    const newText = await replacer(...matchItem);

    tempStr = tempStr.replace(matchItem[0], newText);
  }
  return tempStr;
}

async function transformLess(code, options) {
  const reg = /( *)(style\(lang="less"\)\.)((?:\n(?:\1 +.+)?)+)\n(?:\1)?/g;
  async function replacer(matchText, empty, blockTag, lessCode) {
    const blank = /\n( +)/.exec(lessCode)?.[1] ?? '';
    const res = await less.render(lessCode, {
      ...options.less,
      paths: [options.root],
    });
    const css = res.css.trim().replace(/^( *)/gm, `${blank}$1`);
    return empty + `${blockTag}\n${css}\n`;
  }

  return replaceAsync(code, reg, replacer);
}

function transformJs(code, options) {
  const reg = /( *)(script\.)((?:\n(?:\1 +.+)?)+)\n(?:\1)?/g;
  function replacer(matchText, empty, blockTag, sourceCode) {
    const blank = /\n( +)/.exec(sourceCode)?.[1] ?? '';
    const res = babel.transformSync(sourceCode, {
      presets: ['@babel/preset-env'],
      ...options.babel,
      root: options.root,
    });
    const jsCode = res.code.trim().replace(/^( *)/gm, `${blank}$1`);
    return empty + `${blockTag}\n${jsCode}\n`;
  }

  return code.replace(reg, replacer);
}

function transformUrlHash(code, options) {
  const reg = /(src|href)="(.*?\?.*?v=)\{hash\}"/g;

  function replacer(matchText, attrName, urlunholder) {
    const pureUrlPath = urlunholder.slice(0, urlunholder.indexOf('?'));

    const filename = path.join(
      options.root,
      options.mapHashUrl?.(pureUrlPath) ?? pureUrlPath
    );

    if (fs.existsSync(filename)) {
      const hash = MD5(fs.readFileSync(filename, 'utf-8')).toString();
      return attrName + `="${urlunholder}${hash.slice(0, 10)}"`;
    }

    return matchText;
  }

  return code.replace(reg, replacer);
}

/**
 *
 * @param {*} code
 * @param {*} options
 */
async function transform(code, options) {
  options ??= {};
  options.root ??= process.cwd();

  let transformedCode = code;
  transformedCode = await transformLess(transformedCode, options);
  transformedCode = await transformJs(transformedCode, options);
  transformedCode = await transformUrlHash(transformedCode, options);
  return transformedCode;
}

module.exports = transform;
