package com.skyworthdigital.appstore.entity;

import java.io.Serializable;
import java.util.Date;


/**
 * 
 * 
 * @author jiangbo
 * @email jiangbo@fengmang.tv.cn
 * @date 2019-03-18 18:52:52
 */
public class AlbumAutoupdateMapperEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	
	//
	private Integer id;
	//专题id
	private String albumid;
	//是否开启自动更新状态，1 开启，0 关闭
	private Integer autoUpdate;
	//最近一次更新时间
	private Date lastupdatetime;

	private int source;

	/**
	 * 设置：
	 */
	public void setId(Integer id) {
		this.id = id;
	}
	/**
	 * 获取：
	 */
	public Integer getId() {
		return id;
	}
	/**
	 * 设置：专题id
	 */
	public void setAlbumid(String albumid) {
		this.albumid = albumid;
	}
	/**
	 * 获取：专题id
	 */
	public String getAlbumid() {
		return albumid;
	}

	/**
	 * 设置：最近一次更新时间
	 */
	public void setLastupdatetime(Date lastupdatetime) {
		this.lastupdatetime = lastupdatetime;
	}
	/**
	 * 获取：最近一次更新时间
	 */
	public Date getLastupdatetime() {
		return lastupdatetime;
	}

	public int getSource() {
		return source;
	}

	public void setSource(int source) {
		this.source = source;
	}

	public Integer getAutoUpdate() {
		return autoUpdate;
	}

	public void setAutoUpdate(Integer autoUpdate) {
		this.autoUpdate = autoUpdate;
	}
}
