package com.skyworthdigital.appstore.utils;

public class CheckUses {

    public static void main(String[] args) {
        System.out.println(check(null));
        System.out.println(check("rough"));
        System.out.println(check("cpa"));
        System.out.println(check("xxx"));
    }

    public static boolean check(String uses) {
        return  uses != null && (uses.equals(Constant.STORE_USES_ROUGH)
                || uses.equals(Constant.STORE_USES_PRECISION)
                || uses.equals(Constant.STORE_USES_OTT)
                || uses.equals(Constant.STORE_USES_HOT_SEARCH)
                || uses.equals(Constant.STORE_USES_HOTKEY_RECOMMEND)
                || uses.equals(Constant.STORE_USES_CPA)
                || Constant.NEED_STATISTICS_VIRTUAL_DOWNLOAD_USES_LIST.contains(uses));
    }

}
