package competition.cig.robinbaumgarten.astar;

import java.util.ArrayList;
import java.util.Vector;

import sun.print.resources.serviceui;

import ch.idsia.mario.engine.sprites.Mario;
import competition.cig.robinbaumgarten.astar.level.Level;

public class TaylorsSimulator {
	public final static boolean[] DEFAULT_ACTION = {false,true,false,false,true};
	public final static boolean[] WORST_SITUATION_ACTION = {true,false,false,false,false};
	private final static float maxMarioSpeed = 10.9090909f;
	public final int STEP_REPETITION = 2;
	public LevelScene levelScene;
	//private int currentSoluctionRemationSteps = 0;
	private boolean requireReplanning = false;
	private boolean foundSafePlan = false;
	private SearchNode currentBestNode = null;
	Vector<boolean[]> currentActionsPlan = new Vector<>();
	public TaylorsSimulator(){
		levelScene = new LevelScene();
		levelScene.init();	
		levelScene.level = new Level(1500,15);
	}
	

	public boolean[] getBestAction(){
		//Just started, use default action
		if(currentActionsPlan.size() > 0 && !requireReplanning){
			return currentActionsPlan.remove(0);
		}
		searchPlan();
		requireReplanning = false;
		if(foundSafePlan){
			extractPlan(currentBestNode);
			//System.out.println("=======Find best!" + printAction(currentActionsPlan.get(0)));
		}else{
			currentActionsPlan.clear();
			for (int i = 0; i < STEP_REPETITION; i++) {
				currentActionsPlan.add(WORST_SITUATION_ACTION);
			}
		}
		return currentActionsPlan.remove(0);
	}
	private void extractPlan(SearchNode targetNode){
		SearchNode currentNode = targetNode;
		currentActionsPlan.clear();
		while(currentNode.parentNode != null){
			for (int i = 0; i < currentNode.repeatStepsNumber; i++) {
				currentActionsPlan.insertElementAt(currentNode.beforeAction, 0);
			}
			currentNode = currentNode.parentNode;
		}
		//currentSoluctionRemationSteps = currentActionsPlan.size();
	}
	private void searchPlan(){
		foundSafePlan = false;
		float bestCost = 10000;
		//Two round
		SearchNode rootNode = new SearchNode(null, null, STEP_REPETITION, levelScene);
		ArrayList<boolean[]> possibleActions = getAllPossibleAction(levelScene);
		float preX = levelScene.mario.x;
		float preY = levelScene.mario.y;
		System.out.print("(" + preX + "," + preY + ")-");
		for (int a1 = 0; a1 < possibleActions.size(); a1++) {
			LevelScene backup = backupState();
			boolean[] firstRoundAction = possibleActions.get(a1);
			int beforeHarm = getMarioDamage();
			for(int i = 0;i < STEP_REPETITION;i++){
				advanceStep(firstRoundAction);
			}
			float currentX = levelScene.mario.x;
			float curentY = levelScene.mario.y;
			//System.out.println("(" + currentX + "," + curentY + ")-1 " + printAction(firstRoundAction));
			//If hurt, find another one
			int afterHarm = getMarioDamage();
			if(afterHarm > beforeHarm){
				restoreState(backup);
				continue;
			}else{
				//System.out.println("Not Harmed, go on, in the first round");
			}
			SearchNode firstRoundNode = new SearchNode(firstRoundAction, rootNode, STEP_REPETITION, levelScene);
			ArrayList<boolean[]> secondRound = getAllPossibleAction(levelScene);
			for (int a2 = 0; a2 < secondRound.size(); a2++) {
				LevelScene secondRoundBackup = backupState();
				boolean[] secondRoundAction = secondRound.get(a2);
				beforeHarm = getMarioDamage();
				for(int i = 0;i < STEP_REPETITION;i++){
					advanceStep(secondRoundAction);
				}
				currentX = levelScene.mario.x;
				curentY = levelScene.mario.y;
				//System.out.println("(" + currentX + "," + curentY + ")-2 " + printAction(secondRoundAction));
				afterHarm = getMarioDamage();
				if(afterHarm > beforeHarm){
					restoreState(secondRoundBackup);
					continue;
				}
				//Evaluate the result
				SearchNode secondRoundNode = new SearchNode(
						secondRoundAction, firstRoundNode, STEP_REPETITION, levelScene);
				float cost = secondRoundNode.getEstimateTotalCost();
				if(cost < bestCost){
					System.out.println("Best:" + cost + "--" + printAction(secondRoundAction));
					foundSafePlan = true;
					currentBestNode = secondRoundNode;
				}
				restoreState(secondRoundBackup);
			}
			restoreState(backup);
		}
		
	}
	
	
	


	public boolean[] makeAction(boolean leftPress,boolean rightPress,boolean downPress,boolean jumpPress,boolean speedPress){
		boolean[] action = new boolean[5];
		action[Mario.KEY_DOWN] = downPress;
    	action[Mario.KEY_JUMP] = jumpPress;
    	action[Mario.KEY_LEFT] = leftPress;
    	action[Mario.KEY_RIGHT] = rightPress;
    	action[Mario.KEY_SPEED] = speedPress;
		return action;
	}

	private ArrayList<boolean[]> getAllPossibleAction(LevelScene currentScene){
		//TODO:
		boolean[][] ActionChoice    = new boolean[9][];
		ActionChoice[0] = new boolean[] {false,true,false,false,true};
    	ActionChoice[1] = new boolean[] {false,true,false,true,true};
    	ActionChoice[2] = new boolean[] {false,true,false,false,false};
    	ActionChoice[3] = new boolean[] {false,true,false,true,false};
    	ActionChoice[4] = new boolean[] {false,false,false,false,false};
    	ActionChoice[5] = new boolean[] {false,false,false,true,false};
    	ActionChoice[6] = new boolean[] {true,false,false,false,false};
    	ActionChoice[7] = new boolean[] {true,false,false,true,false};
    	ActionChoice[8] = new boolean[] {true,false,false,false,true};
    	ArrayList<boolean[]> results = new ArrayList<>();
    	for (int i = 0; i < ActionChoice.length; i++) {
			results.add(ActionChoice[i]);
		}
		return results;
	}
	public class SearchNode{
		SearchNode parentNode;
		LevelScene sceneSnapShot;
		//The action to be done to reach this node
		boolean[] beforeAction;
		
		float currentDistanceFromOrigin;
		int repeatStepsNumber;
		int currentStepNumber;
		float estimateRemainTimeTick;
		public SearchNode(boolean[] action,SearchNode parent,int repetition,LevelScene snapshot){
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
			estimateRemainTimeTick = estimateRemainingTimeChild(beforeAction, this.repeatStepsNumber); 
		}
		public float getEstimateTotalCost(){
			return 1.0f / sceneSnapShot.mario.x;
			//return (float)currentStepNumber + estimateRemainTimeTick;
		}
		private float estimateRemainingTimeChild(boolean[] action, int repetitions)
		{
			return calcRemainingTime(sceneSnapShot.mario.x,sceneSnapShot.mario.xa);			
		}
		
	}
	
	 private float maxForwardMovement(float initialSpeed, int ticks){
    	float y = ticks;
    	float s0 = initialSpeed;
    	return (float) (99.17355373 * Math.pow(0.89,y+1)
    	  -9.090909091*s0*Math.pow(0.89,y+1)
    	  +10.90909091*y-88.26446282+9.090909091*s0);
    }
	 
	private float calcRemainingTime(float marioX, float marioXA)
	{
		return (100000 - (maxForwardMovement(marioXA, 1000) + marioX)) 
			/ maxMarioSpeed - 1000;
	}
	private float[] estimateMaximumForwardMovement(float currentAccel, boolean[] action, int ticks)
    {
    	float dist = 0;
    	float runningSpeed =  action[Mario.KEY_SPEED] ? 1.2f : 0.6f;
    	int dir = 0;
    	if (action[Mario.KEY_LEFT]) dir = -1;
    	if (action[Mario.KEY_RIGHT]) dir = 1;
    	for (int i = 0; i < ticks; i++)
    	{
    		currentAccel += runningSpeed * dir;
    		dist += currentAccel;
    		//System.out.println("Estimator of Fastforward Speed, Tick "+i+" speed: "+currentAccel);
    		currentAccel *= 0.89f;
    	}    	
    	float[] ret = new float[2];
    	ret[0] = dist;
    	ret[1] = currentAccel;
    	return ret;
    }
	
	public String printAction(boolean[] action)
    {
    	String s = "";
    	if (action[Mario.KEY_RIGHT]) s+= "Forward ";
    	if (action[Mario.KEY_LEFT]) s+= "Backward ";
    	if (action[Mario.KEY_SPEED]) s+= "Speed ";
    	if (action[Mario.KEY_JUMP]) s+= "Jump ";
    	if (action[Mario.KEY_DOWN]) s+= "Duck";
    	return s;
    }
	
	public void advanceStep(boolean[] action)
	{
		levelScene.mario.setKeys(action);

		levelScene.tick();
	}// 设置mario动作
	
	public void setLevelPart(byte[][] levelPart, float[] enemies)
	{
    	levelScene.setLevelScene(levelPart);
    	levelScene.setEnemies(enemies);
	}// 设置场景和敌人
	
	public LevelScene backupState()
	{
		LevelScene sceneCopy = null;
		try
		{
			sceneCopy = (LevelScene) levelScene.clone();
		} catch (CloneNotSupportedException e)
		{
			e.printStackTrace();
		}
		
		return sceneCopy;
	}// 备份场景信息
	
	public void restoreState(LevelScene l)
	{
		levelScene = l;
	}// 重新载入场景信息
	
    public int getMarioDamage()
    {
    	if (levelScene.level.isGap[(int) (levelScene.mario.x/16)] &&
    			levelScene.mario.y > levelScene.level.gapHeight[(int) (levelScene.mario.x/16)]*16)
    	{
    		levelScene.mario.damage+=5;
    	}
    	return levelScene.mario.damage;
    }// 获取mario收到伤害的值
}
