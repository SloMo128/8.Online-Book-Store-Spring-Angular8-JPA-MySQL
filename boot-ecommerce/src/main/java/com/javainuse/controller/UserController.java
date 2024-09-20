package com.javainuse.controller;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javainuse.db.UserRepository;
import com.javainuse.model.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.javainuse.db.UserRepository;
//import com.javainuse.model.Book;
import com.javainuse.model.User;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "users")
public class UserController {

	@Autowired
	private UserRepository userRepository;
	
	@GetMapping("/get")
	public List<User> getUsers() {
		return userRepository.findAll();
	}
	
	@PostMapping("/add")
	public void createUser(@RequestBody User user) {
		userRepository.save(user);
	}
	
	 @PutMapping("/update/{id}")
	    public User updateUser(@PathVariable("id") long id, @RequestBody User userDetails) {
	        // Trova l'utente esistente
	        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
	        
	        // Aggiorna i dettagli dell'utente
	        user.setName(userDetails.getName());
	        user.setType(userDetails.getType());
	        user.setPassword(userDetails.getPassword());
	
	        // Salva le modifiche
	        return userRepository.save(user);
	    }
	 
	 @PostMapping("/login")
	    public ResponseEntity<Object> login(@RequestBody User user) {
	        Optional<User> foundUser = userRepository.findByNameAndPassword(user.getName(), user.getPassword());

	        if (foundUser.isPresent()) {
	            return new ResponseEntity<>(foundUser.get(), HttpStatus.OK);
	        } else {
	            return new ResponseEntity<>("Invalid name or password", HttpStatus.UNAUTHORIZED);
	        }
	    }
	
	@DeleteMapping(path = { "/{id}" })
	public User deleteUser(@PathVariable("id") long id) {
		//deprecated: User user = userRepository.getOne(id);
		User user = userRepository.getReferenceById(id);
		userRepository.deleteById(id);
		return user;
	}

}