/// <reference path="globals/less/index.d.ts" />
/// <reference path="modules/babel-core/index.d.ts" />

import { TransformOptions } from 'babel-core';
import { Transform } from 'readable-stream';

interface LessOptions extends Less.Options {
  paths?: string[] | undefined;
  rootpath?: string;
  javascriptEnabled?: boolean;
  globalVars?: any;
  modifyVars?: any;
}

interface PugxOptions {
  /**
   * 根目录，如果不传 默认取process.cwd()。
   */
  root: string | undefined;
  /**
   * less options 参考less官方文档配置 https://lesscss.org/usage/#less-options
   */
  less: LessOptions;
  /**
   * babel options // 参考babel官方文档配置
   */
  babel: TransformOptions;
  /**
   * 是否压缩js和css
   */
  compress: Boolean;
  /**
   * 插件会替换src="./logo.png?v={hash}" 这样的src和href中的hash部分 ，hash值是通过md5进行计算的，用此处理缓存问题。
   * 此函数帮助插件找到引用的这些资源的文件路径，找到正确的文件路径才能计算md5值
   */
  mapHashUrl: (filename: string) => string;
}

declare function gulpPugx(options: PugxOptions): Transform;
export = gulpPugx;
