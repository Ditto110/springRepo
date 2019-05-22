package com.skyworthdigital.appstore.service.imple;

import com.skyworthdigital.appstore.dao.AlbumAutoupdateMapperDao;
import com.skyworthdigital.appstore.service.VideoMainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service("albumAutoupdateMapperService")
public class VideoMainServiceImpl implements VideoMainService {
	@Autowired
	private AlbumAutoupdateMapperDao albumAutoupdateMapperDao;
	
	@Override
	public Map<String,Object> queryObject(Integer id){
		return albumAutoupdateMapperDao.queryObject(id);
	}

}
