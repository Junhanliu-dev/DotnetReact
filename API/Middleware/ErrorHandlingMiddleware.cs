using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;

        }

        public async Task Invoke(HttpContext context) {

            try {
                // move the request onto the next piece of middleware 
                await _next(context);
            }
            catch(Exception ex) {
                await HndleExceptionAsync(context, ex, _logger);
            }

        }

        private async Task HndleExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
        {
            object errors = null;

            switch (ex) {
                case RestException re:
                    logger.LogError(ex, "RESt ERROR");
                    errors = re.Errors;
                    //add code to response
                    context.Response.StatusCode = (int)re.Code;
                    break;
                case Exception e:
                    logger.LogError(ex, "SERVER ERROR");
                    errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }
            
            context.Response.ContentType = "application/json";

            if(errors != null) {
                var result = JsonSerializer.Serialize(new {
                    errors
                });

                await context.Response.WriteAsync(result);
            }
        }
    }
}