namespace Banking.APIService
{
    public class APIExceptionResponse : Exception
    {
        public APIExceptionResponse(string message, Exception inner) : base(message, inner) { }

        public Guid CorrelationId { get; set; } = Guid.NewGuid();
    }
}
