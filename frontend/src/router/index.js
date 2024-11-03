import { createRouter, createWebHistory } from 'vue-router';
import BookList from '../views/book/BookList.vue';
// Sử dụng BookEdit cho chi tiết và chỉnh sửa
import BookAdd from '../views/book/BookAdd.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'booklist',
    component: BookList,
  },
  {
    path: '/books/add',
    name: 'book.add',
    component: BookAdd,
  },
  {
        path: "/books/:id",
        name: "book.edit",
        component: () => import("@/views/book/BookEdit.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;