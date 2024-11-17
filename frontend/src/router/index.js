import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/books'
  },
  {
    path: '/books',
    name: 'booklist',
    component: () => import('../views/book/BookList.vue')
  },
  {
    path: '/books/add',
    name: 'book.add',
    component: () => import('../views/book/BookAdd.vue')
  },
  {
    path: '/books/:maSach',
    name: 'book.edit',
    component: () => import('../views/book/BookEdit.vue'),
    props: true
  },
  {
    path: '/publishers',
    name: 'publisher.list',
    component: () => import('../views/publisher/PublisherList.vue')
  },
  {
    path: '/publishers/add',
    name: 'publisher.add',
    component: () => import('../views/publisher/PublisherAdd.vue')
  },
  {
    path: '/publishers/:id',
    name: 'publisher.edit',
    component: () => import('../views/publisher/PublisherEdit.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;