using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Data;
using System.Reflection.PortableExecutable;

namespace Banking.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly ICommonService _commonService;
        private readonly ISearchService _nameSearchService;
        private readonly IGeneralValidationService _generalValidationService;

        public CustomerService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _commonService = new CommonService(databaseSettings);
            _nameSearchService = new SearchService(databaseSettings);
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

                            var item = customerModel.KYCTypeList?.FirstOrDefault(x => x.Value == kyc.KYCId);

                            customerModel.KYCTypeList?.Remove(item!);
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
                        customerModel.ErrorMessage = "Invalid Customer Id..";
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
                        customerModel.ErrorMessage = "Invalid Customer Id..";
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

        public async Task<string> SaveCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments)
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
                string ckycid = customerModel.Personal_CKYCID ?? "";
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

                string kycidcols = string.Empty, kycdtlsvals1 = string.Empty;
                string CKYCENROLLDTLScols = string.Empty, CKYCENROLLDTLSvals = string.Empty;

                if (kycDocuments.Count > 0)
                {
                    kycidcols = "BRANCHCODE, CUSTOMERID, KYCID, DESCRIPTION, STATUS, USERID, MACHINEID, SYSTEMDATE";
                    string kycdtlsvals = string.Empty;

                    foreach (var kyc in kycDocuments)
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kyc.KYCId + "','" + kyc.KYCNo?.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidpanno) && kycidpanno != "0")
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidpanno + "','" + panno.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidadhar) && kycidadhar != "0")
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidadhar + "','" + aadhaarId.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidgstin) && kycidgstin != "0")
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidgstin + "','" + customerModel.Personal_GSTIN?.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    kycdtlsvals1 = kycdtlsvals1.Substring(1);

                    foreach (var file in kycDocuments)
                        SaveFile(file.File, customerid, file.KYCNo);
                }

                if (!string.IsNullOrWhiteSpace(ckycid) && !string.IsNullOrWhiteSpace(ckycenrolldate))
                {
                    CKYCEnrollmentDateModel result = await _generalValidationService.GetCKYCEnrollDetails(ckycenrolldate);
                    CKYCENROLLDTLScols = "SNO, CUSTOMERID, CKYCID, ENROLLDT, DUEDATE, STATUS, REMARKS, APPLICATIONDATE, USERID, MACHINEID, SYSTEMDATE";
                    CKYCENROLLDTLSvals = "'" + result.CKYCSno + "','" + customerid + "','" + ckycid.ToUpper() + "',TO_DATE('" + ckycenrolldate + "', 'DD-MON-YYYY')," +
                        "TO_DATE('" + result.DueDate + "', 'DD-MON-YYYY'),'N','New Enrollment',TO_DATE('" + appdate + "', 'DD-MON-YYYY'),'" + userid + "','" + 
                        machineid + "',sysdate";
                }

                string custFields = "name,fathername,CUSTSEX,mailaddress1,mailaddress2,mailaddress3,mailaddress4,mailaddress5,custemail,phone1,phone2,phone3,custmobile," +
                    "custfax,custdob,custminoryn,customertype,branchcode,currencycode,PANNO,GSTIN, CKYCID,CUSTOCCUPATION, CUSTMONTHLYINCOME,smsyn,userid,machineid," +
                    "applicationdate,systemdate,GlobalYn,customerid,riskcategory,CUSTMEMBERSHIPNO,AADHARUID,SALUTATIONID,RELATIONID,RELIGIONID,KYCID,mobaccessyn," +
                    "PAN206AAYN,PAN206ABYN,custmaritalstatus";

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
                    "','" + strpan206aayn + "','" + strpan206abyn + "','" + customerModel.Personal_MaritalStatus + "'";

                // custid, custtype, appdate, userid, machineidb

                if (customerModel.IsMailingSameAsPermanent)
                {
                    custFields = custFields + ",PMTADDRESS1,PMTADDRESS2,PMTADDRESS3,PMTADDRESS4,PMTADDRESS5";
                    custValues = custValues + ",'" + customerModel.Mailing_FlatNo + "','" + customerModel.Mailing_Building + "','" + customerModel.Mailing_Area + "','" +
                        customerModel.Mailing_City + "','" + customerModel.Mailing_Pincode + "'";
                }

                string[,] arrtrans = new string[3, 5];
                int arrcnt = 0;

                // Customer Info Insertion
                arrtrans[arrcnt, 0] = "I";
                arrtrans[arrcnt, 1] = "GENCUSTINFOMST";
                arrtrans[arrcnt, 2] = custFields;
                arrtrans[arrcnt, 3] = custValues;
                arrtrans[arrcnt, 4] = "";

                // Customer KYC Details Insertion
                if (kycDocuments.Count > 0)
                {
                    arrcnt++;
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = "GENCUSTKYCDTLS";
                    arrtrans[arrcnt, 2] = kycidcols;
                    arrtrans[arrcnt, 3] = kycdtlsvals1;
                    arrtrans[arrcnt, 4] = "";
                }

                // CKYC Enrollment Details Insertion
                if (!string.IsNullOrWhiteSpace(ckycid) && !string.IsNullOrWhiteSpace(ckycenrolldate))
                {
                    arrcnt++;
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = "CKYCENROLLDTLS";
                    arrtrans[arrcnt, 2] = CKYCENROLLDTLScols;
                    arrtrans[arrcnt, 3] = CKYCENROLLDTLSvals;
                    arrtrans[arrcnt, 4] = "";
                }

                var output = await _databaseFactory.ProcessDataTransactions(arrtrans);

                if (output.Equals(BankingConstants.TransactionSuccessful))
                    return output + "|" + customerid;

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

        public async Task<string> UpdateCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments, List<Relation> relations)
        {
            int idx = 0, cntMst = 0;
            string strTable, stFeld, stCond;
            string deltrans = string.Empty, trans = string.Empty, famvals = "", famdtls, transtat = "";
            string kycidcols = "", kycdtlsvals1 = "", transkyc = string.Empty, deltranskyc = string.Empty;
            string[] strVal;

            string appdate = session.GetString(SessionConstants.ApplicationDate);
            string userid = session.GetString(SessionConstants.UserId);
            string machineid = session.GetString(SessionConstants.MachineId);

            string brcode = customerModel.Branch ?? session.GetString(SessionConstants.BranchCode);
            string name = customerModel.CustomerName ?? "";
            string custtype = customerModel.CustomerType ?? "0";
            string membershipno = customerModel.MembershipNumber ?? "";
            string dob = customerModel.Personal_DOB ?? "";
            string email = customerModel.Personal_Email ?? "";
            string mobile = customerModel.Personal_Mobile ?? "";

            string minor = customerModel.Personal_Minor ? "Y" : "N";
            string marital = customerModel.Personal_MaritalStatus!;
            string gender = customerModel.Personal_Gender!;
            string occupation = customerModel.Occupation_Id ?? "0";
            string qualification = customerModel.Occupation_Educataion ?? "0";
            string income = customerModel.Occupation_Income ?? "0";

            string panno = customerModel.Personal_PANNo ?? "";
            string fathername = customerModel.Personal_RelationName ?? "";
            string riskcategory = customerModel.RiskCategory ?? "0";
            string custid = customerModel.CustomerId ?? "";
            string aadhaarid = customerModel.Personal_Aadhaar ?? "";
            string SALUTATIONID = customerModel.Salutation ?? "0";
            string RELATIONID = customerModel.Personal_Relation ?? "0";
            string RELIGIONID = customerModel.Personal_Religion ?? "0";
            string gstin = customerModel.Personal_GSTIN ?? "";
            string ckycid = customerModel.Personal_CKYCID ?? "";
            // string narration = customerModel.CustomerTypeName ?? "";

            //    cardvalues = Request.Form("hdata")
            string kycidpanno = string.IsNullOrWhiteSpace(customerModel.Personal_PANNo) ? customerModel.Personal_PANNo! : "2";
            string kycidadhar = string.IsNullOrWhiteSpace(customerModel.Personal_Aadhaar) ? customerModel.Personal_Aadhaar! : "12";
            string kycidgstin = string.IsNullOrWhiteSpace(customerModel.Personal_GSTIN) ? customerModel.Personal_GSTIN! : "13";
            string KYCID = kycidpanno;
            string strsmsyn = customerModel.SMS_YesNo ? "Y" : "N";
            string strmobaccyn = customerModel.MobileAccess_YesNo ? "Y" : "N";
            string strpan206aayn = customerModel.Personal_PANAAYN ? "Y" : "N";
            string strpan206abyn = customerModel.Personal_PANABYN ? "Y" : "N";
            //string kyciddtlsmain = ""; // Request.Form("hidkycid")
            //string[] kyciddtls = kyciddtlsmain.Split("|");
            //famdtls = ""; // Request.Form("hidfamvals")

            //DataTable rs = await _databaseFactory.SingleRecordSet("GENCUSTFAMILYDTLS", "customerid", "customerid='" + customerModel.CustomerId + "'");

            //if (rs.Rows.Count > 0)
            //    deltrans = "D";
            //else
            //    deltrans = "X";

            //rs = await _databaseFactory.SingleRecordSet("GENCUSTKYCDTLS", "customerid", "customerid='" + customerModel.CustomerId + "'");

            //if (rs.Rows.Count > 0)
            //    deltranskyc = "D";
            //else
            //    deltranskyc = "X";

            if (relations.Count > 0)
            {
                for (int i = 0; i < relations.Count; i++)
                {
                    string famvalstring = "'" + brcode + "','" + relations[i].Name + "',TO_DATE('" + relations[i].DOB + "', 'DD-MON-YYYY'),'" + relations[i].RelationType + "'";
                    famvals += "|" + famvalstring + ",'" + userid + "','" + machineid + "',TO_DATE('" + appdate + "', 'DD-MON-YYYY'),'" + customerModel.CustomerId + "'";
                }

                trans = "I";

                // Remove first '|'
                if (!string.IsNullOrEmpty(famvals))
                    famvals = famvals.Substring(1).Trim();
            }

            if (kycDocuments.Count > 0)
            {
                string kycdtlsvals = string.Empty;
                kycidcols = "BRANCHCODE, CUSTOMERID, KYCID, DESCRIPTION, STATUS, USERID, MACHINEID, SYSTEMDATE";

                for (int i = 0; i < kycDocuments.Count; i++)
                {
                    kycdtlsvals = "'" + brcode + "','" + custid + "','" + kycDocuments[i].KYCId + "','" + kycDocuments[i].KYCDescription + "','R','" + userid + "','" + machineid + "',sysdate";
                    kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                }

                //// PAN No
                //string kycidpannoexists = "NO";
                //for (int i = 0; i < kyciddtls.Length - 1; i++)
                //{
                //    string[] kyciddtls1 = kyciddtls[i].Split(",");
                //    if (kycidpanno == kyciddtls1[0])
                //        kycidpannoexists = "YES";
                //    break;
                //}

                //if (!string.IsNullOrWhiteSpace(kycidpanno))
                //{
                //    if (kycidpannoexists != "YES")
                //    {
                //        kycdtlsvals = "'" + brcode + "','" + custid + "','" + kycidpanno + "','" + panno.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                //        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                //    }
                //}

                //// Aadhaar No
                //string kycidadharexists = "NO";

                //for (int i = 0; i < kyciddtls.Length - 1; i++)
                //{
                //    string[] kyciddtls1 = kyciddtls[i].Split(",");
                //    if (kycidadhar == kyciddtls1[0])
                //        kycidadharexists = "YES";
                //    break;
                //}

                //if (!string.IsNullOrWhiteSpace(kycidadhar))
                //{
                //    if (kycidadharexists != "YES")
                //    {
                //        kycdtlsvals = "'" + brcode + "','" + custid + "','" + kycidadhar + "','" + aadhaarid.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                //        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                //    }
                //}

                //// GSTIN
                //string kycidgstinexists = "NO";

                //for (int i = 0; i < kyciddtls.Length - 1; i++)
                //{
                //    string[] kyciddtls1 = kyciddtls[i].Split(",");
                //    if (kycidgstin == kyciddtls1[0])
                //        kycidgstinexists = "YES";
                //    break;
                //}

                //if (!string.IsNullOrWhiteSpace(kycidadhar))
                //{
                //    if (kycidgstinexists != "YES")
                //    {
                //        kycdtlsvals = "'" + brcode + "','" + custid + "','" + kycidgstin + "','" + gstin.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                //        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                //    }
                //}

                kycdtlsvals1 = kycdtlsvals1.Substring(1);
                transkyc = "I";
            }
            else
                transkyc = "X";

            // List<QueryModel> queryList = new List<QueryModel>();
            string[,] arrtrans = new string[3, 5];
            string custvals = "";

            DataTable rs = await _databaseFactory.SingleRecordSet("GENMODULEMST", "count(*)",
                "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM')");

            if (rs.Rows.Count > 0)
            {
                cntMst = Convert.ToInt32(rs.Rows[0].ItemArray[0]);
                cntMst = cntMst + 4;
            }

            arrtrans = new string[cntMst, 5];
            transtat = "U";

            string custfields = "branchcode,name,customertype,custmembershipno,custdob,custemail,custfax,custmobile,custminoryn,custmaritalstatus,custsex," +
                "custoccupation,custqualification,custmonthlyincome,phone1,phone2,phone3,mailaddress1,mailaddress2,mailaddress3,mailaddress4,mailaddress5,pmtaddress1," +
                "pmtaddress2,pmtaddress3,pmtaddress4,pmtaddress5,offaddress1,offaddress2,offaddress3,offaddress4,offaddress5,userid,machineid,applicationdate,systemdate," +
                "customerid,PANNO,fathername,riskcategory,AADHARUID, SALUTATIONID, RELATIONID, RELIGIONID, KYCID,GSTIN, CKYCID,smsyn,mobaccessyn, PAN206AAYN, PAN206ABYN";

            custvals = "'" + brcode + "'~'" + name + "'~'" + custtype + "'~'" + membershipno + "'~TO_DATE('" + dob + "', 'DD-MON-YYYY')~'" + email + "'~''~'" + mobile + 
                "'~'" + minor + "'~'" + marital + "'~'" + gender + "'~" + occupation + "~" + qualification + "~" + income + "~'" + customerModel.Mailing_Phone + "'~'" + 
                customerModel.Permanent_Phone + "'~'" + customerModel.Office_Phone + "'~'" + customerModel.Mailing_FlatNo + "'~'" + customerModel.Mailing_Building + "'~'" + 
                customerModel.Mailing_Area + "'~'" + customerModel.Mailing_City + "'~'" + customerModel.Mailing_Pincode + "'~'" + customerModel.Mailing_FlatNo + "'~'" + 
                customerModel.Mailing_Building + "'~'" + customerModel.Mailing_Area + "'~'" + customerModel.Mailing_City + "'~'" + customerModel.Mailing_Pincode + "'~'" +
                customerModel.Office_Company + "'~'" + customerModel.Office_Building + "'~'" + customerModel.Office_Area + "'~'" + customerModel.Office_City + "'~'" + 
                customerModel.Office_Pincode + "'~'" + userid + "'~'" + machineid + "'~TO_DATE('" + appdate + "', 'DD-MON-YYYY')~sysdate~'" + custid + "'~'" + panno + "'~'" + 
                fathername + "'~'" + riskcategory + "'~'" + aadhaarid + "'~'" + SALUTATIONID + "'~'" + RELATIONID + "'~'" + RELIGIONID + "'~'" + KYCID + "'~'" + gstin + "'~'" + 
                ckycid + "'~'" + strsmsyn + "'~'" + strmobaccyn + "'~'" + strpan206aayn + "'~'" + strpan206abyn + "'";

            arrtrans[0, 0] = transtat;
            arrtrans[0, 1] = "GENCUSTINFOMST";
            arrtrans[0, 2] = custfields;
            arrtrans[0, 3] = custvals;
            arrtrans[0, 4] = "customerid='" + customerModel.CustomerId + "'";

            arrtrans[1, 0] = trans;
            arrtrans[1, 1] = "GENCUSTFAMILYDTLS";
            arrtrans[1, 2] = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid";
            arrtrans[1, 3] = famvals;
            arrtrans[1, 4] = "";

            arrtrans[2, 0] = transkyc;
            arrtrans[2, 1] = "GENCUSTKYCDTLS";
            arrtrans[2, 2] = kycidcols;
            arrtrans[2, 3] = kycdtlsvals1;
            arrtrans[2, 4] = "";

            rs = await _databaseFactory.SingleRecordSet("GENMODULEMST", "MASTERTABLE", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM') ");

            if (rs.Rows.Count > 0)
            {
                idx = 3;
                foreach (DataRow row in rs.Rows)
                {
                    string rstname = Conversions.ToString(row.ItemArray[0]);
                    rs = await _databaseFactory.SingleRecordSet(rstname, "nvl(customerid,0)", "nvl(customerid,0)='" + customerModel.CustomerId + "'");
                    if (rs.Rows.Count > 0)
                    {
                        arrtrans[idx, 0] = "U";
                        arrtrans[idx, 1] = rstname;
                        arrtrans[idx, 2] = "NAME,USERID,SYSTEMDATE";
                        arrtrans[idx, 3] = "'" + customerModel.CustomerName + "'~'" + userid + "'~'" + appdate + "'";
                        arrtrans[idx, 4] = "customerid='" + customerModel.CustomerId + "'";
                        idx++;
                    }
                }
            }

            rs = await _databaseFactory.SingleRecordSet("GENMODULEMST", "trandaytable", "MASTERTABLE is not null and trandaytable is not null AND MODULEID NOT IN ('SCHOOL','ATM')");

            if (rs.Rows.Count > 0)
            {
                foreach (DataRow row in rs.Rows)
                {
                    string rstname = Conversions.ToString(row.ItemArray[0]);
                    DataTable rsTrn = await _databaseFactory.SingleRecordSet(rstname, "customerid", "customerid='" + customerModel.CustomerId + "'");
                    if (rsTrn.Rows.Count > 0)
                    {
                        arrtrans[idx, 0] = "U";
                        arrtrans[idx, 1] = rstname;
                        arrtrans[idx, 2] = "NAME,USERID,SYSTEMDATE";
                        arrtrans[idx, 3] = "'" + customerModel.CustomerName + "'~'" + userid + "'~'" + appdate + "'";
                        arrtrans[idx, 4] = "customerid='" + customerModel.CustomerId + "'";
                        idx++;
                    }
                }
            }

            strTable = "LOCKERMST~GENCUSTJOINTHOLDERMST~GENCUSTNOMINEEMST~GENCUSTGUARDIANMST~GENCUSTINTRODUCERMST~GENSIGNOTRIESMST~GENDISPOSALDTLS~GENLIMITLNK~" +
                "GENGUARANTORLNK~GENCUSTAADHARLNK~SIMST";
            strVal = strTable.Split("~");

            for (int i = 0; i < strVal.Length - 1; i++)
            {
                if (strVal[i] == "GENCUSTJOINTHOLDERMST")
                {
                    stFeld = "JOINTHOLDERNAME,USERID,SYSTEMDATE";
                    stCond = "JHCUSTOMERID='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "JHCUSTOMERID", "JHCUSTOMERID='" + customerModel.CustomerId + "'");
                }
                else if (strVal[i] == "GENCUSTNOMINEEMST")
                {
                    stFeld = "NOMINEENAME,USERID,SYSTEMDATE";
                    stCond = "NOMCUSTOMERID='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "NOMCUSTOMERID", "NOMCUSTOMERID='" + customerModel.CustomerId + "'");
                }
                else if (strVal[i] == "GENCUSTGUARDIANMST")
                {
                    stFeld = "GUARDIANNAME,USERID,SYSTEMDATE";
                    stCond = "GRDCUSTOMERID='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "GRDCUSTOMERID", "GRDCUSTOMERID='" + customerModel.CustomerId + "'");
                }
                else if (strVal[i] == "GENCUSTINTRODUCERMST")
                {
                    stFeld = "INTRNAME,USERID,SYSTEMDATE";
                    stCond = "INTRCUSTOMERID='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "INTRCUSTOMERID", "INTRCUSTOMERID='" + customerModel.CustomerId + "'");
                }
                else if (strVal[i] == "GENGUARANTORLNK")
                {
                    stFeld = "GUARANTORNAME,USERID,SYSTEMDATE";
                    stCond = "GUARANTORID='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "GUARANTORID", "GUARANTORID='" + customerModel.CustomerId + "'");
                }
                else if (strVal[i] == "GENLIMITLNK")
                {
                    stFeld = "CUSTOMERNAME,USERID,SYSTEMDATE";
                    stCond = "customerid='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "customerid", "customerid='" + customerModel.CustomerId + "'");
                }
                else
                {
                    stFeld = "NAME,USERID,SYSTEMDATE";
                    stCond = "customerid='" + customerModel.CustomerId + "'";
                    rs = await _databaseFactory.SingleRecordSet(strVal[i], "customerid", "customerid='" + customerModel.CustomerId + "'");
                }

                if (rs.Rows.Count > 0)
                {
                    arrtrans[idx, 0] = "U";
                    arrtrans[idx, 1] = strVal[i];
                    arrtrans[idx, 2] = stFeld;
                    arrtrans[idx, 3] = "'" + customerModel.CustomerName + "'~'" + userid + "'~'" + appdate + "'";
                    arrtrans[idx, 4] = stCond;
                    idx = idx + 1;
                }
            }

            rs = await _databaseFactory.SingleRecordSet("SIMST", "CREDITCUSTOMERID", "CREDITCUSTOMERID='" + customerModel.CustomerId + "'");

            if (rs.Rows.Count > 0)
            {
                arrtrans[idx, 0] = "U";
                arrtrans[idx, 1] = "SIMST";
                arrtrans[idx, 2] = "CREDITNAME,USERID,SYSTEMDATE";
                arrtrans[idx, 3] = "'" + customerModel.CustomerName + "'~'" + userid + "'~'" + appdate + "'";
                arrtrans[idx, 4] = "CREDITCUSTOMERID='" + customerModel.CustomerId + "'";
                idx = idx + 1;
            }

            #region New and Delete Customer Handling

            //if (mode == "New")
            //{
            //    transtat = "I";
            //    custvals = trim(ucase(Request.Form("hidcustvals"))) + ",'" + userid + "','" + machineid + "','" + appdate + "',sysdate,'" + customerModel.CustomerId + "','" +
            //        panno + "','" + fathername + "','" + riskcategory + "'" + ",'" + aadhaarid + "','" + SALUTATIONID + "','" + RELATIONID + "','" + RELIGIONID + "','" +
            //        KYCID + "','" + gstin + "','" + ckycid + "','" + strsmsyn + "','" + strmobaccyn + "','" + strpan206aayn + "','" + strpan206abyn + "'";

            //    arrtrans[0, 0] = transtat;
            //    arrtrans[0, 1] = tabname;
            //    arrtrans[0, 2] = custfields;
            //    arrtrans[0, 3] = custvals;
            //    arrtrans[0, 4] = "";

            //    arrtrans[1, 0] = transtat;
            //    arrtrans[1, 1] = "Gencustfamilydtls";
            //    arrtrans[1, 2] = "";
            //    arrtrans[1, 3] = "";
            //    arrtrans[1, 4] = "customerid='" + customerModel.CustomerId + "'";

            //    arrtrans[2, 0] = transtat;
            //    arrtrans[2, 1] = "Gencustfamilydtls";
            //    arrtrans[2, 2] = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid";
            //    arrtrans[2, 3] = famvals;
            //    arrtrans[2, 4] = "";

            //    if (!string.IsNullOrWhiteSpace(kyciddtlsmain))
            //    {
            //        arrtrans[3, 0] = transtat;
            //        arrtrans[3, 1] = "GENCUSTKYCDTLS";
            //        arrtrans[3, 2] = kycidcols;
            //        arrtrans[3, 3] = kycdtlsvals1;
            //        arrtrans[3, 4] = "";
            //    }
            //}
            //else if (mode == "Modify")
            //{
            //}
            //else if (mode == "Delete")
            //{
            //    arrtrans = new string[3, 5];

            //    transtat = "D";

            //    arrtrans[0, 0] = transtat;
            //    arrtrans[0, 1] = tabname;
            //    arrtrans[0, 2] = custfields;
            //    arrtrans[0, 3] = custvals;
            //    arrtrans[0, 4] = "customerid='" + customerModel.CustomerId + "'";

            //    arrtrans[1, 0] = deltrans;
            //    arrtrans[1, 1] = "Gencustfamilydtls";
            //    arrtrans[1, 2] = "";
            //    arrtrans[1, 3] = "";
            //    arrtrans[1, 4] = "customerid='" + customerModel.CustomerId + "'";

            //    arrtrans[2, 0] = trans;
            //    arrtrans[2, 1] = "Gencustfamilydtls";
            //    arrtrans[2, 2] = "branchcode,name,dob,relation,userid,machineid,applicationdate,Customerid";
            //    arrtrans[2, 3] = famvals;
            //    arrtrans[2, 4] = "";

            //    arrtrans[3, 0] = deltranskyc;
            //    arrtrans[3, 1] = "GENCUSTKYCDTLS";
            //    arrtrans[3, 2] = "";
            //    arrtrans[3, 3] = "";
            //    arrtrans[3, 4] = "customerid='" + customerModel.CustomerId + "'";
            //}

            #endregion

            var strMessage = await _databaseFactory.ProcessDataTransactions(arrtrans);

            return strMessage;
        }

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
