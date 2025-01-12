// 存储副作用函数的桶
const bucket = new WeakMap()
// 当前激活的副作用函数
let activeEffect

// Effect Stack 用于处理嵌套的effect
const effectStack = []

// 用于注册副作用函数
function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}

// 清除依赖关系
function cleanup(effectFn) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

// 创建响应式对象的核心函数
function reactive(target) {
    return new Proxy(target, {
        get(target, key) {
            // 收集依赖
            track(target, key)
            const result = target[key]
            if (typeof result === 'object' && result !== null) {
                return reactive(result)
            }
            return result
        },
        set(target, key, value) {
            const oldValue = target[key]
            target[key] = value
            // 只有当值真正发生变化时才触发更新
            if (oldValue !== value) {
                // 触发更新
                trigger(target, key)
            }
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
    
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}

// 触发更新
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    
    const effects = depsMap.get(key)
    
    const effectsToRun = new Set()
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    
    effectsToRun.forEach(effectFn => effectFn())
}
