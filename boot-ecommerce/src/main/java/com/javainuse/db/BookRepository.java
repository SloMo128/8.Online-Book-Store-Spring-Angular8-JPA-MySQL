package com.javainuse.db;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.javainuse.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {

	List<Book> FindByNameOrAuthor(@Param("keyword") String keyword);
		
}