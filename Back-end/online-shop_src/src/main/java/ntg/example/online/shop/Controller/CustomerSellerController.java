package ntg.example.online.shop.Controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer-sellers")
public class CustomerSellerController {

    @GetMapping
    public String getAllRelations() {
        return "Get All Customer Seller Relations";
    }

    @PostMapping("/add")
    public String createRelation() {
        return "Create Customer Seller Relation";
    }

    @DeleteMapping
    public String deleteRelation() {
        return "Delete Customer Seller Relation";
    }
}
