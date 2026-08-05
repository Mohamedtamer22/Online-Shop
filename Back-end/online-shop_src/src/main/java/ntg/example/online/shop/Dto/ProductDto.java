package ntg.example.online.shop.Dto;

import ntg.example.online.shop.Entity.Category;
import ntg.example.online.shop.Entity.Product;

public class ProductDto {
    private Long id;
    private String name;
    private String category;
    private String description;
    private Double price;
    private Double rating;
    private Integer reviews;
    private Boolean inStock;
    private String image;
    private Integer stockQuantity;

    public ProductDto(Product product) {
        this.id = product.getProductId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.image = product.getImage();
        this.stockQuantity = product.getStockQuantity();
        this.inStock = product.getStockQuantity() != null && product.getStockQuantity() > 0;
        this.rating = 0.0;
        this.reviews = 0;

        Category productCategory = product.getCategory();
        this.category = productCategory == null ? "Uncategorized" : productCategory.getName();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Double getRating() {
        return rating;
    }

    public Integer getReviews() {
        return reviews;
    }

    public Boolean getInStock() {
        return inStock;
    }

    public String getImage() {
        return image;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }
}
