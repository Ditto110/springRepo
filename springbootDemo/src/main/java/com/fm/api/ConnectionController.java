package com.fm.api;

import com.alibaba.fastjson.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author SDT14325
 * created at 17:26 2019/4/15
 */
@RestController
@RequestMapping("/api")
public class ConnectionController {
    /**
     * 测试探针
     * @return status
     */
    @RequestMapping("/conn")
    public String conn(){
        JSONObject jsonObject= new JSONObject();
        jsonObject.put("result", 0);
        return jsonObject.toJSONString();
    }
}
