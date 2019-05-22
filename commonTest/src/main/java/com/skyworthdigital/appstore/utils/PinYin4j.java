package com.skyworthdigital.appstore.utils;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

/*
 * 	This class used for Chinese language converter PinYin
 * 	come form online demo -- see http://hi.baidu.com/stevenblake/item/fc3906eba5dc2bf0fa42ba0b
 * 	Use Open Source java Project--Pinyin4j.jar 
 */
public class PinYin4j {

	/**
	 * The logger
	 */
	static Logger logger = Logger.getLogger(PinYin4j.class);

	static HanyuPinyinOutputFormat format = new HanyuPinyinOutputFormat();
	
	static{
		/*
		 * set output format: lowercase; without tone; use v replace of ü
		 */
		format.setVCharType(HanyuPinyinVCharType.WITH_V);
		format.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		format.setToneType(HanyuPinyinToneType.WITHOUT_TONE);		
	}
	/*
	 * @param chinese
	 * 
	 * @return The first letter of chinese, The English characters reserves, The
	 * special characters lost
	 */
	public static String converterToFirstLeterNotIgnoreSplit(String chinese) {
		if (chinese == null || chinese.trim().equals("")) {
			return "";
		}
		String chinesearry[] = chinese.split(",");
		StringBuilder buffer = new StringBuilder();
		for (int i = 0; i < chinesearry.length; i++) {
			String result = converterToFirstLetter(chinesearry[i]);
			buffer.append(result);
			if (i != chinesearry.length - 1) {
				buffer.append(",");
			}
		}
		return buffer.toString();
	}

	public static String converterToSpellNotIgnoreSplit(String chinese) {
		if (chinese == null || chinese.trim().equals("")) {
			return "";
		}
		chinese = chinese.replace("/", ",");
		chinese = chinese.replace(" ", ",");
		chinese = chinese.replace(".", ",");
		String chinesearry[] = chinese.split(",");
		StringBuilder buffer = new StringBuilder();
		for (int i = 0; i < chinesearry.length; i++) {
			if (chinesearry[i].length() > 50) {
				continue;
			}
			String result = converterToSpell(chinesearry[i]);
			buffer.append(result);
			if (i != chinesearry.length - 1) {
				buffer.append(",");
			}
		}
		return buffer.toString();
	}

	public static String converterToFirstLetter(String chinese) {

		if (chinese == null || chinese.trim().equals("")) {
			return "";
		}

		char[] nameChar = chinese.toCharArray();
		StringBuilder pinYinName = new StringBuilder();

		for (int i = 0; i < nameChar.length; i++) {
			if (nameChar[i] > 128) {
				try {
					// full spell
					String[] strs = PinyinHelper.toHanyuPinyinStringArray(
							nameChar[i], format);
					if (strs != null) {
						for (int j = 0; j < strs.length; j++) {
							// first letter
							pinYinName.append(strs[j].charAt(0));
							if (j != strs.length - 1) {
								pinYinName.append(",");
							}
						}
					}
				} catch (BadHanyuPinyinOutputFormatCombination e) {
					logger.error("Pin yin Outpu format error: ", e);
				}
			} else {
				pinYinName.append(nameChar[i]);
			}
			pinYinName.append(" ");
		}
		return parseTheChineseByObject(discountTheChinese(pinYinName.toString()), "");
	}

	/*
	 * @param chinese
	 * 
	 * @return The full spell of chines, The English characters reserves, The
	 * special characters lost
	 */
	public static String converterToSpell(String chinese) {
		String pinyinName = converterToStrSeries(chinese);
		return parseTheChineseByObject(discountTheChinese(pinyinName), "");
	}

	public static String converterToSpell(String chinese, String intervalsign) {
		String pinyinName = converterToStrSeries(chinese);
		
		List<Map<String, Integer>> list = discountTheChinese(pinyinName.toString());
		
		return parseTheChineseByObject(list, intervalsign);
	}
		
	private static String converterToStrSeries(String chinese) {
		if (chinese == null || chinese.trim().equals("")) {
			return "";
		}
		chinese = replace(chinese);
		char[] nameChar = chinese.toCharArray();
		StringBuilder pinyinName = new StringBuilder();

		for (int i = 0; i < nameChar.length; i++) {
			if (nameChar[i] > 128) {
				try {
					// full spell
					String[] strs = PinyinHelper.toHanyuPinyinStringArray(
							nameChar[i], format);
					if (strs != null) {
						for (int j = 0; j < strs.length; j++) {
							pinyinName.append(strs[j]);
							if (j != strs.length - 1) {
								pinyinName.append(",");
							}
						}
					}
				} catch (BadHanyuPinyinOutputFormatCombination e) {
					logger.error("Pin yin Outpu format error: ", e);
				}
			} else {
				pinyinName.append(nameChar[i]);
			}
			pinyinName.append(" ");
		}
		return pinyinName.toString();
	}
	
	/**
	 * This method remove duplicate polyphone
	 * 
	 * @param name
	 * @return
	 */
	private static List<Map<String, Integer>> discountTheChinese(String name) {

		String[] firsts = name.split(" ");
		Map<String, Integer> onlyOne = null;
		List<Map<String, Integer>> mapList = new ArrayList<Map<String, Integer>>();

		for (String str : firsts) {
			onlyOne = new Hashtable<String, Integer>();
			String[] china = str.split(",");

			// remove duplicate polyphone
			for (String s : china) {
				Integer count = onlyOne.get(s);
				if (count == null) {
					onlyOne.put(s, new Integer(1));
				} else {
					onlyOne.remove(s);
					count++;
					onlyOne.put(s, count);
				}
			}
			mapList.add(onlyOne);
		}
		return mapList;

	}

	/**
	 * This method merger Pinyin letter
	 * 
	 * @param list
	 * @return
	 */
	private static String parseTheChineseByObject(
			List<Map<String, Integer>> list, String intervalSign) {

		Map<String, Integer> collector = null;

		for (int i = 0; i < list.size(); i++) {
			Map<String, Integer> temp = new Hashtable<String, Integer>();
			// first collector is null
			if (collector != null) {
				for (String s : collector.keySet()) {
					for (String s1 : list.get(i).keySet()) {
						String str = s + intervalSign + s1;
						temp.put(str, 1);
					}
				}
				// clear last data
				if (temp != null && temp.size() > 0) {
					collector.clear();
				}
			} else {
				for (String s : list.get(i).keySet()) {
					String str = s;
					temp.put(str, 1);
				}
			}
			// save data
			if (temp != null && temp.size() > 0) {
				collector = temp;
			}
		}
		String result = " ";
		if (collector != null) {
			for (String str : collector.keySet()) {
				result += (str + ",");
			}
		}
		if (result.length() > 0 && result.length() < 1000) {
			result = result.substring(0, result.length() - 1);
		}else if(result.length() > 1000){
			result = result.substring(0, 999);
		}
		return result;
	}

	public static String replace(String s) {
		if (s != null) {
			s = s.replace("/", "");
			s = s.replace("[", "");
			s = s.replace("]", "");
		}
		return s;
	}

	
	public static void main(String[] args) {
		String s = "家庭";
		System.out.println(converterToFirstLetter(s));
		System.out.println(converterToFirstLeterNotIgnoreSplit(s));
		System.out.println(converterToStrSeries(s));
		System.out.println(converterToSpellNotIgnoreSplit(s));
	}
}
