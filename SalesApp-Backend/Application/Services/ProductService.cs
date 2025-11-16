using AutoMapper;
using SalesApp_Backend.API.Models;
using SalesApp_Backend.Application.Interfaces;
using SalesApp_Backend.Domain.Entities;

namespace SalesApp_Backend.Application.Services;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _repository;
    private readonly IMapper _mapper;

    public ProductService(IRepository<Product> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _repository.GetByIdAsync(id);
        return product == null ? null : _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProductAsync(ProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        product.CreatedDate = DateTime.UtcNow;
        var createdProduct = await _repository.AddAsync(product);
        return _mapper.Map<ProductDto>(createdProduct);
    }

    public async Task UpdateProductAsync(ProductDto productDto)
    {
        var product = _mapper.Map<Product>(productDto);
        product.ModifiedDate = DateTime.UtcNow;
        await _repository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}
