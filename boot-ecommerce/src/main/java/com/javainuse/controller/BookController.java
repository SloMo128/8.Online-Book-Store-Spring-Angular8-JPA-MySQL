package com.javainuse.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.javainuse.db.BookRepository;
import com.javainuse.model.Book;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "books")
public class BookController {
	
	private byte[] bytes;

	@Autowired
	private BookRepository bookRepository;
	
	@GetMapping("/get")
	public ResponseEntity<Object> getBooks( @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "id") String sort,
            @RequestParam(name="order", required = false, defaultValue = "DESC") String order) {
		
		Sort.Direction sortDirection = "DESC".equalsIgnoreCase(order) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable paging = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        Page<Book> pageBooks = bookRepository.findAll(paging);
		
        Map<String, Object> responseBody = new LinkedHashMap<>();
        if (pageBooks.hasContent()) {
            responseBody.put("books", pageBooks.getContent());
            responseBody.put("currentPage", pageBooks.getNumber());
            responseBody.put("totalItems", pageBooks.getTotalElements());
            responseBody.put("totalPages", pageBooks.getTotalPages());
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } else {
            responseBody.put("message", "No products found");
            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
        }
	}
	
	@GetMapping("/getAll")
	public ResponseEntity<List<Book>> getAllBooks() {
	    List<Book> books = bookRepository.findAll();
	    return new ResponseEntity<>(books, HttpStatus.OK);
	}
	
	@GetMapping("/get/{id}")
	public ResponseEntity<Book> getBookById(@PathVariable Long id) {
	    Optional<Book> bookOptional = bookRepository.findById(id);
	    
	    if (bookOptional.isPresent()) {
	        return new ResponseEntity<>(bookOptional.get(), HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}

	@GetMapping("/search")
	public ResponseEntity<Object> searchBooks(@RequestParam("keyword") String keyword) {
	    List<Book> books = bookRepository.FindByNameOrAuthor(keyword);
	    if (!books.isEmpty()) {
	        return new ResponseEntity<>(books, HttpStatus.OK);
	    } else {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No books found with the given keyword");
	    }
	}

	
	@PostMapping("/upload")
    public ResponseEntity<Void> uploadImage(@RequestParam("imageFile") MultipartFile file) throws IOException {
        this.bytes = file.getBytes();
        return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PostMapping("/add")
	public void createBook(@RequestBody Book book) throws IOException {
		book.setPicByte(this.bytes);
		bookRepository.save(book);
		this.bytes = null;
	}
	
	@DeleteMapping(path = { "/{id}" })
	public Book deleteBook(@PathVariable("id") long id) {
		//deprecated: Book book = bookRepository.getOne(id);
		Book book = bookRepository.getReferenceById(id);
		bookRepository.deleteById(id);
		return book;
	}
	
	@PutMapping("/update")
	public ResponseEntity<Book> updateBook(@RequestBody Book book) {
	    if (this.bytes != null) {
	        book.setPicByte(this.bytes);
	        this.bytes = null;  // Reset the byte array after updating the image
	    } else {
	        // Keep the existing image if no new image is uploaded
	        Book existingBook = bookRepository.findById(book.getId()).orElse(null);
	        if (existingBook != null) {
	            book.setPicByte(existingBook.getPicByte());
	        }
	    }
	    Book updatedBook = bookRepository.save(book);
	    return new ResponseEntity<>(updatedBook, HttpStatus.OK);
	}
	
	 @PutMapping("/update/{id}")
	    public ResponseEntity<?> updateBook(
	            @PathVariable Long id,
	            @RequestParam(required = false) String discount,
	            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
	            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

	        Optional<Book> bookOptional = bookRepository.findById(id);
	        if (!bookOptional.isPresent()) {
	            return ResponseEntity.notFound().build();
	        }

	        Book existingBook = bookOptional.get();

	        // Handle the optional discount parameter
	        if (discount != null) {
	            try {
	                double discountValue = Double.parseDouble(discount);
	                if (discountValue < 0 || discountValue > 100) {
	                    return ResponseEntity.badRequest().body("Errore: Lo sconto deve essere un valore compreso tra 0 e 100.");
	                }
	                existingBook.setDiscount(discount);
	            } catch (NumberFormatException e) {
	                return ResponseEntity.badRequest().body("Errore: Il parametro 'discount' deve essere un numero valido.");
	            }
	        }

	        // Handle the optional date parameters
	        if (startDate != null && endDate != null) {
	            if (startDate.isAfter(endDate)) {
	                return ResponseEntity.badRequest().body("Errore: 'Data di inizio' non può essere successiva alla 'Data di fine'.");
	            }
	            existingBook.setStartDate(java.sql.Date.valueOf(startDate));
	            existingBook.setEndDate(java.sql.Date.valueOf(endDate));
	        }

	        // Save the updated book
	        Book updatedBookResult = bookRepository.save(existingBook);
	        return ResponseEntity.ok(updatedBookResult);
	    }
}