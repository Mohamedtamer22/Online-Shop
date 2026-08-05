package ntg.example.online.shop.Repository;

import ntg.example.online.shop.Entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Long> {
}