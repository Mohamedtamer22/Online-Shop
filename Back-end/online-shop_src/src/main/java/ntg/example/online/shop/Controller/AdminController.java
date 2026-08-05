package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Entity.Admin;
import ntg.example.online.shop.Repository.AdminRepository;
import ntg.example.online.shop.Security.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admins")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @PostMapping("/login")
    public Admin login(@RequestBody Admin request) {
        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (username.isEmpty() || password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required");
        }

        return adminRepository.findByUsername(username)
                .map(admin -> {
                    if (!PasswordUtil.matches(password, admin.getPasswordHash())) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
                    }
                    if (!PasswordUtil.isHashed(admin.getPasswordHash())) {
                        admin.setPasswordHash(PasswordUtil.hash(password));
                        adminRepository.save(admin);
                    }
                    return admin;
                })
                .orElseGet(() -> loginDefaultAdmin(username, password));
    }

    @PostMapping("/add")
    public Admin createAdmin(@RequestBody Admin admin) {
        if (admin.getRole() == null || admin.getRole().isBlank()) {
            admin.setRole("ADMIN");
        }
        if (admin.getPassword() != null && !admin.getPassword().isBlank()) {
            admin.setPasswordHash(PasswordUtil.hash(admin.getPassword()));
        }
        return adminRepository.save(admin);
    }

    @PutMapping("/{id}")
    public Admin updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        Admin existing = adminRepository.findById(id).orElseThrow();
        existing.setUsername(admin.getUsername());
        existing.setName(admin.getName());
        existing.setEmail(admin.getEmail());
        if (admin.getRole() == null || admin.getRole().isBlank()) {
            existing.setRole("ADMIN");
        } else {
            existing.setRole(admin.getRole());
        }
        if (admin.getPassword() != null && !admin.getPassword().isBlank()) {
            existing.setPasswordHash(PasswordUtil.hash(admin.getPassword()));
        }
        return adminRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminRepository.deleteById(id);
    }

    private Admin loginDefaultAdmin(String username, String password) {
        if (!"admin".equals(username) || !"admin123".equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin credentials");
        }

        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPasswordHash(PasswordUtil.hash("admin123"));
        admin.setName("ElectroHub Admin");
        admin.setEmail("admin@electrohub.local");
        admin.setRole("ADMIN");
        return adminRepository.save(admin);
    }
}
