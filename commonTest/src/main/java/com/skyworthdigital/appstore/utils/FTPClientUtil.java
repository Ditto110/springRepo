package com.skyworthdigital.appstore.utils;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

/**
 * 
 * @author PangXiang
 *
 */
@Component
public class FTPClientUtil {
	private static Logger log = LogManager.getLogger(FTPClientUtil.class);
	private  String userName;         //FTP 登录用户名
	private  String password;         //FTP 登录密码
	private  String ip;                     //FTP 服务器地址IP地址
	private  String port;                        //FTP 端口
	/**
     * 关闭连接
     */
    public static void closeConnect(FTPClient ftpClient) {
            try {
                    if (ftpClient != null) {
                            ftpClient.logout();
                            ftpClient.disconnect();
                            ftpClient = null;
                    }
            } catch (Exception e) {
                    e.printStackTrace();
            }
    } 
	
	  /**
     * 连接到服务器
     *
     * @return true 连接服务器成功，false 连接服务器失败
     */
    public  boolean connectServer(FTPClient ftpClient) {
    	log.info("ip:"+ip+"_port:"+port+"_userName:"+userName+"_password:"+password);
    	 boolean flag = true;
         int reply;
         try {
                 ftpClient.setControlEncoding("UTF-8");
                 ftpClient.setDefaultPort(Integer.valueOf(port));
                 ftpClient.connect(ip);
                 ftpClient.login(userName, password);
                 reply = ftpClient.getReplyCode();
                 ftpClient.setDataTimeout(5*60*1000);
                 if (!FTPReply.isPositiveCompletion(reply)) {
                         ftpClient.disconnect();
                         log.info("FTP server refused connection.");
                         flag = false;
                 }
         } catch (SocketException e) {
                 flag = false;
                 e.printStackTrace();
                 log.info("登录ftp服务器 " + ip + " 失败,连接超时！");
         } catch (IOException e) {
                 flag = false;
                 e.printStackTrace();
                 log.info("登录ftp服务器 " + ip + " 失败，FTP服务器无法打开！");
         }

         return flag;
           
    } 
    
	public  boolean uploadFile(FTPClient ftpClient, File localFile, final String distFolder,String targetName) {
        boolean flag = true;
        InputStream input = null;
        try {
                ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
                ftpClient.enterLocalPassiveMode();
                ftpClient.setFileTransferMode(FTP.STREAM_TRANSFER_MODE);
                input = new FileInputStream(localFile);
                ftpClient.makeDirectory(distFolder);
                ftpClient.changeWorkingDirectory(distFolder);
                flag = ftpClient.storeFile(targetName, input);
                if (flag) {
                        log.info("上传"+targetName+"文件成功！");
                } else {
                        log.info("上传"+targetName+"文件失败！");
                }
                
        } catch (IOException e) {
        		log.error("上传文件失败 "+e);
                return false;
        }finally{
        	try {
				input.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
        return flag;
	} 
	
	/**
     * 上传多个文件
     *
     * @param localFile,--本地文件夹路径
     * @param distFolder--目标路径
     * @return true 上传成功，false 上传失败
     */
    public  String uploadManyFile(FTPClient ftpClient,File localFile, final String distFolder) {
            boolean flag = true;
            StringBuffer strBuf = new StringBuffer();
            try {
                    File fileList[] = localFile.listFiles();
                    for (File upfile : fileList) {
                            if (upfile.isDirectory()) {// 文件夹中还有文件夹
                                    uploadManyFile(ftpClient,upfile, distFolder);
                            } else {
                                    flag = uploadFile(ftpClient,upfile, distFolder,upfile.getName());
                            }
                            if (!flag) {
                                    strBuf.append(upfile.getName() + "\r\n");
                            }
                    }
                    log.info("上传失败的文件："+strBuf.toString());
            } catch (NullPointerException e) {
                    e.printStackTrace();
            } catch (Exception e) {
                    e.printStackTrace();
            }
            return strBuf.toString();
    }
    /**
     * 下载文件
     *
     * @param remoteFileName--服务器上的文件名
     * @param localFileName--本地文件名
     * @return true 下载成功，false 下载失败
     */
    public  boolean loadFile(FTPClient ftpClient,String remoteFileName, String localFileName) {
            boolean flag = true;
            // 下载文件
            BufferedOutputStream buffOut = null;
            try {
                    buffOut = new BufferedOutputStream(new FileOutputStream(localFileName));
                    flag = ftpClient.retrieveFile(remoteFileName, buffOut);
            } catch (Exception e) {
                    e.printStackTrace();
            } finally {
                    try {
                            if (buffOut != null){
                            	buffOut.close();
                            }    
                    } catch (Exception e) {
                            e.printStackTrace();
                    }
            }
            return flag;
    }
    
    private  List<String> ftpApkPaths = new ArrayList<String>();
    public  List<String> ListFilePath(FTPClient ftpClient,String[] directorys){  
    	for(String directory:directorys){
    		try {
    			directory = "/" + directory + "/";
    			ftpClient.changeWorkingDirectory(directory);
    			ftpClient.enterLocalPassiveMode();
    			FTPFile[] files = ftpClient.listFiles();
    			for(FTPFile file:files){
                    if(file.isFile()){
                    	ftpApkPaths.add(directory + file.getName());
                    }
                }  
    		} catch (IOException e) {
    			e.printStackTrace();
    		}  
    	}
        
        return ftpApkPaths;
}  
    //测试
    public  void testValue() {
    	log.info("ip:"+ip+"_port:"+port+"_userName:"+userName+"_password:"+password);
    	FTPClient ftpClient = new FTPClient();
    	connectServer(ftpClient);
    }
}
