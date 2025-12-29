namespace Banking.Models
{
    public class RedirectModel : ErrorModel
    {
        public required string ControllerName { get; set; }
        public required string ActionName { get; set; }
        public Dictionary<string, string>? keyValuePairs { get; set; }
    }
}
