# [BC 平台的 vue 组件](https://github.com/bcsoft/bc-vue-components)发布历史

## 0.9.0 - 2017-11-13 
- Add box-pointer component
- Add page-bar-importer component
- Add page-bar-exporter component

## 0.8.2 - 2017-11-09 
- Lost rowCellClick $event argument in grid group column
- Upgrade uglify-js@2.4.x to uglify-es@3.1.x for minified es6

## 0.8.1 - 2017-09-30 
- set grid cell's filter and click function this to vm instance.

## 0.8.0 - 2017-05-16 
- grid component supports `JsonArray` responseBody

## 0.7.2 - 2017-05-15 
- only not cors to set `settings.credentials = 'include'`

## 0.7.1 - 2017-05-15 
- back to set `settings.credentials = 'include'` default

## 0.7.0 - 2017-05-12 
- add CORS support for grid

## 0.6.1 - 2017-02-13 
- add function support for rowCellStyle and rowCellClass with grid component

## 0.6.0 - 2017-01-17 
- change search component theme to classical
- click any cell to select grid row

## 0.5.1 - 2016-12-16 
- support cell text ellipsis

## 0.5.0 - 2016-12-13 
- add cell title support

## 0.4.1 - 2016-11-16 
- fix empty range value for search

## 0.4.0 - 2016-11-14 
- fixed search, grid component demo
- optimise page-bar: not add '#' after url when change
- search refactor:
	1. add search, clean, close button
	2. support date, datetime, month, time, number select
	3. support range condition. like '[]', '[), '(]', '()'
	4. can async load advance-config

## 0.3.0 - 2016-10-28 
- add rowCellClick event for grid
- change page-bar and grid components to not set default pageNo and pageSize prop
- auto copy result files to target dir for build.sh
- deal fetch error for grid
- search refactor
- use fetch API instead of $.ajax for grid
- add beforeReload callback for grid (return false to cancel reload)
- add afterReload event for grid
- add queryKey and mothod prop for grid

## 0.2.3 - 2016-09-21 
- bc-grid 组件单元格值增加过滤器配置 (通过 column.filter 配置)
- bc-grid 组件如果加载数据失败，默认将响应的 responseText 作为提示信息
- bc-grid 组件不分页时不传输 pageNo、 pageSize 参数

## 0.2.2 - 2016-09-06 
- 修正 bc-search 组件高级搜索选择标识符后再输入值然后切换控件焦点会自动清空输入的值的问题

## 0.2.1 - 2016-08-19 
- bc-toolbar|button|search 组件样式优化

## 0.2.0 - 2016-08-15 
- [new] bc-search 组件增加高级搜索功能
- [new] bc-grid 组件的 condition 属性更名为 query
- bc-toolbar 组件无法设置 style 属性的修正
- bc-theme 组件代码优化

## 0.1.0 - 2016-07-08 
- demo at [http://127.0.0.1:3000/examples/index.html]()
- add bc-theme component
- add bc-button component
- add bc-button-set component
- add bc-search component
- add bc-toolbar component
- add bc-loading component
- add bc-page-bar component
- add bc-table-col component
- add bc-grid component