package com.skyworthdigital.appstore.app.controller.statController;

import com.skyworthdigital.appstore.service.VideoMainService;
import com.skyworthdigital.appstore.utils.StatUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author SDT14325
 * created at 12:49 2019/5/14
 */
public class ReadLog implements Runnable {

    private static final String PREFIX = "STATIS start videoPlay mark -----";
    private static final String SUFFIX = " ----- end videoPlay mark videocore";

    private File file;
    private VideoMainService videoMainService;

    public ReadLog(File file, VideoMainService videoMainService) {
        this.file = file;
        this.videoMainService = videoMainService;
    }

    @Override
    public void run() {
        LineIterator it = null;
        String dateStr ;
        try {
            String fileName = file.getName();
            String regex = ".*_201[89]-[0-1][0-9]-[0-3][0-9]\\.log$";
            boolean matches = fileName.matches(regex);
            if (!matches) {
                return;
            }
            dateStr = fileName.substring(fileName.lastIndexOf("_") + 1, fileName.lastIndexOf("."));
            //读取文件
            it = FileUtils.lineIterator(new File(file.getAbsolutePath()), "UTF-8");
            while (it.hasNext()) {
                String line = it.next();
                boolean validate = validateData(line);
                if (!validate) {
                    continue;
                }
                line = line.replaceAll(SUFFIX, "");
                line = line.substring(line.indexOf(PREFIX) + PREFIX.length());
                String[] kv = line.split(",");
                List<String> list = Arrays.asList(kv);
                StringBuilder sb = new StringBuilder();
                Map<Object, Object> map = new HashMap<>();
                for (String s : list) {
                    if (s.startsWith("mac:")) {
                        map.put("mac", s.substring("mac:".length()));
                    }else {
                        String[] data = s.split(":");
                        map.put(data[0], data[1]);
                    }
                }
                int sourceId = querySourceId(map.getOrDefault("videoId", 0).toString());
                sb.append(dateStr).append(",")
                        .append(sourceId).append(",")
                        .append(map.getOrDefault("mac", "null"));
                StatUtils.stat(sb.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            LineIterator.closeQuietly(it);
        }
    }

    private boolean validateData(String line) {
        if (StringUtils.isEmpty(line)) {
            return false;
        }
        if (!line.contains("STATIS start videoPlay mark") || !line.contains("end videoPlay mark videocore")) {
            return false;
        }
        if (line.contains("contentChannelNumber:qmz")) {
            return false;
        }
        return true;
    }

    private int querySourceId(String videoId) {
        try {
            Map<String, Object> map = videoMainService.queryObject(Integer.parseInt(videoId));
            if (map == null) {
                return 0;
            }
            return (int)map.getOrDefault("source", 0);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

}
