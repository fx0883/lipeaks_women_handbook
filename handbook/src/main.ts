import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入vue-konva
import VueKonva from 'vue-konva'

import App from './App.vue'
import router from './router'
import { useProjectStore } from './stores/project'
import projectsData from './data/projects.json'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册vue-konva组件
app.use(VueKonva)

// 初始化项目数据
const projectStore = useProjectStore(pinia)
projectStore.loadProjects(projectsData.projects)

app.mount('#app')
