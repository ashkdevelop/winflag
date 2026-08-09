using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Winflag.Core.Entities;

namespace Winflag.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<PageContent> PageContents => Set<PageContent>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
    public DbSet<Faq> Faqs => Set<Faq>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Product>()
            .Property(p => p.ImageUrls)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );

        builder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductVariant>()
            .HasOne(v => v.Product)
            .WithMany(p => p.Variants)
            .HasForeignKey(v => v.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<PageContent>()
            .HasIndex(p => new { p.PageKey, p.Section })
            .IsUnique();

        SeedData(builder);
    }

    private static void SeedData(ModelBuilder builder)
    {
        builder.Entity<ProductCategory>().HasData(
            new ProductCategory { Id = 1, Name = "Hand Flags", Slug = "hand-flags", Description = "Small handheld flags for rallies, sports events and celebrations", SortOrder = 1 },
            new ProductCategory { Id = 2, Name = "Cloth & Fabric Flags", Slug = "cloth-flags", Description = "Medium to large fabric flags for outdoor display", SortOrder = 2 },
            new ProductCategory { Id = 3, Name = "Feather Banners", Slug = "feather-banners", Description = "Tall feather and teardrop banners for events and storefronts", SortOrder = 3 },
            new ProductCategory { Id = 4, Name = "Table Flags", Slug = "table-flags", Description = "Desktop flags for offices, conferences and gift sets", SortOrder = 4 },
            new ProductCategory { Id = 5, Name = "Car Flags", Slug = "car-flags", Description = "Vehicle-mounted flags for rallies and processions", SortOrder = 5 },
            new ProductCategory { Id = 6, Name = "Custom Flags", Slug = "custom-flags", Description = "Fully custom design flags for any occasion", SortOrder = 6 }
        );

        builder.Entity<PageContent>().HasData(
            new PageContent { Id = 1, PageKey = "home", Section = "hero", Title = "Flags for Every Occasion. Bulk. Fast. India-wide.", Subtitle = "Delivery in 3–7 days | MOQ 50 units | GST Invoice included", Body = "From political rallies to cricket stadiums — WINFLAG delivers bulk custom flags across India, on time, every time.", CtaText = "Get an Instant Quote", CtaLink = "/quote" },
            new PageContent { Id = 2, PageKey = "home", Section = "stats", MetaJson = "{\"flagsDelivered\":120000,\"citiesServed\":450,\"yearsInBusiness\":8,\"onTimePercent\":98}" },
            new PageContent { Id = 3, PageKey = "about", Section = "intro", Title = "Born from the Heartbeat of India", Body = "WINFLAG was founded with one mission: ensure every celebration, rally, match, and milestone has the perfect flag — delivered on time, every time. We are India's most reliable bulk flag supplier." }
        );

        builder.Entity<Testimonial>().HasData(
            new Testimonial { Id = 1, CustomerName = "Rajesh Kumar", City = "Delhi", Occasion = "Political Rally", Review = "Ordered 50,000 flags for our party event. Delivered 2 days early and quality was excellent!", Rating = 5, SortOrder = 1 },
            new Testimonial { Id = 2, CustomerName = "Priya Sharma", City = "Mumbai", Occasion = "IPL Watch Party", Review = "200 custom fan flags for our cricket club. The colours were vibrant and exactly as designed.", Rating = 5, SortOrder = 2 },
            new Testimonial { Id = 3, CustomerName = "Anand Verma", City = "Bangalore", Occasion = "Corporate Event", Review = "Branded flags for our product launch. Professional quality, GST invoice provided, hassle-free.", Rating = 5, SortOrder = 3 }
        );

        builder.Entity<Faq>().HasData(
            new Faq { Id = 1, Question = "What is the minimum order quantity?", Answer = "Our minimum order is 50 units. For some specialty flags, MOQ may vary — check the product page.", Category = "Ordering", SortOrder = 1 },
            new Faq { Id = 2, Question = "What file formats do you accept for designs?", Answer = "We accept AI, PDF, SVG, and high-resolution PNG/JPG (300 DPI minimum). Vector formats give the best print results.", Category = "Design", SortOrder = 1 },
            new Faq { Id = 3, Question = "How long does delivery take?", Answer = "Standard delivery is 3–7 working days after design approval. Express delivery (48 hrs) is available at a 30% surcharge.", Category = "Delivery", SortOrder = 1 },
            new Faq { Id = 4, Question = "Do you provide GST invoices?", Answer = "Yes. A GST-compliant invoice is automatically generated for every order. You can download it from your order dashboard.", Category = "Billing", SortOrder = 1 },
            new Faq { Id = 5, Question = "Can you print political party symbols?", Answer = "Yes. We print all registered party symbols. Orders during Model Code of Conduct periods are subject to compliance with Election Commission guidelines.", Category = "Ordering", SortOrder = 2 }
        );
    }
}
