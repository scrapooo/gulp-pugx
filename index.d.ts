import { Transform } from 'readable-stream';
interface PugxOptions {
  root: string | undefined; // 根目录，如果不传 默认去process.cwd()
  mapHashUrl: (filename: string) => string;
  less: any; // 参考less官方文档配置
  babel: any; // 参考babel官方文档配置
}

declare function gulpPugx(options: PugxOptions): Transform;
declare module 'gulp-pugx' {
  export = gulpPugx;
}
