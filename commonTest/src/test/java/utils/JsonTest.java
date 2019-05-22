package utils;

import static org.hamcrest.CoreMatchers.is;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationConfig;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.BeanPropertyWriter;
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier;

import lombok.Getter;
import lombok.Setter;

public class JsonTest {  
	  
    protected static String getJson(Object obj) throws JsonProcessingException {  
        ObjectMapper mapper = new ObjectMapper();  
        mapper.setSerializerFactory(mapper.getSerializerFactory().withSerializerModifier(new CustomBeanSerializerModifier()));  

        String str = null;  
        str = mapper.writeValueAsString(obj);  
        return str;  
    }  
  
    public static class IntegerNullSerializer extends JsonSerializer<Object> {              
		@Override
		public void serialize(Object value, JsonGenerator gen, SerializerProvider serializers)
				throws IOException, JsonProcessingException {
			// TODO Auto-generated method stub
			gen.writeString("intNull");  
		}
    };
    
    public static class CustomBeanSerializerModifier extends BeanSerializerModifier {

        private JsonSerializer<Object> integerNullSerializer = new JsonTest.IntegerNullSerializer();

        @Override
        public List<BeanPropertyWriter> changeProperties(SerializationConfig config, BeanDescription beanDesc,
                List<BeanPropertyWriter> beanProperties) {
            // 循环所有的beanPropertyWriter
            for (int i = 0; i < beanProperties.size(); i++) {
                BeanPropertyWriter writer = beanProperties.get(i);

                if (isDecimalType(writer)) {
                	writer.assignNullSerializer(integerNullSerializer);
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
    
    @Test  
    public void test() throws JsonProcessingException {  
        System.out.println(getJson(new TestObject()));//TestObject必须是POJO对象  
    }
}  
  
class TestObject {  
	@Getter @Setter
    String name = "张三";
	@Getter @Setter
    String sex = null;
	@Getter @Setter
	Integer val = null;
}  