using System.ComponentModel.DataAnnotations;

namespace Banking.Models
{
    public class LoginModel
    {
        public required string Username { get; set; }
        
        public required string Password1 { get; set; }

        public required string Password2 { get; set; }
    }
}
