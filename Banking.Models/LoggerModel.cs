namespace Banking.Models
{
    public class LoggerModel
    {
        public string? ControllerName { get; set; }
        public string? ActionName { get; set; }
        public string? UserName { get; set; }
        public string? LogType { get; set; }
        public string? Message { get; set; }
        public string? Exception { get; set; }
        public DateTime LogDate { get; set; }
        public string? AdditionalInfo { get; set; }
        public long ResponseTime { get; set; }
    }
}
