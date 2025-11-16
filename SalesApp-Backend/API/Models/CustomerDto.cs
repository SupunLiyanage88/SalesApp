namespace SalesApp_Backend.API.Models;

public class CustomerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string Address3 { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
