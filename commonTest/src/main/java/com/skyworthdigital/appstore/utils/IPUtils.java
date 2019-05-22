package com.skyworthdigital.appstore.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;

import com.alibaba.druid.util.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

/**
 * IP地址
 * @author SDT13843
 *
 */
public class IPUtils {
	private static Logger logger = LoggerFactory.getLogger(IPUtils.class);

	/**
	 * 获取IP地址
	 * 
	 * 使用Nginx等反向代理软件， 则不能通过request.getRemoteAddr()获取IP地址
	 * 如果使用了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP地址，X-Forwarded-For中第一个非unknown的有效IP字符串，则为真实IP地址
	 */
	public static String getIpAddr(HttpServletRequest request) {
    	String ip = null;
        try {
            ip = request.getHeader("x-forwarded-for");
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (StringUtils.isEmpty(ip) || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
        } catch (Exception e) {
        	logger.error("IPUtils ERROR ", e);
        }
        
        //使用代理，则获取第一个IP地址
        if(StringUtils.isEmpty(ip) && ip.length() > 15) {
			if(ip.indexOf(",") > 0) {
				ip = ip.substring(0, ip.indexOf(","));
			}
		}
        // 没有通过代理的情况，直接获取IP
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
            if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
                InetAddress inet = null; // 根据网卡的配置取本机IP
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        return ip;
    }
	
	/**
     * IP转换成对应数字
     * @param ip
     * @return
     */
    public static Long ipToLong(String ip){  
        if(ip == null){
            throw new IllegalArgumentException("Illegal argument: ip !!!");
        }
        //将目标IP地址字符串strIPAddress转换为数字  
        long result = 0;
        String[] arrayIP = ip.split("\\.");
        for(int i = 3; i>=0; i--){
            long n = Long.parseLong(arrayIP[3-i]);
            //左移运算符，num << 1,相当于num乘以2
            result |= n << (i*8); 
        }
        
        return result;  
    }

	
}
