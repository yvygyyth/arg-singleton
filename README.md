# arg-singleton

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/yvygyyth/arg-singleton)

按“参数引用”进行缓存的单例/多例工具：基于调用参数元组自动复用或创建实例，支持类构造函数与普通函数。

> 📦 ​源码地址：`https://github.com/yvygyyth/arg-singleton`

## 特性
- **双模式支持**：既可包装类构造函数，也可包装普通函数
- **引用感知缓存**：以参数的“引用”作为缓存键
  - 原始类型（string/number/boolean/symbol/null/undefined）：按值比较
  - 对象/数组/函数/Map/Set/Date/RegExp：按引用比较（内容相同但引用不同 → 视为不同）
- **零依赖**：基于原生 Proxy 与 Map 的参数 Trie 实现
- **类型友好**：完善的 TypeScript 类型提示

## 安装
```bash
npm install arg-singleton
```

## 快速上手
### 包装类构造函数
```ts
import { singleton } from 'arg-singleton'

class Database {
  constructor(public config: { url: string }) {}
}

const CachedDB = singleton(Database)

// 1) 对象参数：内容相同但“不同引用” → 产生不同实例
const db1 = new CachedDB({ url: 'mysql://localhost' })
const db2 = new CachedDB({ url: 'mysql://localhost' })
console.log(db1 === db2) // false

// 2) 对象参数：同一个引用 → 复用同一实例
const shared = { url: 'mysql://localhost' }
const db3 = new CachedDB(shared)
const db4 = new CachedDB(shared)
console.log(db3 === db4) // true

// 3) 数组参数：同一个数组引用 → 复用同一实例
const items = ['a', 'b']
class Box { constructor(public list: string[]) {} }
const CachedBox = singleton(Box)
const b1 = new CachedBox(items)
const b2 = new CachedBox(items)
console.log(b1 === b2) // true
```

### 包装普通函数
```ts
const createConn = singleton((config: { port: number }) => ({
  conn: `Port ${config.port}`
}))

// 相同引用参数 → 复用结果；不同引用（即使内容相同）→ 新结果
const c1 = createConn({ port: 3306 })
const c2 = createConn({ port: 3306 })
console.log(c1 === c2) // false

const cfg = { port: 3306 }
const c3 = createConn(cfg)
const c4 = createConn(cfg)
console.log(c3 === c4) // true
```

## 行为说明
- 缓存键为“参数元组”，逐个参数使用严格相等（`===`）判断：
  - 原始类型按值相等复用
  - 引用类型按引用相等复用
- 代理保持被包装目标的静态属性与原型行为不变
- 同一参数组合，无论调用多少次，都返回同一实例/结果

## API
### `singleton()`
```ts
// 包装类构造函数
export function singleton<T extends object>(target: new (...args: any[]) => T): new (...args: any[]) => T

// 包装普通函数
export function singleton<T extends object>(target: (...args: any[]) => T): (...args: any[]) => T
```

## 实现概要
- 使用多层 Map 构建“参数字典树（Args Trie）”，逐参数定位缓存桶
- 命中则直接返回缓存实例/结果，未命中则创建后放入缓存

## 注意事项与性能
- 本库按“引用”缓存，对于“值相等但引用不同”的对象/数组，将视为不同参数组合
- 大量不重复的参数引用会增加缓存体积，请根据业务特征控制参数多样性
- 当前不内置清理/重置 API，如需清空缓存可重新创建包装：`const Wrapped = singleton(Target)`
