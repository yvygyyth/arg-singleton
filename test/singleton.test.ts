import { describe, it, expect } from 'vitest'
import { singleton } from '../src/index'

describe('singleton', () => {
  describe('构造函数单例', () => {
    it('应该为相同的参数返回相同的实例', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance1 = new SingletonTestClass('test')
      const instance2 = new SingletonTestClass('test')
      
      expect(instance1).toBe(instance2)
      expect(instance1.value).toBe('test')
      expect(instance2.value).toBe('test')
    })

    it('应该为不同的参数返回不同的实例', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance1 = new SingletonTestClass('test1')
      const instance2 = new SingletonTestClass('test2')
      
      expect(instance1).not.toBe(instance2)
      expect(instance1.value).toBe('test1')
      expect(instance2.value).toBe('test2')
    })

    it('应该正确处理多个参数', () => {
      class TestClass {
        constructor(public value1: string, public value2: number) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance1 = new SingletonTestClass('test', 123)
      const instance2 = new SingletonTestClass('test', 123)
      const instance3 = new SingletonTestClass('test', 456)
      
      expect(instance1).toBe(instance2)
      expect(instance1).not.toBe(instance3)
      expect(instance1.value1).toBe('test')
      expect(instance1.value2).toBe(123)
      expect(instance3.value2).toBe(456)
    })

    it('应该正确处理对象参数，不同地址', () => {
      class TestClass {
        constructor(public config: { name: string; age: number }) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const config1 = { name: 'Alice', age: 25 }
      const config2 = { name: 'Alice', age: 25 }
      
      const instance1 = new SingletonTestClass(config1)
      const instance2 = new SingletonTestClass(config2)
      
      expect(instance1).not.toBe(instance2)
      expect(instance1.config).toBe(config1)
      expect(instance2.config).toBe(config2)
    })

    it('应该正确处理数组参数', () => {
      class TestClass {
        constructor(public items: string[]) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const items1 = ['a', 'b', 'c']
      const items2 = items1
      const items3 = items1
      
      const instance1 = new SingletonTestClass(items1)
      const instance2 = new SingletonTestClass(items2)
      const instance3 = new SingletonTestClass(items3)
      
      expect(instance1).toBe(instance2)
      expect(instance1).toBe(instance3)
      expect(instance1.items).toBe(items1)
      expect(instance2.items).toBe(items1)
      expect(instance3.items).toBe(items3)
    })
  })

  describe('函数单例', () => {
    it('应该为相同的参数返回相同的实例', () => {
      function createObject(value: string) {
        return { value, timestamp: Date.now() }
      }

      const SingletonCreateObject = singleton(createObject)
      
      const instance1 = SingletonCreateObject('test')
      const instance2 = SingletonCreateObject('test')
      
      expect(instance1).toBe(instance2)
      expect(instance1.value).toBe('test')
      expect(instance2.value).toBe('test')
    })

    it('应该为不同的参数返回不同的实例', () => {
      function createObject(value: string) {
        return { value, timestamp: Date.now() }
      }

      const SingletonCreateObject = singleton(createObject)
      
      const instance1 = SingletonCreateObject('test1')
      const instance2 = SingletonCreateObject('test2')
      
      expect(instance1).not.toBe(instance2)
      expect(instance1.value).toBe('test1')
      expect(instance2.value).toBe('test2')
    })

    it('应该正确处理多个参数', () => {
      function createObject(value1: string, value2: number) {
        return { value1, value2, timestamp: Date.now() }
      }

      const SingletonCreateObject = singleton(createObject)
      
      const instance1 = SingletonCreateObject('test', 123)
      const instance2 = SingletonCreateObject('test', 123)
      const instance3 = SingletonCreateObject('test', 456)
      
      expect(instance1).toBe(instance2)
      expect(instance1).not.toBe(instance3)
      expect(instance1.value1).toBe('test')
      expect(instance1.value2).toBe(123)
      expect(instance3.value2).toBe(456)
    })
  })

  describe('边界情况', () => {
    it('应该正确处理空参数', () => {
      class TestClass {
        constructor() {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance1 = new SingletonTestClass()
      const instance2 = new SingletonTestClass()
      
      expect(instance1).toBe(instance2)
    })

    it('应该正确处理 null 和 undefined 参数', () => {
      class TestClass {
        constructor(public value: any) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance1 = new SingletonTestClass(null)
      const instance2 = new SingletonTestClass(null)
      const instance3 = new SingletonTestClass(undefined)
      const instance4 = new SingletonTestClass(undefined)
      
      expect(instance1).toBe(instance2)
      expect(instance3).toBe(instance4)
      expect(instance1).not.toBe(instance3)
      expect(instance1.value).toBe(null)
      expect(instance3.value).toBe(undefined)
    })

    it('应该正确处理原始类型参数', () => {
      class TestClass {
        constructor(
          public str: string,
          public num: number,
          public bool: boolean,
          public sym: symbol
        ) {}
      }

      const SingletonTestClass = singleton(TestClass)
      const sym = Symbol('test')
      
      const instance1 = new SingletonTestClass('test', 123, true, sym)
      const instance2 = new SingletonTestClass('test', 123, true, sym)
      const instance3 = new SingletonTestClass('test', 123, false, sym)
      
      expect(instance1).toBe(instance2)
      expect(instance1).not.toBe(instance3)
      expect(instance1.str).toBe('test')
      expect(instance1.num).toBe(123)
      expect(instance1.bool).toBe(true)
      expect(instance1.sym).toBe(sym)
    })
  })

  describe('代理行为', () => {
    it('应该正确代理静态属性', () => {
      class TestClass {
        static staticProp = 'static'
        constructor(public value: string) {}
      }

      const SingletonTestClass = singleton(TestClass) as typeof TestClass
      
      expect(SingletonTestClass.staticProp).toBe('static')
      expect(SingletonTestClass.staticProp).toBe(TestClass.staticProp)
    })

    it('应该正确代理原型方法', () => {
      class TestClass {
        constructor(public value: string) {}
        
        getValue() {
          return this.value
        }
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance = new SingletonTestClass('test')
      expect(instance.getValue()).toBe('test')
    })

    it('应该正确代理原型属性', () => {
      class TestClass {
        prototypeProp = 'prototype'
        constructor(public value: string) {}
      }

      const SingletonTestClass = singleton(TestClass)
      
      const instance = new SingletonTestClass('test')
      expect(instance.prototypeProp).toBe('prototype')
    })
  })

  describe('性能测试', () => {
    it('应该能够处理大量不同的参数组合', () => {
      class TestClass {
        constructor(public value: string) {}
      }

      const SingletonTestClass = singleton(TestClass)
      const instances = new Set()
      
      // 创建1000个不同的实例
      for (let i = 0; i < 1000; i++) {
        const instance = new SingletonTestClass(`test${i}`)
        instances.add(instance)
      }
      
      // 验证所有实例都是唯一的
      expect(instances.size).toBe(1000)
      
      // 验证相同参数返回相同实例
      const instance1 = new SingletonTestClass('test0')
      const instance2 = new SingletonTestClass('test0')
      expect(instance1).toBe(instance2)
    })
  })
}) 