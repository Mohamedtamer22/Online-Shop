package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Entity.OrderItem;
import ntg.example.online.shop.Repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
@CrossOrigin("*")
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @GetMapping("/{id}")
    public OrderItem getOrderItemById(@PathVariable Long id) {
        return orderItemRepository.findById(id).orElseThrow();
    }

    @PostMapping("/add")
    public OrderItem createOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @PutMapping("/{id}")
    public OrderItem updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        orderItem.setOrderItemId(id);
        return orderItemRepository.save(orderItem);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderItem(@PathVariable Long id) {
        orderItemRepository.deleteById(id);
    }
}
