# Todo List Application

Ứng dụng quản lý công việc (Todo List) được xây dựng với Spring Boot 3.x, JWT Authentication, Thymeleaf và Oracle Database.

## Tính năng

- ✨ **Xác thực người dùng**: Đăng ký và đăng nhập với JWT
- 📝 **Quản lý Task**: CRUD đầy đủ (Tạo, Đọc, Cập nhật, Xóa)
- ✅ **Đánh dấu hoàn thành**: Toggle trạng thái công việc
- 📅 **Hạn chót**: Đặt deadline cho mỗi task
- 🔒 **Bảo mật**: Mỗi user chỉ xem được task của chính họ
- 🎨 **Giao diện đẹp**: Bootstrap 5 với gradient và hiệu ứng hiện đại
- 🔔 **Thông báo**: Toast notifications cho các thao tác

## Công nghệ sử dụng

### Backend
- Java 21
- Spring Boot 3.5.10
- Spring Security
- Spring Data JPA
- JWT (JJWT 0.12.3)

### Frontend
- Thymeleaf
- Bootstrap 5.3.2
- Bootstrap Icons
- Vanilla JavaScript

### Database
- Oracle Database XE 21c
- Docker Compose

## Cấu trúc dự án

```
todo/
├── src/
│   ├── main/
│   │   ├── java/com/work/todo/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── TodoController.java
│   │   │   │   └── ViewController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── TodoRequest.java
│   │   │   │   └── TodoResponse.java
│   │   │   ├── entity/
│   │   │   │   ├── Todo.java
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── TodoRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtTokenProvider.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   └── TodoService.java
│   │   │   └── TodoApplication.java
│   │   └── resources/
│   │       ├── templates/
│   │       │   ├── dashboard.html
│   │       │   ├── login.html
│   │       │   └── register.html
│   │       ├── application.yml
│   │       ├── data.sql
│   │       └── schema.sql
│   └── test/
├── compose.yaml
└── pom.xml
```

## Cài đặt và chạy

### 1. Yêu cầu

- JDK 21+
- Maven 3.6+
- Docker và Docker Compose

### 2. Clone repository

```bash
git clone <repository-url>
cd todo
```

### 3. Khởi động Oracle Database

```bash
docker-compose up -d
```

Đợi khoảng 1-2 phút để Oracle database khởi động hoàn toàn.

### 4. Cấu hình

Kiểm tra file `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521/XEPDB1
    username: todouser
    password: todopass
```

### 5. Chạy ứng dụng

```bash
# Sử dụng Maven
mvnw spring-boot:run

# Hoặc
./mvnw spring-boot:run
```

### 6. Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:8080**

## Tài khoản mẫu

Database đã được khởi tạo với các tài khoản mẫu:

| Username | Password | Email | Mô tả |
|----------|----------|-------|--------|
| admin | password123 | admin@todoapp.com | Admin user |
| johndoe | password123 | john.doe@example.com | John Doe |
| janedoe | password123 | jane.doe@example.com | Jane Doe |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập

### Todos (Yêu cầu JWT token)

- `GET /api/todos` - Lấy danh sách todos của user
- `GET /api/todos/{id}` - Lấy chi tiết một todo
- `POST /api/todos` - Tạo todo mới
- `PUT /api/todos/{id}` - Cập nhật todo
- `PUT /api/todos/{id}/toggle` - Đánh dấu hoàn thành/chưa hoàn thành
- `DELETE /api/todos/{id}` - Xóa todo

### Views

- `GET /` - Trang chủ (redirect đến login hoặc dashboard)
- `GET /login` - Trang đăng nhập
- `GET /register` - Trang đăng ký
- `GET /dashboard` - Trang quản lý todos

## Cấu hình JWT

JWT secret key và thời gian hết hạn có thể được cấu hình trong `application.yml`:

```yaml
jwt:
  secret: ${JWT_SECRET:mySecretKeyForJWTTokenGenerationTodoAppSpringBoot2024VeryLongSecretKeyAtLeast256Bits}
  expiration: 86400000  # 24 giờ (milliseconds)
```

## Kiến trúc

### Layered Architecture

1. **Controller Layer**: Xử lý HTTP requests và responses
2. **Service Layer**: Business logic
3. **Repository Layer**: Data access
4. **Entity Layer**: JPA entities
5. **DTO Layer**: Data transfer objects
6. **Security Layer**: JWT authentication và authorization

### Security

- Spring Security với JWT authentication
- Password được mã hóa bằng BCrypt
- Session stateless
- CSRF disabled (sử dụng JWT thay thế)
- Authorization header hoặc Cookie để lưu token

## Giao diện

### Login Page
- Gradient background với hiệu ứng glassmorphism
- Form validation
- Lưu JWT token vào localStorage

### Register Page  
- Thiết kế tương tự login page
- Validation cho username, email, password

### Dashboard
- Header với thông tin user và nút logout
- Form thêm task mới
- Danh sách tasks với:
  - Hiển thị title, description, deadline
  - Nút Complete/Undo, Edit, Delete
  - Hiệu ứng hover và transition
- Modal edit task
- Toast notifications

## Database Schema

### Users Table
```sql
- id (NUMBER) - Primary Key
- username (VARCHAR2) - Unique
- email (VARCHAR2) - Unique
- password (VARCHAR2) - BCrypt hashed
- full_name (VARCHAR2)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Todos Table
```sql
- id (NUMBER) - Primary Key
- title (VARCHAR2)
- description (VARCHAR2)
- deadline (DATE)
- completed (NUMBER) - 0 hoặc 1
- user_id (NUMBER) - Foreign Key
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### Database connection issues

Nếu không kết nối được database:

1. Kiểm tra Docker container đang chạy:
   ```bash
   docker ps
   ```

2. Xem logs của Oracle container:
   ```bash
   docker logs todo-oracle-db
   ```

3. Đảm bảo port 1521 không bị sử dụng bởi service khác

### JWT token issues

Nếu gặp lỗi xác thực:

1. Xóa token trong localStorage và đăng nhập lại
2. Kiểm tra JWT secret trong application.yml
3. Đảm bảo token chưa hết hạn (24 giờ)

## Tác giả

Được xây dựng với Spring Boot 3.x và JWT Authentication

## License

MIT License
