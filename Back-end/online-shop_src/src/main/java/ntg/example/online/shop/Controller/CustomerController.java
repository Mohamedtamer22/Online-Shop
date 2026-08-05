package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Entity.Customer;
import ntg.example.online.shop.Repository.CustomerRepository;
import ntg.example.online.shop.Security.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/customers")
@CrossOrigin("*")
public class CustomerController {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id).orElseThrow();
    }

    @PostMapping("/login")
    public Customer login(@RequestBody Customer request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        if (!isValidEmail(email) || request.getPassword() == null || request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid email and password are required");
        }

        Customer customer = customerRepository.findByEmail(email).orElseGet(Customer::new);
        customer.setEmail(email);
        customer.setPasswordHash(PasswordUtil.hash(request.getPassword()));
        customer.setName(request.getName() == null || request.getName().isBlank()
                ? email.split("@")[0]
                : request.getName());
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            customer.setPhone(request.getPhone());
        }
        if (request.getAddress() != null && !request.getAddress().isBlank()) {
            customer.setAddress(request.getAddress());
        }

        return customerRepository.save(customer);
    }

    @PostMapping("/add")
    public Customer createCustomer(@RequestBody Customer customer) {
        if (!isValidEmail(customer.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid email is required");
        }
        if (customer.getPassword() != null) {
            customer.setPasswordHash(PasswordUtil.hash(customer.getPassword()));
        }
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        Customer existing = customerRepository.findById(id).orElseThrow();
        if (customer.getName() != null) {
            existing.setName(customer.getName());
        }
        if (customer.getEmail() != null) {
            if (!isValidEmail(customer.getEmail())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid email is required");
            }
            existing.setEmail(customer.getEmail());
        }
        if (customer.getPassword() != null && !customer.getPassword().isBlank()) {
            existing.setPasswordHash(PasswordUtil.hash(customer.getPassword()));
        }
        if (customer.getPhone() != null) {
            existing.setPhone(customer.getPhone());
        }
        if (customer.getAddress() != null) {
            existing.setAddress(customer.getAddress());
        }
        return customerRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

}
