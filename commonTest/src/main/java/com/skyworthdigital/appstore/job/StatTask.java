package com.skyworthdigital.appstore.job;

import com.skyworthdigital.appstore.utils.StatUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author SDT14325
 * created at 16:03 2019/1/29
 */
@Component
public class StatTask {
    private static final Logger LOGGER = LogManager.getLogger(StatTask.class);
    /**
     * 定时任务用于分割日志
     */
    @Scheduled(cron = "0 1 0 * * ?")
    public void writeNewLog(){
        StatUtils.stat("beemarket log start ....");
    }

}
