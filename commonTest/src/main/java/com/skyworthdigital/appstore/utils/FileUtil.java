package com.skyworthdigital.appstore.utils;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

public class FileUtil {
	private static Logger log = Logger.getLogger(FileUtil.class);
	 /**
     * 创建文件
     * @param createFile
     * @return
     */
  public static boolean createFile(File file) {  
        if(file.exists()) {  
            return false;  
        }  
        if(!file.getParentFile().exists()) {  
            //如果目标文件所在的目录不存在，则创建父目录  
            if(!file.getParentFile().mkdirs()) {
            	log.info("create dir fail!");
                return false;  
            }  
        }  
        //创建目标文件  
        try {  
            if (file.createNewFile()) {  
                return true;  
            } else {  
                return false;  
            }  
        } catch (IOException e) {  
            e.printStackTrace();  
            return false;  
        }  
    }  
  
  /**
   * 重命名文件名
   */
  public static String renameFile(String fileName) {
	  int index = fileName.lastIndexOf(".");
	  String suffix = fileName.substring(index);
	  fileName = NumGenerateUtils.getUUIDByLength(16) + DateUtils.format(new Date(), "yyyyMMdd") +suffix;
	  return fileName;
  }
  
  /**
   * 图片存储
   */
  public static String storePicFile(String tempFilePath,String targetFileName){
		File tempFile = new File(Constant.basePath + tempFilePath);
		String targetFilePath = Constant.picDir + DateUtils.format(new Date(), "yyyy/MM/dd") + targetFileName;
		File targetFile = new File(Constant.basePath + targetFilePath);
		try{
			FileUtils.copyFile(tempFile, targetFile);
		}catch(Exception e){
			log.error("copyFile exception", e);
			return null;
		}
		return targetFilePath;
  }
  
  /**
   * apk存储
   */
  public static String storeApkFile(String tempFilePath,String targetFileName){
		File tempFile = new File(Constant.basePath + tempFilePath);
		String targetFilePath = Constant.appDir + DateUtils.format(new Date(), "yyyy/MM/dd") + targetFileName;
		File targetFile = new File(Constant.basePath + targetFilePath);
		try{
			FileUtils.copyFile(tempFile, targetFile);
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
		return targetFilePath;
  }
  
  /**
   * 日志存储
   */
  public static String storeLogFile(MultipartFile img,String fileName){
	  String targetFileDir = Constant.logDir + DateUtils.format(new Date(), "yyyy/MM/dd/");
	  String targetFilePath = targetFileDir + fileName;
	  File targetFile = new File(Constant.basePath + targetFilePath);
	  if (!new File(Constant.basePath +targetFileDir).exists()) {
          new File(Constant.basePath +targetFileDir).mkdirs();
      }
	  try {
			img.transferTo(targetFile);
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return targetFilePath;
  }
}
