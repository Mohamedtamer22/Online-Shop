package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Dto.ProductDto;
import ntg.example.online.shop.Entity.Customer;
import ntg.example.online.shop.Entity.Order;
import ntg.example.online.shop.Entity.OrderItem;
import ntg.example.online.shop.Entity.Product;
import ntg.example.online.shop.Entity.Shipping;
import ntg.example.online.shop.Repository.CustomerRepository;
import ntg.example.online.shop.Repository.OrderItemRepository;
import ntg.example.online.shop.Repository.OrderRepository;
import ntg.example.online.shop.Repository.ProductRepository;
import ntg.example.online.shop.Repository.ShippingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ShippingRepository shippingRepository;

    @GetMapping
    public List<ProductDto> getAllProducts(@RequestParam(required = false) String category,
                                           @RequestParam(required = false) String search) {
        String categoryFilter = normalize(category);
        String searchFilter = normalize(search);

        return productRepository.findAll().stream()
                .filter(product -> matchesCategory(product, categoryFilter))
                .filter(product -> matchesSearch(product, searchFilter))
                .map(ProductDto::new)
                .toList();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .filter(Objects::nonNull)
                .map(category -> category.getName())
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();
    }

    @GetMapping("/{id}")
    public ProductDto getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ProductDto::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @PostMapping("/add")
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PostMapping("/{id}/reserve")
    public ProductDto reserveProduct(@PathVariable Long id,
                                     @RequestParam(defaultValue = "1") Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        if (stock < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough stock");
        }

        product.setStockQuantity(stock - quantity);
        return new ProductDto(productRepository.save(product));
    }

    @PostMapping("/checkout")
    @Transactional
    public List<ProductDto> checkout(@RequestBody CheckoutRequest request) {
        List<CheckoutItem> items = request == null ? null : request.items();
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        if (request.customerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer is required");
        }
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now());
        order.setQuantity(0);
        order.setPrice(0.0);
        order.setTotalAmount(0.0);
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        List<Product> products = items.stream()
                .map(item -> {
                    if (item.quantity() == null || item.quantity() < 1) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
                    }

                    Product product = productRepository.findById(item.productId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

                    int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
                    if (stock < item.quantity()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough stock for " + product.getName());
                    }

                    product.setStockQuantity(stock - item.quantity());
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(item.quantity());
                    orderItem.setPrice(product.getPrice());
                    orderItems.add(orderItem);
                    return product;
                })
                .toList();

        int totalQuantity = orderItems.stream().mapToInt(OrderItem::getQuantity).sum();
        double totalAmount = orderItems.stream()
                .mapToDouble(item -> (item.getPrice() == null ? 0.0 : item.getPrice()) * item.getQuantity())
                .sum();

        savedOrder.setQuantity(totalQuantity);
        savedOrder.setPrice(totalAmount);
        savedOrder.setTotalAmount(totalAmount);

        productRepository.saveAll(products);
        orderItemRepository.saveAll(orderItems);
        orderRepository.save(savedOrder);

        Shipping shipping = new Shipping();
        shipping.setOrder(savedOrder);
        shipping.setReceiverName(customer.getName());
        shipping.setAddress(customer.getAddress());
        shipping.setPhone(customer.getPhone());
        shipping.setShippingDate(LocalDate.now().plusDays(2));
        shipping.setTrackingNumber("EH-SHIP-" + savedOrder.getOrderId());
        shippingRepository.save(shipping);

        return products.stream()
                .map(ProductDto::new)
                .toList();
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {
        product.setProductId(id);
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    private boolean matchesCategory(Product product, String categoryFilter) {
        if (categoryFilter == null || categoryFilter.equals("all")) return true;
        if (product.getCategory() == null || product.getCategory().getName() == null) return false;
        return product.getCategory().getName().toLowerCase(Locale.ROOT).equals(categoryFilter);
    }

    private boolean matchesSearch(Product product, String searchFilter) {
        if (searchFilter == null) return true;

        String name = normalize(product.getName());
        String description = normalize(product.getDescription());
        String category = product.getCategory() == null ? null : normalize(product.getCategory().getName());

        return contains(name, searchFilter) || contains(description, searchFilter) || contains(category, searchFilter);
    }

    private boolean contains(String value, String search) {
        return value != null && value.contains(search);
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        return value.trim().toLowerCase(Locale.ROOT);
    }

    public record CheckoutItem(Long productId, Integer quantity) {
    }

    public record CheckoutRequest(Long customerId, List<CheckoutItem> items) {
    }
}
