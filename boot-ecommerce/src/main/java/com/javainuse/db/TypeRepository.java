package com.javainuse.db;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javainuse.model.Type;

public interface TypeRepository extends JpaRepository<Type, String> {
	List<Type> findByCode(String code);
}