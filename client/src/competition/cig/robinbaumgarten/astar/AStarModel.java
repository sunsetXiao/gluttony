package competition.cig.robinbaumgarten.astar;

import java.util.ArrayList;
import java.util.PriorityQueue;

/**
 * 使用A星算法进行搜索的类
 * @author 张泰源
 *
 */
public class AStarModel {
	PriorityQueue<AStarNode> openList = new PriorityQueue<>();
	AStarNode currentBestNode = null;
	AStarNode startNode = null;
	/**
	 * 重新设置搜索的起点
	 * @param root
	 */
	public void reset(AStarNode root){
		openList.clear();
		startNode = root;
		startNode.parentNode =  null;
	}
	
	/**
	 * 根据给定的约束，搜索最佳目标节点
	 * @param maxTime 搜索所能花费时间的上限，单位毫秒
	 * @param maxNumber 搜索次数的上限
	 */
	public void search(long maxTime,int maxNumber){
		long startTime = System.currentTimeMillis();
		int searchNum = 0;
		currentBestNode = null;
		float minCost = TSimulator.MAX_MAP_LENGTH;
		
		float preX = 0; 
		float preY = 0; 
		if(startNode != null){
			preX = startNode.sceneSnapShot.mario.x;
			preY = startNode.sceneSnapShot.mario.y;
		}
		//离起点长度超过这个长度的节点不用考虑
		float maxXWidth = 256;
		//最佳节点离起始节点的距离必须超过下面这个数
		float minXWidth = 40;
		
		if(startNode != null)
			openList.add(startNode);
		while((System.currentTimeMillis() - startTime <= maxTime)
				&& searchNum < maxNumber){
			//循环搜索
			AStarNode searchNode = openList.poll();
			if(searchNode == null){
				break;
			}
			//从当前节点往下延伸搜索树，每个分支是当前节点下能采取的行动之一
			ArrayList<boolean[]> possibleActions = TSimulator.getPossibleActions(searchNode);
			int preDamage = TSimulator.getMarioDamage(searchNode.sceneSnapShot);
			
			for(boolean[] action : possibleActions){
				searchNum++;
				LevelScene snapShot = TSimulator.backupState(searchNode.sceneSnapShot);
				TSimulator.advanceStep(snapShot, action);
				if(TSimulator.getMarioDamage(snapShot) > preDamage){
					//如果一个行动导致马里奥受到伤害，则放弃这个行动
					//System.out.println("Will damage:" + (snapShot.mario.damage - preDamage));
					continue;
				}else{
					float afterX = snapShot.mario.x;
					if(afterX - preX > maxXWidth){
						//不去考虑太远的结点
						continue;
					}
					//否则，新建一个搜索的结点，放到openlist里面
					AStarNode newNode = new AStarNode(action, 
							searchNode, TSimulator.DEFAULT_STEP_REPETITION, snapShot);
					if(newNode.getCost() < minCost && afterX - preX > minXWidth){
						//最优节点必须保证一定的搜索距离
						minCost = newNode.getCost();
						currentBestNode = newNode;
					}
					openList.add(newNode);
				}
			}
		}/*
		if(currentBestNode != null)
			System.out.println("Best node in the distance of " + (currentBestNode.sceneSnapShot.mario.x - preX));
		System.out.println("Search ends,search for " + searchNum + " times, cost time:" + 
		(System.currentTimeMillis() - startTime) + ",with the minimum cost be " + minCost);
		*/
	}
	/**
	 * 
	 * @return 上一次搜索后得到的最佳目标节点
	 */
	public AStarNode getBestNode(){
		return currentBestNode;
	}
}
