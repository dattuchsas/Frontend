using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Data;

namespace Banking.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly ICommonService _commonService;
        private readonly INameSearchService _nameSearchService;
        private readonly IGeneralValidationService _generalValidationService;

        public CustomerService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _commonService = new CommonService(databaseSettings);
            _nameSearchService = new NameSearchService(databaseSettings);
            _generalValidationService = new GeneralValidationService(databaseSettings);
        }

        public async Task<CustomerModel> GetCustomerDetails(ISession session, string custId = "")
        {
            var customerModel = new CustomerModel();

            customerModel.BranchList = await _commonService.GetBranchList();
            customerModel.SalutationList = await _commonService.GetSalutationList();
            customerModel.CustomerTypeList = await _commonService.GetCategoryList("CustType|Cust");
            customerModel.RiskCategoryList = _commonService.GetRiskCategoryList();

            customerModel.Personal_RelationList = await _commonService.GetRelationList();
            customerModel.Personal_MaritalStatusList = _commonService.GetMaritalStatusList();
            customerModel.Personal_GenderList = _commonService.GetGenderList();
            customerModel.Personal_ReligionList = await _commonService.GetReligionList();

            customerModel.KYCTypeList = await _commonService.GetKYCList();

            customerModel.Relation_List = await _commonService.GetRelationList();

            customerModel.Occupation_List = await _commonService.GetOccupationList();
            customerModel.Occupation_IncomeList = await _commonService.GetIncomeList();
            customerModel.Occupation_EducationList = await _commonService.GetQualificationList();

            customerModel.Branch = session.GetString(SessionConstants.BranchCode);
            customerModel.ApplicationDate = session.GetString(SessionConstants.ApplicationDate);

            customerModel.Personal_DOB = DateTime.Now.ToString("dd-MMM-yyyy");
            customerModel.Personal_CKYCEnrollDate = DateTime.Now.ToString("dd-MMM-yyyy");
            customerModel.Relation_DOB = DateTime.Now.ToString("dd-MMM-yyyy");

            if (!string.IsNullOrWhiteSpace(custId))
                customerModel = await GetDetails(custId, customerModel);

            return customerModel;
        }

        public async Task<string> GetMemberNameById(string memberId)
        {
            DataTable rsMem = await _databaseFactory.SingleRecordSet("sharesmst", "NAME", "ACCNO='" + memberId.Split("|")[0] +
                "' AND glcode='101010'");// AND status='R' ");

            if (rsMem.Rows.Count > 0)
                return "MemberName" + "|" + rsMem.Rows[0].ItemArray[0];
            else
                return "MemberName|Norecords";
        }

        private async Task<CustomerModel> GetDetails(string custid, CustomerModel customerModel)
        {
            string mainstr = string.Empty, memberId = string.Empty;

            string[] arr = custid.Split('|');

            if (arr.Length != 0)
                customerModel.CustomerId = arr[0];

            DataTable rs = null!;

            if (custid.Length > 0)
            {
                string[] k = custid.Split("|");

                if (k.Length - 1 > 0)
                {
                    string listfields = "name,panno,customertype,custmembershipno,to_char(custdob,'dd-Mon-yyyy'),custemail,custfax,custmobile,custminoryn," +
                        "custmaritalstatus,custsex,custoccupation,custqualification,custmonthlyincome,phone1,phone2,phone3,mailaddress1,mailaddress2," +
                        "mailaddress3,mailaddress4,mailaddress5,pmtaddress1,pmtaddress2,pmtaddress3,pmtaddress4,pmtaddress5,offaddress1,offaddress2," +
                        "offaddress3,offaddress4,offaddress5,fathername,riskcategory,AADHARUID,SALUTATIONID, RELATIONID, RELIGIONID, KYCID,GSTIN, CKYCID," +
                        "smsyn,mobaccessyn,PAN206AAYN, PAN206ABYN";

                    rs = await _databaseFactory.SingleRecordSet("Gencustinfomst", listfields, "customerid='" + k[0] + "' " + k[2] + "");

                    if (rs.Rows.Count > 0)
                    {
                        customerModel.Salutation = Conversions.ToString(rs.Rows[0].ItemArray[35]);
                        customerModel.CustomerName = Conversions.ToString(rs.Rows[0].ItemArray[0]);
                        customerModel.CustomerType = Conversions.ToString(rs.Rows[0].ItemArray[2]);
                        customerModel.MemberId = string.IsNullOrWhiteSpace(Conversions.ToString(rs.Rows[0].ItemArray[3])) ? false : true;
                        customerModel.MembershipNumber = Conversions.ToString(rs.Rows[0].ItemArray[3]);
                        customerModel.RiskCategory = Conversions.ToString(rs.Rows[0].ItemArray[33]);
                        customerModel.SMS_YesNo = Conversions.ToString(rs.Rows[0].ItemArray[41]).Equals("Y") ? true : false;
                        customerModel.MobileAccess_YesNo = Conversions.ToString(rs.Rows[0].ItemArray[42]).Equals("Y") ? true : false;

                        customerModel.Personal_Relation = Conversions.ToString(rs.Rows[0].ItemArray[36]);
                        customerModel.Personal_RelationName = Conversions.ToString(rs.Rows[0].ItemArray[32]);
                        customerModel.Personal_MaritalStatus = Conversions.ToString(rs.Rows[0].ItemArray[9]);
                        customerModel.Personal_Gender = Conversions.ToString(rs.Rows[0].ItemArray[10]);
                        customerModel.Personal_DOB = Conversions.ToString(rs.Rows[0].ItemArray[4]);
                        customerModel.Personal_Minor = Conversions.ToString(rs.Rows[0].ItemArray[8]).Equals("Y") ? true : false;
                        customerModel.Personal_Religion = Conversions.ToString(rs.Rows[0].ItemArray[37]);
                        customerModel.Personal_Mobile = Conversions.ToString(rs.Rows[0].ItemArray[7]);
                        customerModel.Personal_PANNo = Conversions.ToString(rs.Rows[0].ItemArray[1]);
                        customerModel.Personal_PANAAYN = Conversions.ToString(rs.Rows[0].ItemArray[43]).Equals("Y") ? true : false;
                        customerModel.Personal_PANABYN = Conversions.ToString(rs.Rows[0].ItemArray[44]).Equals("Y") ? true : false;
                        customerModel.Personal_Email = Conversions.ToString(rs.Rows[0].ItemArray[5]);
                        customerModel.Personal_Aadhaar = Conversions.ToString(rs.Rows[0].ItemArray[34]);
                        customerModel.Personal_CKYCID = Conversions.ToString(rs.Rows[0].ItemArray[40]);
                        customerModel.Personal_GSTIN = Conversions.ToString(rs.Rows[0].ItemArray[39]);

                        customerModel.Mailing_FlatNo = Conversions.ToString(rs.Rows[0].ItemArray[17]);
                        customerModel.Mailing_Building = Conversions.ToString(rs.Rows[0].ItemArray[18]);
                        customerModel.Mailing_Area = Conversions.ToString(rs.Rows[0].ItemArray[19]);
                        customerModel.Mailing_City = Conversions.ToString(rs.Rows[0].ItemArray[20]);
                        customerModel.Mailing_Pincode = Conversions.ToString(rs.Rows[0].ItemArray[21]);
                        customerModel.Mailing_Phone = Conversions.ToString(rs.Rows[0].ItemArray[14]);

                        customerModel.Permanent_FlatNo = Conversions.ToString(rs.Rows[0].ItemArray[22]);
                        customerModel.Permanent_Building = Conversions.ToString(rs.Rows[0].ItemArray[23]);
                        customerModel.Permanent_Area = Conversions.ToString(rs.Rows[0].ItemArray[24]);
                        customerModel.Permanent_City = Conversions.ToString(rs.Rows[0].ItemArray[25]);
                        customerModel.Permanent_Pincode = Conversions.ToString(rs.Rows[0].ItemArray[26]);
                        customerModel.Permanent_Phone = Conversions.ToString(rs.Rows[0].ItemArray[15]);

                        customerModel.Office_Company = Conversions.ToString(rs.Rows[0].ItemArray[27]);
                        customerModel.Office_Building = Conversions.ToString(rs.Rows[0].ItemArray[28]);
                        customerModel.Office_Area = Conversions.ToString(rs.Rows[0].ItemArray[29]);
                        customerModel.Office_City = Conversions.ToString(rs.Rows[0].ItemArray[30]);
                        customerModel.Office_Pincode = Conversions.ToString(rs.Rows[0].ItemArray[31]);
                        customerModel.Office_Phone = Conversions.ToString(rs.Rows[0].ItemArray[16]);

                        // Process KYC List
                        customerModel.KYCType = Conversions.ToString(rs.Rows[0].ItemArray[38]);
                        string strsql1 = "SELECT d.KYCID,m.DESCRIPTION,d.DESCRIPTION FROM GENCUSTKYCDTLS d, GENKYCMST m WHERE d.KYCID = m.CODE AND d.CUSTOMERID= '" +
                            k[0] + "' order by d.KYCID";
                        DataTable rskycdtls = await _databaseFactory.ProcessQueryAsync(strsql1);

                        customerModel.KYCDetails = new List<KYC>();

                        foreach (DataRow row in rskycdtls.Rows)
                        {
                            KYC kyc = new KYC
                            {
                                KYCId = Conversions.ToString(row.ItemArray[0]),
                                KYCDescription = Conversions.ToString(row.ItemArray[1]),
                                KYCNo = Conversions.ToString(row.ItemArray[2])
                            };
                            customerModel.KYCDetails.Add(kyc);
                        }

                        // Relation Details
                        DataTable rs1 = await _databaseFactory.SingleRecordSet("gencustfamilydtls", "name,to_char(dob,'dd-Mon-yyyy'),relation", "customerid='" + k[0] + "'");

                        customerModel.RelationDetails = new List<Relation>();

                        foreach (DataRow row in rs1.Rows)
                        {
                            Relation relation = new Relation
                            {
                                Name = Conversions.ToString(row.ItemArray[0]),
                                DOB = Conversions.ToString(row.ItemArray[1]),
                                RelationType = Conversions.ToString(row.ItemArray[2])
                            };
                            customerModel.RelationDetails.Add(relation);
                        }

                        customerModel.Occupation_Id = Conversions.ToString(rs.Rows[0].ItemArray[11]);
                        customerModel.Occupation_Income = Conversions.ToString(rs.Rows[0].ItemArray[13]);
                        customerModel.Occupation_Educataion = Conversions.ToString(rs.Rows[0].ItemArray[12]);


                        //string code = Conversions.ToString(rs.Rows[0].ItemArray[2]);
                        //rs1 = await _databaseFactory.SingleRecordSet("gencategorymst", "narration", "categorycode=" + code);

                        //DataTable rsMem = await _databaseFactory.SingleRecordSet("sharesmst", "NAME", "ACCNO='" + customerModel.MemberId +
                        //"' AND glcode='101010' AND status='R'");
                    }
                    else
                    {
                        throw new Exception("Invalid Customer Id..");
                    }
                }
                else
                {
                    rs = await _databaseFactory.SingleRecordSet("gencustinfomst", "name,panno,mailaddress1,mailaddress2,mailaddress3,mailaddress4," +
                        "mailaddress5,custemail,phone1,phone2,phone3,custmobile,custfax,to_char(custdob,'dd-Mon-yyyy'),custminoryn,customertype,globalyn,riskcategory",
                        "customerid='" + custid + "'");

                    if (rs.Rows.Count > 0)
                    {
                        //string code = Conversions.ToString(rs.Rows[0].ItemArray[15]);

                        //DataTable rs1 = await _databaseFactory.SingleRecordSet("gencategorymst", "narration", "categorycode=" + code);

                        //DataTable rsMem = await _databaseFactory.SingleRecordSet("SHAREHOLDERINFOMST", "NAME", "CUSTOMERID='" + memberId + "'");
                    }
                    else
                        throw new Exception("Invalid Customer Id..");
                }
            }

            return customerModel;
        }

        public async Task<CustomerModel> NewCustomer(ISession session, string custId = "")
        {
            var customerModel = new CustomerModel();

            customerModel.BranchList = await _commonService.GetBranchList();
            customerModel.SalutationList = await _commonService.GetSalutationList();
            customerModel.CustomerTypeList = await _commonService.GetCategoryList("CustType|Cust");

            customerModel.RiskCategoryList = _commonService.GetRiskCategoryList();

            customerModel.Personal_RelationList = await _commonService.GetRelationList();
            customerModel.Personal_MaritalStatusList = _commonService.GetMaritalStatusList();
            customerModel.Personal_GenderList = _commonService.GetGenderList();
            customerModel.Personal_ReligionList = await _commonService.GetReligionList();

            customerModel.Occupation_List = await _commonService.GetOccupationList();
            customerModel.Occupation_IncomeList = await _commonService.GetIncomeList();

            customerModel.KYCTypeList = await _commonService.GetKYCList();

            customerModel.Branch = session.GetString(SessionConstants.BranchCode);
            customerModel.ApplicationDate = session.GetString(SessionConstants.ApplicationDate);

            customerModel.Personal_DOB = DateTime.Now.ToString("dd-MMM-yyyy");
            customerModel.Personal_CKYCEnrollDate = DateTime.Now.ToString("dd-MMM-yyyy");

            return customerModel;
        }

        public async Task<string> SaveCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments, string status = "")
        {
            try
            {
                // These three should not be null for customer insertion
                string appdate = session.GetString(SessionConstants.ApplicationDate);
                string userid = session.GetString(SessionConstants.UserId);
                string machineid = session.GetString(SessionConstants.MachineId);

                string globalcode = customerModel.IsGlobalCustomer ? "Y" : "N";
                string strsmsyn = customerModel.SMS_YesNo ? "Y" : "N";
                string strmobaccyn = customerModel.MobileAccess_YesNo ? "Y" : "N";
                string strpan206aayn = customerModel.Personal_PANAAYN ? "Y" : "N";
                string strpan206abyn = customerModel.Personal_PANABYN ? "Y" : "N";
                string kycidpanno = string.IsNullOrWhiteSpace(customerModel.Personal_PANNo) ? "0" : "2";
                string kycidadhar = string.IsNullOrWhiteSpace(customerModel.Personal_Aadhaar) ? "0" : customerModel.Personal_Aadhaar;
                string kycidgstin = string.IsNullOrWhiteSpace(customerModel.Personal_GSTIN) ? "0" : customerModel.Personal_GSTIN;
                string minor = customerModel.Personal_Minor ? "Y" : "N";
                string memId = customerModel.MembershipNumber!;

                string aadhaarId = customerModel.Personal_Aadhaar!;
                string panno = customerModel.Personal_PANNo!;
                string ckycenrolldate = string.IsNullOrWhiteSpace(customerModel.Personal_CKYCEnrollDate) ?
                    session.GetString(SessionConstants.ApplicationDate) : customerModel.Personal_CKYCEnrollDate;
                string ckycid = customerModel.Personal_CKYCID ?? "0";
                string dob = customerModel.Personal_DOB!;
                string riskcategory = customerModel.RiskCategory!;
                string brcode = Conversions.ToString(session.GetString(SessionConstants.BranchCode));
                string crcode = Conversions.ToString(session.GetString(SessionConstants.CurrencyCode));

                string occupationId = customerModel.Occupation_Id ?? "0"; 
                string income = customerModel.Occupation_Income ?? "0";
                string religion = customerModel.Personal_Religion ?? "0";

                string fax = "";
                DataTable rs = await _databaseFactory.SingleRecordSet("gencustinfomst", "NVL(MAX(SUBSTR(customerid,4,7)),0)cust", "");

                string newbrcode = brcode.PadLeft(3, '0')[..3];
                int nnum = Math.Max(0, 3 - brcode.Length);

                string customerid = Convert.IsDBNull(rs.Rows[0].ItemArray[0]) ? "0000000" : Conversions.ToString(rs.Rows[0].ItemArray[0]);
                customerid = Conversions.ToString(long.Parse(customerid.Trim()) + 1);
                customerid = (customerid.Trim().Length < 7) ? customerid.PadLeft(7, '0') : customerid.Substring(0, 7);
                customerid = newbrcode + customerid;

                string kycidtabname = string.Empty, kycidcols = string.Empty, kycdtlsvals1 = string.Empty;
                string CKYCENROLLDTLStabname = string.Empty, CKYCENROLLDTLScols = string.Empty, CKYCENROLLDTLSvals = string.Empty;

                if (kycDocuments.Count > 0)
                {
                    kycidtabname = "GENCUSTKYCDTLS";
                    kycidcols = "BRANCHCODE, CUSTOMERID, KYCID, DESCRIPTION, STATUS, USERID, MACHINEID, SYSTEMDATE";
                    string kycdtlsvals = string.Empty;

                    foreach (var kyc in kycDocuments)
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kyc.KYCId + "','" + kyc.KYCNo?.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidpanno))
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidpanno + "','" + panno.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidadhar))
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidadhar + "','" + aadhaarId.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidgstin))
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidgstin + "','" + customerModel.Personal_GSTIN?.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    kycdtlsvals1 = kycdtlsvals1.Substring(1);

                    foreach (var file in kycDocuments)
                    {
                        SaveFile(file.File, customerid, file.KYCNo);
                    }
                }

                if (!string.IsNullOrWhiteSpace(ckycid) && !string.IsNullOrWhiteSpace(ckycenrolldate))
                {
                    CKYCEnrollmentDateModel result = await _generalValidationService.GetCKYCEnrollDetails(ckycenrolldate);

                    CKYCENROLLDTLStabname = "CKYCENROLLDTLS";
                    CKYCENROLLDTLScols = "SNO, CUSTOMERID, CKYCID, ENROLLDT, DUEDATE, STATUS, REMARKS, APPLICATIONDATE, USERID, MACHINEID, SYSTEMDATE";
                    CKYCENROLLDTLSvals = "'" + result.CKYCSno + "','" + customerid + "','" + ckycid.ToUpper() + "',TO_DATE('" + ckycenrolldate + "', 'DD-MON-YYYY')," +
                        "TO_DATE('" + result.DueDate + "', 'DD-MON-YYYY'),'N','New Enrollment',TO_DATE('" + appdate + "', 'DD-MON-YYYY'),'" + userid + "','" + 
                        machineid + "',sysdate";
                }

                string tableName = "GENCUSTINFOMST";
                string custFields = "name,fathername,CUSTSEX,mailaddress1,mailaddress2,mailaddress3,mailaddress4,mailaddress5,custemail,phone1,phone2,phone3,custmobile," +
                    "custfax,custdob,custminoryn,customertype,branchcode,currencycode,PANNO,GSTIN, CKYCID,CUSTOCCUPATION, CUSTMONTHLYINCOME,smsyn,userid,machineid," +
                    "applicationdate,systemdate,GlobalYn,customerid,riskcategory,CUSTMEMBERSHIPNO,AADHARUID,SALUTATIONID,RELATIONID,RELIGIONID,KYCID,mobaccessyn," +
                    "PAN206AAYN,PAN206ABYN";

                string custValues = "'" + customerModel.CustomerName + "','" + customerModel.Personal_RelationName + "','" + customerModel.Personal_Gender + "','" +
                    customerModel.Mailing_FlatNo + "','" + customerModel.Mailing_Building + "','" + customerModel.Mailing_Area + "','" + customerModel.Mailing_City + "','" +
                    customerModel.Mailing_Pincode + "','" + customerModel.Personal_Email + "','" + 
                    (string.IsNullOrWhiteSpace(customerModel.Mailing_Phone) ? "0" : customerModel.Mailing_Phone) + "','" +
                    (string.IsNullOrWhiteSpace(customerModel.Permanent_Phone) ? "0" : customerModel.Permanent_Phone) + "','" +
                    (string.IsNullOrWhiteSpace(customerModel.Office_Phone) ? "0" : customerModel.Office_Phone) + "','" + customerModel.Personal_Mobile + "','" + fax + 
                    "',TO_DATE('" + customerModel.Personal_DOB + "', 'DD-MON-YYYY'),'" + minor + "','" + customerModel.CustomerType + "','" + brcode + "','" + crcode + "','" + 
                    customerModel.Personal_PANNo + "','" + kycidgstin + "','" + ckycid + "'," + occupationId + "," + income + ",'" + strsmsyn + "','" + 
                    userid + "','" + machineid + "',TO_DATE('" + appdate + "', 'DD-MON-YYYY'),sysdate,'" + globalcode + "','" + customerid + "','" + customerModel.RiskCategory + "', '" + memId + 
                    "'," + kycidadhar + "," + customerModel.Salutation + "," + customerModel.Personal_Relation + "," + religion + "," + kycidpanno + ",'" + strmobaccyn + 
                    "','" + strpan206aayn + "','" + strpan206abyn + "'";

                // custid, custtype, appdate, userid, machineid
                // 01-Jan-1988

                if (customerModel.IsMailingSameAsPermanent)
                {
                    custFields = custFields + ",PMTADDRESS1,PMTADDRESS2,PMTADDRESS3,PMTADDRESS4,PMTADDRESS5";
                    custValues = custValues + ",'" + customerModel.Mailing_FlatNo + "','" + customerModel.Mailing_Building + "','" + customerModel.Mailing_Area + "','" +
                        customerModel.Mailing_City + "','" + customerModel.Mailing_Pincode + "'";
                }

                string[,] arrtrans = new string[3, 5];
                int arrcnt = 0;

                arrtrans[arrcnt, 0] = "I";
                arrtrans[arrcnt, 1] = tableName;
                arrtrans[arrcnt, 2] = custFields;
                arrtrans[arrcnt, 3] = custValues;
                arrtrans[arrcnt, 4] = "";

                if (kycDocuments.Count > 0)
                {
                    arrcnt++;
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = kycidtabname;
                    arrtrans[arrcnt, 2] = kycidcols;
                    arrtrans[arrcnt, 3] = kycdtlsvals1;
                    arrtrans[arrcnt, 4] = "";
                }

                if (!string.IsNullOrWhiteSpace(ckycid) && !string.IsNullOrWhiteSpace(ckycenrolldate))
                {
                    arrcnt++;
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = CKYCENROLLDTLStabname;
                    arrtrans[arrcnt, 2] = CKYCENROLLDTLScols;
                    arrtrans[arrcnt, 3] = CKYCENROLLDTLSvals;
                    arrtrans[arrcnt, 4] = "";
                }

                Console.WriteLine(arrtrans);

                var output = await _databaseFactory.ProcessDataTransactions(arrtrans);

                return output;

                //if (strMessage.Equals("Transaction Sucessful."))
                //    Response.Redirect("newcustomer.aspx?record=" & customerid & "|" & name & "|" & brcode & "|" & crcode & "|" & codestr(2) & "|" & codestr(3) & "|" & main & "|" & custtype & "|" & custdesc & "|" & dob & "|" & minor & "|" & riskcategory)
                //else
                //    Response.Redirect("newcustomer.aspx?record=" & "GENCUSTINFOMST: " + strMessage);
            }
            catch (Exception ex)
            {
                // Handle exception (e.g., log the error)
                throw new Exception("An error occurred while saving the customer details.", ex);
            }
        }

        //public async Task SaveExistingCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments)
        //{
        //    //     Obj = SERVER.CreateObject("GeneralTransactions.DBTransactions")

        //    string obj, obj1, obj2, Strmsg, status, title, rs1, StrTabName, StrFldNames, cardvalues, rsTrn, rsTRes, objTrn, objTres, rsTab, objTab, rsStab, objStab;
        //    string cntMst, idx, strTable, iCnt, stFeld, stCond, deltrans, deltranskyc;

        //    //    kyciddtlsmain = Request.Form("hidkycid")
        //    //    kyciddtls = split(kyciddtlsmain, "|")
        //    //    appdate = session("applicationdate")
        //    //    name = Request.Form("txtCustname")
        //    //    userid = session("userid")
        //    //    custid = Request.Form("txtcustid")
        //    //    machineid = session("machineid")
        //    //    narration = Request.Form("txtnarration")
        //    //    famdtls = Request.Form("hidfamvals")
        //    //    mode = Request.Form("hidmode")
        //    //    custtype = Request.Form("txtCustType")
        //    //    brcode = Request.Form("txtBranchCode")
        //    //    panno = Request.Form("txtpan")
        //    //    cardvalues = Request.Form("hdata")
        //    //    fathername = Request.Form("txtfathername")
        //    //    riskcategory = Request.Form("slctRiskcat")

        //    //    aadhaarid = Request.Form("txtadharid")
        //    //    SALUTATIONID = Request.Form("slcsalutation")
        //    //    RELATIONID = Request.Form("slcrelation")
        //    //    RELIGIONID = Request.Form("slcreligion")

        //    //    gstin = Request.Form("txtgstin")
        //    //    ckycid = Request.Form("txtckycid")
        //    //    kycidpanno = Request.Form("hidpankycid")
        //    //    kycidadhar = Request.Form("hidadharkycid")
        //    //    kycidgstin = Request.Form("hidgstinkycid")
        //    //    KYCID = kycidpanno
        //    //    strsmsyn = Request.Form("hidsmsyn")
        //    //    strmobaccyn = Request.Form("hidmobaccyn")
        //    //    strpan206aayn = Request.Form("hdnpan206aayn")
        //    //    strpan206abyn = Request.Form("hdnpan206abyn")

        //    DataTable rs = await _databaseFactory.SingleRecordSet("gencustfamilydtls", "customerid", "customerid='" + customerModel.CustomerId + "'");

        //    if (rs.Rows.Count > 0)
        //        deltrans = "D";
        //    else
        //        deltrans = "X";

        //    rs = await _databaseFactory.SingleRecordSet("GENCUSTKYCDTLS", "customerid", "customerid='" + customerModel.CustomerId + "'");

        //    if (rs.Rows.Count > 0)
        //        deltranskyc = "D";
        //    else
        //        deltranskyc = "X";


        //    //    if len(famdtls) > 1 then
        //    //        famdtls = split(famdtls, "#")
        //    //        for i = 1 to ubound(famdtls)
        //    //            famvals = famvals & "|" & famdtls(i) & ",'" & userid & "','" & _
        //    //                machineid & "','" & appdate & "','" & custid & "'"
        //    //            trans = "I"
        //    //        next
        //    //        famvals = trim(mid(famvals, 2))
        //    //    else
        //    //                    trans = "X"
        //    //    end if

        //    //    code = Request.Form("txtcode")
        //    //    tabname = "genCUSTINFOMST"

        //    string custfields = "branchcode,name,customertype,custmembershipno,custdob,custemail,custfax,custmobile,custminoryn,custmaritalstatus,custsex," +
        //        "custoccupation,custqualification,custmonthlyincome,phone1,phone2,phone3,mailaddress1,mailaddress2,mailaddress3,mailaddress4,mailaddress5,pmtaddress1," +
        //        "pmtaddress2,pmtaddress3,pmtaddress4,pmtaddress5,offaddress1,offaddress2,offaddress3,offaddress4,offaddress5,userid,machineid,applicationdate,systemdate," +
        //        "customerid,PANNO,fathername,riskcategory,AADHARUID, SALUTATIONID, RELATIONID, RELIGIONID, KYCID,GSTIN, CKYCID,smsyn,mobaccessyn, PAN206AAYN, PAN206ABYN";



        //    //    if kyciddtlsmain<> "" then
        //    //    kycidtabname = "GENCUSTKYCDTLS"

        //    //    kycidcols = "BRANCHCODE, CUSTOMERID, KYCID, DESCRIPTION, STATUS, USERID, MACHINEID, SYSTEMDATE"

        //    //    kycdtlsvals1 = ""

        //    //    kycdtlsvals = ""

        //    //    for icnt = 0 to ubound(kyciddtls)

        //    //    kyciddtls1 = split(kyciddtls(icnt), ",")

        //    //    kycdtlsvals = "'" & brcode & "','" & custid & "','" & kyciddtls1(0) & "','" & UCase(kyciddtls1(1)) & "','R','" & userid & "','" & machineid & "',sysdate"

        //    //    kycdtlsvals1 = kycdtlsvals1 & "|" & kycdtlsvals

        //    //    next icnt


        //    //    '' Panno

        //    //    kycidpannoexists = "NO"

        //    //    for icnt = 0 to ubound(kyciddtls)

        //    //    kyciddtls1 = split(kyciddtls(icnt), ",")

        //    //    if kycidpanno = kyciddtls1(0) then
        //    //    kycidpannoexists = "YES"

        //    //    exit for

        //    //    end if

        //    //    next icnt


        //    //    if kycidpanno<> "" then

        //    //    if kycidpannoexists = "YES" then

        //    //    else
        //    //                kycdtlsvals = "'" & brcode & "','" & custid & "','" & kycidpanno & "','" & UCase(panno) & "','R','" & userid & "','" & machineid & "',sysdate"

        //    //        kycdtlsvals1 = kycdtlsvals1 & "|" & kycdtlsvals

        //    //    end if

        //    //    end if


        //    //    '' Aadhar
        //    //    kycidadharexists = "NO"

        //    //    for icnt = 0 to ubound(kyciddtls)

        //    //    kyciddtls1 = split(kyciddtls(icnt), ",")

        //    //    if kycidadhar = kyciddtls1(0) then
        //    //        kycidadharexists = "YES"

        //    //            exit for

        //    //    end if

        //    //    next icnt

        //    //    if kycidadhar<>"" then

        //    //    if kycidadharexists = "YES" then

        //    //    else
        //    //                kycdtlsvals = "'" & brcode & "','" & custid & "','" & kycidadhar & "','" & UCase(aadhaarid) & "','R','" & userid & "','" & machineid & "',sysdate"

        //    //        kycdtlsvals1 = kycdtlsvals1 & "|" & kycdtlsvals

        //    //    end if

        //    //    end if


        //    //    '' GSTIN
        //    //    kycidgstinexists = "NO"

        //    //    for icnt = 0 to ubound(kyciddtls)

        //    //    kyciddtls1 = split(kyciddtls(icnt), ",")

        //    //    if kycidgstin = kyciddtls1(0) then
        //    //        kycidgstinexists = "YES"

        //    //            exit for

        //    //    end if

        //    //    next icnt


        //    //    if kycidgstin<>"" then

        //    //    if kycidgstinexists = "YES" then

        //    //    else
        //    //                kycdtlsvals = "'" & brcode & "','" & custid & "','" & kycidgstin & "','" & UCase(gstin) & "','R','" & userid & "','" & machineid & "',sysdate"

        //    //        kycdtlsvals1 = kycdtlsvals1 & "|" & kycdtlsvals

        //    //    end if

        //    //    end if


        //    //    kycdtlsvals1 = Mid(kycdtlsvals1, 2)

        //    //    transkyc = "I"

        //    //    else
        //    //                    transkyc = "X"

        //    //    end if


        //    //    if mode = "New" then
        //    //    Redim arrtrans(3, 4)

        //    //        transtat = "I"

        //    //        custvals = trim(ucase(Request.Form("hidcustvals"))) & ",'" & userid & "','" & _

        //    //        machineid & "','" & appdate & "',sysdate,'" & custid & "','" & panno & "','" & fathername & "','" & riskcategory & "'" & _

        //    //                     ",'" & aadhaarid & "','" & SALUTATIONID & "','" & RELATIONID & "','" & RELIGIONID & "','" & KYCID & "','" & gstin & "','" & ckycid & "','" & strsmsyn & "','" & strmobaccyn & "','" & strpan206aayn & "','" & strpan206abyn & "'"


        //    //            arrtrans(0, 0) = transtat

        //    //            arrtrans(0, 1) = tabname

        //    //            arrtrans(0, 2) = custfields

        //    //            arrtrans(0, 3) = custvals

        //    //            arrtrans(0, 4) = ""


        //    //            arrtrans(1, 0) = transtat

        //    //            arrtrans(1, 1) = "Gencustfamilydtls"

        //    //            arrtrans(1, 2) = ""

        //    //            arrtrans(1, 3) = ""

        //    //            arrtrans(1, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(2, 0) = transtat

        //    //            arrtrans(2, 1) = "Gencustfamilydtls"

        //    //            arrtrans(2, 2) = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid"

        //    //            arrtrans(2, 3) = famvals

        //    //            arrtrans(2, 4) = ""


        //    //          if kyciddtlsmain<> "" then


        //    //            arrtrans(3, 0) = transtat

        //    //            arrtrans(3, 1) = kycidtabname

        //    //            arrtrans(3, 2) = kycidcols

        //    //            arrtrans(3, 3) = kycdtlsvals1

        //    //            arrtrans(3, 4) = ""

        //    //        end if


        //    //    elseif mode = "Modify" then
        //    //    custvals = trim(ucase(Request.Form("hidcustvals"))) & ",'" & userid & "','" & _

        //    //        machineid & "','" & appdate & "',sysdate,'" & custid & "','" & panno & "','" & fathername & "','" & riskcategory & "'" & _

        //    //                  ",'" & aadhaarid & "','" & SALUTATIONID & "','" & RELATIONID & "','" & RELIGIONID & "','" & KYCID & "','" & gstin & "','" & ckycid & "','" & strsmsyn & "','" & strmobaccyn & "','" & strpan206aayn & "','" & strpan206abyn & "'"


        //    //    if cardvalues<>"" then
        //    //        Redim arrtrans(6, 4)

        //    //            StrTabName = "CARDCUSTOMERDTLS"


        //    //            StrFldNames = "BRANCHCODE,CUSTOMERID,NAME,CARDTYPE,CARDNO,CARDCATEGORYTYPE,CARDSCOPETYPE," & _

        //    //            "CARDSPONSERTYPE,CURRENCYCODE,CARDLIMIT,CASHLIMIT,ISSUEDATE,VALIDFROMDATE," & _
        //    //            "VALIDUPTODATE,MAINCARDNO,STATUS,TRANSTATUS," & _

        //    //            "APPLICATIONDATE,USERID,MACHINEID,SYSTEMDATE"


        //    //            arrtrans(0, 0) = "I"

        //    //            arrtrans(0, 1) = StrTabName

        //    //            arrtrans(0, 2) = StrFldNames

        //    //            arrtrans(0, 3) = left(cardvalues, cdbl(len(cardvalues) - 1))

        //    //            arrtrans(0, 4) = ""


        //    //            arrtrans(1, 0) = transtat

        //    //            arrtrans(1, 1) = tabname

        //    //            arrtrans(1, 2) = custfields

        //    //            arrtrans(1, 3) = custvals

        //    //            arrtrans(1, 4) = ""


        //    //            arrtrans(2, 0) = deltrans

        //    //            arrtrans(2, 1) = "Gencustfamilydtls"

        //    //            arrtrans(2, 2) = ""

        //    //            arrtrans(2, 3) = ""

        //    //            arrtrans(2, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(3, 0) = trans

        //    //            arrtrans(3, 1) = "Gencustfamilydtls"

        //    //            arrtrans(3, 2) = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid"

        //    //            arrtrans(3, 3) = famvals

        //    //            arrtrans(3, 4) = ""


        //    //            arrtrans(4, 0) = deltranskyc

        //    //            arrtrans(4, 1) = kycidtabname

        //    //            arrtrans(4, 2) = ""

        //    //            arrtrans(4, 3) = ""

        //    //            arrtrans(4, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(5, 0) = transkyc

        //    //            arrtrans(5, 1) = kycidtabname

        //    //            arrtrans(5, 2) = kycidcols

        //    //            arrtrans(5, 3) = kycdtlsvals1

        //    //            arrtrans(5, 4) = ""



        //    //    rs = obj1.singlerecordset("GENMODULEMST", "MASTERTABLE", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM') ")

        //    //    if not rs.EOF and not rs.BOF then

        //    //        idx = 6

        //    //        do until rs.EOF

        //    //        rstname = rs(0).value

        //    //        rs1 = obj2.singlerecordset(rstname, "customerid", "customerid='" & custid & "'")

        //    //        if not rs1.EOF and not rs1.BOF then

        //    //            arrtrans(idx, 0) = "U"

        //    //            arrtrans(idx, 1) = rs(0).value

        //    //            arrtrans(idx, 2) = "NAME,USERID,SYSTEMDATE"

        //    //            arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //            arrtrans(idx, 4) = "branchcode='" & brcode & "' and customerid='" & custid & "'"

        //    //        end if

        //    //        idx = idx + 1

        //    //        rs.MoveNext
        //    //        loop

        //    //    end if


        //    //    'rsTrn,rsTRes,objTrn,objTres

        //    //    rsTrn = objTrn.singlerecordset("GENMODULEMST", "trandaytable", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM')")

        //    //        if not rsTrn.EOF and not rsTrn.BOF then

        //    //            do until rsTrn.EOF

        //    //            rstname = rsTrn(0).value

        //    //            rsTRes = objTres.singlerecordset(rstname, "customerid", "customerid='" & custid & "'")

        //    //                if not rsTRes.EOF and not rsTRes.BOF then

        //    //                    arrtrans(idx, 0) = "U"

        //    //                    arrtrans(idx, 1) = rsTrn(0).value

        //    //                    arrtrans(idx, 2) = "NAME,USERID,SYSTEMDATE"

        //    //                    arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //                    arrtrans(idx, 4) = "customerid='" & custid & "'"


        //    //                    idx = idx + 1

        //    //                end if

        //    //            rsTrn.MoveNext

        //    //            loop
        //    //        end if


        //    //    strTable = "LOCKERMST~GENCUSTJOINTHOLDERMST~GENCUSTNOMINEEMST~GENCUSTGUARDIANMST~GENCUSTINTRODUCERMST~GENSIGNOTRIESMST~GENDISPOSALDTLS~GENLIMITLNK~GENGUARANTORLNK~GENCUSTAADHARLNK~SIMST"


        //    //    strVal = strTable.Split("~")


        //    //        For iCnt = 0 To strVal.Length - 1


        //    //            If strVal(iCnt) = "GENCUSTJOINTHOLDERMST" Then
        //    //                stFeld = "JOINTHOLDERNAME,USERID,SYSTEMDATE"

        //    //                stCond = "JHCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "JHCUSTOMERID", "JHCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTNOMINEEMST" Then
        //    //                stFeld = "NOMINEENAME,USERID,SYSTEMDATE"

        //    //                stCond = "NOMCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "NOMCUSTOMERID", "NOMCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTGUARDIANMST" Then
        //    //                stFeld = "GUARDIANNAME,USERID,SYSTEMDATE"

        //    //                stCond = "GRDCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "GRDCUSTOMERID", "GRDCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTINTRODUCERMST" Then
        //    //                stFeld = "INTRNAME,USERID,SYSTEMDATE"

        //    //                stCond = "INTRCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "INTRCUSTOMERID", "INTRCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENGUARANTORLNK" Then
        //    //                stFeld = "GUARANTORNAME,USERID,SYSTEMDATE"

        //    //                stCond = "GUARANTORID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "GUARANTORID", "GUARANTORID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENLIMITLNK" Then
        //    //                stFeld = "CUSTOMERNAME,USERID,SYSTEMDATE"

        //    //                stCond = "customerid='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "customerid", "customerid='" & custid & "'")


        //    //            else

        //    //                stFeld = "NAME,USERID,SYSTEMDATE"

        //    //                stCond = "customerid='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "customerid", "customerid='" & custid & "'")


        //    //            end if


        //    //            if not rsTab.EOF and not rsTab.BOF then

        //    //                arrtrans(idx, 0) = "U"

        //    //                arrtrans(idx, 1) = strVal(iCnt)

        //    //                arrtrans(idx, 2) = stFeld

        //    //                arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //                arrtrans(idx, 4) = stCond


        //    //                idx = idx + 1

        //    //            end if

        //    //        Next


        //    //        rsStab = objStab.singlerecordset("SIMST", "CREDITCUSTOMERID", "CREDITCUSTOMERID='" & custid & "'")


        //    //        if not rsStab.EOF and not rsStab.BOF then

        //    //            arrtrans(idx, 0) = "U"

        //    //            arrtrans(idx, 1) = "SIMST"

        //    //            arrtrans(idx, 2) = "CREDITNAME,USERID,SYSTEMDATE"

        //    //            arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //            arrtrans(idx, 4) = "CREDITCUSTOMERID='" & custid & "'"


        //    //            idx = idx + 1

        //    //        end if


        //    //    else
        //    //                    rs = obj1.singlerecordset("GENMODULEMST", "count(*)", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM')")


        //    //      if not rs.EOF and not rs.BOF then
        //    //         cntMst = rs(0).value
        //    //         cntMst = cntMst + 4
        //    //      end if


        //    //         Redim arrtrans(cntMst, 4)

        //    //        transtat = "U"

        //    //        custvals = trim(ucase(Request.Form("hidcustvals"))) & "~'" & userid & "'~'" & _

        //    //        machineid & "'~'" & appdate & "'~sysdate~'" & custid & "'~'" & panno & "'~'" & fathername & "'~'" & riskcategory & "'~'" & _

        //    //                   aadhaarid & "'~'" & SALUTATIONID & "'~'" & RELATIONID & "'~'" & RELIGIONID & "'~'" & KYCID & "'~'" & gstin & "'~'" & ckycid & "'~'" & strsmsyn & "'~'" & strmobaccyn & "'~'" & strpan206aayn & "'~'" & strpan206abyn & "'"

        //    //        'response.write(custvals)

        //    //            arrtrans(0, 0) = transtat

        //    //            arrtrans(0, 1) = tabname

        //    //            arrtrans(0, 2) = custfields

        //    //            arrtrans(0, 3) = custvals

        //    //            arrtrans(0, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(1, 0) = deltrans

        //    //            arrtrans(1, 1) = "Gencustfamilydtls"

        //    //            arrtrans(1, 2) = ""

        //    //            arrtrans(1, 3) = ""

        //    //            arrtrans(1, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(2, 0) = trans

        //    //            arrtrans(2, 1) = "Gencustfamilydtls"

        //    //            arrtrans(2, 2) = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid"

        //    //            arrtrans(2, 3) = famvals

        //    //            arrtrans(2, 4) = ""


        //    //            arrtrans(3, 0) = deltranskyc

        //    //            arrtrans(3, 1) = kycidtabname

        //    //            arrtrans(3, 2) = ""

        //    //            arrtrans(3, 3) = ""

        //    //            arrtrans(3, 4) = "customerid='" & custid & "'"


        //    //            arrtrans(4, 0) = transkyc

        //    //            arrtrans(4, 1) = kycidtabname

        //    //            arrtrans(4, 2) = kycidcols

        //    //            arrtrans(4, 3) = kycdtlsvals1

        //    //            arrtrans(4, 4) = ""


        //    //        rs = obj1.singlerecordset("GENMODULEMST", "MASTERTABLE", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM') ")

        //    //        if not rs.EOF and not rs.BOF then

        //    //           idx = 5

        //    //           do until rs.EOF

        //    //           rstname = rs(0).value

        //    //           'if rstname <> "MISCMST" then

        //    //            rs1 = obj2.singlerecordset(rstname, "nvl(customerid,0)", "nvl(customerid,0)='" & custid & "'")

        //    //            if not rs1.EOF and not rs1.BOF then

        //    //              arrtrans(idx, 0) = "U"

        //    //              arrtrans(idx, 1) = rs(0).value

        //    //              arrtrans(idx, 2) = "NAME,USERID,SYSTEMDATE"

        //    //              arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //              arrtrans(idx, 4) = "customerid='" & custid & "'"

        //    //              idx = idx + 1



        //    //             end if

        //    //            'end if

        //    //            rs.MoveNext
        //    //         loop

        //    //        end if


        //    //        rsTrn = objTrn.singlerecordset("GENMODULEMST", "trandaytable", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM')")

        //    //        if not rsTrn.EOF and not rsTrn.BOF then

        //    //            do until rsTrn.EOF

        //    //                rstname = rsTrn(0).value

        //    //                rsTRes = objTres.singlerecordset(rstname, "customerid", "customerid='" & custid & "'")

        //    //                if not rsTRes.EOF and not rsTRes.BOF then

        //    //                    arrtrans(idx, 0) = "U"

        //    //                    arrtrans(idx, 1) = rsTrn(0).value

        //    //                    arrtrans(idx, 2) = "NAME,USERID,SYSTEMDATE"

        //    //                    arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //                    arrtrans(idx, 4) = "customerid='" & custid & "'"


        //    //                    idx = idx + 1

        //    //                end if

        //    //            rsTrn.MoveNext

        //    //            loop
        //    //        end if


        //    //        strTable = "LOCKERMST~GENCUSTJOINTHOLDERMST~GENCUSTNOMINEEMST~GENCUSTGUARDIANMST~GENCUSTINTRODUCERMST~GENSIGNOTRIESMST~GENDISPOSALDTLS~GENLIMITLNK~GENGUARANTORLNK~GENCUSTAADHARLNK~SIMST"


        //    //    strVal = strTable.Split("~")


        //    //        For iCnt = 0 To strVal.Length - 1


        //    //            If strVal(iCnt) = "GENCUSTJOINTHOLDERMST" Then
        //    //                stFeld = "JOINTHOLDERNAME,USERID,SYSTEMDATE"

        //    //                stCond = "JHCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "JHCUSTOMERID", "JHCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTNOMINEEMST" Then
        //    //                stFeld = "NOMINEENAME,USERID,SYSTEMDATE"

        //    //                stCond = "NOMCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "NOMCUSTOMERID", "NOMCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTGUARDIANMST" Then
        //    //                stFeld = "GUARDIANNAME,USERID,SYSTEMDATE"

        //    //                stCond = "GRDCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "GRDCUSTOMERID", "GRDCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENCUSTINTRODUCERMST" Then
        //    //                stFeld = "INTRNAME,USERID,SYSTEMDATE"

        //    //                stCond = "INTRCUSTOMERID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "INTRCUSTOMERID", "INTRCUSTOMERID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENGUARANTORLNK" Then
        //    //                stFeld = "GUARANTORNAME,USERID,SYSTEMDATE"

        //    //                stCond = "GUARANTORID='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "GUARANTORID", "GUARANTORID='" & custid & "'")


        //    //            elseIf strVal(iCnt) = "GENLIMITLNK" Then
        //    //                stFeld = "CUSTOMERNAME,USERID,SYSTEMDATE"

        //    //                stCond = "customerid='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "customerid", "customerid='" & custid & "'")


        //    //            else

        //    //                stFeld = "NAME,USERID,SYSTEMDATE"

        //    //                stCond = "customerid='" & custid & "'"

        //    //                rsTab = objTab.singlerecordset(strVal(iCnt), "customerid", "customerid='" & custid & "'")


        //    //            end if


        //    //            if not rsTab.EOF and not rsTab.BOF then

        //    //                arrtrans(idx, 0) = "U"

        //    //                arrtrans(idx, 1) = strVal(iCnt)

        //    //                arrtrans(idx, 2) = stFeld

        //    //                arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //                arrtrans(idx, 4) = stCond


        //    //                idx = idx + 1

        //    //            end if

        //    //        Next


        //    //        rsStab = objStab.singlerecordset("SIMST", "CREDITCUSTOMERID", "CREDITCUSTOMERID='" & custid & "'")


        //    //        if not rsStab.EOF and not rsStab.BOF then

        //    //            arrtrans(idx, 0) = "U"

        //    //            arrtrans(idx, 1) = "SIMST"

        //    //            arrtrans(idx, 2) = "CREDITNAME,USERID,SYSTEMDATE"

        //    //            arrtrans(idx, 3) = "'" & name & "'~'" & userid & "'~'" & appdate & "'"

        //    //            arrtrans(idx, 4) = "CREDITCUSTOMERID='" & custid & "'"


        //    //            idx = idx + 1

        //    //        end if


        //    //    end if

        //    //    elseif mode = "Delete" then
        //    //        Redim arrtrans(3, 4)

        //    //        transtat = "D"

        //    //            arrtrans(0, 0) = transtat

        //    //            arrtrans(0, 1) = tabname

        //    //            arrtrans(0, 2) = custfields

        //    //            arrtrans(0, 3) = custvals

        //    //            arrtrans(0, 4) = "customerid='" & custid & "'"

        //    //            arrtrans(1, 0) = deltrans

        //    //            arrtrans(1, 1) = "Gencustfamilydtls"

        //    //            arrtrans(1, 2) = ""

        //    //            arrtrans(1, 3) = ""

        //    //            arrtrans(1, 4) = "customerid='" & custid & "'"

        //    //            arrtrans(2, 0) = trans

        //    //            arrtrans(2, 1) = "Gencustfamilydtls"

        //    //            arrtrans(2, 2) = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid"

        //    //            arrtrans(2, 3) = famvals

        //    //            arrtrans(2, 4) = ""

        //    //            arrtrans(3, 0) = deltranskyc

        //    //            arrtrans(3, 1) = kycidtabname

        //    //            arrtrans(3, 2) = ""

        //    //            arrtrans(3, 3) = ""

        //    //            arrtrans(3, 4) = "customerid='" & custid & "'"
        //    //    end if

        //    //Strmsg = obj.DataTransactions(arrtrans)

        //    //response.Redirect("customer.aspx?record=" & strmsg)
        //}

        public async Task<string> GetCustomerListByName(string name)
        {
            return await _nameSearchService.GetCustomerListByName(name);
        }

        private void SaveFile(IFormFile? formFile, string customerId, string kycNo)
        {
            if (formFile != null)
            {
                string folderPath = @$"C:\BankingFiles\{customerId}";

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string filePath = string.Concat(folderPath, "\\", formFile.FileName);

                if (!File.Exists(filePath))
                {
                    formFile.CopyTo(new FileStream(filePath, FileMode.Create));
                }
            }
        }
    }
}
