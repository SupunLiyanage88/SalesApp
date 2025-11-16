using Microsoft.AspNetCore.Mvc;
using SalesApp_Backend.Domain.Entities;
using SalesApp_Backend.Application.Interfaces;

namespace SalesApp_Backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly IRepository<Customer> _customerRepository;
        private readonly IRepository<Product> _productRepository;

        public SeedController(
            IRepository<Customer> customerRepository,
            IRepository<Product> productRepository)
        {
            _customerRepository = customerRepository;
            _productRepository = productRepository;
        }

        [HttpPost]
        public async Task<IActionResult> SeedData()
        {
            // Check if data already exists
            var existingCustomers = await _customerRepository.GetAllAsync();
            if (existingCustomers.Any())
            {
                return BadRequest("Database already has data. Please clear it first if you want to reseed.");
            }

            // Seed Customers
            var customers = new List<Customer>
            {
                new Customer
                {
                    Name = "ABC Corporation",
                    Email = "contact@abccorp.com",
                    Phone = "011-234-5678",
                    Address1 = "123 Business Park",
                    Address2 = "Level 5, Tower A",
                    Address3 = "Jalan Ampang",
                    State = "Kuala Lumpur",
                    PostCode = "50450",
                    IsActive = true
                },
                new Customer
                {
                    Name = "XYZ Trading Sdn Bhd",
                    Email = "info@xyztrading.com",
                    Phone = "03-8888-9999",
                    Address1 = "88 Commerce Avenue",
                    Address2 = "Unit 12-3A",
                    Address3 = "Taman Perindustrian",
                    State = "Selangor",
                    PostCode = "47100",
                    IsActive = true
                },
                new Customer
                {
                    Name = "Tech Solutions Malaysia",
                    Email = "sales@techsolutions.my",
                    Phone = "04-555-6677",
                    Address1 = "456 Innovation Hub",
                    Address2 = "Block B",
                    Address3 = "Bayan Lepas Industrial Park",
                    State = "Penang",
                    PostCode = "11900",
                    IsActive = true
                },
                new Customer
                {
                    Name = "Global Supplies Co",
                    Email = "orders@globalsupplies.com",
                    Phone = "07-333-4444",
                    Address1 = "22 Warehouse District",
                    Address2 = "",
                    Address3 = "Pasir Gudang",
                    State = "Johor",
                    PostCode = "81700",
                    IsActive = true
                }
            };

            foreach (var customer in customers)
            {
                await _customerRepository.AddAsync(customer);
            }

            // Seed Products
            var products = new List<Product>
            {
                new Product
                {
                    ItemCode = "LAPTOP-001",
                    Name = "Dell Latitude 5420",
                    Description = "14-inch Business Laptop, Intel i5, 8GB RAM, 256GB SSD",
                    Price = 3200.00m,
                    Stock = 15,
                    Category = "Electronics",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "DESK-001",
                    Name = "Executive Office Desk",
                    Description = "Premium wooden desk with drawers, 160cm x 80cm",
                    Price = 1500.00m,
                    Stock = 8,
                    Category = "Furniture",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "CHAIR-001",
                    Name = "Ergonomic Office Chair",
                    Description = "Adjustable height, lumbar support, mesh back",
                    Price = 450.00m,
                    Stock = 25,
                    Category = "Furniture",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "PRINT-001",
                    Name = "HP LaserJet Pro M404n",
                    Description = "Monochrome laser printer, network-ready, 38 ppm",
                    Price = 1200.00m,
                    Stock = 12,
                    Category = "Electronics",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "MON-001",
                    Name = "Dell 24\" Monitor",
                    Description = "Full HD IPS display, 1920x1080, VGA/HDMI",
                    Price = 650.00m,
                    Stock = 20,
                    Category = "Electronics",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "PAPER-001",
                    Name = "A4 Copy Paper",
                    Description = "80gsm white paper, 500 sheets per ream, 5 reams per box",
                    Price = 85.00m,
                    Stock = 100,
                    Category = "Stationery",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "KB-001",
                    Name = "Wireless Keyboard & Mouse",
                    Description = "2.4GHz wireless combo, ergonomic design",
                    Price = 120.00m,
                    Stock = 35,
                    Category = "Electronics",
                    IsActive = true
                },
                new Product
                {
                    ItemCode = "CAB-001",
                    Name = "Filing Cabinet",
                    Description = "4-drawer steel cabinet with lock, A4 size",
                    Price = 380.00m,
                    Stock = 10,
                    Category = "Furniture",
                    IsActive = true
                }
            };

            foreach (var product in products)
            {
                await _productRepository.AddAsync(product);
            }

            return Ok(new
            {
                message = "Database seeded successfully",
                customersAdded = customers.Count,
                productsAdded = products.Count
            });
        }

        [HttpDelete]
        public async Task<IActionResult> ClearData()
        {
            var customers = await _customerRepository.GetAllAsync();
            foreach (var customer in customers)
            {
                await _customerRepository.DeleteAsync(customer.Id);
            }

            var products = await _productRepository.GetAllAsync();
            foreach (var product in products)
            {
                await _productRepository.DeleteAsync(product.Id);
            }

            return Ok(new { message = "Database cleared successfully" });
        }
    }
}
