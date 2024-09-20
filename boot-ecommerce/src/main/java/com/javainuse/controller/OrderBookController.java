package com.javainuse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.javainuse.db.BookRepository;
import com.javainuse.db.OrderBookRepository;
import com.javainuse.db.OrderRepository;
import com.javainuse.model.Book;
import com.javainuse.model.OrderBook;
import com.javainuse.model.Orders;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user-books")
public class OrderBookController {

    @Autowired
	private BookRepository bookRepository;

    @Autowired
    private OrderBookRepository orderBookRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> viewOrderBookByOrderId(@PathVariable("orderId") Long orderId) {
        // Cerca tutti gli OrderBook che corrispondono a orderId
        List<OrderBook> orderBooks = orderBookRepository.findByOrderId(orderId);

        if (orderBooks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No OrderBooks found for the given orderId.");
        }

        // Restituisce la lista di OrderBook
        return ResponseEntity.ok(orderBooks);
    }


    // Create a new OrderBook with query parameters
    @PostMapping("/add")
    public ResponseEntity<?> createUserBook(
    		@RequestParam("orderId") Long orderId,
            @RequestParam("bookId") Long bookId,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("price") Double price) {

        // Validate inputs
        if (price == null || bookId == null || quantity == null || orderId == null) {
            return ResponseEntity.badRequest().body("Price, Book ID, and Quantity are required.");
        }

        if (quantity < 1) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1.");
        }

        if (price < 1) {
            return ResponseEntity.badRequest().body("Price must be at least 1.");
        }
        
        // Check if the book exists
        Optional<Book> bookOptional = bookRepository.findById(bookId);
        if (!bookOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Book not found.");
        }
        
        // Check if the user exists
        Optional<Orders> orderOptional = orderRepository.findById(orderId);
        if (!orderOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Order not found.");
        }


        // Create a new OrderBook object
        OrderBook orderBook = new OrderBook();
        orderBook.setPrice(price);
        orderBook.setBookId(bookId);
        orderBook.setQuantity(quantity);
        orderBook.setOrderId(orderId);

        try {
            // Save the new OrderBook to the repository
            OrderBook savedOrderBook = orderBookRepository.save(orderBook);

            // Return the saved OrderBook
            return ResponseEntity.ok(savedOrderBook);

        } catch (DataAccessException e) {
            // Handle database exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while saving the order book: " + e.getMessage());
        }
    }
}
