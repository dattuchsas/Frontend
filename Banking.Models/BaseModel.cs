namespace Banking.Models
{
    public class BaseModel : ErrorModel
    {
        public string BankName { get; set; } = string.Empty;
        public string BranchCode { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
    }
}
