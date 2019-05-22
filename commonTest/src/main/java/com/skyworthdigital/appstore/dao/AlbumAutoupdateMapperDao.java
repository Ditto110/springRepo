package com.skyworthdigital.appstore.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * 
 * 
 * @author jiangbo
 * @email jiangbo@fengmang.tv.cn
 * @date 2019-03-18 18:52:52
 */
@Mapper
public interface AlbumAutoupdateMapperDao  {

    Map<String, Object> queryObject(Integer id);
}
