type Constructor<T = any> = new (...args: any[]) => T;
type AnyFunction<T = any> = (...args: any[]) => T;

/**
 * 参数序列化函数（支持深度对象比较）
 */
const serializeArgs = (args: unknown[]): string => {
  const normalized = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      return JSON.stringify(arg, Object.keys(arg).sort());
    }
    return arg;
  });
  return JSON.stringify(normalized);
};

/**
 * 参数缓存的多例模式
 */
export function singleton<T extends object>(target: Constructor<T>): Constructor<T>;
export function singleton<T extends object>(target: AnyFunction<T>): AnyFunction<T>;
export function singleton<T extends object>(target: Constructor<T> | AnyFunction<T>): Constructor<T> | AnyFunction<T> {
  const instances = new Map<string, T>();

  return new Proxy(target, {
    construct(target: Constructor<T>, args: any[]): T {
      const key = serializeArgs(args);
      
      if (!instances.has(key)) {
        instances.set(key, Reflect.construct(target, args));
      }
      
      return instances.get(key)!;
    },

    apply(target: AnyFunction<T>, thisArg: any, args: any[]): T {
      const key = serializeArgs(args);
      
      if (!instances.has(key)) {
        instances.set(key, target.apply(thisArg, args));
      }
      
      return instances.get(key)!;
    }
  });
}