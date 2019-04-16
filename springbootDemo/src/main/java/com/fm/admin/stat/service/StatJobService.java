package com.fm.admin.stat.service;

import com.fm.admin.stat.entity.StatJobEntity;
import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author jiangbo
 * @email jiangbo@fengmang.tv.cn
 * @date 2019-04-15 18:58:25
 */
public interface StatJobService {
	
	StatJobEntity queryObject(Integer id);
	
	List<StatJobEntity> queryList(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(StatJobEntity statJob);
	
	void update(StatJobEntity statJob);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}
