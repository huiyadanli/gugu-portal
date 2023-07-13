# 咕咕导航

基于 Vue3 写的自用导航，纯静态页面无后端，框架用了 [Arco Design](https://arco.design/vue/docs/start) 。

可以直接在线编辑导航内容，所有面板、分类、网址链接都可以随意新增、修改、删除、拖拽位置，数据以 JSON 形式的配置保存在浏览器 `localStorage` 的 `customBox` 中。

在线示例： https://gugu-nav.vercel.app/

## 截图

![Screenshot](https://raw.githubusercontent.com/huiyadanli/gugu-portal/main/docs/screenshot.png)

## TODO

- [ ] 可以直接导入从Chrome导出的书签文件,导入时可以勾选

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
