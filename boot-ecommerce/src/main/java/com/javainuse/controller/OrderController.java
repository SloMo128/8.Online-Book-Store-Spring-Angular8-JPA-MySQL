package com.javainuse.controller;

import com.javainuse.model.Orders;
import com.javainuse.db.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/addOrder")
    public ResponseEntity<Orders> createOrder(@RequestParam String name) {
        if (name == null || name.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        Orders order = new Orders();
        order.setName(name);
        Orders savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }
    
    @GetMapping("/{name}")
    public ResponseEntity<List<Orders>> getOrdersByName(@PathVariable("name") String name) {
        List<Orders> orders = orderRepository.findByName(name);
        if (orders.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(orders);
        }
    }
}
