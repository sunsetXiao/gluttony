package competition.cig.robinbaumgarten;

import java.util.ArrayList;
import java.util.Vector;

import competition.cig.robinbaumgarten.astar.AStarModel;
import competition.cig.robinbaumgarten.astar.AStarNode;
import competition.cig.robinbaumgarten.astar.LevelScene;
import competition.cig.robinbaumgarten.astar.TSimulator;
import competition.cig.robinbaumgarten.astar.TaylorsSimulator;
import competition.cig.robinbaumgarten.astar.TaylorsSimulator.SearchNode;
import competition.cig.robinbaumgarten.astar.VisualizeSimulator;

import ch.idsia.ai.agents.Agent;
import ch.idsia.ai.agents.ai.BasicAIAgent;
import ch.idsia.mario.engine.sprites.Mario;
import ch.idsia.mario.environments.Environment;

public class MyAgent extends BasicAIAgent implements Agent{

	public static final String AGENT_NAME = "Taylor_SimpleAgent";
	TSimulator simulator = new TSimulator();
	private boolean[] action = new boolean[Environment.numberOfButtons];
	private AStarNode currentTargetNode = null;
	ArrayList<boolean[]> currentActionsPlan = new ArrayList<>();
	
	
	public MyAgent() {
		super(AGENT_NAME);
	}
	
	float preX = -1;
	float preY = -1;
	int repeatXTimes = 0;
	final int maxAllowableRepeatXTimes = 10;
	@Override
	public boolean[] getAction(Environment observation){
		
		byte[][] scene  = observation.getLevelSceneObservationZ(0);	// 得到场景
		float[] enemies = observation.getEnemiesFloatPos();			// 得到敌人位置
		
		simulator.advanceStep(action);							//
		simulator.setLevelPart(scene, enemies);					// 更新场景
		
		
		/*if(currentActionsPlan.size() > 0){
			action = currentActionsPlan.remove(0);
			
			//System.out.println(TSimulator.printAction(action) + "("
			//		+ simulator.levelScene.mario.x + "," + simulator.levelScene.mario.y + ")");
			
			
			return action;
		}*/
		
		AStarModel model = new AStarModel();
//		if(currentTargetNode == null){
		currentTargetNode = new AStarNode(null, null,
					TSimulator.DEFAULT_STEP_REPETITION, simulator.levelScene);
	//	}
		model.reset(currentTargetNode);
		model.search(300, 4000);
		
		currentTargetNode = model.getBestNode();
		currentActionsPlan = extractPlan(currentTargetNode);

		
		action = currentActionsPlan.remove(0);
		//adjustAction(action, simulator.levelScene);
		preX = simulator.levelScene.mario.x;
		preY = simulator.levelScene.mario.y;
		
		//VisualizeSimulator.getSingleton().drawTrace(simulator.levelScene, currentTargetNode);
		//System.out.println(TSimulator.printAction(action) + "("
			//	+ simulator.levelScene.mario.x + "," + simulator.levelScene.mario.y + ")");
		return action;
	}
	
	private void adjustAction(boolean[] action,LevelScene levelScene){
		if(preX != levelScene.mario.x){
			repeatXTimes = 0;
		}else{
			repeatXTimes++;
		}
//		if(repeatXTimes > maxAllowableRepeatXTimes && levelScene.mario.x == preX && action[Mario.KEY_JUMP]){
//			System.out.println("Adjusting, with repeat times be " + repeatXTimes);
//			action[Mario.KEY_JUMP] = false;
//		}
		if(levelScene.mario.x == preX && isPassive(action) && repeatXTimes >= maxAllowableRepeatXTimes){
			//action[Mario.KEY_JUMP] = action[Mario.KEY_RIGHT] = true;
			for (int i = 0; i < Environment.numberOfButtons; i++) {
				action[i] = TSimulator.WORST_SITUATION_ACTION[i];
			}
			System.out.println("Adjusting, with repeat times be " + repeatXTimes);
			repeatXTimes = 0;
		}
	}
	
	private boolean isPassive(boolean[] action){
		return !(action[0] || action[1] || action[2] || action[3] || action[4]);
	}
	public ArrayList<boolean[]> extractPlan(AStarNode node){
		ArrayList<boolean[]> plansArrayList = new ArrayList<>();
		if(node == null){
			//这意味着没有找到最佳路径, 不顾一切地采取默认方案
			boolean[] action = TSimulator.RUSHING_ACTION;
			System.out.println("Cannot find " + 
					"best solution, use default solution:" + 
					TSimulator.printAction(action));
			for (int i = 0; i < TSimulator.DEFAULT_STEP_REPETITION; i++) {
				plansArrayList.add(action);
			}
			return plansArrayList;
		}
		
		
		while(node.parentNode != null){
			for (int i = 0; i < node.repeatStepsNumber; i++) {
				plansArrayList.add(0, node.beforeAction);
			}
			node = node.parentNode;
		}
		//System.out.println("Find solution of length " + plansArrayList.size() + "!==========");
		return plansArrayList;
	}
}
