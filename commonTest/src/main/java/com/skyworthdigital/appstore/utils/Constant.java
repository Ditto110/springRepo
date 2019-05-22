package com.skyworthdigital.appstore.utils;

import java.util.Arrays;
import java.util.List;

/**
 * 常量
 *
 * @author SDT13843
 */
public class Constant {

    public static final String basePath = "/usr/local/mobee/data/";
    public static final String tempDir = "/appstore/upload_temp/";
    public static final String picDir = "/appstore/pic/";
    public static final String appDir = "/appstore/app/";
    public static final String apkDir = "/appstore/apk/";
    public static final String logDir = "/appstore/log/";

    public static final int SUCCESS_STATUS = 0;
    public static final int FAIL_STATUS = 1;
    public static final int TYPE_APP_ADD = 0;
    public static final int TYPE_APP_UPDATE = 1;
    public static final int TYPE_APP_UPGRADE = 2;
    public static final String appsuffix_old = ".apk";
    public static final String appsuffix_new = ".beemarket";

    //蜜蜂市场默认型号
    public static final String DEFAULT_DEVICETYPE_BEEMARKET = "all";
    //蜜蜂市场默认渠道
    public static final String DEFAULT_CUSTOMER_BEEMARKET = "default";
    //应用商店默认型号
    public static final String DEFAULT_DEVICETYPE_STORE = "9999";
    //应用商店默认渠道
    public static final String DEFAULT_CUSTOMER_STORE = "99999";
    //暴风默认型号
    public static final String DEFAULT_DEVICETYPE_BAOFENG = "baofengAll";
    //暴风默认渠道
    public static final String DEFAULT_CUSTOMER_BAOFENG = "baofeng";
    //应用商店运营专属渠道
    public static final String DEFAULT_DEVICETYPE_YUNYING = "storeManager";
    // 预览默认值
    public static final int DEFAULT_PREVIEW = 0;

    public static final String DOWNLOAD_PREFIX = "download count mark start";
    public static final String DOWNLOAD_SUFFIX = " download count mark end";
    public static final String DOWNLAD_BEE_PREFIX = "download bee count mark start";
    public static final String DOWNLAOD_BEE_SUFFIX = " download bee count mark end";
    public static final String SEARCH_PREFIX = "search count mark start";
    public static final String SEARCH_SUFFIX = " search count mark end";
    public static final String ERROR_PREFIX = "error count mark start";
    public static final String ERROR_SUFFIX = " error count mark end";
    public static final String INSTALL_SUFFIX = " install count mark end";
    public static final String INSTALL_PREFIX = "install count mark start";
    public static final String EXCEPTION_DATA_SUFFIX = " exception count mark end";
    public static final String EXCEPTION_DATA_PREFIX = "exception count mark start";
    public static final String DOWNLOAD_USE_STORE_RECOMMEND = "应用商店推荐位";
    public static final String DOWNLOAD_USE_SEARCH_RECOMMEND = "搜索页推荐位";
    public static final String DOWNLOAD_USE_START_RECOMMEND = "启动页推荐位";
    public static final String DOWNLOAD_USE_EXIT_RECOMMEND = "退出页推荐位";
    public static final String DOWNLOAD_USE_QMZ_LAUNCHER = "全媒资launcher";
    public static final String DOWNLOAD_USE_TENCET_LAUNCHER = "腾讯4.3launcher";
    public static final String DOWNLOAD_USE_JIGUANG_LAUNCHER = "企鹅激光launcher";
    public static final String DOWNLOAD_USE_AUTO_UPDATE = "自动更新";
    public static final String DOWNLOAD_USE_MANNUAL_UPDATE = "手动更新";
    public static final String DOWNLOAD_SOURCE_NORMAL = "主动下载";
    public static final String DOWNLOAD_SOURCE_SEARCH_INSTALL = "搜索安装";
    public static final String DOWNLOAD_SOURCE_PUSH_INSTALL = "推送安装";
    public static final String DOWNLOAD_SOURCE_MUST_INSTALL = "装机必备";
    public static final String DOWNLOAD_SOURCE_CAP = "CAP拦截安装";
    public static final String DOWNLOAD_SOURCE_OTT = "OTT大师";
    public static final String DOWNLOAD_SOURCE_UPDATE = "应用更新";
    public static final String DOWNLOAD_SOURCE_SELFUPDATE_DOWNLOAD = "应用商店自升级下载";
    public static final String DOWNLOAD_SOURCE_SELFUPDATE_INSTALL = "应用商店自升级安装";
    public static final String INSTALLTYPE_FIRST_INSTALL = "首次安装";
    public static final String INSTALLTYPE_REINSTALL = "重新安装";
    public static final String INSTALLTYPE_UPDATE_INSTALL = "升级安装";
    public static final Integer INSTALLTYPE_FIRST_INSTALL_CODE = 0;
    public static final Integer INSTALLTYPE_REINSTALL_CODE = 1;
    public static final Integer INSTALLTYPE_UPDATE_INSTALL_CODE = 2;
    public static final String DOWNLOAD_FLAG_SUCCESS = "下载成功";
    public static final String DOWNLOAD_FLAG_FAILED = "下载失败";
    public static final String INSTALL_FALG_SUCCESS = "安装成功";
    public static final String INSTALL_FLAG_FAILED = "安装失败";
    //6.02.05 版本下载安装状态
    public static final int STORE_V60205_DOWNLOAD_SUCCESS = 0;
    public static final int STORE_V60205_DOWNLOAD_FAILED = 2;
    public static final int STORE_V60205_INSTALL_SUCCESS = 0;
    //6.03.09 版本下载安装状态
    public static final int STORE_V60309_DOWNLOAD_SUCCESS = 0;
    public static final int STORE_V60309_DOWNLOAD_FAILED = 2;
    public static final int STORE_V60309_INSTALL_SUCCESS = 0;
    //6.03.12 版本的下载安装状态
    public static final int STORE_V60312_DOWNLOAD_NEW_SUCCESS = 3;
    public static final int STORE_V60312_DOWNLOAD_RE_SUCCESS = 4;
    public static final int STORE_V60312_DOWNLOAD_UPDATE_SUCCESS = 5;
    public static final int STORE_V60312_INSTALL_NEW_SUCCESS = 3;
    public static final int STORE_V60312_INSTALL_RE_SUCCESS = 4;
    public static final int STORE_V60312_INSTALL_UPDATE_SUCCESS = 5;
    //6.04.09 版本下载安装状态
    public static final int STORE_V60409_DOANLOAD_SUCCESS = 0;
    public static final int STORE_V60409_DOWNLOAD_FAILED = 1;
    public static final int STORE_V60409_INSTALL_SUCCESS = 2;
    public static final int STORE_V60409_INSTALL_FAILED = 3;
  //兼容应用商店6.02.05、6.0309、6.03.12 版本上报数据到新版本,2表示上报到install接口的数据，0表示上报到download接口的数据
    public  static final int STORE_OLD_VERSION_DATA_DOWNLOAD = 0;
    public  static final int STORE_OLD_VERSION_DATA_INSTALL = 2;
    // 6.4 之后的flag
    public static final int FLAG_INSTALL_SUCCESS = 2;

    //uses和 source映射关系
    public static final String STORE_USES_NORMAL  = "normal";
    public static final String STORE_USES_SEARCH_POSTER  = "search_poster";
    public static final String STORE_USES_SEARCH_RECOMMEND  = "search_recommend";
	public static final String STORE_USES_HOME_POSTER  = "home_poster";
	public static final String STORE_USES_HOME_TVSHOW  = "home_tvshow";
	public static final String STORE_USES_MUST_INSTALL_HOME  = "must_install_home";
	public static final String STORE_USES_DETAIL_POSTER  = "detail_poster";
	public static final String STORE_USES_DETAIL_RECOMMEND  = "detail_recommend";
	public static final String STORE_USES_EXIT_RECOMMEND  = "exit_recommend";
	public static final String STORE_USES_ENTER_RECOMMEND  = "enter_recommend";
	public static final String STORE_USES_CATEGORY  = "category";
	public static final String STORE_USES_ALBUM  = "album";
	public static final String STORE_USES_ALBUM_COLLECTION  = "album_collection";
	public static final String STORE_USES_ALBUM_GOODS  = "album_goods";
	public static final String STORE_USES_RANKING  = "ranking";
	public static final String STORE_USES_HOT_KEY  = "hot_key";
	public static final String STORE_USES_SEARCH  = "search";
	public static final String STORE_USES_RECOMMEND  = "store_recommend";
	public static final String STORE_USES_SKYWORTH  = "skyworth_launcher";
	public static final String STORE_USES_TENCENT_QIE  = "tencent_qie";
	public static final String STORE_USES_TENCENT_JIGUANG  = "tencent_jiguang";
	public static final String STORE_USES_TENCENT_PREFIX  = "notstore#tencent#com.skyworthdigital.sky2dlauncherv4";
    public static final String STORE_USES_JIGUANG_UNKOWN_PREFIX  = "notstore#unknow#com.ktcp.launcher";
    public static final String STORE_USES_JIGUANG_TENCENT_PREFIX  = "notstore#tencent#com.ktcp.launcher";
    public static final String STORE_USES_JIGUANG_SKYWORTH_PREFIX  = "notstore#skyworth#com.ktcp.launcher";
    public static final String STORE_USES_QMZ_UNKOWN_PREFIX  = "notstore#unknow#com.skyworthdigital.sky2dlauncherv4";
    public static final String STORE_USES_QMZ_SKYWORTH_PREFIX  = "notstore#skyworth#com.skyworthdigital.sky2dlauncherv4";
    public static final String STORE_USES_PACKAGE_INSTALLER  = "notstore#com.android.packageinstaller";
	public static final String STORE_USES_MUST_INSTALL  = "must_install_home";
    public static final String STORE_USES_APP_MANUAL_UPDATE = "app_manual_update";
    public static final String STORE_USES_ROUGH = "rough";
    public static final String STORE_USES_PRECISION = "precision";
    public static final String STORE_USES_OTT = "ott";
    public static final String STORE_USES_CPA = "cpa";
    public static final String STORE_USES_HOT_SEARCH = "hot_search";
    public static final String STORE_USES_HOTKEY_RECOMMEND = "hotkey_recommend";

    public static final String STORE_SOURCE_PACKAGE_INSTALLER  = "notstore#com.android.packageinstaller";
    public static final String STORE_SOURCE_RECOMMEND  = "store_recommend";
	public static final String STORE_SOURCE_SEARCH  = "search";
	public static final String STORE_SOURCE_PUSH_INSTALL  = "push_install";
	public static final String STORE_SOURCE_MUST_INSTALL  = "must_install";
	public static final String STORE_SOURCE_APP_UPDATE  = "app_update";
	public static final String STORE_SOURCE_SYSTEM_CPA  = "system_cpa";
	public static final String STORE_SOURCE_OTT_MASTER  = "ott_master";
	public static final String STORE_SOURCE_SELE_UPDATE_DOWNLOAD  = "1000";
	public static final String STORE_SOURCE_SELF_UPDATE_INSTALL  = "1001";
	public static final String STORE_SOURCE_UPGRADE  = "upgrade";
	public static final String STORE_SOURCE_SELE_UPGRADE_DOWNLOAD  = "upgrade_download";
	public static final String STORE_SOURCE_SELF_UPGRADE_INSTALL  = "upgrade_install";
	public static final String STORE_SOURCE60312_STORE_RECOMMEND  = "0";
	public static final String STORE_SOURCE60312_STORE_UPDATE  = "1";
	public static final String STORE_SOURCE60312_STORE_PUSH_INSTALL  = "2";
	public static final String STORE_SOURCE60312_STORE_LAUNCHER  = "3";



	public static final String STORE_V60205 = "60205";
	public static final String STORE_V60309 = "60309";
	public static final String STORE_V60312 = "60312";
	public static final String STORE_V60409 = "60409";

    // common http request headers
    public static final String REQUEST_KEY_DEVICE_ID = "deviceid";
    public static final String REQUEST_KEY_DEVICE_TYPE_ID = "devicetypeid";
    public static final String REQUEST_KEY_DEVICE_TYPE = "devicetype";
    public static final String REQUEST_KEY_CUSTOMER_ID = "customerid";
    public static final String REQUEST_KEY_SN = "sn";
    public static final String REQUEST_KEY_STORE_PACKAGENAME = "storePackageName";
    public static final String REQUEST_KEY_STORE_VERSIONCODE = "storeVersionCode";
    public static final String REQUEST_KEY_PREVIEW = "preview";
    public static final String REQUEST_KEY_STORE_ANDROIDSDKVERSION = "androidSDKVersion";

    // request key => param key, 希望以后前后端参数做到统一
    public static final String PARAM_KEY_CUSTOMER_ID = "customerId";
    public static final String PARAM_KEY_DEVICE_TYPE_ID = "deviceTypeId";
    public static final String PARAM_KEY_DEVICE_TYPE = "deviceType";
    public static final String PARAM_KEY_DEVICE_ID = "deviceId";
    public static final String PARAM_KEY_APP_PACKAGE_NAME = "packageName";
    public static final String PARAM_KEY_VERSION_NAME = "versionName";
    public static final String PARAM_KEY_VERSION_NAME_LOWER = "versionname";
    public static final String PARAM_KEY_VERSION_CODE = "versionCode";
    public static final String PARAM_KEY_INSTALL_TYPE = "installType";
    public static final String PARAM_KEY_SOURCE = "source";
    public static final String PARAM_KEY_APP_ID = "appid";
    public static final String PARAM_KEY_APP_NANME = "appName";
    public static final String PARAM_KEY_APP_NANME_LOWER = "appname";
    public static final String PARAM_KEY_USES = "uses";
    public static final String PARAM_KEY_MSG = "msg";
    public static final String PARAM_KEY_SN = "sn";
    public static final String PARAM_KEY_UNKOWN = "unkown";
    public static final String PARAM_KEY_FLAG = "flag";
    public static final String PARAM_KEY_CLASS_ID = "classId";
    public static final String PARAM_KEY_CREATE_TIME_DB = "createtime";
    public static final String PARAM_KEY_CREATE_TIME_UPPER = "createTime";
    public static final String PARAM_KEY_CREATE_TIME_OLD = "downloadDate";
    public static final String PARAM_KEY_START_DATE = "startDate";
    public static final String PARAM_KEY_END_DATE = "endDate";
    public static final String PARAM_KEY_CAHNNEL_TYPE = "channelType";
    public static final String PARAM_KEY_SDK_VERSION = "SDKVersion";
    public static final String PARAM_KEY_STORE_PACKAGE_NAME = "storePackageName";
    public static final String PARAM_KEY_STORE_VERSION_CODE = "storeVersionCode";
    public static final String PARAM_KEY_STORE_ERRORINFO = "errorInfo";

    // redis key
    public static final String REDIS_HASH_CONTAINER_BOX_INFO = "redisHashContainerBoxInfo";
    public static final String REDIS_LIST_CONTAINER_BOX_INFO = "redisListContainerBoxInfo";
    public static final String REDIS_STRING_CONTAINER_SIZE = "redisStringContainerSize";
    public static final String REDIS_STRING_CONTAINER_TIMEOUT = "redisStringContainerTimeout";
    public static final String REDIS_STRING_PUSH_LIST = "redisStringPushList";
    // 修改上报接口版本号
    public static final int UPLOAD_DOWNLAOD_VERSION = 60400;
    public static final int STORE_SELF_UPDATE_VERSION = 60409;

    //精准推送状态
    public static final int APP_PUSH_STATUS_NO_INSTALL = 0;
    public static final int APP_PUSH_STATUS_INSTALLED = 1;
    public static final int APP_PUSH_STATUS_PAUSE_INSTALL = 2;

    public static final int CHANNELTYPE_MIFENG = 0;
    public static final int CHANNELTYPE_APPSTORE = 1;
    public static final int CHANNELTYPE_BAOFENG = 2;
    public static final int CHANNELTYPE_OTHER = 9;

    //mongoDB 表名
    public static final String TB_STAT_MONGODB_BEEMARKET_LOG = "tb_stat_beemarket_mg_log";
    public static final String TB_STAT_MONGODB_BEEMARKET_DAY = "tb_stat_beemarket_mg_day";

    // 需要统计的虚拟下载uses列表
    public static final List<String> NEED_STATISTICS_VIRTUAL_DOWNLOAD_USES_LIST = Arrays.asList("normal",
            STORE_USES_SEARCH_POSTER,
            STORE_USES_SEARCH_RECOMMEND,
            STORE_USES_HOME_POSTER,
            STORE_USES_HOME_TVSHOW,
            STORE_USES_MUST_INSTALL_HOME,
            STORE_USES_DETAIL_POSTER,
            STORE_USES_DETAIL_RECOMMEND,
            STORE_USES_ENTER_RECOMMEND,
            STORE_USES_EXIT_RECOMMEND,
            STORE_USES_CATEGORY,
            STORE_USES_ALBUM,
            STORE_USES_ALBUM_COLLECTION,
            STORE_USES_ALBUM_GOODS,
            STORE_USES_RANKING,
            STORE_USES_HOT_KEY,
            STORE_USES_SEARCH,
            STORE_USES_MUST_INSTALL,
            STORE_USES_APP_MANUAL_UPDATE
    );

    /**
     * 所有应用的最新版本都存放在缓存中，key前缀
     */
    public static final String STORE_CACHE_APP_VERSION_KEY_PREFIX = "store_app_version_";
    public static final String STORE_CACHE_OBTAIN_RECOMMEND_SEARCH_APPS_KEY_PREFIX = "store_obtainRecommendSearchApps_";
    public static final String STORE_CACHE_OBTAIN_APPS_BY_TAG_KEY_PREFIX = "store_obtainAppsByTag_";
    public static final String STORE_CACHE_OBTAIN_APP_INFO_KEY_PREFIX = "store_obtainAppInfo_";
    public static final String STORE_CACHE_OBTAIN_APP_ICON_KEY_PREFIX = "store_obtainAppIconPath_";
    public static final String STORE_CACHE_OBTAIN_APP_BY_PACKAGENAME_KEY_PREFIX = "store_queryAppByPkgName_";
    public static final String STORE_CACHE_OBTAIN_SEARCH_APP_KEY_PREFIX = "store_obtainSearchApps_";
    public static final String STORE_CACHE_OBTAIN_APP_BY_CLASS_KEY_PREFIX = "store_obtainAppsByClass_";
    public static final String STORE_CACHE_OBTAIN_DETAIL_RECOMMAND_KEY_PREFIX = "store_obtainDetailRecommand_";
    public static final String STORE_CACHE_OBTAIN_HOTSEARCH_KEY_PREFIX = "store_obtainHotSearchApps_";
    public static final String STORE_CACHE_OBTAIN_RANK_LIST_KEY_PREFIX = "store_obtainRankList_";
    public static final String STORE_CACHE_OBTAIN_APP_PERIPHERAL_KEY_PREFIX = "store_obtainPeripheralApps_";
    public static final String STORE_CACHE_OBTAIN_ALBUM_COLLECTION_KEY_PREFIX = "store_obtainAlbumCollection_";
    public static final String STORE_CACHE_OBTAIN_ALBUM_LIST_KEY_PREFIX = "store_obtainAlbumList_";
    public static final String STORE_CACHE_OBTAIN_ALBUM_DETAIL_KEY_PREFIX = "store_albumDetail_";


}
