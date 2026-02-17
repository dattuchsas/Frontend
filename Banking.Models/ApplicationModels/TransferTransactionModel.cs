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
