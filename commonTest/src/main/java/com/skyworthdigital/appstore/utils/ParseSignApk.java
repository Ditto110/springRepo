package com.skyworthdigital.appstore.utils;

import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateEncodingException;
import java.util.Enumeration;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
/***
 * 
 * @author sdt12686
 *
 */
public class ParseSignApk {
	
	public static void main(String[] args) {
		String apkPath2 = "E:\\APK安装包\\SkyTvMarket02_5.06.09_platform.apk";
		System.out.println(getApkSignInfo(apkPath2));
	}
	
	
	private static java.security.cert.Certificate[] loadCertificates(JarFile jarFile, JarEntry je, byte[] readBuffer) {
		try {
			InputStream is = jarFile.getInputStream(je);
			while (is.read(readBuffer, 0, readBuffer.length) != -1) {

			}
			is.close();
			return (java.security.cert.Certificate[]) (je != null ? je.getCertificates() : null);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception reading " + je.getName() + " in " + jarFile.getName() + ": " + e);
		}
		return null;
	}

	public static String getApkSignInfo(String apkFilePath) {
		byte[] readBuffer = new byte[8192];
		java.security.cert.Certificate[] certs = null;
		try {
			JarFile jarFile = new JarFile(apkFilePath);
			Enumeration entries = jarFile.entries();
			while (entries.hasMoreElements()) {
				JarEntry je = (JarEntry) entries.nextElement();
				if (je.isDirectory()) {
					continue;
				}
				if (je.getName().startsWith("META-INF/")) {
					continue;
				}
				java.security.cert.Certificate[] localCerts = loadCertificates(jarFile, je, readBuffer);
				if (certs == null) {
					certs = localCerts;
				} else {
					for (int i = 0; i < certs.length; i++) {
						boolean found = false;
						for (int j = 0; j < localCerts.length; j++) {
							if (certs[i] != null && certs[i].equals(localCerts[j])) {
								found = true;
								break;
							}
						}
						if (!found || certs.length != localCerts.length) {
							jarFile.close();
							return null;
						}
					}
				}
			}
			jarFile.close();

			String hex = null;
			try {
				MessageDigest md = MessageDigest.getInstance("SHA1");
				byte[] publicKey = md.digest(certs[0].getEncoded());
				hex = byte2HexFormatted(publicKey);
			} catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			} catch (CertificateEncodingException e) {
				e.printStackTrace();
			}

			return hex;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static String byte2HexFormatted(byte[] bytes) {
		final char[] HEX = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
		char[] hexChars = new char[bytes.length * 3 - 1];
		int v = 0x00;
		for (int i = 0; i < bytes.length; i++) {
			v = bytes[i] & 0xff; // 保留最后两位，即两个16进制位
			// high 4bit
			hexChars[i * 3] = HEX[v >>> 4]; // 忽略符号右移，空出补0
			// low 4bit
			hexChars[i * 3 + 1] = HEX[v & 0x0f];
			if (i < bytes.length - 1) {
				hexChars[i * 3 + 2] = ':';
			}
		}
		return String.valueOf(hexChars);
	}
}
