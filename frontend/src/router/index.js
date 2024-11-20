import { createRouter, createWebHistory } from 'vue-router';
import AuthService from "@/services/auth.service";

const routes = [
  {
    path: '/',
    redirect: '/books'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/books',
    name: 'booklist',
    component: () => import('../views/book/BookList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/books/add',
    name: 'book.add',
    component: () => import('../views/book/BookAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/books/:maSach',
    name: 'book.edit',
    component: () => import('../views/book/BookEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/publishers',
    name: 'publisher.list',
    component: () => import('../views/publisher/PublisherList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/publishers/add',
    name: 'publisher.add',
    component: () => import('../views/publisher/PublisherAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/publishers/:maNxb',
    name: 'publisher.edit',
    component: () => import('../views/publisher/PublisherEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees',
    name: 'employee.list',
    component: () => import('../views/employee/EmployeeList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/add',
    name: 'employee.add',
    component: () => import('../views/employee/EmployeeAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/employees/:maNV',
    name: 'employee.edit',
    component: () => import('../views/employee/EmployeeEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/readers',
    name: 'reader.list',
    component: () => import('../views/reader/ReaderList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/readers/add',
    name: 'reader.add',
    component: () => import('../views/reader/ReaderAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/readers/:maDocGia',
    name: 'reader.edit',
    component: () => import('../views/reader/ReaderEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/borrows',
    name: 'borrow.list',
    component: () => import('../views/borrow/BorrowList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/borrows/add',
    name: 'borrow.add',
    component: () => import('../views/borrow/BorrowAdd.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/borrows/edit',
    name: 'borrow.edit',
    component: () => import('../views/borrow/BorrowEdit.vue'),
    props: route => ({ query: route.query }),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthService.isLoggedIn();

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' });
  }

  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ name: 'booklist' });
  }

  next();
});

export default router;
