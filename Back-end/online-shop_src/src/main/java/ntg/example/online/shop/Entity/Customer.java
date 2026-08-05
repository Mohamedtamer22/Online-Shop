package ntg.example.online.shop.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Set;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    private String name;
    private String email;
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @JsonIgnore
    @Column(name = "password_hash")
    private String passwordHash;
    private String phone;
    private String address;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Order> orders;

    @ManyToMany
    @JoinTable(
            name = "customer_seller",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "seller_id")
    )
    @JsonIgnore
    private Set<Seller> sellers;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordDisplay() {
        return passwordHash == null || passwordHash.isBlank() ? "" : "******";
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public Set<Seller> getSellers() {
        return sellers;
    }

    public void setSellers(Set<Seller> sellers) {
        this.sellers = sellers;
    }
}
