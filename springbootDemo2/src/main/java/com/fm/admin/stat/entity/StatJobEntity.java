package com.fm.admin.stat.entity;

import java.io.Serializable;


/**
 * 
 * 
 * @author jiangbo
 * @email jiangbo@fengmang.tv.cn
 * @date 2019-04-15 18:58:25
 */
public class StatJobEntity implements Serializable {
	private static final long serialVersionUID = 1L;
	
	//
	private Integer id;
	//任务名称
	private String jobName;
	//任务处理的字段
	private String jobSubject;
	//简述
	private String jobDesc;

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
	 * 设置：任务名称
	 */
	public void setJobName(String jobName) {
		this.jobName = jobName;
	}
	/**
	 * 获取：任务名称
	 */
	public String getJobName() {
		return jobName;
	}
	/**
	 * 设置：任务处理的字段
	 */
	public void setJobSubject(String jobSubject) {
		this.jobSubject = jobSubject;
	}
	/**
	 * 获取：任务处理的字段
	 */
	public String getJobSubject() {
		return jobSubject;
	}
	/**
	 * 设置：简述
	 */
	public void setJobDesc(String jobDesc) {
		this.jobDesc = jobDesc;
	}
	/**
	 * 获取：简述
	 */
	public String getJobDesc() {
		return jobDesc;
	}
}
