package com.fm.admin.stat.service.impl;

import com.fm.admin.stat.dao.StatJobDao;
import com.fm.admin.stat.entity.StatJobEntity;
import com.fm.admin.stat.service.StatJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;


@Service("statJobService")
public class StatJobServiceImpl implements StatJobService {
	@Autowired
	private StatJobDao statJobDao;
	
	@Override
	public StatJobEntity queryObject(Integer id){
		return statJobDao.queryObject(id);
	}
	
	@Override
	public List<StatJobEntity> queryList(Map<String, Object> map){
		return statJobDao.queryList(map);
	}
	
	@Override
	public int queryTotal(Map<String, Object> map){
		return statJobDao.queryTotal(map);
	}
	
	@Override
	public void save(StatJobEntity statJob){
		statJobDao.save(statJob);
	}
	
	@Override
	public void update(StatJobEntity statJob){
		statJobDao.update(statJob);
	}
	
	@Override
	public void delete(Integer id){
		statJobDao.delete(id);
	}
	
	@Override
	public void deleteBatch(Integer[] ids){
		statJobDao.deleteBatch(ids);
	}
	
}
