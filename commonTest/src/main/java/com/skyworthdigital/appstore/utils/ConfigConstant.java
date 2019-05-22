package com.skyworthdigital.appstore.utils;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 系统参数相关Key
 *
 * @author SDT13843
 */
@Component
@ConfigurationProperties(prefix = "config")
public class ConfigConstant {

    private static String cacheServers;
    private static String adminHost;
    private static String redisauth;

    public static String getCacheServers() {
        return cacheServers;
    }

    public static String getRedisauth() {
        return redisauth;
    }

    public static void setRedisauth(String redisauth) {
        ConfigConstant.redisauth = redisauth;
    }

    public static void setCacheServers(String cacheServers) {
        ConfigConstant.cacheServers = cacheServers;
    }

    public static String getAdminHost() {
        return adminHost;
    }

    public static void setAdminHost(String adminHost) {
        ConfigConstant.adminHost = adminHost;
    }
}
