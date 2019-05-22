package utils;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.GzipDecompressingEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HttpClientUtils {
	private static Log log = LogFactory.getLog(HttpClientUtils.class);
	private static String gzip = "gzip";
	private static String defaultCharset = "utf-8";
	
	private static ObjectMapper mapper = new ObjectMapper();
	
//	public static JsonNode getJsonData(String url) {
//		
//		CloseableHttpClient httpClient = getHttpClient();
//
//		HttpGet getMethod = new HttpGet(url);
//
//		
//		HttpResponse response = null;
//		try {
//			response = httpClient.execute(getMethod);
//			StatusLine line = response.getStatusLine();
//			int code = line.getStatusCode();
//			
//			if (code != HttpStatus.SC_OK){
//				log.error("httpError" + response.getStatusLine());
//				return null;
//			} 
//			
//			HttpEntity entity = response.getEntity();
//			Header ceheader = entity.getContentEncoding();
//			if (Objects.nonNull(ceheader)) {
//				for (HeaderElement element : ceheader.getElements()) {
//					// System.out.println(element.getName()+element.getName().equalsIgnoreCase("gzip"));
//					if (element.getName().equalsIgnoreCase(gzip)) {
//						entity = new GzipDecompressingEntity(response.getEntity());
//					}
//				}
//			}
//			
//			String result = EntityUtils.toString(entity, defaultCharset);
////			log.info("result:" + result);
//			
//	    	JsonNode node = mapper.readTree(result);
//			return node; 
//		} catch (IOException e) {
//			log.error("io error," + e);
//			e.printStackTrace();
//		} finally {
//			try {				
//				httpClient.close();
//			} catch (IOException e) {
//				log.error("io error," + e);
//				e.printStackTrace();
//			}
//		}
//		
//		return mapper.createObjectNode();
//	}
//
	public static CloseableHttpClient getHttpClient() {
		RequestConfig requestConfig = RequestConfig.custom()
		.setConnectTimeout(5000)		
		.setConnectionRequestTimeout(20000)
		.setSocketTimeout(40000).build();
		
		HttpRequestRetryHandler handler = new DefaultHttpRequestRetryHandler(3, true);
		
		CloseableHttpClient	httpClient = HttpClientBuilder.create()
					.setRetryHandler(handler)
					.setDefaultRequestConfig(requestConfig)
					.build();
		return httpClient;
	}
	
	private static final HostnameVerifier HOSTNAME_VERIFIER = new HostnameVerifier() {
		public boolean verify(String hostname, SSLSession session) {
			if (hostname.contains("192.168") || hostname.contains("localhost") || hostname.contains("127.0.0.1")) {
				return true;
			}

			HostnameVerifier hv = HttpsURLConnection.getDefaultHostnameVerifier();
			return hv.verify(hostname, session);
		}
	};
	
	public static CloseableHttpClient getSSLClient() {
		RequestConfig defaultRequestConfig = RequestConfig.custom()
				.setCookieSpec(CookieSpecs.STANDARD_STRICT)
				.setConnectTimeout(5000)
				.setConnectionRequestTimeout(20000)
				.setSocketTimeout(40000)				
				.build();
		
		HttpRequestRetryHandler retryHandler = new DefaultHttpRequestRetryHandler(3, true);
		SSLContext sslContext = null;
		try {
			sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustSelfSignedStrategy()).build();
		} catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
			e.printStackTrace();
		}

		SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, HOSTNAME_VERIFIER);

		Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
				.register("http", PlainConnectionSocketFactory.INSTANCE)
				.register("https", sslsf).build();

		PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(
				socketFactoryRegistry);
		CloseableHttpClient httpClient = HttpClients.custom()				
				.setConnectionManager(connectionManager)
				.setDefaultRequestConfig(defaultRequestConfig)
				.setRetryHandler(retryHandler)
				.build();

		return httpClient;
	}
		
}
