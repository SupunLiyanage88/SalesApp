namespace SalesApp_Backend.Domain.Entities;

public class SalesOrder : BaseEntity
{
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; } = string.Empty;
    
    // Customer address snapshot (saved at time of order)
    public string CustomerName { get; set; } = string.Empty;
    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string Address3 { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostCode { get; set; } = string.Empty;
    
    // Totals
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    
    public string Status { get; set; } = "Pending";
    public string Notes { get; set; } = string.Empty;
    
    // Navigation property
    public ICollection<SalesOrderItem> Items { get; set; } = new List<SalesOrderItem>();
}
