using Microsoft.EntityFrameworkCore;
using SalesApp_Backend.Domain.Entities;

namespace SalesApp_Backend.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<SalesOrder> SalesOrders { get; set; }
    public DbSet<SalesOrderItem> SalesOrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ItemCode).HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
        });

        // Configure Customer entity
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
        });

        // Configure SalesOrder entity
        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.InvoiceNo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.TotalExcl).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalTax).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalIncl).HasColumnType("decimal(18,2)");
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.SalesOrders)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasMany(e => e.Items)
                .WithOne(i => i.SalesOrder)
                .HasForeignKey(i => i.SalesOrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure SalesOrderItem entity
        modelBuilder.Entity<SalesOrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ItemCode).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxRate).HasColumnType("decimal(5,2)");
            entity.Property(e => e.ExclAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.InclAmount).HasColumnType("decimal(18,2)");
            
            entity.HasOne(e => e.Product)
                .WithMany(p => p.SalesOrderItems)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}
