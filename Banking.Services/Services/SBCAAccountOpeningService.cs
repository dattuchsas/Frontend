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


        public async Task<string> SaveSBCAAccountOpeningDetails(ISession session, SBCAAccountOpeningModel sbcaaccountopeningmodel,List<JntAcc> jntAccs,List<Guardian> guardians,List<Nominee> nominees)
        {
            string[,] arrtrans = new string[20,5 ];
            string newaccno;
            try
            {
                // These three should not be null for customer insertion
                string appdate = session.GetString(SessionConstants.ApplicationDate);
                string userid = session.GetString(SessionConstants.UserId);
                string machineid = session.GetString(SessionConstants.MachineId);
                string customerid = sbcaaccountopeningmodel.CustomerId!;
                string moduleid = sbcaaccountopeningmodel.Module!;
                string brcode = session.GetString(SessionConstants.BranchCode)!;
                string glcode = sbcaaccountopeningmodel.AccountType!;
                string accno = sbcaaccountopeningmodel.AccountNumber!;
                string narration = sbcaaccountopeningmodel.Remarks!;
                string operatinginstr = sbcaaccountopeningmodel.OperatingInstrs!;
                string categorycode = sbcaaccountopeningmodel.CategoryType!;
                string salutation = sbcaaccountopeningmodel.Salutation!;
                string name = sbcaaccountopeningmodel.CustomerName!;
                string tdsyn = sbcaaccountopeningmodel.TDSOptions!;
                string chequebook = sbcaaccountopeningmodel.CheckChequeBook ? "Y" : "N";
                string bankstaffyn = sbcaaccountopeningmodel.CheckBankStaff ? "Y" : "N";
                string minoryn = sbcaaccountopeningmodel.CheckMinor ? "Y" : "N";
                string operatedby = sbcaaccountopeningmodel.OperatedBy!;
                string regno = sbcaaccountopeningmodel.Regno!;
                string regplace = sbcaaccountopeningmodel.Regplace!;
                string regdate = sbcaaccountopeningmodel.dateofincorporation.HasValue ? sbcaaccountopeningmodel.dateofincorporation.Value.ToString("dd-MMM-yyyy") : "";
                string panno = sbcaaccountopeningmodel.Panno!;
                string openingdate = sbcaaccountopeningmodel.OpeningDate.HasValue ? sbcaaccountopeningmodel.OpeningDate.Value.ToString("dd-MMM-yyyy") : "";

                DateTime lastopppdate;
                lastopppdate = Convert.ToDateTime(appdate).AddDays(-1);
                
                int arrcnt = 0;

                // Customer Info Insertion
                string autoTab = moduleid + "MST";
                arrtrans[arrcnt, 0] = "A";
                arrtrans[arrcnt, 1] = "GETAUTONUMBER|upper(trim(MAXAUTOTABLENAME))='" + autoTab + "' and upper(trim(MAXAUTOFIELDNAME))='ACCNO' and Upper(glcode)='" + glcode + "'";
                arrtrans[arrcnt, 2] = "branchcode,moduleid,maxautotablename,maxautofieldname,applicationdate,glcode";
                arrtrans[arrcnt, 3] = "'" + brcode + "','" + moduleid + "','" + autoTab + "','ACCNO',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),'" + glcode + "'";
                arrtrans[arrcnt, 4] = "upper(branchcode)='" + brcode + "' and upper(moduleid)='" + moduleid + "' and  upper(maxautotablename)='" + autoTab + "'  and Upper(glcode)='"+ glcode +"' and upper(maxautofieldname)='ACCNO'";
                
                arrcnt++;

                // for sbmst
                string sbfields, sbvalues;
                sbfields = "branchcode,currencycode,glcode,customerid,name,chequebook,opdate,transtatus,operatedby,operatinginstr,categorycode,bankstaffyn,REGNO,REGDATE, REGPLACE,TDSYN,EXMPFORMSRECYN,FORMS15G,NONTDS,status,introduceryn,jointholderyn,nomineeyn,GUARDIANYN,signatureyn,narration,applicationdate,systemdate,userid,machineid,lastintcalcdate,opplastintcalcdate,accno";
                sbvalues = "'" + brcode + "','INR','" + glcode + "','" + customerid + "','" + name + "','" + chequebook + "',to_Date('" + openingdate + "','dd-Mon-yyyy'),'P','" + operatedby + "','" + operatinginstr + "','" + categorycode + "','" + bankstaffyn + "','" + regno + "',to_Date('" + regdate + "', 'dd-Mon-yyyy'),'" + regplace + "','" + tdsyn + "','N','N','N','N','N','" + narration + "',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),sysdate,'" + userid + "','" + machineid + "',TO_DATE('" + lastopppdate + "', 'dd-Mon-yyyy'),TO_DATE('" + lastopppdate + "', 'dd-Mon-yyyy')";

                arrtrans[arrcnt, 0] = "I";
                arrtrans[arrcnt, 1] = moduleid + "MST";
                arrtrans[arrcnt, 2] = sbfields;
                arrtrans[arrcnt, 3] = sbvalues;
                arrtrans[arrcnt, 4] = "";

                arrcnt++;

                string intfields, intvalues;
                intfields = "branchcode,currencycode,glcode,moduleid,INTRCUSTOMERID,INTRNAME, customerid,applicationdate,systemdate,userid,machineid,accno";
                intvalues = "'" + brcode + "','INR','" + glcode + "','" + moduleid + "','" + sbcaaccountopeningmodel.IntroCustId + "','" + sbcaaccountopeningmodel.IntroCustName + "','" + customerid + "',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),sysdate,'" + userid + "','" + machineid + "'";

                // For customer introducer details insertion
                arrtrans[arrcnt, 0] = "I";
                arrtrans[arrcnt, 1] = "GENCUSTINTRODUCERMST";
                arrtrans[arrcnt, 2] = intfields;
                arrtrans[arrcnt, 3] = intvalues;
                arrtrans[arrcnt, 4] = "";
                arrcnt++;
                string jointfields = string.Empty;
                if (jntAccs.Count > 0)
                {
                    jointfields = "branchcode,currencycode,glcode,moduleid,sno,JHCUSTOMERID,jointholdername,MINORYN,MINORDOB,RELATIONID,customerid,applicationdate, systemdate,userid, machineid,accno";
                    string jointvalues = string.Empty;
                    string jointvalues1 = string.Empty;
                    Int32 sno = 1;
                    foreach (var jnt in jntAccs)
                    {
                        
                        jointvalues= "'" + brcode + "','INR','" + glcode + "','" + moduleid + "',"+ sno +",'" + jnt.JntCustId + "','" + jnt.JntCustName + "','" + (jnt.CheckJntMinor ? "Y" : "N") + "','" + jnt.Jnt_MinorDOB + "','" + jnt.Jnt_Relation + "','" + customerid + "',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),sysdate,'" + userid + "','" + machineid + "'";
                        jointvalues1 = jointvalues1 + "|" + jointvalues;
                        sno++;

                    }
                    // For joint account holder details insertion
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = "GENCUSTJOINTHOLDERMST";
                    arrtrans[arrcnt, 2] = jointfields;
                    arrtrans[arrcnt, 3] = jointvalues1;
                    arrtrans[arrcnt, 4] = "";
                    arrcnt++;
                }

                string guardianfields = string.Empty;
                if (guardians.Count > 0)
                {
                    jointfields = "branchcode,currencycode,glcode,moduleid,grdCUSTOMERID,guardianname,relation,customerid,applicationdate,systemdate,userid,machineid,accno";
                    string guardianvalues = string.Empty;
                    string guardianvalues1 = string.Empty;
                    Int32 sno = 1;
                    foreach (var guard in guardians)
                    {

                        guardianvalues = "'" + brcode + "','INR','" + glcode + "','" + moduleid + "','" + guard.GuardCustId + "','" + guard.GuardCustName + "','" + guard.Guard_Relation + "','" + customerid + "',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),sysdate,'" + userid + "','" + machineid + "'";
                        guardianvalues1 = guardianvalues1 + "|" + guardianvalues;
                        sno++;

                    }
                    // For joint account holder details insertion
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = "GENCUSTGUARDIANMST";
                    arrtrans[arrcnt, 2] = guardianvalues;
                    arrtrans[arrcnt, 3] = guardianvalues1;
                    arrtrans[arrcnt, 4] = "";
                    arrcnt++;
                }

                string nomineefields = string.Empty;
                if (nominees.Count > 0)
                {
                    jointfields = "branchcode,currencycode,glcode,moduleid,NOMCUSTOMERID,nomineename,MINORYN,MINNOMINEEDOB,relation,RECEIVERNAME,ALLOCATION,customerid,applicationdate,systemdate,userid,machineid,accno";
                    string nomineevalues = string.Empty;
                    string nomineevalues1 = string.Empty;
                    Int32 sno = 1;
                    foreach (var nom in nominees )
                    {

                        nomineevalues= "'"+ brcode + "','INR','" + glcode + "','" + moduleid + "','" + nom.NomineeCustId + "','" + nom.NomineeCustName + "','" + (nom.CheckNomineeMinor ? "Y" : "N") + "','" + nom.Nominee_MinorDOB + "','" + nom.Nominee_Relation + "','','','" + customerid + "',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),sysdate,'" + userid + "','" + machineid + "'";

                        sno++;

                    }
                    // For joint account holder details insertion
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = "GENCUSTNOMINEEMST";
                    arrtrans[arrcnt, 2] = nomineevalues;
                    arrtrans[arrcnt, 3] = nomineevalues1;
                    arrtrans[arrcnt, 4] = "";
                    arrcnt++;
                }

                string balancefields, balancevalues;
                balancefields = "branchcode,currencycode,glcode,curbal,status, applicationdate,userid,machineid,accno";
                balancevalues = "'" + brcode + "','INR','" + glcode + "','0','P',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),'" + userid + "','" + machineid + "'";

                // For customer introducer details insertion
                arrtrans[arrcnt, 0] = "I";
                arrtrans[arrcnt, 1] = moduleid + "BALANCE";
                arrtrans[arrcnt, 2] = balancefields;
                arrtrans[arrcnt, 3] = balancevalues;
                arrtrans[arrcnt, 4] = "";
                arrcnt++;

                string[] chargetype =    new string[7];
             
                chargetype[0] = "FC";
                chargetype[1] = "MBC";
                chargetype[2] = "IRC";
                chargetype[3] = "ORC";
                chargetype[4] = "CIC";
                chargetype[5] = "SPC";
                chargetype[6] = "STC";

                for (int i = 0; i <= 6; i++)
                {
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = moduleid + "chargedatedtls";
                    arrtrans[arrcnt, 2] = "BRANCHCODE, CURRENCYCODE, GLCODE,CHARGETYPE,LASTCHARGECALCDATE,STATUS, TRANSTATUS, APPLICATIONDATE, USERID, MACHINEID, SYSTEMDATE,ACCNO";
                    arrtrans[arrcnt, 3] = "'" + brcode + "','INR','" + glcode + "','" + chargetype[i] + "',TO_DATE('" + lastopppdate + "', 'dd-Mon-yyyy'),'R','P',TO_DATE('" + appdate + "', 'dd-Mon-yyyy'),'" + userid + "','" + machineid + "',sysdate"; 
                    arrtrans[arrcnt, 4] = "";

                    arrcnt++;
                }

                var output = await _databaseFactory.ProcessDataTransactions(arrtrans);


            //    if (output.Equals(BankingConstants.TransactionSuccessful))
             //       return output + "|" + newaccno;

                return output;
            }
            catch (Exception ex)
            {
                // Handle exception (e.g., log the error)
                throw new Exception("An error occurred while saving the SBCA Account Opening  details.", ex);
            }
        }
    }
}
