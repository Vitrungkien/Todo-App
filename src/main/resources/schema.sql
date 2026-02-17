-- -- Schema for Todo List Application (Oracle)
--
-- -- Xóa bảng cũ (nếu có). Lỗi sẽ được bỏ qua nhờ continue-on-error: true
-- DROP TABLE todos CASCADE CONSTRAINTS;
-- DROP TABLE users CASCADE CONSTRAINTS;
-- DROP SEQUENCE user_seq;
-- DROP SEQUENCE todo_seq;
--
-- -- Tạo sequence cho ID
-- CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1;
-- CREATE SEQUENCE todo_seq START WITH 1 INCREMENT BY 1;
--
-- -- Tạo bảng Users
-- CREATE TABLE users (
--     id NUMBER(19) PRIMARY KEY,
--     username VARCHAR2(100) NOT NULL UNIQUE,
--     email VARCHAR2(100) NOT NULL UNIQUE,
--     password VARCHAR2(255) NOT NULL,
--     full_name VARCHAR2(100),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- -- Tạo bảng Todos
-- CREATE TABLE todos (
--     id NUMBER(19) PRIMARY KEY,
--     title VARCHAR2(200) NOT NULL,
--     description VARCHAR2(1000),
--     deadline DATE,
--     completed NUMBER(1) DEFAULT 0 NOT NULL,
--     user_id NUMBER(19) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_todo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     CONSTRAINT chk_completed CHECK (completed IN (0, 1))
-- );
--
-- -- Index để tối ưu truy vấn
-- CREATE INDEX idx_users_username ON users(username);
-- CREATE INDEX idx_todos_user_id ON todos(user_id);

--
-- -- Schema for Categories
--

-- -- Tạo sequence cho Category ID
-- CREATE SEQUENCE category_seq START WITH 1 INCREMENT BY 1;

-- Tạo bảng Categories
CREATE TABLE categories (
    id NUMBER(19) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    color VARCHAR2(20),
    user_id NUMBER(19) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Thêm cột category_id vào bảng Todos (nếu chưa có)
ALTER TABLE todos ADD category_id NUMBER(19);
ALTER TABLE todos ADD CONSTRAINT fk_todo_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Index cho category
CREATE INDEX idx_categories_user_id ON categories(user_id);
