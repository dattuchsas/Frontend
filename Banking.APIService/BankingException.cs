namespace Banking.APIService
{
    public class BankingException(BankingExceptionType bankingExceptionType, string message) : Exception(message)
    {
        public BankingExceptionType BankingExceptionType { get; set; } = bankingExceptionType;
    }

    public enum BankingExceptionType { Forbidden, Unauthorized, NotFound, Conflict, InternalServerError, BadRequest }
}
