/// <reference path="globals/less/index.d.ts" />
/// <reference path="modules/babel-core/index.d.ts" />

import { TransformOptions } from 'babel-core';
import { Transform } from 'readable-stream';
interface PugxOptions {
  root: string | undefined; // 根目录，如果不传 默认去process.cwd()
  mapHashUrl: (filename: string) => string;
  less: Less.Options; // 参考less官方文档配置
  babel: TransformOptions; // 参考babel官方文档配置
}

declare function gulpPugx(options: PugxOptions): Transform;
export = gulpPugx;
