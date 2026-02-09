using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
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

            if (!string.IsNullOrWhiteSpace(custId))
                customerModel = await GetDetails(custId, customerModel);

            return customerModel;
        }

        private async Task<CustomerModel> GetDetails(string custid, CustomerModel customerModel)
        {
            string mainstr = string.Empty, memberId = string.Empty;

            string[] arr = custid.Split('|');

            if (arr.Length != 0)
                customerModel.CustomerId = arr[0];

            DataTable rs = null!;

            if (arr[1] == "Member")
            {
                DataTable rsMem = await _databaseFactory.SingleRecordSet("sharesmst", "NAME", "ACCNO='" + custid.Split("|")[0] +
                    "' AND glcode='101010' AND status='R' ");

                if (rsMem.Rows.Count > 0)
                    mainstr = "MemberName" + "|" + rsMem.Rows[0].ItemArray[0];
                else
                    mainstr = "MemberName|Norecords";
            }
            else
            {
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
                            customerModel.Personal_DOB = Conversions.ToDateTime(rs.Rows[0].ItemArray[4]);
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
                                    DOB = Conversions.ToDateTime(row.ItemArray[1]),
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
                            mainstr = "Invalid Customer Id..";
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
                            mainstr = "Invalid Customer Id..";
                    }
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

            return customerModel;
        }

        public async Task<string> SaveCustomer(ISession session, CustomerModel customerModel, List<KYC> kycDocuments, string status = "")
        {
            try
            {
                string appdate = session.GetString(SessionConstants.ApplicationDate);
                string userid = session.GetString(SessionConstants.UserId);
                string machineid = session.GetString(SessionConstants.MachineId);

                string globalcode = customerModel.IsGlobalCustomer ? "Y" : "N";
                string strsmsyn = customerModel.SMS_YesNo ? "Y" : "N";
                string strmobaccyn = customerModel.MobileAccess_YesNo ? "Y" : "N";
                string strpan206aayn = customerModel.Personal_PANAAYN ? "Y" : "N";
                string strpan206abyn = customerModel.Personal_PANABYN ? "Y" : "N";
                string kycidpanno = string.IsNullOrWhiteSpace(customerModel.Personal_PANNo) ? "" : "2";
                string kycidadhar = string.IsNullOrWhiteSpace(customerModel.Personal_Aadhaar) ? "" : "12";
                string kycidgstin = string.IsNullOrWhiteSpace(customerModel.Personal_GSTIN) ? "" : "13";
                string minor = customerModel.Personal_Minor ? "Y" : "N";
                string memId = customerModel.MembershipNumber!;

                string Adharid = customerModel.Personal_Aadhaar!;
                string panno = customerModel.Personal_PANNo!;
                string ckycenrolldate = string.IsNullOrWhiteSpace(customerModel.Personal_CKYCEnrollDate) ?
                    session.GetString(SessionConstants.ApplicationDate) : customerModel.Personal_CKYCEnrollDate;
                string ckycid = customerModel.Personal_CKYCID!;
                DateTime dob = (DateTime)customerModel.Personal_DOB!;
                string riskcategory = customerModel.RiskCategory!;
                string brcode = Conversions.ToString(session.GetString(SessionConstants.BranchCode));
                string crcode = Conversions.ToString(session.GetString(SessionConstants.CurrencyCode));

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
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidadhar + "','" + Adharid.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    if (!string.IsNullOrWhiteSpace(kycidgstin))
                    {
                        kycdtlsvals = "'" + brcode + "','" + customerid + "','" + kycidgstin + "','" + customerModel.Personal_GSTIN?.ToUpper() + "','R','" + userid + "','" + machineid + "',sysdate";
                        kycdtlsvals1 = kycdtlsvals1 + "|" + kycdtlsvals;
                    }

                    kycdtlsvals1 = kycdtlsvals1.Substring(1);
                }

                if (!string.IsNullOrWhiteSpace(ckycenrolldate))
                {
                    CKYCEnrollmentDateModel result = await _generalValidationService.GetCKYCEnrollDetails(ckycenrolldate);

                    CKYCENROLLDTLStabname = "CKYCENROLLDTLS";
                    CKYCENROLLDTLScols = "SNO, CUSTOMERID, CKYCID, ENROLLDT, DUEDATE, STATUS, REMARKS, APPLICATIONDATE, USERID, MACHINEID, SYSTEMDATE";
                    CKYCENROLLDTLSvals = "'" + result.CKYCSno + "','" + customerid + "','" + ckycid.ToUpper() + "','" + ckycenrolldate + "','" + result.DueDate +
                        "','N','New Enrollment','" + appdate + "','" + userid + "','" + machineid + "',sysdate";
                }

                if (customerModel.IsMailingSameAsPermanent)
                {
                    //           custfields = custfields & ",PMTADDRESS1,PMTADDRESS2,PMTADDRESS3,PMTADDRESS4,PMTADDRESS5"
                    //           custvals = custvals & ",'" & Request.Form("txtAddress1") & "','" & Request.Form("txtAddress2") & "'," & _
                    //                                 "'" & Request.Form("txtAddress3") & "','" & Request.Form("txtAddress4") & "'," & _
                    //                                 "'" & Request.Form("txtAddress5") & "'"
                }

                string tableName = "GENCUSTINFOMST";
                string custFields = "name,fathername,CUSTSEX,mailaddress1,mailaddress2,mailaddress3,mailaddress4,mailaddress5,custemail,phone1,phone2,phone3,custmobile," +
                    "custfax,custdob,custminoryn,customertype,branchcode,currencycode,PANNO,GSTIN, CKYCID,CUSTOCCUPATION, CUSTMONTHLYINCOME,smsyn,userid,machineid," +
                    "applicationdate,systemdate,GlobalYn,customerid,riskcategory,CUSTMEMBERSHIPNO,AADHARUID,SALUTATIONID,RELATIONID,RELIGIONID,KYCID,mobaccessyn," +
                    "PAN206AAYN,PAN206ABYN";

                string custValues = "'" + customerModel.CustomerName + "','" + customerModel.Personal_RelationName + "','" + customerModel.Personal_Gender + "','" +
                    customerModel.Mailing_FlatNo + "','" + customerModel.Mailing_Building + "','" + customerModel.Mailing_Area + "','" + customerModel.Mailing_City + "','" +
                    customerModel.Mailing_Pincode + "','" + customerModel.Personal_Email + "','" + customerModel.Mailing_Phone + "','" + customerModel.Permanent_Phone + "','" +
                    customerModel.Office_Phone + "','" + customerModel.Personal_Mobile + "','" + fax + "','" + customerModel.Personal_DOB + "'," + minor + "," +
                    customerModel.CustomerType + ",'" + brcode + "','" + crcode + "','" + customerModel.Personal_PANNo + "','" + kycidgstin + "','" +
                    customerModel.Personal_CKYCID + "'," + customerModel.Occupation_Id + "," + customerModel.Occupation_Income + ",'" + strsmsyn + "','" + userid +
                    "','" + machineid + "','" + appdate + "',sysdate,'" + globalcode + "','" + customerModel.CustomerId + "','" + customerModel.RiskCategory + "', '" + memId +
                    "','" + kycidadhar + "'," + customerModel.Salutation + "," + customerModel.Relation_Type + "," + "" + customerModel.Personal_Religion +
                    ",'" + kycidpanno + "','" + strmobaccyn + "','" + strpan206aayn + "','" + strpan206abyn + "'";

                string[,] arrtrans = null!;
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

                if (!string.IsNullOrEmpty(ckycenrolldate))
                {
                    arrcnt++;
                    arrtrans[arrcnt, 0] = "I";
                    arrtrans[arrcnt, 1] = CKYCENROLLDTLStabname;
                    arrtrans[arrcnt, 2] = CKYCENROLLDTLScols;
                    arrtrans[arrcnt, 3] = CKYCENROLLDTLSvals;
                    arrtrans[arrcnt, 4] = "";
                }

                return await _databaseFactory.ProcessDataTransactions(arrtrans);


                //if (strMessage.Equals("Transaction Sucessful."))
                //{
                //    //main = codestr(4)
                //    // Response.Redirect("newcustomer.aspx?record=" & customerid & "|" & name & "|" & brcode & "|" & crcode & "|" & codestr(2) & "|" & codestr(3) & "|" & main & "|" & custtype & "|" & custdesc & "|" & dob & "|" & minor & "|" & riskcategory)
                //}
                //else
                //    // Response.Redirect("newcustomer.aspx?record=" & "GENCUSTINFOMST: " + strMessage);
            }
            catch (Exception ex)
            {
                // Handle exception (e.g., log the error)
                throw new Exception("An error occurred while saving the customer details.", ex);
            }
        }

        public async Task<string> GetCustomerListByName(string name)
        {
            return await _nameSearchService.GetCustomerListByName(name);
        }
    }
}
