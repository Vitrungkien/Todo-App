# PROJECT GUIDE - Todo List Application

## 1. Sơ đồ thư mục (Rút gọn)

```
todo/
├── src/main/java/com/work/todo/
│   ├── config/              # Cấu hình ứng dụng (Security, MVC, Bean)
│   ├── controller/          # Xử lý HTTP request (API & View)
│   ├── dto/                 # Data Transfer Objects (Request/Response)
│   ├── entity/              # Mô hình dữ liệu (JPA Entities)
│   ├── repository/          # Tương tác Database (JPA Repositories)
│   ├── security/            # Xác thực & Phân quyền (JWT, UserDetails)
│   └── service/             # Logic nghiệp vụ (Business Logic)
│   └── TodoApplication.java # Entry Point chính
├── src/main/resources/
│   ├── static/              # Tài nguyên tĩnh (CSS, JS, Images)
│   ├── templates/           # Giao diện HTML (Thymeleaf)
│   ├── application.yml      # Cấu hình môi trường (DB, JWT, Port)
│   ├── schema.sql           # Script khởi tạo DB (DDL)
│   └── data.sql             # Script khởi tạo dữ liệu mẫu (DML)
├── pom.xml                  # Quản lý dependencies (Maven)
└── compose.yaml             # Cấu hình Docker (Oracle DB)
```

## 2. Chức năng chính của từng thư mục

- **config/**: Chứa `SecurityConfig` (cấu hình bảo mật Spring Security) và các bean cấu hình khác.
- **controller/**:
  - `AuthController`: Xử lý đăng nhập, đăng ký.
  - `TodoController`: API CRUD cho công việc (Task).
  - `CategoryController`: API CRUD cho danh mục (Category).
  - `ViewController`: Điều hướng người dùng đến các trang giao diện (Login, Dashboard).
- **dto/**: Chứa các class đơn giản để truyền dữ liệu giữa client và server (VD: `LoginRequest`, `TodoResponse`).
- **entity/**: Định nghĩa bảng trong database (`User`, `Todo`, `Category`).
- **repository/**: Interface kế thừa `JpaRepository` để thực hiện query database (`UserRepository`, `TodoRepository`).
- **security/**: Chứa logic xác thực JWT (`JwtTokenProvider`, `JwtAuthenticationFilter`) và load user từ DB (`CustomUserDetailsService`).
- **service/**: Chứa logic xử lý chính (`TodoService`, `CategoryService`, `AuthService`).
- **templates/**: Chứa các file HTML giao diện (`login.html`, `dashboard.html`, `register.html`).

## 3. Entry Points Quan Trọng

1.  **Chạy ứng dụng**: `TodoApplication.java` - Class chứa hàm `main()`.
2.  **Cấu hình bảo mật**: `SecurityConfig.java` - Nơi định nghĩa các endpoint công khai/yêu cầu xác thực và bộ lọc JWT.
3.  **Xử lý Request chính**:
    -   `ViewController.java`: Điểm vào cho giao diện người dùng.
    -   `TodoController.java` & `CategoryController.java`: Điểm vào cho các API nghiệp vụ.

## 4. Công nghệ & Thư viện chính

-   **Backend**: Java 17+, Spring Boot 3.x
-   **Database**: Oracle Database (chạy trên Docker container)
-   **ORM**: Spring Data JPA (Hibernate)
-   **Security**: Spring Security + JWT
-   **Frontend**: Thymeleaf (Template Engine), Bootstrap 5 (CSS Framework), JavaScript (Fetch API)
-   **Build Tool**: Maven

## 5. Lưu ý quan trọng

-   **Database**: Ứng dụng sử dụng Oracle Database, cấu hình kết nối trong `application.yml`.
-   **Authentication**: Sử dụng JWT lưu trong LocalStorage ở client và gửi kèm header `Authorization: Bearer <token>` mỗi request.
-   **Quy trình phát triển**:
    1.  Tạo Entity/DTO.
    2.  Tạo Repository.
    3.  Viết logic trong Service.
    4.  Tạo Controller API.
    5.  Cập nhật/Tạo giao diện trong `templates/`.
