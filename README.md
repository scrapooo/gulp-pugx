# gulp pugx 插件

将 pugx 转换为 pug 文件的 gulp 插件

## 用法

```javascript
const gulpPugx = require('gulp-pugx');
gulp.src([xxx]).
  pipe(gulpPugx({
    compress: false,//是否压缩 less 和js
    babel:{...} // babel配置 https://babel.docschina.org/docs/en/options/
    less:{}, // less配置 https://less.bootcss.com/usage/#lessjs-options
    mapHashUrl(url){ // src/href 引用的本地资源地址可能和真实的地址不一样，这是可以通过此方式转换位真实文件路径
      return path.join(__dirname,url);
    }
  }))
```
