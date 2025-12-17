using System.ComponentModel.DataAnnotations;

namespace Banking.Models
{
    public class LoginModel
    {
        [StringLength(13, ErrorMessage = "Username lenght should not exceed 13 characters")]
        [Display(Name = "Username")]
        public required string Username { get; set; }

        [StringLength(20, ErrorMessage = "Password 1 lenght should not exceed 20 characters")]
        [Display(Name = "Password 1")]
        public required string Password1 { get; set; }

        [StringLength(20, ErrorMessage = "Password 2 lenght should not exceed 20 characters")]
        [Display(Name = "Password 2")]
        public required string Password2 { get; set; }
    }
}
