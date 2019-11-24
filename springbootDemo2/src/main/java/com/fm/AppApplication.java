package com.fm;

import com.fm.dynamicdatasource.DynamicDataSourceRegister;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;

/**
 * start
 */
@SpringBootApplication
@Import(DynamicDataSourceRegister.class)
public class AppApplication extends SpringBootServletInitializer{
    public static void main( String[] args ) {
        SpringApplication.run(AppApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return super.configure(builder).sources(AppApplication.class);
    }
}
