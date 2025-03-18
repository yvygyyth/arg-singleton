好的，我现在需要帮用户写一个README.md文件，用户已经提供了他们的代码，并且之前的对话中讨论了如何结合参数缓存实现单例模式。首先，我要理解用户提供的代码的功能，然后根据常见的README结构来组织内容。

首先，用户的项目是一个名为keyed-singleton的npm包，它的主要功能是根据不同的参数缓存实例，实现多例模式。也就是说，相同的参数会返回同一个实例，不同的参数会创建新的实例。用户之前讨论过如何代理构造函数和普通函数，使用Proxy来拦截construct和apply方法，并且用Map来缓存实例。

接下来，我需要确定README的结构。通常包括标题、简介、安装、使用示例、API文档、注意事项、贡献和许可证等部分。用户可能希望突出显示功能、安装步骤、使用示例和API说明。

标题部分应该明确，比如keyed-singleton，加上简短的描述，比如参数感知的单例/多例模式管理工具。简介部分要说明这个库的作用，解决了什么问题，比如根据参数管理实例，避免重复创建。

安装部分很简单，就是npm install的命令。使用示例需要展示类构造函数和普通函数的使用，以及参数不同时的行为。用户之前提供的代码示例中，有Database类和createConnection函数，这些可以作为示例。

API文档需要详细说明导出的singleton函数，参数和返回值，以及类型定义。注意事项部分要提到参数序列化的细节，比如对象属性的顺序和类型处理，以及循环引用的限制。可能还需要提到性能问题，比如参数复杂时的影响。

贡献和许可证部分通常是标准内容，鼓励贡献和MIT许可证。用户可能需要调整许可证，但通常MIT比较通用。

另外，用户可能希望README包含一些徽章，比如npm版本、下载量、构建状态等，但用户没有提供这些信息，可能暂时不需要。

需要注意的是，用户提供的serializeArgs函数使用JSON.stringify并排序对象键，这可能导致一些特殊情况，比如不可序列化的对象（如包含函数或循环引用）会出错，这些需要在注意事项中说明。

还要检查代码中的类型定义是否正确，比如Constructor和AnyFunction类型是否在README中正确描述。用户之前的代码有类型定义，需要在API文档部分准确反映。

最后，确保语言简洁明了，示例代码正确，并且结构清晰，方便其他开发者理解和使用这个库。




```markdown
# keyed-singleton 🗝️

[![npm version](https://img.shields.io/npm/v/keyed-singleton)](https://www.npmjs.com/package/keyed-singleton)
[![bundle size](https://img.shields.io/bundlephobia/minzip/keyed-singleton)](https://bundlephobia.com/package/keyed-singleton)

智能参数感知的单例/多例模式管理工具，根据初始化参数自动缓存实例。

## 特性

- 🧩 **双模式支持**：同时处理类构造函数和普通函数
- 🔍 **深度参数感知**：自动识别不同参数组合创建独立实例
- 📦 **零依赖**：仅使用原生Proxy和Map实现
- 🦾 **完全类型化**：完善的TypeScript类型支持

## 安装

```bash
npm install keyed-singleton
```

## 使用示例

### 类构造函数模式
```typescript
import { singleton } from 'keyed-singleton';

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
console.log(db1 === db3); // false
```

### 工厂函数模式
```typescript
const createConnection = (config: { timeout: number }) => ({
  ...config,
  status: 'connected'
});

const getConnection = singleton(createConnection);

// 相同参数复用实例
const conn1 = getConnection({ timeout: 1000 });
const conn2 = getConnection({ timeout: 1000 });
console.log(conn1 === conn2); // true

// 参数差异触发新实例
const conn3 = getConnection({ timeout: 2000 });
console.log(conn1 === conn3); // false
```

## API

### `singleton<T>(target)`
```typescript
export function singleton<T extends object>(
  target: Constructor<T> | AnyFunction<T>
): Constructor<T> | AnyFunction<T>
```

#### 类型定义
```typescript
type Constructor<T = any> = new (...args: any[]) => T;
type AnyFunction<T = any> = (...args: any[]) => T;
```

#### 参数
| 参数    | 类型                    | 说明                |
|---------|-------------------------|-------------------|
| target  | `Constructor` \| `AnyFunction` | 需要缓存实例的类或函数 |

#### 返回值
返回经过代理的类/函数，具有参数感知的实例缓存能力

## 工作原理

1. **参数序列化**  
   使用深度稳定序列化算法处理参数：
   - 对象属性按字母顺序排序
   - 嵌套结构递归处理
   - 非对象类型直接保留

2. **缓存策略**  
   ```mermaid
   graph TD
     A[调用构造函数/函数] --> B{参数缓存存在?}
     B -- 是 --> C[返回缓存实例]
     B -- 否 --> D[创建新实例]
     D --> E[序列化参数并缓存]
     E --> C
   ```

## 注意事项

1. **参数稳定性**  
   以下情况会被视为不同参数：
   ```typescript
   // 对象属性顺序不同
   getConnection({ a: 1, b: 2 }) vs getConnection({ b: 2, a: 1 })
   
   // 数组顺序不同
   new CachedService([1, 2]) vs new CachedService([2, 1])
   ```

2. **不可序列化类型**  
   以下类型会导致缓存失效：
   ```typescript
   // 包含函数
   getConnection({ handler: () => {} })

   // 循环引用对象
   const obj = { self: {} };
   obj.self = obj;
   ```

3. **性能建议**  
   对于高频调用场景，建议：
   - 使用简单参数类型
   - 对复杂对象参数进行预处理
   - 考虑LRU缓存策略扩展

## 贡献

欢迎提交issue和PR！请先阅读[贡献指南](CONTRIBUTING.md)。

## 许可证

MIT © [你的名字]
```

---

这个README包含：
1. 直观的徽章显示包状态
2. 可交互的代码示例
3. Mermaid流程图说明工作原理
4. 类型安全的API文档
5. 注意事项的对比示例
6. 清晰的目录结构

可以根据实际需求添加：
• 性能基准测试数据
• 与其他流行库的对比表格
• 浏览器/Node.js兼容性说明
• 具体的开发指南文档链接