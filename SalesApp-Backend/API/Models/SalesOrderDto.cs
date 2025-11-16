namespace SalesApp_Backend.API.Models;

public class SalesOrderDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; } = string.Empty;
    
    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string Address3 { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostCode { get; set; } = string.Empty;
    
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    
    public List<SalesOrderItemDto> Items { get; set; } = new();
}

public class SalesOrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}

public class CreateSalesOrderDto
{
    public int CustomerId { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    
    // Customer address (can be edited)
    public string CustomerName { get; set; } = string.Empty;
    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string Address3 { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostCode { get; set; } = string.Empty;
    
    public List<CreateSalesOrderItemDto> Items { get; set; } = new();
}

public class CreateSalesOrderItemDto
{
    public int ProductId { get; set; }
    public string Note { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TaxRate { get; set; }
}
