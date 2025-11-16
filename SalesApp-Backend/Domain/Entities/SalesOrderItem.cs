namespace SalesApp_Backend.Domain.Entities;

public class SalesOrderItem : BaseEntity
{
    public int SalesOrderId { get; set; }
    public SalesOrder SalesOrder { get; set; } = null!;
    
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; } // Tax percentage (e.g., 10 for 10%)
    
    public decimal ExclAmount { get; set; } // Quantity * Price
    public decimal TaxAmount { get; set; }  // ExclAmount * TaxRate / 100
    public decimal InclAmount { get; set; } // ExclAmount + TaxAmount
}
