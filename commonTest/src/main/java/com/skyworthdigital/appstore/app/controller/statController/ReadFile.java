package com.skyworthdigital.appstore.app.controller.statController;

import com.skyworthdigital.appstore.service.VideoMainService;
import com.skyworthdigital.appstore.utils.R;
import org.apache.commons.io.LineIterator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author SDT14325
 * created at 18:17 2019/5/13
 */
@RequestMapping("/api")
@RestController
public class ReadFile {

    private static final Logger LOGGER = LogManager.getLogger(ReadFile.class);

    @Value("${stat.logPath}")
    private String path;

    @Autowired
    private VideoMainService videoMainService;

    @RequestMapping("/conn")
    public R conn() {
        return R.ok();
    }

    @RequestMapping("/readLog")
    public R readLogFromFile() {
        LOGGER.info("开始读取日志文件");

        ThreadPoolExecutor pool = new ThreadPoolExecutor(6,
                Integer.MAX_VALUE,
                1,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>());
        File[] files = new File(path).listFiles();
        if (files == null) {
            return R.error(1, "文件路径错误");
        }
        LOGGER.info("paht:{}",path);
        LineIterator it = null;
        for (File file : files) {
            try {
                if (file.isDirectory()) {
                    continue;
                }
                if (!file.getName().startsWith("videoApi") || !file.getName().endsWith(".log")||file.getName().contains("logstat")) {
                    continue;
                }
                LOGGER.info("file:{}",file.getAbsolutePath());
                ReadLog readLog = new ReadLog(file, videoMainService);
                pool.execute(readLog);
            } catch (Exception e) {
                e.printStackTrace();
                LOGGER.error("读取日志数据失败");
            } finally {
                LineIterator.closeQuietly(it);
            }
        }
        //关闭
        pool.shutdown();
        while (true) {
            if (pool.isTerminated()) {
                LOGGER.info("日志读取结束");
                break;
            }
        }
        return R.ok();
    }
}
