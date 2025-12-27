namespace Banking.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string Database { get; set; } = null!;

        public int MaxRetries { get; set; }

        public int InitialDelayMs { get; set; }
    }
}
