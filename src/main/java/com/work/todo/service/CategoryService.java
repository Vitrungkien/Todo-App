package com.work.todo.service;

import com.work.todo.dto.CategoryRequest;
import com.work.todo.dto.CategoryResponse;
import com.work.todo.entity.Category;
import com.work.todo.entity.User;
import com.work.todo.repository.CategoryRepository;
import com.work.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories(String username) {
        User user = getCurrentUser(username);
        return categoryRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, String username) {
        User user = getCurrentUser(username);

        Category category = Category.builder()
                .name(request.getName())
                .color(request.getColor())
                .user(user)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id, String username) {
        User user = getCurrentUser(username);
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }
}
