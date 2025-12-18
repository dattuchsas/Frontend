using System.ComponentModel.DataAnnotations;

namespace Banking.Models
{
    public class LoginModel : ErrorModel
    {
        [Required]
        [StringLength(13, ErrorMessage = "Username lenght should not exceed 13 characters")]
        [Display(Name = "Username")]
        public string Username { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "Password 1 lenght should not exceed 20 characters")]
        [Display(Name = "Password 1")]
        public string Password1 { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "Password 2 lenght should not exceed 20 characters")]
        [Display(Name = "Password 2")]
        public string Password2 { get; set; }
    }
}
