package ntg.example.online.shop.Entity;

import jakarta.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    private String name;
    private String email;
    private String phone;
    private String storeName;
    private String address;

    @OneToMany(mappedBy = "seller")
    private List<Product> products;

    @ManyToMany(mappedBy = "sellers")
    private Set<Customer> customers;

    // Getters and Setters
}