package ntg.example.online.shop.Repository;

import ntg.example.online.shop.Entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByCustomerCustomerId(Long customerId);

    Optional<WishlistItem> findByCustomerCustomerIdAndProductProductId(Long customerId, Long productId);
}
