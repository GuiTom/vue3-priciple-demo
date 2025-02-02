// 存储副作用函数的桶
const bucket = new WeakMap()
// 当前激活的副作用函数
let activeEffect

// 用于依赖收集的类
class Dep {
    constructor() {
        this.subscribers = new Set()
    }

    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }

    notify() {
        this.subscribers.forEach(effect => effect())
    }
}

// 用于注册副作用函数
function effect(fn) {
    activeEffect = fn
    fn()
    activeEffect = null
}

// 创建响应式对象的核心函数
function reactive(target) {
    return new Proxy(target, {
        get(target, key) {
            // 收集依赖
            track(target, key)
            return target[key]
        },
        set(target, key, value) {
            target[key] = value
            // 触发更新
            trigger(target, key)
            return true
        }
    })
}

// 依赖收集
function track(target, key) {
    if (!activeEffect) return
    
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    
    dep.add(activeEffect)
}

// 触发更新
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    
    const effects = depsMap.get(key)
    effects && effects.forEach(effect => effect())
}

// 测试代码
const data = reactive({
    message: 'Hello Vue 3!'
})

effect(() => {
    console.log('Effect run:', data.message)
})

// 修改数据会触发副作用函数重新执行
setTimeout(() => {
    data.message = 'Hello Reactivity!'
}, 1000)
