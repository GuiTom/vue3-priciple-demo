const { h, inject } = Vue
import { ROUTER_KEY } from './router.js'

// 首页组件
export const Home = {
    name: 'Home',
    setup() {
        return () => h('div', null, 'Home Page')
    }
}

// 关于页面组件
export const About = {
    name: 'About',
    setup() {
        return () => h('div', null, 'About Page')
    }
}

// 用户页面组件
export const User = {
    name: 'User',
    setup() {
        // 注入路由实例
        const router = inject(ROUTER_KEY)

        // 处理导航按钮点击
        const handleNavigate = () => {
            router.push('/about')
        }

        const handleBack = () => {
            router.back()
        }

        return () => h('div', null, [
            h('h2', null, 'User Page'),
            h('div', { style: { marginTop: '20px' } }, [
                h('button', 
                    { 
                        onClick: handleNavigate,
                        style: {
                            marginRight: '10px',
                            padding: '5px 10px'
                        }
                    }, 
                    'Go to About'
                ),
                h('button', 
                    { 
                        onClick: handleBack,
                        style: {
                            padding: '5px 10px'
                        }
                    }, 
                    'Go Back'
                )
            ])
        ])
    }
}
