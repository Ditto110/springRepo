package com.skyworthdigital.appstore.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

public class HttpContextUtils {

	private static final Logger LOGGER = LogManager.getLogger(HttpContextUtils.class);
	public static final String APPSTORE_STORE = "com.mipt.store";
	public static final String PACKAGE_BEEMARKET = "tv.beemarket";
	public static final String PACKAGE_BAOFENGMARKET = "baofeng.market";

	public static HttpServletRequest getHttpServletRequest() {
		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
	}

	public static Map<String, Object> ValidateHeader(HttpServletRequest httpServletRequest) {

		Map<String, Object> paramMap = new HashMap<>();
		
		// 必选 headers
		String customerid = httpServletRequest.getHeader(Constant.REQUEST_KEY_CUSTOMER_ID);
		String storePackageName = httpServletRequest.getHeader(Constant.REQUEST_KEY_STORE_PACKAGENAME)==null?PACKAGE_BEEMARKET:httpServletRequest.getHeader(Constant.REQUEST_KEY_STORE_PACKAGENAME);
		String storeVersionCode = httpServletRequest.getHeader(Constant.REQUEST_KEY_STORE_VERSIONCODE);
		String devicetypeid = httpServletRequest.getHeader(Constant.REQUEST_KEY_DEVICE_TYPE_ID);
		String androidSDKVersion = httpServletRequest.getHeader(Constant.REQUEST_KEY_STORE_ANDROIDSDKVERSION) == null ? "21" : httpServletRequest.getHeader(Constant.REQUEST_KEY_STORE_ANDROIDSDKVERSION);
		String preview = httpServletRequest.getHeader(Constant.REQUEST_KEY_PREVIEW);
		int source = 0; 	//渠道类型:0 蜜蜂市场,1应用商店,2暴风市场, 99 表示其他

		// 注意:默认渠道机型分为两种情况，蜜蜂市场和应用商店, 蜜蜂市场默认渠道
		if (StringUtils.isEmpty(customerid)) {
			if (APPSTORE_STORE.equals(storePackageName)) {
				customerid = Constant.DEFAULT_CUSTOMER_STORE;
			}else if (PACKAGE_BEEMARKET.equals(storePackageName)) {
				customerid = Constant.DEFAULT_CUSTOMER_BEEMARKET;
			}else if (PACKAGE_BAOFENGMARKET.equals(storePackageName)) {
				customerid = Constant.DEFAULT_CUSTOMER_BAOFENG;
			}else {
				customerid = Constant.DEFAULT_CUSTOMER_BEEMARKET;
			}
		}
		
		if (storePackageName.equals(PACKAGE_BEEMARKET)) {
			source = 0;
		}else if (storePackageName.equals(APPSTORE_STORE)) {
			source = 1;
		}else if (storePackageName.equals(PACKAGE_BAOFENGMARKET)) {
			source = 2;
		}else {
			source = 99;
		}
		
		if (StringUtils.isEmpty(devicetypeid)) {
			if (APPSTORE_STORE.equals(storePackageName)) {
				devicetypeid = Constant.DEFAULT_DEVICETYPE_STORE;
			}else if (PACKAGE_BEEMARKET.equals(storePackageName)) {
				devicetypeid = Constant.DEFAULT_DEVICETYPE_BEEMARKET;
			}else if (PACKAGE_BAOFENGMARKET.equals(storePackageName)) {
				devicetypeid = Constant.DEFAULT_DEVICETYPE_BAOFENG;
			}else {
				devicetypeid = Constant.DEFAULT_DEVICETYPE_BEEMARKET;
			}
		}
		String deviceId = httpServletRequest.getHeader(Constant.REQUEST_KEY_DEVICE_ID);
		if(StringUtils.isEmpty(deviceId)) {
			deviceId = httpServletRequest.getParameter(Constant.REQUEST_KEY_DEVICE_ID);
		}
		paramMap.put("deviceTypeId", devicetypeid);
		paramMap.put("customerId", customerid);
		paramMap.put("storePackageName", storePackageName);
		paramMap.put("storeVersionCode", storeVersionCode);
		paramMap.put("packageName", storePackageName);
		paramMap.put("versionCode", storeVersionCode);
		paramMap.put("androidSDKVersion", androidSDKVersion);
		paramMap.put("deviceId", deviceId);
		paramMap.put("sn", httpServletRequest.getHeader(Constant.REQUEST_KEY_SN));
		paramMap.put("source", source);
		// 预览
		if (StringUtils.isEmpty(preview)) {
			paramMap.put("preview", Constant.DEFAULT_PREVIEW);
		}else {
			paramMap.put("preview", preview);
		}

		return paramMap;
	}
	
}
