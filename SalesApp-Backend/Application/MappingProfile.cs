using AutoMapper;
using SalesApp_Backend.API.Models;
using SalesApp_Backend.Domain.Entities;

namespace SalesApp_Backend.Application;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<Customer, CustomerDto>().ReverseMap();
    }
}
