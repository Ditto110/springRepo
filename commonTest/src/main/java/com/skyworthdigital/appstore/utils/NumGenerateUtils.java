/*
 * 文 件 名  :  NumGenerateUtils.java
 * 版    权    :  Ltd. Copyright (c) 2015 深圳创维数字技术有限公司,All rights reserved
 * 描    述    :  &lt;描述&gt;
 * 创建人    :  韩红强
 * 创建时间:  2017-5-2 上午11:20:53
 */
package com.skyworthdigital.appstore.utils;

import java.util.Date;
import java.util.Random;
import java.util.UUID;

/**
 * 订单号、排期流水号生成工具类
 * <功能详细描述>
 * @author  韩红强
 * @version  [版本号, 2017-5-2 上午11:20:53]
 */
public class NumGenerateUtils {

    /**
     * 生成排期流水号
     * <功能详细描述>
     * @return [参数说明]
     * @return String 
     * @exception throws [违例类型] [违例说明]
     */
    public static String generateScheduleNo(){
        StringBuilder result = new StringBuilder();
        result.append("PQ-")
        .append(DateUtils.format(new Date() , "yyyyMMdd"))
        .append(getRandomStringByLength(5));
        
        return result.toString();
    }
    
    /**
     * 获取一定长度的随机字符串
     * @param length 指定字符串长度
     * @return 一定长度的字符串
     */
    public static String getRandomStringByLength(int length) {
        String base = "0123456789";
        int baseLength = base.length();
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(baseLength);
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
    /**
     * 生成uuid
     */
    public static String getUUIDByLength(int length){
    	UUID uuid = UUID.randomUUID(); 
	    String uuidStr = uuid.toString().replace("-", "").substring(0,length);
	    return uuidStr;
    }
    
    /** 
     * <一句话功能简述>
     * <功能详细描述>
     * @param args [参数说明]
     * @return void 
     * @exception throws [违例类型] [违例说明]
     */
    public static void main(String[] args) {
        // TODO Auto-generated method stub
        System.out.println(generateScheduleNo());
    }

}
