package competition.cig.robinbaumgarten.astar;

import java.util.ArrayList;

import ch.idsia.mario.engine.sprites.Mario;
import competition.cig.robinbaumgarten.astar.level.Level;

public class TSimulator {
	public LevelScene levelScene;
	
	public final static float MAX_MAP_LENGTH = 100000;
	public final static boolean[] DEFAULT_ACTION = {false,true,false,false,false};
	public final static boolean[] RUSHING_ACTION = {false,true,false,false,true};
	public final static boolean[] WORST_SITUATION_ACTION = {true,false,false,false,false};
	public final static boolean[] PASSIVE_ACTION = {false,false,false,false,false};
	public final static float maxMarioSpeed = 10.9090909f;
	public final static int DEFAULT_STEP_REPETITION = 1;
	
	public TSimulator()
	{
		levelScene = new LevelScene();
		levelScene.init();	
		levelScene.level = new Level(1500,15);
	}// 构造函数
	
	public void advanceStep(boolean[] action)
	{
		levelScene.mario.setKeys(action);

		levelScene.tick();
	}
	public static void advanceStep(LevelScene l,boolean[] action){
		l.mario.setKeys(action);
		l.tick();
	}
	
	public void setLevelPart(byte[][] levelPart, float[] enemies){
    	levelScene.setLevelScene(levelPart);
    	levelScene.setEnemies(enemies);
	}
	
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
	}
	public static LevelScene backupState(LevelScene l){
		LevelScene sceneCopy = null;
		try
		{
			sceneCopy = (LevelScene) l.clone();
		} catch (CloneNotSupportedException e)
		{
			e.printStackTrace();
		}
		
		return sceneCopy;
	}
	
	public void restoreState(LevelScene l)
	{
		LevelScene sceneCopy = null;
		try
		{
			sceneCopy = (LevelScene) l.clone();
		} catch (CloneNotSupportedException e)
		{
			e.printStackTrace();
		}
		levelScene = sceneCopy;
	}// 重新载入场景信息
	public static boolean canJump(AStarNode currentPos, boolean checkParent)
    {
		/*
    	if (currentPos.parentNode != null && checkParent
    			&& canJump(currentPos.parentNode, false))
    			return true;
    	return currentPos.sceneSnapShot.mario.mayJump() || 
    			(currentPos.sceneSnapShot.mario.jumpTime > 0) 
    			//|| currentPos.sceneSnapShot.mario.isOnGround()
    			;*/
		return currentPos.sceneSnapShot.mario.mayJump()
				|| (currentPos.sceneSnapShot.mario.jumpTime > 0);
    }
    public int getMarioDamage()
    {
    	if (levelScene.level.isGap[(int) (levelScene.mario.x/16)] &&
    			levelScene.mario.y > levelScene.level.gapHeight[(int) (levelScene.mario.x/16)]*16)
    	{
    		System.out.println("Gap height: "+levelScene.level.gapHeight[(int) (levelScene.mario.x/16)]);
    		return levelScene.mario.damage + 5;
    	}
    	return levelScene.mario.damage;
    }// 获取mario收到伤害的值
    static public int getMarioDamage(LevelScene scene){
    	if (scene.level.isGap[(int) (scene.mario.x/16)] &&
    			scene.mario.y > scene.level.gapHeight[(int) (scene.mario.x/16)]*16)
    	{
    		//System.out.println("Gap height: "+scene.level.gapHeight[(int) (scene.mario.x/16)]);
    		return scene.mario.damage + 5;
    	}
    	return scene.mario.damage;
    }
    
    public static ArrayList<boolean[]> getPossibleActions(AStarNode node){
    	ArrayList<boolean[]> possibleActions = new ArrayList<boolean[]>();
    	
    	
    	//跳
    	if(canJump(node, true)){
    		possibleActions.add(createAction(false, false, false, true, false));
    		possibleActions.add(createAction(false, false, false, true, true));
    	}
    	
    	// run right
    	possibleActions.add(createAction(false, true, false, false, true));
    	possibleActions.add(createAction(false, true, false, false, false));
    	if(canJump(node, true)){
    		possibleActions.add(createAction(false, true, false, true, true));
        	possibleActions.add(createAction(false, true, false, true, false));
    	}
    	
    	// run left
    	possibleActions.add(createAction(true, false, false, false, false));
    	possibleActions.add(createAction(true, false, false, false, true));
    	if(canJump(node, true)){
    		possibleActions.add(createAction(true, false, false, true, false));
    		possibleActions.add(createAction(true, false, false, true, true));
    	}
    	//possibleActions.add(createAction(false, false, false, false, false));
    	return possibleActions;
    }
    
    /*
    public static ArrayList<boolean[]> getPossibleActions(AStarNode node){
    	ArrayList<boolean[]> possibleActions = new ArrayList<boolean[]>();
    	
    	//跳

    		possibleActions.add(createAction(false, false, false, true, false));
    		possibleActions.add(createAction(false, false, false, true, true));

    	
    	// run right
    	possibleActions.add(createAction(false, true, false, false, true));
    	possibleActions.add(createAction(false, true, false, false, false));

    		possibleActions.add(createAction(false, true, false, true, true));
        	possibleActions.add(createAction(false, true, false, true, false));

    	
    	
    	// run left
    	possibleActions.add(createAction(true, false, false, false, false));
    	possibleActions.add(createAction(true, false, false, false, true));

    		possibleActions.add(createAction(true, false, false, true, false));
    		possibleActions.add(createAction(true, false, false, true, true));

    	return possibleActions;
    }*/
    
    
    
    
    public static String printAction(boolean[] action)
    {
    	String s = "";
    	if (action[Mario.KEY_RIGHT]) s+= "Forward ";
    	if (action[Mario.KEY_LEFT]) s+= "Backward ";
    	if (action[Mario.KEY_SPEED]) s+= "Speed ";
    	if (action[Mario.KEY_JUMP]) s+= "Jump ";
    	if (action[Mario.KEY_DOWN]) s+= "Duck";
    	return s;
    }

    private static boolean[] createAction(boolean left, boolean right, boolean down, boolean jump, boolean speed)
    {
    	boolean[] action = new boolean[5];
    	action[Mario.KEY_DOWN] = down;
    	action[Mario.KEY_JUMP] = jump;
    	action[Mario.KEY_LEFT] = left;
    	action[Mario.KEY_RIGHT] = right;
    	action[Mario.KEY_SPEED] = speed;
    	return action;
    }
    
    protected static float[] estimateMaximumForwardMovement(float currentAccel, boolean[] action, int ticks)
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
    		currentAccel *= 0.89f;
    	}    	
    	float[] ret = new float[2];
    	ret[0] = dist;
    	ret[1] = currentAccel;
    	return ret;
    }
}
