# EchoRate 欧美流行专辑测评网站

这是一个可直接用 Visual Studio 或 VS Code 打开的静态 Web 项目，目标浏览器为 Google Chrome。项目包含欧美流行专辑测评、风格筛选、20 张随机专辑评分推荐、私人 Top 10、相似专辑推荐，以及“联系我们”页面。

## 运行方式

1. 在 Visual Studio 中选择“打开文件夹”，打开 `C:\Users\wqy\Documents\web`。
2. 将默认调试浏览器选择为 Chrome，然后打开 `index.html`。
3. 如果使用 VS Code，可在“运行和调试”中选择 `Open EchoRate in Chrome`，直接启动 Chrome 打开页面。
4. 也可以直接用 Chrome 打开 `C:\Users\wqy\Documents\web\index.html`。
5. 修改 `app.js` 里的 `albums` 数组即可扩展专辑库和评分。

## 文件结构

- `index.html`：页面结构
- `styles.css`：响应式视觉样式
- `app.js`：专辑数据、筛选、测评面板和推荐算法
- 曲库范围：保留原有精选专辑，并扩充近十年 Grammy Album of the Year 提名专辑
- 封面图：优先使用已写入的真实封面地址，其余专辑会通过 iTunes Search API 动态加载封面
- `contact.html`：“联系我们”表单页面
- `form-layout.css`：“联系我们”页面样式
- `.vscode/launch.json`：VS Code 中使用 Chrome 打开页面的调试配置
