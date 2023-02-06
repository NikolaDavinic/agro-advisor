﻿using BookStoreApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;
using webapi.DTO;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("transaction")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ILogger<TransactionController> _logger;
        private readonly TransactionService _transactionService;
        private readonly CategoryService _categoryService;
        public TransactionController(
            ILogger<TransactionController> logger,
            TransactionService transactionService,
            CategoryService categoryService)
        {
            _transactionService = transactionService;
            _categoryService = categoryService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddTransaction([FromBody] AddTransactionDTO tDTO)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                if (userId == null)
                {
                    return Unauthorized("Greska pri autentifikaciji");
                }

                var category = await _categoryService.GetAsync(tDTO.CategoryId);

                if (category == null) 
                {
                    return BadRequest(new { msg = "Kategorija ne postoji" });
                }

                Transaction transaction = new()
                {
                    Category = new MongoDBRef("TCategory", category.Id),
                    CategoryName = category.Name,
                    Description = tDTO.Description,
                    Value = tDTO.Value,
                    Date = tDTO.Date
                };

                var t = await _transactionService.AddTransactionForUser(userId, transaction);

                return Ok(new
                {
                    Id = t.Id.Value.ToString(),
                    t.Date,
                    t.CategoryName,
                    t.Description,
                    t.Value
                });
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        }

        [Authorize]
        [HttpGet("q")]
        public async Task<ActionResult> GetTransactions([FromQuery] DateTime? before, [FromQuery] int? skip, [FromQuery] int? take)
        {
            try
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

                var transactions = await _transactionService.FilterTransactions(userId, before, skip, take);

                return Ok(transactions.Select((t) => new
                {
                    Id = t.Id.Value.ToString(),
                    t.Date,
                    t.CategoryName,
                    t.Description,
                    t.Value,
                }));
            }
            catch (Exception e)
            {
                return BadRequest(new { msg = e.Message });
            }
        } 
    }
}
