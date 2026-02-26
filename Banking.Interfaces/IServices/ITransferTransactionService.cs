using Banking.Models;
using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces
{
    public interface ITransferTransactionService
    {
        Task<TransferTransactionModel> Get(ISession session, TransferTransactionModel model);
        Task<TransferTransactionModel> GetDetails(ISession session, TransferTransactionModel model, string queryString = "");
    }
}
