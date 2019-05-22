package com.skyworthdigital.appstore.utils;

import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ThreadPoolManager {
	private static Map<String, ThreadPoolManager> tb = new ConcurrentHashMap<String, ThreadPoolManager>();

	private final static int CORE_POOL_SIZE = 10;

	private final static int MAX_POOL_SIZE = 20;

	private final static int KEEP_ALIVE_TIME = 120;

	private final static int WORK_QUEUE_SIZE = 100;

	public Queue<Runnable> msgQueue = new LinkedList<Runnable>();

	final Runnable accessBufferThread = new Runnable() {
		public void run() {
			if (hasMoreAcquire()) {
				threadPool.execute(msgQueue.poll());
			}
		}
	};

	final RejectedExecutionHandler handler = new RejectedExecutionHandler() {
		public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
			//System.out.println(r + " request 放入队列中重新等待执行 " + r);
			msgQueue.offer(r);
		}
	};
	@SuppressWarnings({ "unchecked", "rawtypes" })
	final ThreadPoolExecutor threadPool = new ThreadPoolExecutor(CORE_POOL_SIZE, MAX_POOL_SIZE, KEEP_ALIVE_TIME, TimeUnit.MINUTES, new ArrayBlockingQueue(
			WORK_QUEUE_SIZE), this.handler);

	final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	@SuppressWarnings("rawtypes")
	final ScheduledFuture taskHandler = scheduler.scheduleAtFixedRate(accessBufferThread, 0, 1, TimeUnit.SECONDS);

	public static synchronized ThreadPoolManager getInstance(String key) {
		ThreadPoolManager obj = tb.get(key);
		if (obj == null) {
			obj = new ThreadPoolManager();
			tb.put(key, obj);
		}

		return obj;
	}

	private ThreadPoolManager() {

	}

	private boolean hasMoreAcquire() {
		return !msgQueue.isEmpty();
	}

	public void addTask(Runnable task) {
		threadPool.execute(task);
	}
}
