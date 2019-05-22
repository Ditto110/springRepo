/*
 * 文 件 名 : JSONUtil.java 版 权 : Ltd. Copyright (c) 2015 深圳创维数字技术有限公司,All rights
 * reserved 描 述 : &lt;描述&gt; 创建人 : 韩红强 创建时间: 2015-12-4 上午11:00:33
 */
package com.skyworthdigital.appstore.utils;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier;

/**
 * <一句话功能简述> <功能详细描述>
 * @author 韩红强
 * @version [版本号, 2015-12-4 上午11:00:33]
 * 
 * 采用jackson，增加更多的工具功能。
 * @author zhaixiaobin 
 */
public class JSONUtil {

    /**
     * 将Object装换为String
     * @param obj
     * @return [参数说明]
     * @return String
     * @exception throws [违例类型] [违例说明]
     */
    public static String toJsonString(Object obj) {
        if (obj != null) {
            return JSON.toJSONString(obj);
        }
        return "";
    }

    private JSONUtil() {}

    /**
     * 将对象序列化成json字符串
     * @param object javaBean
     * @return jsonString json字符串
     */
    public static String toJson(Object object) {
        try {
            return getInstance().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     *  
     */
    public static String toFormatedJson(Object object) {
    	ObjectWriter writer = getInstance().writerWithDefaultPrettyPrinter();
        try {
            return writer.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    
    /**
     * 将json反序列化成对象
     * @param jsonString jsonString
     * @param valueType class
     * @param <T> T 泛型标记
     * @return Bean
     */
    public static <T> T parse(String jsonString, Class<T> valueType) {
        try {
            return getInstance().readValue(jsonString, valueType);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    
    public static <T> ObjectNode parse(T bean){
    	return mapper.convertValue(bean, ObjectNode.class);
    }

    public static <T> ArrayNode parse(Collection<T> list){
    	return mapper.convertValue(list, ArrayNode.class);
    }

    private final static JacksonObjectMapper mapper;
    static {
    	mapper = new JacksonObjectMapper();
    }
    public static ObjectMapper getInstance() {
        return mapper;
    }

    public static ObjectNode getObject() {
        return mapper.createObjectNode();
    }

    public static ArrayNode getArray() {
        return mapper.createArrayNode();
    }
    
    private static class JacksonObjectMapper extends ObjectMapper {
        private static final long serialVersionUID = 4288193147502386170L;
        private static final Locale CHINA = Locale.CHINA;
        
        public JacksonObjectMapper() {
            this.setLocale(CHINA);
            this.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", CHINA));
            //this.setSerializationInclusion(Include.NON_NULL);  
            this.setTimeZone(TimeZone.getTimeZone("GMT+8"));
            this.setSerializerFactory(this.getSerializerFactory().withSerializerModifier(new CustomBeanSerializerModifier()));              
        }
    }
    
    private static class NumberNullSerializer extends JsonSerializer<Object> {              
		@Override
		public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers)
				throws IOException, JsonProcessingException {
			gen.writeNumber(0);
		}
    };
    
    private static class CustomBeanSerializerModifier extends BeanSerializerModifier {
        private JsonSerializer<Object> numberNullSerializer = new NumberNullSerializer();

        @Override
        public List<BeanPropertyWriter> changeProperties(SerializationConfig config, BeanDescription beanDesc,
                List<BeanPropertyWriter> beanProperties) {
            for (int i = 0; i < beanProperties.size(); i++) {
                BeanPropertyWriter writer = beanProperties.get(i);

                if (isDecimalType(writer)) {
                	writer.assignNullSerializer(numberNullSerializer);
                }
            }
            return beanProperties;
        }

        protected boolean isDecimalType(BeanPropertyWriter writer) {
            JavaType type = writer.getType();
            @SuppressWarnings("rawtypes")
			Class clazz = type.getRawClass();
            
            return clazz.equals(Long.class) || clazz.equals(Integer.class) || clazz.equals(Short.class);
        }
    }    
    
}
