# Quick Reference - API Integration Steps

## 📋 Tóm tắt nhanh các bước tích hợp Backend

### Step 1: Cập nhật Environments (5 phút)

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
};
```

### Step 2: Tạo Auth Service thực (10 phút)

Copy nội dung từ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) phần "Phase 2"
Thay thế file `auth.service.ts`

### Step 3: Tạo Auth Interceptor (5 phút)

Tạo file: `src/app/shared/interceptors/auth.interceptor.ts`
Copy từ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) phần "Phase 3"

### Step 4: Tạo Auth Guard (5 phút)

Tạo file: `src/app/shared/guards/auth.guard.ts`
Copy từ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) phần "Phase 4"

### Step 5: Cập nhật app.config.ts (5 phút)

```typescript
import { authInterceptor } from "./shared/interceptors/auth.interceptor";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    // ... other providers
  ],
};
```

### Step 6: Cập nhật Routes (3 phút)

```typescript
import { authGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [authGuard],
  },
];
```

---

## 🔌 API Endpoints Cần Implement trên Backend

| Endpoint                    | Method | Mô tả                       |
| --------------------------- | ------ | --------------------------- |
| `/api/auth/register`        | POST   | Đăng ký tài khoản mới       |
| `/api/auth/login`           | POST   | Đăng nhập                   |
| `/api/auth/google`          | POST   | Đăng nhập qua Google OAuth  |
| `/api/auth/refresh`         | POST   | Làm mới token               |
| `/api/auth/logout`          | POST   | Đăng xuất                   |
| `/api/auth/me`              | GET    | Lấy thông tin user hiện tại |
| `/api/auth/profile`         | PUT    | Cập nhật hồ sơ              |
| `/api/auth/change-password` | POST   | Đổi mật khẩu                |
| `/api/auth/forgot-password` | POST   | Yêu cầu reset mật khẩu      |
| `/api/auth/reset-password`  | POST   | Thực hiện reset mật khẩu    |

---

## 🗂️ Các Files Cần Tạo/Sửa

```
src/app/
├── shared/
│   ├── services/
│   │   └── auth.service.ts (✏️ EDIT - Replace with real HTTP calls)
│   ├── interceptors/
│   │   └── auth.interceptor.ts (📝 CREATE)
│   └── guards/
│       └── auth.guard.ts (📝 CREATE)
├── components/
│   ├── home/
│   │   ├── home.component.ts (✅ CREATED)
│   │   ├── home.component.html (✅ CREATED)
│   │   └── home.component.css (✅ CREATED)
│   ├── profile/
│   │   ├── profile.component.ts (✅ CREATED)
│   │   ├── profile.component.html (✅ CREATED)
│   │   └── profile.component.css (✅ CREATED)
│   ├── login/
│   │   └── login.component.ts (✅ EXISTED)
│   └── register/
│       └── register.component.ts (✅ EXISTED)
├── app.routes.ts (✅ UPDATED)
└── app.config.ts (✏️ EDIT - Add interceptor provider)

src/environments/
├── environment.ts (✏️ EDIT - Add apiUrl)
└── environment.prod.ts (✏️ EDIT - Add apiUrl)
```

---

## 🧪 Testing với Mock Service (Demo)

Hiện tại ứng dụng đã cấu hình để chạy với mock service. Để test demo:

1. **Chạy ứng dụng:**

   ```bash
   npm start
   ```

2. **Truy cập:** http://localhost:4200/

3. **Tài khoản test:**
   - Username: `testuser` | Password: `Test@123`
   - Username: `johndoe` | Password: `John@123`

4. **Quy trình test:**
   - Đăng ký tài khoản mới
   - Đăng nhập với tài khoản mới
   - Xem hồ sơ
   - Đăng xuất

---

## 🔌 Khi Kết Nối Backend Thực

### Backend Requirements

Khi bạn đã sẵn sàng kết nối backend, hãy đảm bảo backend của bạn:

1. **Trả về JWT tokens:**

   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
     "user": { "id": "...", "email": "..." }
   }
   ```

2. **Hỗ trợ CORS:**

   ```javascript
   cors({
     origin: "http://localhost:4200",
     credentials: true,
   });
   ```

3. **Validate JWT trong headers:**

   ```
   Authorization: Bearer {token}
   ```

4. **Trả về 401 khi token invalid:**
   ```json
   {
     "success": false,
     "message": "Unauthorized"
   }
   ```

### Frontend Implementation

Sau khi backend sẵn sàng:

1. Update `environment.ts` với backend URL
2. Thay thế `auth.service.ts` với real HTTP calls
3. Add `auth.interceptor.ts` cho token injection
4. Test tất cả endpoints

---

## 📊 Request/Response Flow

```
USER INPUT
    ↓
COMPONENT (Login/Register)
    ↓
AUTH SERVICE (HTTP call)
    ↓
AUTH INTERCEPTOR (Add token)
    ↓
BACKEND API
    ↓
RESPONSE
    ↓
AUTH SERVICE (Save token/user)
    ↓
COMPONENT (Navigate/Show error)
```

---

## 🛡️ Security Checklist

- [ ] HTTPS enabled in production
- [ ] JWT tokens stored securely
- [ ] CORS configured properly
- [ ] Input validation on both frontend & backend
- [ ] Token refresh implemented
- [ ] Rate limiting on auth endpoints
- [ ] Password hashed on backend (bcrypt/argon2)
- [ ] Sensitive data not logged
- [ ] httpOnly cookies for tokens (recommended)

---

## 📝 Notes

**Hiện tại:**

- ✅ Frontend UI hoàn thiện
- ✅ Mock service hoạt động
- ✅ Routes và navigation sẵn sàng
- ✅ API endpoints được ghi chú

**Khi ready backend:**

- Implement real AuthService từ [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- Add interceptor & guard
- Update environment URLs
- Test từng endpoint

---

## 📚 Tài liệu Tham Khảo

1. [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Chi tiết API endpoints
2. [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Hướng dẫn chi tiết tích hợp
3. [AUTHENTICATION.md](./AUTHENTICATION.md) - Thông tin xác thực
4. [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Hướng dẫn setup backend

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Storing tokens in plain localStorage
   - ✅ Consider httpOnly cookies

2. ❌ Not validating input on frontend
   - ✅ Always validate on backend too

3. ❌ Hardcoding API URLs
   - ✅ Use environment files

4. ❌ Not handling token expiration
   - ✅ Implement token refresh

5. ❌ Ignoring CORS errors
   - ✅ Configure backend CORS properly

---

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra browser console logs
2. Kiểm tra network tab (DevTools)
3. Xem backend logs
4. Đảm bảo backend API đang chạy
5. Kiểm tra CORS configuration
