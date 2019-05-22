/*
 * 文 件 名 : StringUtils.java 版 权 : Ltd. Copyright (c) 2015 深圳创维数字技术有限公司,All
 * rights reserved 描 述 : &lt;描述&gt; 创建人 : 韩红强 创建时间: 2015-12-4 上午8:24:11
 */

package com.skyworthdigital.appstore.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * <一句话功能简述> <功能详细描述>
 * 
 * @author 韩红强
 * @version [版本号, 2015-12-4 上午8:24:11]
 */
public class StringUtils {
    /**
     * 
     * <一句话功能简述> <功能详细描述>
     * @param str
     * @return [参数说明]
     * @return boolean
     * @exception throws [违例类型] [违例说明]
     */
    public static boolean isNotEmpty(String str) {
        return isNotNull(str);
    }

    /**
     * 
     * <一句话功能简述> <功能详细描述>
     * @param str
     * @return [参数说明]
     * @return boolean
     * @exception throws [违例类型] [违例说明]
     */
    public static boolean isEmpty(String str) {
        return isNull(str);
    }

    /**
     * 判断字符串是否为null或者“”，如果是返回true,否则返回false
     * 
     * @param str
     * @return boolean
     * @exception throws [违例类型] [违例说明]
     */
    public static boolean isNull(String str) {
        boolean flag = false;

        if (str == null) {
            flag = true;
        }
        else if (str.equals("")) {
            flag = true;
        }

        return flag;
    }

    /**
     * 与isNull相反
     * 
     * @param str
     * @return boolean
     * @exception throws [违例类型] [违例说明]
     */
    public static boolean isNotNull(String str) {
        return !isNull(str);
    }

    /**
     * 以splitStr为分隔符，获取source前num位 举例： source = "abc,wr,t,r,t,y,h"; splitStr =
     * "," num = 3 结果为"abc,wr,t" <功能详细描述>
     * @param source
     * @param splitStr
     * @param num
     * @return [参数说明]
     * @return String
     * @exception throws [违例类型] [违例说明]
     */
    public static String getFrontNumPart(String source, String splitStr, int num) {
        if (isNotNull(source)) {
            StringBuilder target = new StringBuilder("");
            String[] strs = source.split(splitStr);
            for (int i = 0; i < strs.length && i < num; ++i) {
                target.append(strs[i]).append(splitStr);
            }

            return target.substring(0, target.length() - 1);
        }
        return "";
    }

    public static String getNowDateString() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-ddHHmmss");
        Date date = new Date();
        return format.format(date);
    }

    /**
     * 格式化日期
     *
     * @return String
     * @exception throws [违例类型] [违例说明]
     */
    public static String formatDate(Date date, String pattern) {
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        return format.format(date);
    }

    /**
     * 将字符串解析成Date类型
     *
     * @param dateStr
     * @param pattern "yyyy-MM-dd HH:mm:ss"
     * @return java.util.Date
     * @exception throws [违例类型] [违例说明]
     */
    public static Date parseStrToDate(String dateStr, String pattern) {
        try {
            SimpleDateFormat format = new SimpleDateFormat(pattern);
            return format.parse(dateStr);
        }
        catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * MD5加密 <功能详细描述>
     * @param plainText
     * @return String
     * @exception throws [违例类型] [违例说明]
     */
    public static String md5(String plainText) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(plainText.getBytes("UTF-8"));
            byte[] b = md.digest();

            int i;

            StringBuffer buf = new StringBuffer("");
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }

            return buf.toString();
        }
        catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 随机生成一串字符串，length为长度 <功能详细描述>
     * @param length
     * @return String
     * @exception throws [违例类型] [违例说明]
     */
    public static String generateRandomString(int length) {
        String upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerLetters = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialLetters = "!@#%&*";

        StringBuilder temp = new StringBuilder();

        for (int i = 0; i < length; ++i) {
            int randomNum = (int) (Math.random() * 4) + 1;
            switch (randomNum) {
                case 1 :
                    int randomNumTemp1 = (int) (Math.random() * (upperLetters.length()));
                    temp.append(upperLetters.charAt(randomNumTemp1));
                    break;
                case 2 :
                    int randomNumTemp2 = (int) (Math.random() * (lowerLetters.length()));
                    temp.append(lowerLetters.charAt(randomNumTemp2));
                    break;
                case 3 :
                    int randomNumTemp3 = (int) (Math.random() * (numbers.length()));
                    temp.append(numbers.charAt(randomNumTemp3));
                    break;
                case 4 :
                    int randomNumTemp4 = (int) (Math.random() * (specialLetters.length()));
                    temp.append(specialLetters.charAt(randomNumTemp4));
                    break;
                default :
                    break;
            }
        }

        return temp.toString();
    }

    public static void main(String[] args) {
        System.out.println("原时间 " + new Date());
        TimeZone tz = TimeZone.getTimeZone("ETC/GMT-8");
        TimeZone.setDefault(tz);
        System.out.println("修改后时间 " + new Date());
    }

    /**
     * 获取异常堆栈信息
     * @param t
     * @return
     */
    public static String getExceptionDetailInfo(Throwable t){
        String expMessage = "";
        try {
            ByteArrayOutputStream buf = new ByteArrayOutputStream();
            t.printStackTrace(new java.io.PrintWriter(buf , true));
            expMessage = buf.toString();
            buf.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return expMessage;
    }

    /**
     * 获取应用名称
     * @param siteUrl
     * @return
     */
    public static String getAppName(String siteUrl){
        String appName = "";
        if(StringUtils.isNotEmpty(siteUrl)) {
            String[] partsInfo = siteUrl.split("[/]{1,}");
            appName = partsInfo[partsInfo.length - 1];
        }
        return appName;
    }

    /**
     * 获取ip
     * @param siteUrl
     * @return
     */
    public static String getServerIp(String siteUrl){
        String serverIp = "";
        if(StringUtils.isNotEmpty(siteUrl)){
            String[] partsInfo = siteUrl.split("[/]{1,}");
            if(partsInfo.length - 2 >= 0) {
                String secondPart = partsInfo[partsInfo.length - 2];
                if(StringUtils.isNotEmpty(secondPart)){
                    serverIp = secondPart.split(":")[0];
                }
            }
        }
        return serverIp;
    }

    /**
     * 获取端口号
     * @param siteUrl
     * @return
     */
    public static String getServerPort(String siteUrl){
        String serverPort = "";
        if(StringUtils.isNotEmpty(siteUrl)){
            String[] partsInfo = siteUrl.split("[/]{1,}");
            if(partsInfo.length - 2 >= 0) {
                String secondPart = partsInfo[partsInfo.length - 2];
                if(StringUtils.isNotEmpty(secondPart)){
                    String[] temps = secondPart.split(":");
                    if(temps.length > 1 ){
                        serverPort = temps[1];
                    }else{
                        serverPort = "80";
                    }
                }
            }
        }
        return serverPort;
    }

}
