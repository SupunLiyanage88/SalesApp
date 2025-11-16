using AutoMapper;
using SalesApp_Backend.API.Models;
using SalesApp_Backend.Application.Interfaces;
using SalesApp_Backend.Domain.Entities;

namespace SalesApp_Backend.Application.Services;

public class CustomerService : ICustomerService
{
    private readonly IRepository<Customer> _repository;
    private readonly IMapper _mapper;

    public CustomerService(IRepository<Customer> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
    {
        var customers = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
    {
        var customer = await _repository.GetByIdAsync(id);
        return customer == null ? null : _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateCustomerAsync(CustomerDto customerDto)
    {
        var customer = _mapper.Map<Customer>(customerDto);
        customer.CreatedDate = DateTime.UtcNow;
        var createdCustomer = await _repository.AddAsync(customer);
        return _mapper.Map<CustomerDto>(createdCustomer);
    }

    public async Task UpdateCustomerAsync(CustomerDto customerDto)
    {
        var customer = _mapper.Map<Customer>(customerDto);
        customer.ModifiedDate = DateTime.UtcNow;
        await _repository.UpdateAsync(customer);
    }

    public async Task DeleteCustomerAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}
