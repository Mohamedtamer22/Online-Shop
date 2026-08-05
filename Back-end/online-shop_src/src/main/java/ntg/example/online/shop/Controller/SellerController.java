package ntg.example.online.shop.Controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sellers")
public class SellerController {

    @GetMapping
    public String getAllSellers() {
        return "Get All Sellers";
    }

    @PostMapping("/add")
    public String createSeller() {
        return "Create Seller";
    }

    @PutMapping("/{id}")
    public String updateSeller(@PathVariable Long id) {
        return "Update Seller " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteSeller(@PathVariable Long id) {
        return "Delete Seller " + id;
    }
}
