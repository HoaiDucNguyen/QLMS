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
    path: '/publishers/:maNxb',
    name: 'publisher.edit',
    component: () => import('../views/publisher/PublisherEdit.vue'),
    props: true
  },
  {
    path: '/employees',
    name: 'employee.list',
    component: () => import('../views/employee/EmployeeList.vue')
  },
  {
    path: '/employees/add',
    name: 'employee.add',
    component: () => import('../views/employee/EmployeeAdd.vue')
  },
  {
    path: '/employees/:maNV',
    name: 'employee.edit',
    component: () => import('../views/employee/EmployeeEdit.vue'),
    props: true
  },
  {
    path: '/readers',
    name: 'reader.list',
    component: () => import('../views/reader/ReaderList.vue'),
  },
  {
    path: '/readers/add',
    name: 'reader.add',
    component: () => import('../views/reader/ReaderAdd.vue'),
  },
  {
    path: '/readers/:maDocGia',
    name: 'reader.edit',
    component: () => import('../views/reader/ReaderEdit.vue'),
    props: true
  },
  {
    path: '/borrows',
    name: 'borrow.list',
    component: () => import('../views/borrow/BorrowList.vue')
  },
  {
    path: '/borrows/add',
    name: 'borrow.add',
    component: () => import('../views/borrow/BorrowAdd.vue')
  },
  {
    path: '/borrows/edit',
    name: 'borrow.edit',
    component: () => import('../views/borrow/BorrowEdit.vue'),
    props: route => ({ query: route.query })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
