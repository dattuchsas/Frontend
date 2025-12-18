using System.Text;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Banking.APIService
{
    public class ExternalHttpProvider
    {
        protected readonly HttpClient _httpClient;

        public ExternalHttpProvider(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        protected enum HttpVerb { POST, PUT, PATCH, DELETE, GET };

        /// <summary>
        /// Used to Prepare any PrepareRequest Information, Great to be used when need to validate access tokens
        /// </summary>
        protected virtual void PrepareRequest()
        {
            //this._httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "");
        }

        /// <summary>
        /// Used to Prepare any PostRequest Information, Used When Common Postprocessing must be done
        /// </summary>
        protected virtual void PostRequest() { }

        protected async Task<HttpResponseMessage> DeleteAsync(string url, object data, string mediaType = "application/json")
        {
            PrepareRequest();
            var val = JsonConvert.SerializeObject(data);
            var patchValue = GetStringContent(val, mediaType);
            return await _httpClient.DeleteAsync(url + patchValue, CancellationToken.None);
        }

        protected async Task<HttpResponseMessage> PutAsync(string url, object data, string mediaType = "application/json")
        {
            PrepareRequest();
            var val = JsonConvert.SerializeObject(data);
            var patchValue = GetStringContent(val, mediaType);
            return await _httpClient.PutAsync(url, patchValue);
        }

        protected async Task<HttpResponseMessage> PatchAsync(string url, object data, string mediaType = "application/json")
        {
            PrepareRequest();
            var val = JsonConvert.SerializeObject(data);
            var patchValue = GetStringContent(val, mediaType);
            return await _httpClient.PatchAsync(url, patchValue);
        }

        protected async Task<HttpResponseMessage> PostAsync(string query, string url, string mediaType = "application/json")
        {
            PrepareRequest();
            var content = GetStringContent(query, mediaType);
            PostRequest();
            return await _httpClient.PostAsync(url, content);
        }

        protected async Task<HttpResponseMessage> GetRestAPIResponseAsync(string URL, string Query)
        {
            HttpResponseMessage message = new();
            try
            {
                PrepareRequest();
                var request = new HttpRequestMessage(new HttpMethod(HttpVerb.GET.ToString()), URL + Query);
                message = await _httpClient.SendAsync(request);
                PostRequest();
            }
            catch (Exception ex)
            {
                //var details = _processorTelemetry.GetKeyValuePairs(ex);
                //details.TryAdd("URL", URL);
                //details.TryAdd("Query", Query);
                //_loggerClient.TrackEvent("GetRestAPIResponseAsync", details);
                throw new Exception("", ex);
            }
            return message;
        }

        private static StringContent GetStringContent(string val, string mediaType = "application/json")
        {
            return new StringContent(val, Encoding.UTF8, mediaType); // lgtm[cs/web/xss] lgtm[cs/web/xss-dynamics]
        }

        protected async Task<HttpResponseMessage> SetRestAPIRequestAsync(
          string URL,
          string Query,
          HttpVerb methodtype,
          string mediaType = "application/json")
        {
            HttpResponseMessage message = new HttpResponseMessage();
            try
            {
                PrepareRequest();
                var method = new HttpMethod(methodtype.ToString());
                var request = new HttpRequestMessage(method, URL + Query);
                message = await _httpClient.SendAsync(request);
                PostRequest();
            }
            catch (Exception ex)
            {
                //var details = _processorTelemetry.GetKeyValuePairs(ex);
                //details.TryAdd("URL", URL);
                //details.TryAdd("Query", Query);
                //details.TryAdd("methodtype", methodtype.ToString());
                //_loggerClient.TrackEvent("SetRestAPIRequestAsync", details);
                throw new Exception("", ex);
            }
            return message;
        }

        protected async Task<HttpResponseMessage> SetRestAPIRequestAsync(
          string URL,
          string Query,
          HttpVerb methodtype,
          object data,
          string mediaType = "application/json")
        {
            HttpResponseMessage message = new HttpResponseMessage();
            try
            {
                PrepareRequest();
                var val = JsonConvert.SerializeObject(data);
                var patchValue = new StringContent(val, Encoding.UTF8, mediaType); // lgtm[cs/web/xss] lgtm[cs/web/xss-dynamics]
                var method = new HttpMethod(methodtype.ToString());
                var request = new HttpRequestMessage(method, URL + Query) { Content = patchValue };
                message = await _httpClient.SendAsync(request);
                PostRequest();
            }
            catch (Exception ex)
            {
                //var details = _processorTelemetry.GetKeyValuePairs(ex);
                //details.TryAdd("URL", URL);
                //details.TryAdd("Query", Query);
                //details.TryAdd("methodtype", methodtype.ToString());
                //details.TryAdd("Query", JsonConvert.SerializeObject(data));
                //_loggerClient.TrackEvent("SetRestAPIRequestAsync", details);
                throw new Exception("", ex);
            }
            return message;
        }
    }
}
