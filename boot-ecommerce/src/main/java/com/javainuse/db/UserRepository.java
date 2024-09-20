package com.javainuse.db;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javainuse.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByNameAndPassword(String name, String password);
}