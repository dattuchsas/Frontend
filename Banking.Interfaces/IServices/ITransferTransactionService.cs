using Banking.Models;
using Microsoft.AspNetCore.Http;

namespace Banking.Interfaces
{
    public interface ITransferTransactionService
    {
        Task<TransferTransactionModel> Get(ISession session);
        Task<TransferTransactionModel> GetDetails(ISession session, TransferTransactionModel model, string queryString = "");
        Task<string> GetBatchNoGenRemCan(string searchString = "");
        Task<string> GetBatchNoGen(string searchString = "");
        Task<string> InsertTempTransaction(string insertString = "");
    }
}
