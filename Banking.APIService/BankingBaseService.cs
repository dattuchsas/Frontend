using System.Net;
using System.Net.Http.Headers;

namespace Banking.APIService
{
    /// <summary>
    /// Use as base to Call any Banking APIs from Banking UI for any service and event triggering
    /// </summary>
    public class BankingBaseService : ExternalHttpProvider
    {
        public string ApiKey;
        public string SecretToken;
        public string BaseAddress;
        public HttpClient HttpClient;
        private bool SendAPIKey;

        public BankingBaseService(string baseAddress, HttpClient httpClient, string apiKey, string secretToken) : base(httpClient)
        {
            if (httpClient.BaseAddress == null)
            {
                httpClient.BaseAddress = new Uri(baseAddress) ?? throw new ArgumentNullException(nameof(baseAddress));
            }
            ApiKey = apiKey;
            SecretToken = secretToken;
            BaseAddress = baseAddress;
            HttpClient = httpClient;
            SendAPIKey = true;
            if (!baseAddress.EndsWith("api/"))
            {
                throw new IndexOutOfRangeException("Base address does not ends in https://{domain}/api/spec ");
            }
        }

        protected sealed override void PrepareRequest()
        {
            if (_httpClient.DefaultRequestHeaders.Authorization == null)
            {
                string headerApiKey = SendAPIKey ? ApiKey : string.Empty;
                _httpClient.DefaultRequestHeaders.Add("X-API-KEY", headerApiKey);
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("X-API-KEY", headerApiKey);
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
            base.PrepareRequest();
        }

        internal async Task<string> ProcessBankingAPIResponseAsync(BankingBaseService bankingUIBaseService, string queryType, string url, 
            string query, object data = null!, string postData = "", string mediaType = "application/json")
        {
            var httpResponseMessage = new HttpResponseMessage();

            if (queryType.ToUpper().Equals("GET"))
                httpResponseMessage = await bankingUIBaseService.GetRestAPIResponseAsync(url, query);
            else if (queryType.ToUpper().Equals("POST"))
                httpResponseMessage = await bankingUIBaseService.PostAsync(postData, url, mediaType);
            else if (queryType.ToUpper().Equals("PUT") || queryType.ToUpper().Equals("PATCH") || queryType.ToUpper().Equals("DELETE"))
                httpResponseMessage = await bankingUIBaseService.PutAsync(url + query, data, mediaType);

            return await ReturnResponse(httpResponseMessage);
        }

        private async Task<string> ReturnResponse(HttpResponseMessage httpResponseMessage)
        {
            switch (httpResponseMessage.StatusCode)
            {
                case HttpStatusCode.OK:
                    using (HttpContent content = httpResponseMessage.Content)
                    {
                        var result = await content.ReadAsStringAsync();

                        if (string.IsNullOrWhiteSpace(result))
                            throw new InvalidOperationException("Response content is empty.");

                        return result;
                    }
                case HttpStatusCode.NoContent:
                    return string.Empty;
                case HttpStatusCode.NotFound:
                    var notFoundMsg = await httpResponseMessage.Content.ReadAsStringAsync();
                    if (notFoundMsg == "Zero Count.")
                    {
                        return string.Empty;
                    }
                    throw new BankingException(BankingExceptionType.NotFound, notFoundMsg);
                case HttpStatusCode.Conflict:
                    using (HttpContent content = httpResponseMessage.Content)
                    {
                        throw new BankingException(BankingExceptionType.Conflict, await content.ReadAsStringAsync());
                    }
                case HttpStatusCode.Unauthorized:
                    throw new BankingException(BankingExceptionType.Unauthorized, "Unauthorized action. Please get support from Banking support team.");
                case HttpStatusCode.Forbidden:
                    throw new BankingException(BankingExceptionType.Forbidden, "User has no rights to access the resource..");
                case HttpStatusCode.InternalServerError:
                    using (HttpContent content = httpResponseMessage.Content)
                    {
                        try
                        {
                            throw new BankingException(BankingExceptionType.InternalServerError,
                              await content.ReadAsStringAsync());
                        }
                        catch (Exception)
                        {
                            var msg = await content.ReadAsStringAsync();
                            throw new BankingException(BankingExceptionType.InternalServerError, msg);
                        }
                    }
                case HttpStatusCode.BadRequest:
                    using (HttpContent content = httpResponseMessage.Content)
                    {
                        throw new BankingException(BankingExceptionType.BadRequest, await content.ReadAsStringAsync());
                    }
                default:
                    throw new Exception($"Unable to process the request. Please try again or get support from Banking support team.");
            }
        }
    }
}
