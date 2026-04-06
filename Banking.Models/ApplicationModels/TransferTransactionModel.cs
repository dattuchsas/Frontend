using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Models
{
    public class TransferTransactionModel : BaseModel
    {
        public TransactionModes TransactionMode { get; set; } = new();

        public List<SelectListItem>? BranchList { get; set; }
        public string? AccountNumber { get; set; }
        public string? CustomerName { get; set; }

        public bool CheckABB { get; set; }
        public bool CheckCheque { get; set; }
        public bool CheckLinkModule { get; set; }
        public bool CheckTransDetails { get; set; }
        public bool CheckDenoms { get; set; }
        public bool CheckRateDetails { get; set; }
        public bool CheckDenomsTally { get; set; }

        public string? ServiceCode { get; set; }
        public List<SelectListItem>? ServiceList { get; set; }

        public string? ModuleCode { get; set; }
        public List<SelectListItem>? ModuleList { get; set; }

        public string? GLCode { get; set; }
        public List<SelectListItem>? GLCodeList { get; set; }

        public string? CategoryCode { get; set; }
        public List<SelectListItem>? CategoryList { get; set; }

        public string? AccountType { get; set; }
        public string? ApplicationName { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public float? Amount { get; set; }
        public string? Narration { get; set; }

        public List<TransferTransactionComponents>? Components { get; set; }

        public string? ChequeType { get; set; }
        public string? ChequeNo { get; set; }
        public string? ChequeDate { get; set; }
        public string? ChequeFavouring { get; set; }

        public string? DebitTransactions { get; set; }
        public string? CreditTransactions { get; set; }
        public string? DebitTotal { get; set; }
        public string? CreditTotal { get; set; }
        public string? Difference { get; set; }

        public string? CounterNo { get; set; }
        public string? CashierId { get; set; }
        public string? BranchCode { get; set; }
        public string? BranchNarration { get; set; }
        public string? CurrencyCode { get; set; }
        public string? CurrencyNarration { get; set; }
        public string? MachineId { get; set; }

        public string? ABBUser { get; set; }
        public string? SelectedModule { get; set; }

        public string? ClearBalance { get; set; }
        public string? UnclearBalance { get; set; }
        public string? AccountBalance { get; set; }
        public string? OperationInstruction { get; set; }
        public string? OperatedBy { get; set; }
        public string? PendingBalance { get; set; }
        public string? CustomerId { get; set; }
        public string? LimitAmount { get; set; }
        public string? TotalCashDebited { get; set; }
        public string? TotalCashCredited { get; set; }
        public string? LimitExpiryDate { get; set; }
        public string? GSTIN { get; set; }

        public string? TODLimit { get; set; }
        public string? AvailableLimit { get; set; }
        public string? PendingIntAmount { get; set; }
        public string? InterestAmount { get; set; }
        public string? PendingInstallments { get; set; }
        public string? NPAIntAmount { get; set; }
        public string? SanctionAmount { get; set; }
        public string? DisbursementAmount { get; set; }

        public string? RD_OpAmount { get; set; }
        public string? RD_OpDate { get; set; }
        public string? RD_ROI { get; set; }
        public string? RD_IntAccr { get; set; }
        public string? RD_IntPaidUpto { get; set; }
        public string? RD_MaturityAmount { get; set; }
        public string? RD_MaturityDate { get; set; }
        public string? RD_EffectiveDate { get; set; }
        public string? RD_CurrAmount { get; set; }

        public string? REMBank { get; set; }
        public List<SelectListItem>? REMBankList { get; set; }

        public string? REMBranch { get; set; }
        public List<SelectListItem>? REMBranchList { get; set; }

        public string? REMFavouring { get; set; }
        public string? REMCommission { get; set; }

        public string? REMRecipientName { get; set; }
        public List<SelectListItem>? REMRecipientList { get; set; }

        public string? REMGST { get; set; }
        public string? REMCESS { get; set; }
        public string? REMPAN { get; set; }
        public string? REMMobile { get; set; }
        public string? REMAddress1 { get; set; }
        public string? REMAddress2 { get; set; }
        public string? REMAddress3 { get; set; }



        #region Hidden Fields

        public string? Hidden_194NModId { get; set; }
        public string? Hidden_194NCustomerId { get; set; }
        public string? Hidden_194NGLCode { get; set; }
        public string? Hidden_194NAccNo { get; set; }

        public string? Hidden_194NModDesc { get; set; }
        public string? Hidden_Mode { get; set; }
        public string? Hidden_SubMode { get; set; }

        public string? Hidden_RemCanCESSYN { get; set; } = "N";
        public string? Hidden_RemCanGSTYN { get; set; } = "N";
        public string? Hidden_OlimpYN { get; set; } = "Y";
        public string? Hidden_AutoRetChrgsYN { get; set; } = "N";
        public string? Hidden_CommRetChrgsYN { get; set; } = "N";
        public string? Hidden_RemCanAutoChrgsYN { get; set; } = "N";
        public string? Hidden_RemCanCommYN { get; set; } = "N";
        public string? Hidden_194NYN { get; set; } = "N";
        public string? Hidden_ThrLmt { get; set; } = "N";
        public string? Hidden_TellerVerifyReqYN { get; set; } = "Y";
        public bool? Hidden_BDT { get; set; } = false;

        public string? Hidden_Title { get; set; }
        public string? Hidden_TotalNarration { get; set; }

        public string? Hidden_194NAccName { get; set; }
        public string? Hidden_BDTStartDate { get; set; }
        public string? Hidden_194NGLDesc { get; set; }
        public string? Hidden_RemCanCommAmt { get; set; }
        public string? Hidden_RemCanGSTTax { get; set; }
        public string? Hidden_RemCanCESSTax { get; set; }
        public string? Hidden_GST { get; set; }

        public string? Hidden_SBCAAccClose { get; set; }

        public string? Hidden_CustomerId { get; set; }
        public string? Hidden_ReceipientName { get; set; }

        public string? Hidden_ChequeValidPeriod { get; set; }
        public string? Hidden_ChequeLength { get; set; }

        public string? Hidden_Precision { get; set; }
        public string? Hidden_MaxAmount { get; set; }
        public string? Hidden_CheckThresholdLimit { get; set; }



        public string? Overdraft { get; set; }
        public string? VTotalAmount { get; set; }
        public string? ImpYnWek { get; set; }
        public string? ImpYnDay { get; set; }
        public string? WekLmt { get; set; }
        public string? ImpClgYN { get; set; } = "N";
        public string? SRGTP { get; set; }
        public string? SRPOS { get; set; }
        
        #endregion
    }

    public enum TransactionModes
    {
        Debit,
        Credit
    }

    public class TransferTransactionComponents
    {
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Value { get; set; }
    }
}
