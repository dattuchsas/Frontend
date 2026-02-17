namespace Banking.Framework
{
    public class ControllerNames
    {
        public const string Login = "Login";
        public const string Dashboard = "Dashboard";
        public const string Customer = "Customer";
        public const string User = "User";
        public const string GetDetails = "GetDetails";
        public const string TransferTransaction = "TransferTransaction";
    }

    public class ActionNames
    {
        public const string Index = "Index";
        public const string UserModules = "UserModules";
        public const string SelectedModule = "SelectedModule";
        public const string New = "New";
    }

    public class TransactionModes
    {
        public const string Debit = "Debit";
        public const string Credit = "Credit";
    }

    public class SessionConstants
    {
        public const string UserId = "UserId";
        public const string Mod = "Modules";
        public const string ModNar = "ModuleNarration";
        public const string ServerId = "ServerId";
        public const string MachineId = "MachineId";
        public const string ABBUser = "ABBUser";

        public const string BankCode = "BankCode";
        public const string BankName = "BankName";
        public const string BranchCode = "BranchCode";
        public const string BranchNarration = "BranchNarration";
        public const string GroupCode = "GroupCode";
        public const string CashDenomYN = "CashDenomYN";
        public const string CashDenomTallyYN = "CashDenomTallyYN";
        public const string ClgRetChgsAutoYN = "ClgRetChgsAutoYN";
        
        public const string ApplicationDate = "ApplicationDate";
        public const string ChequeValidPeriod = "ChequeValidPeriod";
        public const string ChequeLength = "ChequeLength";
        public const string CounterNo = "CounterNo";
        public const string NonCustomer = "NonCustomer";
        public const string DayBegin = "DayBegin";
        public const string DayBegin1 = "DayBegin1";

        public const string CurrencyCode = "CurrencyCode";
        public const string CurrencyNarration = "CurrencyNarration";

        public const string ControllerName = "ControllerName";
        public const string SelectedModule = "SelectedModule";
        public const string QueryString = "QueryString";
        public const string ReferrerUrl = "ReferrerUrl";
    }

    public class BankingConstants
    {
        public const string DataPresent = "Data Present";
        public const string BankNameNotSet = "No Bank Name Not Properly Set";
        public const string BranchDataNotSet = "Noo~Branch Data Not Set";
        
        public const string TransactionCompleted = "Transaction Completed";

        //public const string NoLicAMC = "Noo~License Or AMC Not Set";
        //public const string AMCExpiresOn = "Mes~Your AMC Is Going To Expire On {0}, Please Renew It";
        //public const string LicExpiresOn = "Mes~Your License Is Going To Expire On {0}, Please Enter Into AMC";
        //public const string RenewAMCBefore = "Mes~Your AMC Is Expired On {0}, Please Renew Your AMC Before {1} To Extend Our Services ";
        //public const string AMCFeePending = "Your AMC Fee Is Pending, Please pay on or before {0} to extending services.";
        //public const string AMCNotPaid = "AMC Fee Is Not Paid, Please Contact Raminfo Ltd. To extend our services.";
        //public const string AMCExpired = "Your AMC Period Is Expired, Please Contact SAS Ltd.";
    }

    public class TransactionTypes
    {
        public const string Insert = "DATABASETRANSACTIONS.TRANSACTIONS / INSERTRECORD";
        public const string BulkInsert = "DATABASETRANSACTIONS.TRANSACTIONS / BulkInsert";
        public const string Update = "DATABASETRANSACTIONS.TRANSACTIONS / UPDATERECORD";
        public const string Delete = "DATABASETRANSACTIONS.TRANSACTIONS / DELETERECORD";
        public const string Reject = "DATABASETRANSACTIONS.TRANSACTIONS / REJECTRECORD";
        public const string DeleteRecOnly = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordOnly";
        public const string DeleteRecGen = "DATABASETRANSACTIONS.TRANSACTIONS / DeleteRecordGen";
        public const string InsertUsingSelect = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelect";
        public const string InsertUsingSelectHist = "DATABASETRANSACTIONS.TRANSACTIONS / InsertUsingSelectHist";
    }
}
