"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var App_vue_1 = __importDefault(require("./App.vue"));
require("./style.css");
var Dashboard = {
    template: "\n    <main class=\"admin-page\">\n      <h1>Hotel Admin Dashboard</h1>\n      <p>\u7BA1\u7406\u529F\u80FD\u5C07\u5728\u6B64\u9010\u6B65\u64F4\u5145\uFF08\u8A02\u55AE\u5BE9\u6838\u3001\u6D3B\u52D5\u7BA1\u7406\u3001\u6703\u54E1\u67E5\u8A62\uFF09\u3002</p>\n    </main>\n  "
};
var router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(),
    routes: [{ path: '/', component: Dashboard }]
});
(0, vue_1.createApp)(App_vue_1.default).use(router).mount('#app');
