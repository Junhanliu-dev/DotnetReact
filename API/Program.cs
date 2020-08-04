using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            //Anything unside using is going to be cleaned up automatically after completed.
            //in this case, scope 
            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                try{
                    var context = services.GetRequiredService<DataContext>();

                    //Applies any pending migrations for the context to the database. 
                    //Will create the database if it does not already exist.
                    context.Database.Migrate();
                    Seed.SeedData(context);
                }
                catch(Exception ex){

                    //Inside ILogger, provide Class that will be logged
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
