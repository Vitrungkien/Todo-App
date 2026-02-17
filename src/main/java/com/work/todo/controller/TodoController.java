package com.work.todo.controller;

import com.work.todo.dto.TodoRequest;
import com.work.todo.dto.TodoResponse;
import com.work.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(Authentication authentication) {
        String username = authentication.getName();
        List<TodoResponse> todos = todoService.getAllTodos(username);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTodoById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            TodoResponse todo = todoService.getTodoById(id, username);
            return ResponseEntity.ok(todo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTodo(@Valid @RequestBody TodoRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            TodoResponse todo = todoService.createTodo(request, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(todo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id,
            @Valid @RequestBody TodoRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            TodoResponse todo = todoService.updateTodo(id, request, username);
            return ResponseEntity.ok(todo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleComplete(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            TodoResponse todo = todoService.toggleComplete(id, username);
            return ResponseEntity.ok(todo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            todoService.deleteTodo(id, username);
            return ResponseEntity.ok("Todo deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
