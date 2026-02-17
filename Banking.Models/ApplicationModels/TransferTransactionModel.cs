using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Models
{
    public class TransferTransactionModel : BaseModel
    {
        public string? TransactionMode { get; set; }
        public List<SelectListItem>? BranchList { get; set; }
        public string? AccountNumber { get; set; }
        public string? CustomerName { get; set; }

        public bool? CheckABB { get; set; }
        public bool? CheckCheque { get; set; }
        public bool? CheckLinkModule { get; set; }
        public bool? CheckTransDetails { get; set; }
        public bool? CheckDenoms { get; set; }
        public bool? CheckRateDetails { get; set; }
        public bool? CheckDenomsTally { get; set; }

        public string? ServiceCode { get; set; }
        public List<SelectListItem>? ServiceList { get; set; }

        public string? Module { get; set; }
        public List<SelectListItem>? ModuleList { get; set; }

        public string? AccountType { get; set; }
        public string? ApplicationName { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public float? Amount { get; set; }
        public string? Narration { get; set; }


        public string? ClearBalance { get; set; }
        public string? UnclearBalance { get; set; }
        public string? AccountBalance { get; set; }
        public string? OperarationInstruction { get; set; }
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
        public string? NoofPendingInstallments { get; set; }
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

        public string? Remm_IssuedOnBank { get; set; }
        public string? Remm_IssuedOnBranch { get; set; }
        public string? Remm_Favouring { get; set; }
        public string? Remm_Commission { get; set; }
        public string? Remm_RecipientName { get; set; }
        public string? Remm_GST { get; set; }
        public string? Remm_CESS { get; set; }
        public string? Remm_PAN { get; set; }
        public string? Remm_Mobile { get; set; }
        public string? Remm_Address1 { get; set; }
        public string? Remm_Address2 { get; set; }
        public string? Remm_Address3 { get; set; }

        public string? ChequeType { get; set; }
        public string? ChequeNo { get; set; }
        public string? ChequeDate { get; set; }
        public string? ChequeFavouring { get; set; }

        public string? DebitTransactions { get; set; }
        public string? CreditTransactions { get; set; }
        public string? Total { get; set; }
        public string? Difference { get; set; }

        #region Hidden Fields

        public string? Hidden_194NModId { get; set; }
        public string? Hidden_194NGLCode { get; set; }
        public string? Hidden_194NAccNo { get; set; }

        public string? Hidden_194NModDesc { get; set; }
        public string? Hidden_Mode { get; set; }
        public string? Hidden_SubMode { get; set; }

        public string? Hidden_RemCanCESSYN { get; set; } = "N";
        public string? Hidden_RemCanGSTYN { get; set; } = "N";
        public string? Hidden_OlimpYN { get; set; } = "Y";
        public string? Hidden_impClgYN { get; set; } = "N";
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

        #endregion
    }
}
