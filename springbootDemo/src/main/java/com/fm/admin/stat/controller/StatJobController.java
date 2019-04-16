package com.fm.admin.stat.controller;

import com.fm.admin.stat.entity.StatJobEntity;
import com.fm.admin.stat.service.StatJobService;
import com.fm.utils.PageUtils;
import com.fm.utils.Query;
import com.fm.utils.R;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author jiangbo
 * @email jiangbo@fengmang.tv.cn
 * @date 2019-04-15 18:58:25
 */
@RestController
@RequestMapping("/admin/job")
public class StatJobController {
	@Autowired
	private StatJobService statJobService;
	
	/**
	 * 列表
	 */
	@RequestMapping("/list")
	public R list(@RequestParam Map<String, Object> params){
		//查询列表数据
        Query query = new Query(params);

		List<StatJobEntity> statJobList = statJobService.queryList(query);
		int total = statJobService.queryTotal(query);
		
		PageUtils pageUtil = new PageUtils(statJobList, total, query.getLimit(), query.getPage());
		
		return R.ok().put("page", pageUtil);
	}
	
	
	/**
	 * 信息
	 */
	@RequestMapping("/info/{id}")
	public R info(@PathVariable("id") Integer id){
		StatJobEntity statJob = statJobService.queryObject(id);
		
		return R.ok().put("statJob", statJob);
	}
	
	/**
	 * 保存
	 */
	@RequestMapping("/save")
	public R save(@RequestBody StatJobEntity statJob){
		statJobService.save(statJob);
		
		return R.ok();
	}
	
	/**
	 * 修改
	 */
	@RequestMapping("/update")
	public R update(@RequestBody StatJobEntity statJob){
		statJobService.update(statJob);
		
		return R.ok();
	}
	
	/**
	 * 删除
	 */
	@RequestMapping("/delete")
	public R delete(@RequestBody Integer[] ids){
		statJobService.deleteBatch(ids);
		
		return R.ok();
	}
	
}
