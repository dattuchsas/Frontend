using Banking.Backend;
using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<DataTable> GetUserModuleList(string fields, string condition)
        {
            try
            {
                return await ProcessSingleRecordSet(TableNames.GenModuleMst, fields, condition);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<DataTable> GetServiceVirtualDirectoryDetails(string fields, string condition)
        {
            try
            {
                return await ProcessSingleRecordSet(TableNames.ServerVirtualDirDtls, fields, condition);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> GetHOTRALWBrCode()
        {
            return await _generalValidationService.GetHOTRALWBrCode();
        }

        #region Private Methods

        private async Task<DataTable> ProcessSingleRecordSet(string tblName, string fieldName, string whereCondition)
        {
            return await _databaseFactory.SingleRecordSet(tblName, fieldName, whereCondition);
        }

        #endregion
    }
}
