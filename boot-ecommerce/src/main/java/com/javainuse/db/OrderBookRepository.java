package com.javainuse.db;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.javainuse.model.OrderBook;

public interface OrderBookRepository extends JpaRepository<OrderBook, Long> {
	
	 List<OrderBook> findByOrderId(Long orderId);
	
}