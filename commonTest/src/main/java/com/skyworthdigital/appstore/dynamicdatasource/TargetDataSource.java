package com.skyworthdigital.appstore.dynamicdatasource;

import java.lang.annotation.*;

@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TargetDataSource {
    String name();
    
    public static final String DATA_SOURCE_STAT = "stat";
    
}