using System.Data;
using Banking.Models;
using Banking.Interfaces;
using Microsoft.Extensions.Options;

namespace Banking.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly IGeneralValidationService _generalValidationService;

        public DashboardService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _generalValidationService = new GeneralValidationService(databaseSettings);
        }

        public async Task<string> GetHOTRALWBrCode()
        {
            return await _generalValidationService.GetHOTRALWBrCode();
        }

        public async Task<DataTable> GetUserId(string query)
        {
            try
            {
                return await _databaseFactory.ProcessQueryAsync(query);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<DataTable> ProcessSingleRecordRequest(string tblName, string fieldName, string whereCondition)
        {
            try
            {
                return await ProcessSingleRecordSet(tblName, fieldName, whereCondition);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #region Private Methods

        private async Task<DataTable> ProcessSingleRecordSet(string tblName, string fieldName, string whereCondition)
        {
            return await _databaseFactory.SingleRecordSet(tblName, fieldName, whereCondition);
        }

        #endregion
    }
}
