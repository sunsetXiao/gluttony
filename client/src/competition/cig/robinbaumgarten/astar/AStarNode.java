package competition.cig.robinbaumgarten.astar;



/**
 * 用于在A星搜索中的结点类
 * @author 张泰源
 *
 */
public class AStarNode implements Comparable<AStarNode>{
	/**
	 * 在搜索时该结点的上一个结点
	 */
	public AStarNode parentNode;
	/**
	 * 当前结点对应的场景快照
	 */
	public LevelScene sceneSnapShot;
	/**
	 * 从上一个结点达到这个结点的动作
	 */
	public boolean[] beforeAction;
	
	/**
	 * 离起点的距离
	 */
	public float currentDistanceFromOrigin;
	/**
	 * 当前速度
	 */
	public float currentSpeed;
	/**
	 * 动作的重复次数
	 */
	public int repeatStepsNumber;
	/**
	 * 从搜索的根节点到当前结点经过了多少部动作
	 */
	public int currentStepNumber;
	/**
	 * 从搜索的根节点到当前结点积累的实际开销
	 */
	public float accumulateRealCost;
	/**
	 * 总开销,包括实际开销与预测开销
	 */
	public float estimateCost;
	public AStarNode(boolean[] action,AStarNode parent,int repetition,LevelScene snapshot){
		beforeAction = action;
		parentNode = parent;
		repeatStepsNumber = repetition;
		if(parent != null){
			currentStepNumber = parent.currentStepNumber + this.repeatStepsNumber;
		}else{
			currentStepNumber = 0;
		}
		sceneSnapShot = snapshot;
		currentDistanceFromOrigin = sceneSnapShot.mario.x;
		currentSpeed = sceneSnapShot.mario.xa;
		calculateCost();
	}
	/**
	 * 计算总开销
	 */
	private void calculateCost(){
		//这里采取了比较Naive的策略，单纯看以当前结点的速度有多快，离目标有多远作为判断的标准
		//也就是说，只考虑了启发式的开销，而没有考虑实际的开销，有待改善
		float[] disAndSpeed = TSimulator.estimateMaximumForwardMovement(currentSpeed,
				TSimulator.RUSHING_ACTION, TSimulator.DEFAULT_STEP_REPETITION);
		estimateCost = TSimulator.MAX_MAP_LENGTH - currentDistanceFromOrigin - disAndSpeed[0];
	}
	/*
	private void calculateCost(){
		//float[] disAndSpeed = TSimulator.estimateMaximumForwardMovement(currentSpeed,
			//	TSimulator.RUSHING_ACTION, TSimulator.DEFAULT_STEP_REPETITION);
		float actuallycost = currentStepNumber * 4.0f;
		estimateCost = TSimulator.MAX_MAP_LENGTH - currentDistanceFromOrigin + actuallycost;
	}*/
	/*
	private void calculateCost(){
		if(parentNode == null){
			accumulateRealCost = 0;
		}else{
			float newCost;
			//float[] disAndSpeed = TSimulator.estimateMaximumForwardMovement(parentNode.currentSpeed, 
			//		TSimulator.RUSHING_ACTION, repeatStepsNumber);
			float dis = estimateMaxForwad(parentNode.currentSpeed, parentNode.repeatStepsNumber);
			newCost = dis - (currentDistanceFromOrigin - parentNode.currentDistanceFromOrigin);
			//if(newCost < 0) System.out.println("Error in cost estimate!=============");
			//System.out.println(newCost);
			//newCost *= 0.5f;
			accumulateRealCost = newCost + parentNode.accumulateRealCost;
		}
		estimateCost = TSimulator.MAX_MAP_LENGTH - currentDistanceFromOrigin + accumulateRealCost;
	}*/
	private float estimateMaxForwad(float speed,int repetition){
		//return TSimulator.maxMarioSpeed * repetition;
		
		float dis = 0;
		for (int i = 0; i < repetition; i++) {
			speed += 1.2;
			speed = Math.min(speed, TSimulator.maxMarioSpeed);
			dis += speed;
		}
		return dis;
	}
	
	
	public float getCost(){
		return estimateCost;
	}
	@Override
	public int compareTo(AStarNode node) {
		return (int)(this.getCost() - node.getCost());
	}
	
}