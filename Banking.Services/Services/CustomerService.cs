using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using System.Data;

namespace Banking.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IDatabaseService _databaseFactory;
        private readonly ICommonService _commonService;

        public CustomerService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
            _commonService = new CommonService(databaseSettings);
        }

        public async Task<CustomerModel> GetCustomerDetails(string custId = "")
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

                            // Relation Details
                            DataTable rs1 = await _databaseFactory.SingleRecordSet("gencustfamilydtls", "name,to_char(dob,'dd-Mon-yyyy'),relation", "customerid='" + k[0] + "'");

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
    }
}
