package utils;

import java.io.IOException;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HttpReqJsonUtils {
	private static final String FORM = "application/x-www-form-urlencoded";
	private static final String JSON = "application/json";
	private static final String TEXT = "text/plain";
	private  CloseableHttpClient  httpClient = null;
	public final static ObjectMapper mapper = new ObjectMapper();
	private static String useAgent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36";
	
	private static final String PREVIEW_TAG = "preview";
	/**
devicetypeid	"3061"
devicetype	"π盒"
customerid	"37020"
customername	"运营测试渠道"	 
	 * */
	private static void setHeaders1(HttpUriRequest request){
		request.setHeader("customerid", "37002");
		request.setHeader("devicetypeid", "3061");
		request.setHeader("deviceid", "F44C70717DB91743OrLW8");
		request.setHeader("storePackageName", "com.mipt.store");
		request.setHeader("storeVersionCode", "60300");
		request.setHeader("sn", "0330613700217370009675");
		request.setHeader("androidSDKVersion", "23");
		request.setHeader(PREVIEW_TAG, "1");		
	} 
	
	private static void setHeaders(HttpUriRequest request){
		//零售电商-天猫、京东
		request.setHeader("customerid", "37002");
		//π盒
		request.setHeader("devicetypeid", "3061");
		request.setHeader("deviceid",  "F44C70717DB91743OrLW8");
		request.setHeader("storePackageName", "com.mipt.store");
		request.setHeader("storeVersionCode", "60307");
		request.setHeader("sn","0330613700217370009675");
		request.setHeader("androidSDKVersion", "23");
		request.setHeader(PREVIEW_TAG, "0");
	}
	
	private static void setHeaders2(HttpUriRequest request){
		request.setHeader("customerid", "37020");
		request.setHeader("storeVersionCode", "60205");
		request.setHeader("storePackageName", "com.mipt.store");
		request.setHeader(PREVIEW_TAG, "0");
		request.setHeader("sn", "0330583702017080000085");
		request.setHeader("devicetypeid", "3058");
		request.setHeader("deviceid", "74FF4C1C49971709KGHz6");
		request.setHeader("androidSDKVersion", "19");
		request.setHeader("Host", "appstore.skyworthbox.com");
		request.setHeader("Connection", "Keep-Alive");
		request.setHeader("Accept-Encoding", "gzip");
		request.setHeader("User-Agent", "okhttp/3.10.0");
	}
	
	public static HttpReqJsonUtils https(){
		return new HttpReqJsonUtils(HttpClientUtils.getSSLClient());
	}

	public static HttpReqJsonUtils http(){
		return new HttpReqJsonUtils(HttpClientUtils.getHttpClient());
	}
	
	private HttpReqJsonUtils(CloseableHttpClient  httpClient){
		this.httpClient = httpClient;
	}
	
	public JsonNode post(String url, HttpEntity entity) throws IOException, ClientProtocolException {
		HttpPost httpPost = new HttpPost(url);
		httpPost.setEntity(entity);		
		HttpResponse response = httpClient.execute(httpPost);  
		
		HttpEntity httpEntity= response.getEntity();               
//		System.out.println("StatusLine: " + response.getStatusLine());
		String content = EntityUtils.toString(httpEntity, "UTF-8");
		if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
//        	System.out.println(content);
			return mapper.readTree(content);
		}else{
			System.err.println(content);
		}
		return mapper.createObjectNode();
	}
	
	public JsonNode post(String url, String postData) throws IOException, ClientProtocolException {
		HttpEntity entity = new StringEntity(postData, ContentType.create(JSON, "utf-8"));
		return post(url, entity);
	}
	
	public JsonNode post(String url, Map<String,String> postKeyVal) throws IOException, ClientProtocolException {
		String jsonStr = mapper.writeValueAsString(postKeyVal);		
		return post(url, jsonStr);
	}
	
	/**post text*/
	public JsonNode postText(String url, String postData) throws IOException, ClientProtocolException {
		HttpEntity entity = new StringEntity(postData, ContentType.create(TEXT, "utf-8"));
		return post(url, entity);
	}
	
	/**post form*/
	public JsonNode postForm(String url, String postData) throws IOException, ClientProtocolException {
		HttpEntity entity = new StringEntity(postData, ContentType.create(FORM, "utf-8"));		
		JsonNode obj = post(url, entity);
		return obj;
	}
	
	public JsonNode getRequest(String url) throws IOException, ClientProtocolException {
		HttpGet method = new HttpGet(url);	
		setHeaders(method);		
		
        HttpResponse response = httpClient.execute(method);  
        
        HttpEntity httpEntity= response.getEntity();               
        System.out.println("StatusLine: " + response.getStatusLine());
        
//		Header[] header = response.getAllHeaders();
//		for(int i = 0; i < header.length; i++){
//			System.out.println(header[i].getName() + ":" + header[i].getValue());
//		}
        
        String content = EntityUtils.toString(httpEntity, "UTF-8");
//        System.out.println(content);
        if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
//        	System.out.println(content);
        	return mapper.readTree(content);
        }else{
        	System.err.println(content);
        }
        return mapper.createObjectNode();
	}
		
	/**
	 * put request
	 * @param url
	 * @param entity
	 * @return
	 * @throws IOException
	 * @throws ClientProtocolException
	 */
	public JsonNode putText(String url, String putData) throws IOException, ClientProtocolException {		
		HttpEntity entity = new StringEntity(putData, ContentType.create(TEXT, "utf-8"));		
		HttpPut method = new HttpPut(url);
		method.setEntity(entity);
        HttpResponse response = httpClient.execute(method);  
            
        HttpEntity httpEntity= response.getEntity();               
        System.out.println("StatusLine: " + response.getStatusLine());
        if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
        	String content = EntityUtils.toString(httpEntity, "UTF-8");
//        	System.out.println(content);
        	return mapper.readTree(content);
        }
        return null;
	}	
	
	public JsonNode putJson(String url, String putData) throws IOException, ClientProtocolException {		
		HttpEntity entity = new StringEntity(putData, ContentType.create(JSON, "utf-8"));		
		HttpPut method = new HttpPut(url);
		method.setEntity(entity);
        HttpResponse response = httpClient.execute(method);  
        
        HttpEntity httpEntity= response.getEntity();               
        System.out.println("StatusLine: " + response.getStatusLine());
        if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
        	String content = EntityUtils.toString(httpEntity, "UTF-8");
//        	System.out.println(content);
        	return mapper.readTree(content);
        }
        return null;
	}	
	
	public JsonNode delete(String url) throws ClientProtocolException, IOException{
		HttpDelete httpDelete = new HttpDelete(url);
		HttpResponse response = httpClient.execute(httpDelete);
		HttpEntity httpEntity = response.getEntity();
		if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
			String content = EntityUtils.toString(httpEntity,"UTF-8");
//			System.out.println(content);
			return mapper.readTree(content);
		}
		return null;		
	}	

}
