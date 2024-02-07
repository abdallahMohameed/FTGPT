using LLama.Common;
using LLama.WebAPI.Models;
using LLama.WebAPI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.DirectoryServices;
using System.Net.WebSockets;
using System.Reflection.PortableExecutable;
using System.Text;
using DirectoryEntry = System.DirectoryServices.DirectoryEntry;

namespace LLama.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ILogger<ChatController> _logger;
        private readonly IHubContext<ChatHub> _hubContext;


        public ChatController(ILogger<ChatController> logger, IHubContext<ChatHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        [HttpPost("Send")]
        public Task<string> SendMessage([FromBody] SendMessageInput input, [FromServices] StatefulChatService _service)
        {
            return _service.Send(input);
        }

        [HttpPost("Send/Stream")]
        public async Task SendMessageStream([FromBody] SendMessageInput input, [FromServices] StatefulChatService _service, CancellationToken cancellationToken)
        {

            Response.ContentType = "text/event-stream";

            await foreach (var r in _service.SendStream(input))
            {
                await Response.WriteAsync("data:" + r + "\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }

            await Response.CompleteAsync();
        }

        [HttpPost("History")]
        public async Task<string> SendHistory([FromBody] HistoryInput input, [FromServices] StatelessChatService _service)
        {
            var history = new ChatHistory();

            var messages = input.Messages.Select(m => new ChatHistory.Message(Enum.Parse<AuthorRole>(m.Role), m.Content));

            history.Messages.AddRange(messages);

            return await _service.SendAsync(history);
        }


        [HttpPost("loginWithActiveDirectory")]
        public async Task<AD_User> loginWithActiveDirectory(User_credentials User_Credentials)
        {
            try
            {
                string path = "LDAP://flairstech.com";
                return GetADUserData(path, User_Credentials.userName, User_Credentials.password);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw ex;
            }
        }


        public static AD_User GetADUserData(string path, string userName, string password)
        {
            using (var entry = new DirectoryEntry(path, userName, password))
            using (var searcher = new DirectorySearcher(entry))
            {
                searcher.Filter = $"(&(objectClass=user)(sAMAccountName={userName}))";
                searcher.PropertiesToLoad.Add("cn");
                searcher.PropertiesToLoad.Add("givenName");
                searcher.PropertiesToLoad.Add("sn");
                searcher.PropertiesToLoad.Add("mail");
                searcher.PropertiesToLoad.Add("title");
                searcher.PropertiesToLoad.Add("department");


                var result = searcher.FindOne();

                if (result != null)
                {

                    AD_User user = new AD_User();
                    user.Email = result.Properties["mail"][0].ToString();
                    user.Department = result.Properties["department"][0].ToString();
                    user.Title = result.Properties["title"][0].ToString();
                    user.CommonName = result.Properties["cn"][0].ToString();
                    user.FirstName = result.Properties["givenName"][0].ToString();
                    user.LastName = result.Properties["sn"][0].ToString();
                    return user;
                }
                else
                {
                    Console.WriteLine($"User {userName} not found.");

                }
                entry.Close();
                return null;
            }

        }

        public class AD_User
        {
            public string CommonName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Title { get; set; }
            public string Department { get; set; }
        }
        public class User_credentials
        {
            public string userName { get; set; }
            public string password { get; set; }
        }


        [HttpPost("StreamResultsSend")]
        public async Task ProcessMessages(SendMessageInput input, [FromServices] StatefulChatService _service)
        {
            await foreach (var result in _service.StreamResults(input))
            {
                // Process each result asynchronously
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", result);
            }
        }

    }
}