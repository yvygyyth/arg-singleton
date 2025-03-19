# arg-singleton

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/yvygyyth/arg-singleton)

智能参数感知的单例/多例模式管理工具，根据初始化参数自动缓存实例。

> 📦 ​**源码地址**: https://github.com/yvygyyth/arg-singleton

## 特性
- 🧩 **双模式支持**：同时处理类构造函数和普通函数
- 🔍 **深度参数感知**：自动识别不同参数组合创建独立实例
- 📦 **零依赖**：仅使用原生Proxy和Map实现
- 🦾 **完全类型化**：完善的TypeScript类型支持

## 安装
```bash
npm install arg-singleton
```

## 使用示例
### 类构造函数模式
```ts
import { singleton } from 'arg-singleton';

class Database {
  constructor(public config: { url: string }) {}
}

const CachedDB = singleton(Database);

// 相同参数返回同一实例
const db1 = new CachedDB({ url: 'mysql://localhost' });
const db2 = new CachedDB({ url: 'mysql://localhost' });
console.log(db1 === db2); // true

// 不同参数创建新实例
const db3 = new CachedDB({ url: 'postgres://prod' });
console.log(db2 === db3); // false
```

### 普通函数模式
```ts
const createConnection = singleton((config: { port: number }) => {
  return { conn: `Port ${config.port}` };
});

// 相同参数复用实例
const conn1 = createConnection({ port: 3306 });
const conn2 = createConnection({ port: 3306 });
console.log(conn1.conn === conn2.conn); // true
```

## API文档
### `singleton()`
```ts
function singleton<T extends Constructor | AnyFunction>(
  target: T
): T & { reset: () => void }
```

**类型参数**：
- `T`: 支持构造函数或普通函数

**返回值**：
- 代理后的构造函数/函数，包含：
  - `reset()`: 清空所有缓存实例

## 注意事项
1. **参数序列化**：
   - 使用`JSON.stringify`进行参数哈希，对象属性顺序会影响缓存判定
   - 不支持包含循环引用的参数对象

2. **性能优化**：
   - 推荐对高频调用场景进行参数复杂度控制
   - 超大参数对象（>10KB）建议先进行序列化预处理
