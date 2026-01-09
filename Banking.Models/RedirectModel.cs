namespace Banking.Models
{
    public class RedirectModel : BaseModel
    {
        public required string ControllerName { get; set; }
        public required string ActionName { get; set; }
        public Dictionary<string, string>? keyValuePairs { get; set; }
    }
}
