package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Dto.ProductDto;
import ntg.example.online.shop.Entity.Customer;
import ntg.example.online.shop.Entity.Product;
import ntg.example.online.shop.Entity.WishlistItem;
import ntg.example.online.shop.Repository.CustomerRepository;
import ntg.example.online.shop.Repository.ProductRepository;
import ntg.example.online.shop.Repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/customer/{customerId}")
    public List<ProductDto> getCustomerWishlist(@PathVariable Long customerId) {
        return wishlistItemRepository.findByCustomerCustomerId(customerId).stream()
                .map(WishlistItem::getProduct)
                .map(ProductDto::new)
                .toList();
    }

    @PostMapping
    public ProductDto addToWishlist(@RequestBody WishlistRequest request) {
        if (request.customerId() == null || request.productId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer and product are required");
        }

        return wishlistItemRepository
                .findByCustomerCustomerIdAndProductProductId(request.customerId(), request.productId())
                .map(WishlistItem::getProduct)
                .map(ProductDto::new)
                .orElseGet(() -> {
                    Customer customer = customerRepository.findById(request.customerId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
                    Product product = productRepository.findById(request.productId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

                    WishlistItem wishlistItem = new WishlistItem();
                    wishlistItem.setCustomer(customer);
                    wishlistItem.setProduct(product);
                    wishlistItemRepository.save(wishlistItem);

                    return new ProductDto(product);
                });
    }

    @DeleteMapping("/customer/{customerId}/product/{productId}")
    public void removeFromWishlist(@PathVariable Long customerId,
                                   @PathVariable Long productId) {
        wishlistItemRepository
                .findByCustomerCustomerIdAndProductProductId(customerId, productId)
                .ifPresent(wishlistItemRepository::delete);
    }

    public record WishlistRequest(Long customerId, Long productId) {
    }
}
