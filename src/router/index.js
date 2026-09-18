import { createWebHistory } from 'vue-router'
import { createRouter } from './create'

/** Browser router — uses the History API for clean, shareable URLs. */
export default createRouter(createWebHistory())
