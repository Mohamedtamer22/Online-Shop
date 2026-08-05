package ntg.example.online.shop.Controller;

import ntg.example.online.shop.Entity.Shipping;
import ntg.example.online.shop.Repository.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipping")
@CrossOrigin("*")
public class ShippingController {

    @Autowired
    private ShippingRepository shippingRepository;

    @GetMapping
    public List<Shipping> getAllShipping() {
        return shippingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Shipping getShippingById(@PathVariable Long id) {
        return shippingRepository.findById(id).orElseThrow();
    }

    @PostMapping("/add")
    public Shipping createShipping(@RequestBody Shipping shipping) {
        return shippingRepository.save(shipping);
    }

    @PutMapping("/{id}")
    public Shipping updateShipping(@PathVariable Long id, @RequestBody Shipping shipping) {
        shipping.setShippingId(id);
        return shippingRepository.save(shipping);
    }

    @DeleteMapping("/{id}")
    public void deleteShipping(@PathVariable Long id) {
        shippingRepository.deleteById(id);
    }
}
