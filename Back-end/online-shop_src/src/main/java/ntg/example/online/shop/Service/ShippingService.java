package ntg.example.online.shop.Service;

import ntg.example.online.shop.Entity.Shipping;
import ntg.example.online.shop.Repository.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingService {

    @Autowired
    private ShippingRepository shippingRepository;

    public List<Shipping> getAllShipping() {
        return shippingRepository.findAll();
    }

    public Shipping saveShipping(Shipping shipping) {
        return shippingRepository.save(shipping);
    }

    public void deleteShipping(Long id) {
        shippingRepository.deleteById(id);
    }
}