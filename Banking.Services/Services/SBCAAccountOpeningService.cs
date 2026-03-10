using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Data;
using System.Reflection.PortableExecutable;

namespace Banking.Services
{
    public class SBCAAccountOpeningService : ISBCAAccountOpeningService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly ICommonService _commonService;
        private readonly ISearchService _searchService;
        private readonly IGeneralValidationService _generalValidationService;

        public SBCAAccountOpeningService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _commonService = new CommonService(databaseSettings);
            _searchService = new SearchService(databaseSettings);
            _generalValidationService = new GeneralValidationService(databaseSettings);
        }

        public Task<string> SBCAAccountOpening(ISession session, SBCAAccountOpeningModel accountopeningmodel)
        {
            throw new NotImplementedException();
        }

        public async Task<SBCAAccountOpeningModel> GetSBCAAccountOpeningDetails(ISession session, string brcode = "", string moduleid = "", string glcode = "", string accno = "")
        {
            var sbcaaccountopening = new SBCAAccountOpeningModel();
            sbcaaccountopening.BranchList = await _commonService.GetBranchList();

            sbcaaccountopening.SalutationList = await _commonService.GetSalutationList();

            sbcaaccountopening.CategoryTypeList = await _commonService.GetCategoryList("CustType|View");

            sbcaaccountopening.Guard_RelationList = await _commonService.GetRelationList();
            sbcaaccountopening.ModuleList = await _commonService.GetModuleList("moduleid in ('SB')");
            sbcaaccountopening.AccountTypeList = await _commonService.GetAccountTypeList("moduleid in ('SB')");
            sbcaaccountopening.OperatingInstrsList = await _commonService.GetOperatingInstrList();
            sbcaaccountopening.Intro_RelationList = await _commonService.GetRelationList();
            sbcaaccountopening.Jnt_RelationList = await _commonService.GetRelationList();
            sbcaaccountopening.Nominee_RelationList = await _commonService.GetRelationList();
            sbcaaccountopening.Guard_RelationList = await _commonService.GetRelationList();

            if (string.IsNullOrWhiteSpace(accno))
                sbcaaccountopening = await GetDetails(brcode, moduleid, glcode, accno, sbcaaccountopening);

            return sbcaaccountopening;
        }

        private async Task<SBCAAccountOpeningModel> GetDetails(string brcode, string moduleid, string glcode, string accno, SBCAAccountOpeningModel sbcaaccountopeningmodel)
        {
            DataTable rs = null!;
            if (brcode.Length > 0 && moduleid.Length > 0 && glcode.Length > 0 && accno.Length > 0)
            {

                string listfields = "a.customerid,a.name,a.chequebook,a.tdsyn,a.EXMPFORMSRECYN,a.FORMS15G,a.NONTDS,to_char(a.opdate,'dd-Mon-yyyy') opdate,c.narration, a.operatedby, a.bankstaffyn, a.CATEGORYCODE,a.NARRATION NARRATION,b.narration narration1,a.MINORYN,a.TRANSTATUS,a.operatinginstr,a.name,A.REGNO, TO_CHAR(A.REGDATE,'DD-Mon-YYYY') REGDATE,REGPLACE,(SELECT d.panno FROM GENCUSTINFOMST d WHERE KYCID='2' AND d.customerid=a.customerid)PANNO";

                rs = await _databaseFactory.SingleRecordSet(moduleid + "mst a, gencategorymst b, GenOperInstMst c", listfields, "upper(trim(a.branchcode))='" + brcode + "' and upper(trim(a.currencycode))='INR' and upper(trim(a.glcode))='" + glcode + "' and upper(trim(a.accno))='" + accno + "' and status='R' and TRANSTATUS='P' and a.CATEGORYCODE=b.CATEGORYCODE and trim(a.operatinginstr)=trim(c.opercode)");
                if (rs.Rows.Count > 0)
                {
                    sbcaaccountopeningmodel.CustomerId = rs.Rows[0]["customerid"].ToString();
                    sbcaaccountopeningmodel.CustomerName = rs.Rows[0]["name"].ToString();
                    sbcaaccountopeningmodel.CheckChequeBook = rs.Rows[0]["chequebook"].ToString() == "Y" ? true : false;
                    sbcaaccountopeningmodel.TDSOptions = rs.Rows[0]["tdsyn"].ToString();
                    sbcaaccountopeningmodel.Regno = rs.Rows[0]["REGNO"].ToString();
                    sbcaaccountopeningmodel.Regplace = rs.Rows[0]["REGPLACE"].ToString();

                    sbcaaccountopeningmodel.OpeningDate = Convert.ToDateTime(rs.Rows[0]["opdate"].ToString());
                    sbcaaccountopeningmodel.Module = moduleid;
                    sbcaaccountopeningmodel.OperatingInstrs = rs.Rows[0]["operatinginstr"].ToString();
                    sbcaaccountopeningmodel.CheckBankStaff = rs.Rows[0]["bankstaffyn"].ToString() == "Y" ? true : false;
                    sbcaaccountopeningmodel.Remarks = rs.Rows[0]["NARRATION"].ToString();
                    sbcaaccountopeningmodel.Status = rs.Rows[0]["TRANSTATUS"].ToString() == "P" ? "Pending" : "Approved";
                    sbcaaccountopeningmodel.CheckMinor = rs.Rows[0]["MINORYN"].ToString() == "Y" ? true : false;
                    sbcaaccountopeningmodel.Panno = rs.Rows[0]["PANNO"].ToString();
                    sbcaaccountopeningmodel.CategoryType = rs.Rows[0]["CATEGORYCODE"].ToString();
                    sbcaaccountopeningmodel.OperatedBy = rs.Rows[0]["operatedby"].ToString();

                }


                //introducer dtls

                rs = await _databaseFactory.SingleRecordSet("GENCUSTINTRODUCERMST", "INTRCUSTOMERID,INTRNAME", "upper(trim(branchcode)) = '" + brcode + "' and upper(trim(currencycode))='INR' and upper(trim(glcode))= '" + glcode + "' and upper(trim(accno))='" + accno + "' and moduleid='" + moduleid + "'");
                if (rs.Rows.Count > 0)
                {
                    sbcaaccountopeningmodel.IntroCustId = rs.Rows[0]["INTRCUSTOMERID"].ToString();
                    sbcaaccountopeningmodel.IntroCustName = rs.Rows[0]["INTRNAME"].ToString();
                }
                //joint account details
                rs = await _databaseFactory.SingleRecordSet("GENCUSTJOINTHOLDERMST", "SNO,JHCUSTOMERID,jointholdername,to_char(MINORDOB,'dd-Mon-yyyy') MINORDOB,MINORYN,RELATIONID", "upper(trim(branchcode)) = '" + brcode + "' and upper(trim(currencycode))='INR' and upper(trim(glcode))= '" + glcode + "' and upper(trim(accno))='" + accno + "' and moduleid='" + moduleid + "'");

                sbcaaccountopeningmodel.JntAccdtls = new List<JntAcc>();

                foreach (DataRow row in rs.Rows)
                {
                    JntAcc JntAcc1 = new JntAcc
                    {
                        JntCustId = Conversions.ToString(row["JHCUSTOMERID"]),
                        JntCustName = Conversions.ToString(row["jointholdername"]),
                        CheckJntMinor = Conversions.ToString(row["MINORYN"]) == "Y" ? true : false,
                        Jnt_MinorDOB = Conversions.ToString(row["MINORDOB"]),
                        Jnt_Relation = Conversions.ToString(row["RELATIONID"])

                    };
                    sbcaaccountopeningmodel.JntAccdtls.Add(JntAcc1);


                }

                //Guardian details
                rs = await _databaseFactory.SingleRecordSet("GENCUSTGUARDIANMST", "GRDCUSTOMERID,GUARDIANNAME,RELATION", "upper(trim(branchcode)) = '" + brcode + "' and upper(trim(currencycode))='INR' and upper(trim(glcode))= '" + glcode + "' and upper(trim(accno))='" + accno + "' and moduleid='" + moduleid + "'");

                sbcaaccountopeningmodel.Guardiandtls = new List<Guardian>();

                foreach (DataRow row in rs.Rows)
                {
                    Guardian Guardian1 = new Guardian
                    {
                        GuardCustId = Conversions.ToString(row["GRDCUSTOMERID"]),
                        GuardCustName = Conversions.ToString(row["GUARDIANNAME"]),
                        Guard_Relation = Conversions.ToString(row["RELATION"])


                    };
                    sbcaaccountopeningmodel.Guardiandtls.Add(Guardian1);


                }


                // nominee details

                rs = await _databaseFactory.SingleRecordSet("GENCUSTNOMINEEMST", "NOMCUSTOMERID,NOMINEENAME,MINORYN,to_char(MINNOMINEEDOB,'dd-Mon-yy') MINNOMINEEDOB,RELATION,RECEIVERNAME,ALLOCATION", "upper(trim(branchcode)) = '" + brcode + "' and upper(trim(currencycode))='INR' and upper(trim(glcode))= '" + glcode + "' and upper(trim(accno))='" + accno + "' and moduleid='" + moduleid + "'");

                sbcaaccountopeningmodel.Nomineedtls = new List<Nominee>();

                foreach (DataRow row in rs.Rows)
                {
                    Nominee nominee1 = new Nominee
                    {
                        NomineeCustId = Conversions.ToString(row["NOMCUSTOMERID"]),
                        NomineeCustName = Conversions.ToString(row["NOMINEENAME"]),
                        CheckNomineeMinor = Conversions.ToString(row["MINORYN"]) == "Y" ? true : false,
                        Nominee_MinorDOB = Conversions.ToString(row["MINNOMINEEDOB"]),
                        Nominee_Relation = Conversions.ToString(row["RELATION"])
                    };
                    sbcaaccountopeningmodel.Nomineedtls.Add(nominee1);
                }
            }
            return sbcaaccountopeningmodel;
        }
    }
}
