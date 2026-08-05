package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Entity.Order;
import ntg.example.online.shop.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderRepository.findByCustomerCustomerIdOrderByOrderDateDesc(customerId);
    }

    @PostMapping("/add")
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        order.setOrderId(id);
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
