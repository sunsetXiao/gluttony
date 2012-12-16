package competition.cig.robinbaumgarten.astar;

import com.sun.xml.internal.bind.v2.runtime.unmarshaller.LocatorEx.Snapshot;



public class AStarNode implements Comparable<AStarNode>{
	public AStarNode parentNode;
	public LevelScene sceneSnapShot;
	public boolean[] beforeAction;
	
	public float currentDistanceFromOrigin;
	public float currentSpeed;
	public int repeatStepsNumber;
	public int currentStepNumber;
	public float accumulateRealCost;
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
	
	private void calculateCost(){
		float[] disAndSpeed = TSimulator.estimateMaximumForwardMovement(currentSpeed,
				TSimulator.RUSHING_ACTION, TSimulator.DEFAULT_STEP_REPETITION);
		estimateCost = TSimulator.MAX_MAP_LENGTH - currentDistanceFromOrigin - disAndSpeed[0];
	}
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