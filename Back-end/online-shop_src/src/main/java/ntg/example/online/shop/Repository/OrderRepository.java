package ntg.example.online.shop.Repository;

import ntg.example.online.shop.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerCustomerIdOrderByOrderDateDesc(Long customerId);
}
