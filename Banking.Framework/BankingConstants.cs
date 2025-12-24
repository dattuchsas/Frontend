namespace Banking.Framework
{
    public class BankingConstants
    {
        public const string DataPresent = "Data Present";
        public const string BankNameNotSet = "No Bank Name Not Properly Set";
        public const string BranchDataNotSet = "Noo~Branch Data Not Set";

        //public const string NoLicAMC = "Noo~License Or AMC Not Set";
        //public const string AMCExpiresOn = "Mes~Your AMC Is Going To Expire On {0}, Please Renew It";
        //public const string LicExpiresOn = "Mes~Your License Is Going To Expire On {0}, Please Enter Into AMC";
        //public const string RenewAMCBefore = "Mes~Your AMC Is Expired On {0}, Please Renew Your AMC Before {1} To Extend Our Services ";
        //public const string AMCFeePending = "Your AMC Fee Is Pending, Please pay on or before {0} to extending services.";
        //public const string AMCNotPaid = "AMC Fee Is Not Paid, Please Contact Raminfo Ltd. To extend our services.";
        //public const string AMCExpired = "Your AMC Period Is Expired, Please Contact SAS Ltd.";

        // Screen Names
        public const string Screen_Login = "Login";
        public const string Screen_ConfirmUserId = "ConfirmUserId";
        public const string Screen_ModuleSCR = "Module";

        // Transaction Types
        public const string DBTrans_Insert = "DATABASETRANSACTIONS.TRANSACTIONS / INSERTRECORD";
        public const string DBTrans_BulkInsert = "DATABASETRANSACTIONS.TRANSACTIONS / BulkInsert";
        public const string DBTrans_Update = "DATABASETRANSACTIONS.TRANSACTIONS / UPDATERECORD";
        public const string DBTrans_Delete = "DATABASETRANSACTIONS.TRANSACTIONS / DELETERECORD";
        public const string DBTrans_Reject = "DATABASETRANSACTIONS.TRANSACTIONS / REJECTRECORD";
        public const string DBTrans_DeleteRecOnly = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordOnly";
        public const string DBTrans_DeleteRecGen = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordGen";
        public const string DBTrans_InsertUsingSelect = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelect";
        public const string DBTrans_InsertUsingSelectHist = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelectHist";
    }
}
