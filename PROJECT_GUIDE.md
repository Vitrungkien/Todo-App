# PROJECT GUIDE - Todo List Application

## 1. Sơ đồ thư mục (Rút gọn)

```
todo/
├── src/main/java/com/work/todo/
│   ├── ... (Java packages)
├── src/main/resources/
│   ├── static/              
│   │   ├── css/             # Styles (style.css)
│   │   ├── js/              # Scripts (config.js, utils.js, api.js, dashboard.js)
│   │   └── images/
│   ├── templates/           # Giao diện HTML (dashboard.html, login.html...)
│   ├── application.yml      
│   └── schema.sql           
├── pom.xml                  
└── compose.yaml             
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
