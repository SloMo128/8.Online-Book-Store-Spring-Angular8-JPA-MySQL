package com.javainuse.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.javainuse.db.TypeRepository;
import com.javainuse.model.Type;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "type")
public class TypeController {

	@Autowired
	private TypeRepository typeRepository;
	
	@GetMapping("/")
	public List<Type> getUsers() {
		return typeRepository.findAll();
	}
	
	 @GetMapping("/search")
	    public List<Type> searchByCode(@RequestParam String code) {
	        return typeRepository.findByCode(code);
	    }

}