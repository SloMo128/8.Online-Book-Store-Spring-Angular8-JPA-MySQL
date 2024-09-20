package com.javainuse.db;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javainuse.model.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {
	List<Orders> findByName(String name);
}