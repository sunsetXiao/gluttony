package competition.cig.robinbaumgarten.astar;

import java.util.ArrayList;
import java.util.PriorityQueue;


public class AStarModel {
	PriorityQueue<AStarNode> openList = new PriorityQueue<>();
	AStarNode currentBestNode = null;
	AStarNode startNode = null;
	public void reset(AStarNode root){
		openList.clear();
		startNode = root;
		startNode.parentNode =  null;
	}
	
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
		float maxXWidth = 256;
		float minXWidth = 40;
		if(startNode != null)
			openList.add(startNode);
		while((System.currentTimeMillis() - startTime <= maxTime)
				&& searchNum < maxNumber){
			AStarNode searchNode = openList.poll();
			if(searchNode == null){
				break;
			}
			ArrayList<boolean[]> possibleActions = TSimulator.getPossibleActions(searchNode);
			int preDamage = TSimulator.getMarioDamage(searchNode.sceneSnapShot);
			
			for(boolean[] action : possibleActions){
				searchNum++;
				LevelScene snapShot = TSimulator.backupState(searchNode.sceneSnapShot);
				TSimulator.advanceStep(snapShot, action);
				if(TSimulator.getMarioDamage(snapShot) > preDamage){
					//如果一个行动导致马里奥受到伤害，则放弃这个行动
					System.out.println("Will damage:" + (snapShot.mario.damage - preDamage));
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
	
	public AStarNode getBestNode(){
		return currentBestNode;
	}
}
