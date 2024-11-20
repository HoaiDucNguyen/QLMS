import { createRouter, createWebHistory } from 'vue-router';
import AuthService from "@/services/auth.service";

const routes = [
  {
    path: '/',
    redirect: to => {
      return AuthService.isNhanVien() ? '/books' : '/reader-dashboard';
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/reader-dashboard',
    name: 'reader.dashboard',
    component: () => import('../views/reader/ReaderDashboard.vue'),
    meta: { requiresAuth: true, role: 'docgia' }
  },
  {
    path: '/books',
    name: 'booklist',
    component: () => import('../views/book/BookList.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/books/add',
    name: 'book.add',
    component: () => import('../views/book/BookAdd.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/books/:maSach',
    name: 'book.edit',
    component: () => import('../views/book/BookEdit.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/publishers',
    name: 'publisher.list',
    component: () => import('../views/publisher/PublisherList.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/publishers/add',
    name: 'publisher.add',
    component: () => import('../views/publisher/PublisherAdd.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/publishers/:maNxb',
    name: 'publisher.edit',
    component: () => import('../views/publisher/PublisherEdit.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/employees',
    name: 'employee.list',
    component: () => import('../views/employee/EmployeeList.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/employees/add',
    name: 'employee.add',
    component: () => import('../views/employee/EmployeeAdd.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/employees/:maNV',
    name: 'employee.edit',
    component: () => import('../views/employee/EmployeeEdit.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/readers',
    name: 'reader.list',
    component: () => import('../views/reader/ReaderList.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/readers/add',
    name: 'reader.add',
    component: () => import('../views/reader/ReaderAdd.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/readers/:maDocGia',
    name: 'reader.edit',
    component: () => import('../views/reader/ReaderEdit.vue'),
    props: true,
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/borrows',
    name: 'borrow.list',
    component: () => import('../views/borrow/BorrowList.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/borrows/add',
    name: 'borrow.add',
    component: () => import('../views/borrow/BorrowAdd.vue'),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/borrows/edit',
    name: 'borrow.edit',
    component: () => import('../views/borrow/BorrowEdit.vue'),
    props: route => ({ query: route.query }),
    meta: { requiresAuth: true, role: 'nhanvien' }
  },
  {
    path: '/reader-profile',
    name: 'reader.profile',
    component: () => import('../views/reader/ReaderProfile.vue'),
    meta: { requiresAuth: true, role: 'docgia' }
  },
  {
    path: '/reader/books',
    name: 'reader.books',
    component: () => import('../views/reader/ReaderBooks.vue'),
    meta: { requiresAuth: true, role: 'docgia' }
  },
  {
    path: '/reader/borrows',
    name: 'reader.borrows',
    component: () => import('../views/reader/ReaderBorrows.vue'),
    meta: { requiresAuth: true, role: 'docgia' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const userRole = AuthService.getRole();

  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      return next({ name: 'login' });
    }

    if (to.meta.role && to.meta.role !== userRole) {
      if (userRole === 'docgia') {
        return next({ name: 'reader.dashboard' });
      } else if (userRole === 'nhanvien') {
        return next({ name: 'booklist' });
      }
    }
  }

  if (to.meta.requiresGuest && isLoggedIn) {
    if (userRole === 'docgia') {
      return next({ name: 'reader.dashboard' });
    } else {
      return next({ name: 'booklist' });
    }
  }

  next();
});

export default router;
