using Banking.Models;
using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces.IServices
{
    public interface ITransferTransactionService
    {
        Task<TransferTransactionModel> Get(ISession session);
        Task<TransferTransactionModel> GetDetails(ISession session, TransferTransactionModel model, string queryString = "");
    }
}
