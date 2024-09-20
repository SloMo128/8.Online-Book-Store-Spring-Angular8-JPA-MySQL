package com.javainuse.service;

import com.javainuse.db.BookRepository;
import com.javainuse.db.UserRepository;
import com.javainuse.model.Book;
import com.javainuse.model.User;

import com.javainuse.db.OrderBookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookUserService {

    @Autowired
    private OrderBookRepository orderBookRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    /*public BookUser addBookUser(Long bookId, Long userId, Integer quantity) {
        // Fetch the book and user from their repositories
        bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid book ID: " + bookId));
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));

        // Create a new BookUser instance
        BookUser bookUser = new BookUser(bookId, userId, quantity);

        // Save the BookUser entity to the repository
        return bookUserRepository.save(bookUser);
    }*/
}
