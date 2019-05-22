package com.skyworthdigital.appstore.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpURLUtils {

	 public static String getJsonContent(String urlStr)
	    {
	        try
	        {// 获取HttpURLConnection连接对象
	            URL url = new URL(urlStr);
	            HttpURLConnection httpConn = (HttpURLConnection) url
	                    .openConnection();
	            // 设置连接属性
	            httpConn.setConnectTimeout(3000);
	            httpConn.setDoInput(true);
	            httpConn.setRequestMethod("GET");
	            // 获取相应码
	            int respCode = httpConn.getResponseCode();
	            if (respCode == 200)
	            {
	                return ConvertStream2Json(httpConn.getInputStream());
	            }
	        }
	        catch (MalformedURLException e)
	        {
	            e.printStackTrace();
	        }
	        catch (IOException e)
	        {
	            e.printStackTrace();
	        }
	        return "";
	    }

	    private static String ConvertStream2Json(InputStream inputStream)
	    {
	        String jsonStr = "";
	        // ByteArrayOutputStream相当于内存输出流
	        ByteArrayOutputStream out = new ByteArrayOutputStream();
	        byte[] buffer = new byte[1024];
	        int len = 0;
	        // 将输入流转移到内存输出流中
	        try
	        {
	            while ((len = inputStream.read(buffer, 0, buffer.length)) != -1)
	            {
	                out.write(buffer, 0, len);
	            }
	            // 将内存流转换为字符串
	            jsonStr = new String(out.toByteArray());
	        }
	        catch (IOException e)
	        {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	        return jsonStr;
	    }

	    public static String httpPostContent(String url, Map<String,String> params, Map<String,String> headParams){
			String s = "";
			String encoding = "utf-8";
			try {
				CloseableHttpClient httpClient = HttpClients.createDefault();
				HttpPost httpPost = new HttpPost(url);
				ArrayList<NameValuePair> postParams = new ArrayList<>();
				if (params != null) {
					for (Map.Entry<String, String> kv: params.entrySet()){
						postParams.add(new BasicNameValuePair(kv.getKey(), kv.getValue()));
					}
				}
				httpPost.setEntity(new UrlEncodedFormEntity(postParams,encoding));
				for (Map.Entry<String, String> header : headParams.entrySet()){
					httpPost.setHeader(header.getKey(),header.getValue());
				}

				CloseableHttpResponse response = httpClient.execute(httpPost);
				HttpEntity entity = response.getEntity();
				if (entity != null && response.getStatusLine().getStatusCode() ==200) {
					s = EntityUtils.toString(entity,encoding);
				}
				EntityUtils.consume(entity);
				response.close();
				return s;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return s;
		}



	    public static void main(String[] args) {
			String url = "http://gt.beemarket.tv/store/thirdPart/listSubCatByBigCat.action?bigCatCode=AV";
			String content = getJsonContent(url);
			System.out.println("content : "+content);
		}
	    
}
