// 创建响应式的当前路由地址
const { ref, inject, h } = Vue

// 路由注入的key
export const ROUTER_KEY = Symbol('router')

// 创建路由类
export class Router {
    constructor(options) {
        // 路由映射表
        this.routes = options.routes || []
        // 当前路由路径，使用ref使其成为响应式
        this.current = ref(window.location.hash.slice(1) || '/')
        // 路由历史记录
        this.history = []
        
        // 监听hash变化
        window.addEventListener('hashchange', () => {
            const newPath = window.location.hash.slice(1)
            // 将旧路径添加到历史记录
            if (this.current.value !== newPath) {
                this.history.push(this.current.value)
            }
            // 更新当前路径
            this.current.value = newPath
        })
    }

    // 安装路由插件
    install(app) {
        // 注入路由实例
        app.provide(ROUTER_KEY, this)
    }

    // 路由匹配
    resolve(routePath) {
        // 根据路径找到对应的路由配置
        return this.routes.find(route => route.path === routePath)
    }

    // 编程式导航 - push
    push(path) {
        if (path === this.current.value) return
        // 将当前路径添加到历史记录
        this.history.push(this.current.value)
        // 更新hash，这会触发hashchange事件
        window.location.hash = path
    }

    // 编程式导航 - back
    back() {
        if (this.history.length > 0) {
            // 获取上一个路径
            const previousPath = this.history.pop()
            // 更新hash，这会触发hashchange事件
            window.location.hash = previousPath
        }
    }
}

// 创建路由视图组件
export const RouterView = {
    name: 'RouterView',
    setup() {
        // 注入路由实例，使用ROUTER_KEY
        const router = inject(ROUTER_KEY)
        if (!router) {
            console.error('No router instance provided')
            return () => h('div', 'No router instance provided')
        }
        
        // 返回渲染函数
        return () => {
            // 获取当前路由配置
            const route = router.resolve(router.current.value)
            // 如果找到匹配的路由，则渲染对应的组件
            return route ? h(route.component) : h('div', 'Not Found')
        }
    }
}

// 创建路由链接组件
export const RouterLink = {
    name: 'RouterLink',
    props: {
        to: {
            type: String,
            required: true
        }
    },
    setup(props, { slots }) {
        const router = inject(ROUTER_KEY)
        if (!router) {
            console.error('No router instance provided')
            return () => h('a', 'No router instance provided')
        }

        // 返回渲染函数
        return () => {
            return h(
                'a',
                {
                    href: '#' + props.to,
                    class: {
                        'router-link-active': router.current.value === props.to
                    }
                },
                slots.default?.()
            )
        }
    }
}
