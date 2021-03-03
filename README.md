<!-- @format -->

### eslint-cli

使用方式：

- format init
- 安装 prettier 插件

执行：

- 项目选项
  1. 是否使用 TS
  2. 框架类型(先简单支持 react 和 view)
- 读取配置，开始生成
  - 清理已有配置文件
  - 根据配置生成对应的文件
    - 先生成 eslint
    - 根据 eslint 生成 prettier

思考： 要不要添加一些 hooks 之类的

TODO: 生成文件自动格式化
