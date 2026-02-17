package com.work.todo.service;

import com.work.todo.dto.TodoRequest;
import com.work.todo.dto.TodoResponse;
import com.work.todo.entity.Category;
import com.work.todo.entity.Todo;
import com.work.todo.entity.User;
import com.work.todo.repository.CategoryRepository;
import com.work.todo.repository.TodoRepository;
import com.work.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    private User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private TodoResponse convertToResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .deadline(todo.getDeadline())
                .completed(todo.getCompleted())
                .category(todo.getCategory() != null ? com.work.todo.dto.CategoryResponse.builder()
                        .id(todo.getCategory().getId())
                        .name(todo.getCategory().getName())
                        .color(todo.getCategory().getColor())
                        .build() : null)
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos(String username) {
        User user = getCurrentUser(username);
        return todoRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id, String username) {
        User user = getCurrentUser(username);
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return convertToResponse(todo);
    }

    @Transactional
    public TodoResponse createTodo(TodoRequest request, String username) {
        User user = getCurrentUser(username);

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                    .orElse(null); // Or throw exception if strict
        }

        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .category(category)
                .user(user)
                .build();

        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    @Transactional
    public TodoResponse updateTodo(Long id, TodoRequest request, String username) {
        User user = getCurrentUser(username);
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setDeadline(request.getDeadline());
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            todo.setCategory(category);
        }

        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional
    public TodoResponse toggleComplete(Long id, String username) {
        User user = getCurrentUser(username);
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setCompleted(!todo.getCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional
    public void deleteTodo(Long id, String username) {
        User user = getCurrentUser(username);
        Todo todo = todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
    }
}
