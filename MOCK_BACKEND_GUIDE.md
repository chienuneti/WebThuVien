# Mock Backend Guide - Hướng Dẫn Sử Dụng Giả Lập Backend

## 📌 Giới Thiệu

**Mock Backend** là một giả lập hoàn chỉnh của backend API giúp test frontend mà **không cần server thực**.

✅ **Lợi ích:**

- Test ngay mà không cần setup database
- Simulate network delay (500ms)
- Có database người dùng mẫu
- Dễ debug
- Chuyển sang real API dễ dàng

---

## 🚀 Cách Sử Dụng

### 1. Enable Mock Backend (Mặc Định Đã Bật)

File: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  useMockBackend: true, // ← Set true để dùng mock
  apiUrl: "http://localhost:3000/api/auth",
};
```

### 2. Disable Mock Backend (Dùng Real API)

```typescript
export const environment = {
  production: false,
  useMockBackend: false, // ← Set false để dùng real API
  apiUrl: "http://localhost:3000/api/auth",
};
```

### 3. Start Development Server

```bash
npm start
```

Server chạy tại: `http://localhost:4200`

---

## 🧪 Test Với Mock Backend

### Tài Khoản Test Có Sẵn

Mock backend đã có 2 tài khoản test:

| Username   | Password   | Full Name | Email            |
| ---------- | ---------- | --------- | ---------------- |
| `testuser` | `Test@123` | Test User | test@example.com |
| `johndoe`  | `John@123` | John Doe  | john@example.com |

### Thử Đăng Ký (Register)

1. Vào trang `/dang-ki` (hoặc click "Đăng Ký")
2. Điền form:
   ```
   Họ và tên: Your Name
   Email: your@example.com
   Số điện thoại: 0123456789 (định dạng Việt Nam)
   Tài khoản: yourusername
   Mật khẩu: YourPass@123 (phải có: uppercase, lowercase, số, ký tự đặc biệt)
   Xác nhận mật khẩu: YourPass@123 (phải khớp)
   ```
3. Click "Đăng Ký"
4. Sẽ thấy loading 500ms, sau đó:
   - ✅ Thành công: Redirect trang chủ, hiển thị user info
   - ❌ Lỗi: Email/username đã tồn tại, mật khẩu yếu, ...

### Thử Đăng Nhập (Login)

1. Vào trang `/dang-nhap` (hoặc click "Đăng Nhập")
2. Nhập test account:
   ```
   Tài khoản: testuser
   Mật khẩu: Test@123
   ```
3. Click "Đăng Nhập"
4. Sẽ thấy loading 500ms, sau đó:
   - ✅ Thành công: Redirect trang chủ
   - ❌ Lỗi: Tài khoản sai, mật khẩu sai

### Thử Remember Me

1. Nhập credentials trên form login
2. Tick "Ghi nhớ tôi"
3. Click "Đăng Nhập"
4. Quay lại `/dang-nhap` → Sẽ thấy username đã được ghi nhớ

### Thử Logout

1. Sau khi login, header sẽ hiển thị user menu
2. Click "Đăng Xuất" (hoặc user icon → logout)
3. localStorage sẽ bị xóa
4. Redirect trang login

---

## 🔄 Cách Mock Backend Hoạt Động

### Architecture

```
RegisterComponent / LoginComponent
         │
         ▼
    AuthService (provided from app.config.ts)
         │
    ┌────┴────┐
    │          │
    ▼          ▼
Real API   Mock Service
(when       (when
useMock    useMock
=false)    =true)
    │          │
    └────┬─────┘
         ▼
  localStorage
  (tokens & user)
```

### Cách Chuyển Đổi

1. **Để dùng Mock**: `useMockBackend: true` → Sử dụng `AuthServiceMock`
2. **Để dùng Real API**: `useMockBackend: false` → Sử dụng `AuthService` (HTTP calls)

Cơ chế: Trong `app.config.ts`, `AuthService` được provide bằng class khác nhau tùy vào environment.

---

## 📊 Mock Service Features

### 1. Mock Database

```typescript
// Lưu trữ users như một database
private mockUsers: Map<string, {user: User, password: string}>

// Có validate:
- Username không trùng lặp
- Email không trùng lặp
- Password phải mạnh
```

### 2. Network Simulation

```typescript
return of(null).pipe(
  delay(500), // Giả lập trễ mạng 500ms
  // ... logic xử lý
);
```

### 3. Full Error Handling

```
❌ Username already exists
❌ Email already registered
❌ Password not strong enough
❌ Account or password incorrect
```

### 4. Token Generation

```typescript
// Không phải JWT thực, nhưng giả lập đủ
private generateMockTokens(userId: string) {
  const token = `mock_token_${userId}_${Date.now()}...`;
  const refreshToken = `mock_refresh_${userId}_${Date.now()}...`;
  return { token, refreshToken };
}
```

### 5. User State Management

```typescript
// BehaviorSubjects tương tự real service
user$: BehaviorSubject<User | null>;
authenticated$: BehaviorSubject<boolean>;

// localStorage tương tự real API
localStorage.setItem("auth_token", token);
localStorage.setItem("current_user", JSON.stringify(user));
```

---

## 🔍 Debug & Test

### Xem Test Users

Mở console browser (F12) và chạy:

```javascript
// Nếu muốn debug, có thể export method từ AuthServiceMock
// (hiện tại là private, có thể thêm public nếu cần)
```

### Xem localStorage

Mở DevTools → Application → LocalStorage:

```
Key: auth_token
Value: mock_token_xxx...

Key: current_user
Value: {"id":"...","fullName":"...","email":"..."}
```

### Xem Network Activity

Mở DevTools → Network:

- **Khi dùng Mock**: Không có HTTP requests (tất cả là local)
- **Khi dùng Real API**: Sẽ thấy POST requests tới backend

---

## 🔄 Chuyển Sang Real Backend

Khi backend thực được setup:

### 1. Cập nhật URL

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  useMockBackend: false, // ← Disable mock
  apiUrl: "http://localhost:3000/api/auth", // ← Real API URL
};
```

### 2. Kiểm Tra Backend Chạy

```bash
# Terminal khác
cd backend
npm start  # Chạy backend trên port 3000
```

### 3. Thử Lại

Frontend sẽ gọi real API thay vì mock service. Toàn bộ logic login/register vẫn giữ nguyên.

---

## ⚠️ Giới Hạn & Lưu Ý

### Mock Service Không Hỗ Trợ

❌ Refresh Token endpoint
❌ Google OAuth (chỉ có dummy implementation)
❌ Password reset
❌ Email verification
❌ Database persistence (reset khi reload page)

### Khi Reload Page

⚠️ Mock database sẽ **reset** (lost all registered users)

- Reason: Mock data lưu trong memory, không persistent
- **Fix**: Dùng real backend để persist data

### Password Rules

Mật khẩu phải đủ điều kiện:

```
✅ Độ dài: 6+ characters
✅ Phải có: Chữ hoa (A-Z)
✅ Phải có: Chữ thường (a-z)
✅ Phải có: Số (0-9)
✅ Phải có: Ký tự đặc biệt (!@#$%^&*?_)

❌ "test" - Quá yếu
❌ "Test" - Thiếu số
❌ "Test123" - Thiếu ký tự đặc biệt
✅ "Test@123" - OK!
```

---

## 📋 Checklist Testing

- [ ] Đăng ký tài khoản mới → Thành công
- [ ] Đăng ký email trùng → Lỗi
- [ ] Đăng ký username trùng → Lỗi
- [ ] Đăng ký mật khẩu yếu → Lỗi
- [ ] Xác nhận mật khẩu không khớp → Lỗi
- [ ] Đăng nhập với testuser → Thành công
- [ ] Đăng nhập sai password → Lỗi
- [ ] Tick Remember Me → Ghi nhớ username
- [ ] Logout → Clear tokens
- [ ] Thay đổi environment → Switch real/mock API

---

## 🎯 Next Steps

1. ✅ **Test với Mock Backend** (hiện tại)
2. 📌 **Setup Real Backend** (xem `BACKEND_SETUP.md`)
3. 🔄 **Switch to Real API** (cập nhật environment)
4. 🚀 **Deploy** (production build)

---

## 📞 Support

- **Mock Service Code**: `src/app/shared/services/auth.service.mock.ts`
- **Environment Config**: `src/environments/environment.ts`
- **App Config**: `src/app/app.config.ts` (DI setup)
- **Real Service**: `src/app/shared/services/auth.service.ts`

**Hết!** Ready to test? Vào `/dang-ki` thôi! 🎉
