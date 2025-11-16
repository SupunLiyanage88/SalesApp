using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesApp_Backend.API.Models;
using SalesApp_Backend.Domain.Entities;
using SalesApp_Backend.Infrastructure.Data;

namespace SalesApp_Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SalesOrdersController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SalesOrderDto>>> GetAll()
    {
        var orders = await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .OrderByDescending(o => o.InvoiceDate)
            .ToListAsync();

        var orderDtos = _mapper.Map<List<SalesOrderDto>>(orders);
        return Ok(orderDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SalesOrderDto>> GetById(int id)
    {
        var order = await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        var orderDto = _mapper.Map<SalesOrderDto>(order);
        return Ok(orderDto);
    }

    [HttpPost]
    public async Task<ActionResult<SalesOrderDto>> Create(CreateSalesOrderDto createDto)
    {
        // Fetch customer and products
        var customer = await _context.Customers.FindAsync(createDto.CustomerId);
        if (customer == null)
            return BadRequest("Customer not found");

        var productIds = createDto.Items.Select(i => i.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        // Create sales order
        var order = new SalesOrder
        {
            CustomerId = createDto.CustomerId,
            InvoiceNo = createDto.InvoiceNo,
            InvoiceDate = createDto.InvoiceDate,
            ReferenceNo = createDto.ReferenceNo,
            CustomerName = createDto.CustomerName,
            Address1 = createDto.Address1,
            Address2 = createDto.Address2,
            Address3 = createDto.Address3,
            State = createDto.State,
            PostCode = createDto.PostCode,
            Notes = createDto.Notes,
            Status = "Pending",
            CreatedDate = DateTime.UtcNow
        };

        // Create order items and calculate totals
        decimal totalExcl = 0;
        decimal totalTax = 0;

        foreach (var itemDto in createDto.Items)
        {
            if (!products.TryGetValue(itemDto.ProductId, out var product))
                return BadRequest($"Product {itemDto.ProductId} not found");

            var exclAmount = itemDto.Quantity * product.Price;
            var taxAmount = exclAmount * itemDto.TaxRate / 100;
            var inclAmount = exclAmount + taxAmount;

            var orderItem = new SalesOrderItem
            {
                ProductId = itemDto.ProductId,
                ItemCode = product.ItemCode,
                Description = product.Description,
                Note = itemDto.Note,
                Quantity = itemDto.Quantity,
                Price = product.Price,
                TaxRate = itemDto.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = inclAmount,
                CreatedDate = DateTime.UtcNow
            };

            order.Items.Add(orderItem);
            totalExcl += exclAmount;
            totalTax += taxAmount;
        }

        order.TotalExcl = totalExcl;
        order.TotalTax = totalTax;
        order.TotalIncl = totalExcl + totalTax;

        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();

        // Reload with includes
        var createdOrder = await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == order.Id);

        var result = _mapper.Map<SalesOrderDto>(createdOrder);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SalesOrderDto>> Update(int id, CreateSalesOrderDto updateDto)
    {
        var order = await _context.SalesOrders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound();

        var customer = await _context.Customers.FindAsync(updateDto.CustomerId);
        if (customer == null)
            return BadRequest("Customer not found");

        var productIds = updateDto.Items.Select(i => i.ProductId).ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        // Update order details
        order.CustomerId = updateDto.CustomerId;
        order.InvoiceNo = updateDto.InvoiceNo;
        order.InvoiceDate = updateDto.InvoiceDate;
        order.ReferenceNo = updateDto.ReferenceNo;
        order.CustomerName = updateDto.CustomerName;
        order.Address1 = updateDto.Address1;
        order.Address2 = updateDto.Address2;
        order.Address3 = updateDto.Address3;
        order.State = updateDto.State;
        order.PostCode = updateDto.PostCode;
        order.Notes = updateDto.Notes;
        order.ModifiedDate = DateTime.UtcNow;

        // Remove existing items
        _context.SalesOrderItems.RemoveRange(order.Items);

        // Add new items
        decimal totalExcl = 0;
        decimal totalTax = 0;

        foreach (var itemDto in updateDto.Items)
        {
            if (!products.TryGetValue(itemDto.ProductId, out var product))
                return BadRequest($"Product {itemDto.ProductId} not found");

            var exclAmount = itemDto.Quantity * product.Price;
            var taxAmount = exclAmount * itemDto.TaxRate / 100;
            var inclAmount = exclAmount + taxAmount;

            var orderItem = new SalesOrderItem
            {
                ProductId = itemDto.ProductId,
                ItemCode = product.ItemCode,
                Description = product.Description,
                Note = itemDto.Note,
                Quantity = itemDto.Quantity,
                Price = product.Price,
                TaxRate = itemDto.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = inclAmount,
                CreatedDate = DateTime.UtcNow
            };

            order.Items.Add(orderItem);
            totalExcl += exclAmount;
            totalTax += taxAmount;
        }

        order.TotalExcl = totalExcl;
        order.TotalTax = totalTax;
        order.TotalIncl = totalExcl + totalTax;

        await _context.SaveChangesAsync();

        var updatedOrder = await _context.SalesOrders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        var result = _mapper.Map<SalesOrderDto>(updatedOrder);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var order = await _context.SalesOrders.FindAsync(id);
        if (order == null)
            return NotFound();

        _context.SalesOrders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
