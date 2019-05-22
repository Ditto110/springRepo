package com.skyworthdigital.appstore.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import redis.clients.jedis.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.Serializable;
import java.util.*;

public class CacheUtil {

    private static final Logger log = LogManager.getLogger(CacheUtil.class);
    private static JedisCluster jc = null;
    // 缓存过期时间
    public static int expireTime = 30;
    private static Map<String, Integer> urlMap;


    public static JedisCluster getJedisCluster() {
        if (jc == null) {
            synchronized (JedisCluster.class) {
                if (jc == null) {
                    try {
                        String servers[] = ConfigConstant.getCacheServers().split(",");
                        String redisauth = ConfigConstant.getRedisauth();
                        Set<HostAndPort> jedisClusterNodes = new HashSet<HostAndPort>();
                        for (int i = 0; i < servers.length; i++) {
                            String server[] = servers[i].split(":");
                            jedisClusterNodes.add(new HostAndPort(server[0], Integer.valueOf(server[1])));
                        }
                        JedisPoolConfig jpc = new JedisPoolConfig();
                        jpc.setMaxTotal(1536);
                        jpc.setMaxWaitMillis(3000);
                        jpc.setMinEvictableIdleTimeMillis(60000);
                        jpc.setMaxIdle(100);
                        jpc.setMinIdle(50);
                        jc = new JedisCluster(jedisClusterNodes,1000,1000,3,redisauth,jpc);
                    } catch (Exception e) {
                        log.error(e.getMessage());
                    }
                }
            }
        }
        return jc;
    }

    public static void set(String key, String value) {
        try {
            JedisCluster jc = getJedisCluster();
            jc.set(key, value);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void setex(String key, int expire, String value) {
        try {
            JedisCluster jc = getJedisCluster();
            jc.setex(key, expire * 60, value);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static String get(String key) {
        try {
            JedisCluster jc = getJedisCluster();
            return jc.get(key);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public static void setObject(String key, Serializable object) {
        try {
            JedisCluster jc = getJedisCluster();
            jc.set(key.getBytes(), SerializerUtil.objectToByte(object));
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void setexObject(String key, int expire, Serializable object) {
        try {
            JedisCluster jc = getJedisCluster();
            jc.setex(key.getBytes(), expire * 60, SerializerUtil.objectToByte(object));
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static Object getObject(String key) {
        try {
            JedisCluster jc = getJedisCluster();
            return SerializerUtil.byteToObject(jc.get(key.getBytes()));
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public static <T> void setList(String key, List<? extends Serializable> list) {
        try {
            if (list != null) {
                JedisCluster jc = getJedisCluster();
                jc.set(key.getBytes(), SerializerUtil.serializeList(list));
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static <T> List<T> getList(String key) {
        try {
            JedisCluster jc = getJedisCluster();
            byte[] in = jc.get(key.getBytes());
            List<T> list = SerializerUtil.deserializeList(in);
            return list;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public static <T> void setexList(String key, int expire, List<? extends Serializable> list) {
        try {
            if (list != null) {
                JedisCluster jc = getJedisCluster();
                jc.setex(key.getBytes(), expire * 60, SerializerUtil.serializeList(list));
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void delKey(String key) {
        try {
            JedisCluster jc = getJedisCluster();
            jc.del(key);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    /**
     * 查询集群中的key
     * @return
     */
    public static TreeSet<String> getKeys(String pattern){
        TreeSet<String> keys = new TreeSet<>();
        Map<String, JedisPool> clusterNodes = jc.getClusterNodes();
        for(String k : clusterNodes.keySet()){
            JedisPool jp = clusterNodes.get(k);
            Jedis js = jp.getResource();
            keys.addAll(js.keys(pattern));
        }
        return keys;
    }


    public static synchronized Map<String, Integer> getCacheUrl() {
        if (urlMap == null) {
            try {
                urlMap = new HashMap<String, Integer>();
                String path = log.getClass().getClassLoader().getResource("/").getPath() + "cacheurl";
                BufferedReader reader = new BufferedReader(new FileReader(path));
                String cacheurl = null;
                while ((cacheurl = reader.readLine()) != null) {
                    String urls[] = cacheurl.split(":");
                    if (urls.length == 2) {
                        urlMap.put(urls[0], Integer.valueOf(urls[1]));
                    }
                }
                reader.close();
            } catch (Exception e) {
                log.error("read url txt error,{}", e.getMessage());
            }
        }
        return urlMap;
    }

    public static String generateCacheKey(String funcName, String[] params) {
        StringBuilder resultKey = new StringBuilder();
        resultKey.append(funcName);
        for (String param : params) {
            resultKey.append("_");
            resultKey.append(param);
        }
        return resultKey.toString();
    }

    public static void main(String aaa[]) {
        String key = "test";
        String value = "testvalue";
        set("key1", "value1");
        setex(key, 100, value);
        System.out.println(get(key));
    }

	public static void setexObjectMap(String key, int expire, Map<String, Object> map) {
		try {
            JedisCluster jc = getJedisCluster();
            jc.setex(key.getBytes(), expire * 60, SerializerUtil.objectToByte(map));
        } catch (Exception e) {
            log.error(e.getMessage());
        }
		
	}
}
