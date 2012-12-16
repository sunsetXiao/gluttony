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
		
		
		AStarModel model = new AStarModel();

		//根据当前的场景初始化一个搜索结点
		currentTargetNode = new AStarNode(null, null,
					TSimulator.DEFAULT_STEP_REPETITION, simulator.levelScene);

		//以该点为起点搜索
		model.reset(currentTargetNode);
		model.search(300, 4000);
		
		//搜索完后，获得最佳的目标结点
		currentTargetNode = model.getBestNode();
		//根据目标结点获得行动计划
		currentActionsPlan = extractPlan(currentTargetNode);

		//虽然获得了一连串的行动计划，但是只执行第一步，下次重新搜索
		action = currentActionsPlan.remove(0);
		
		preX = simulator.levelScene.mario.x;
		preY = simulator.levelScene.mario.y;
		/*
		if(currentTargetNode == null){
			System.out.println("The damage of mario is " + simulator.levelScene.mario.damage);
		}*/
		//下面这句话是调试的时候监视搜索路径的轨迹用的，
		//VisualizeSimulator.getSingleton().drawTrace(simulator.levelScene, currentTargetNode);
		
		
		//System.out.println(TSimulator.printAction(action) + "("
			//	+ simulator.levelScene.mario.x + "," + simulator.levelScene.mario.y + ")");
		return action;
	}
	@Deprecated
	/**
	 * 用来调整的函数，已废弃
	 * @param action
	 * @param levelScene
	 */
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
			//System.out.println("Adjusting, with repeat times be " + repeatXTimes);
			repeatXTimes = 0;
		}
	}
	
	private boolean isPassive(boolean[] action){
		return !(action[0] || action[1] || action[2] || action[3] || action[4]);
	}
	/**
	 * 根据目标节点找行动计划
	 * @param node 目标节点
	 * @return 从当前节点走到目标节点的行动计划
	 */
	public ArrayList<boolean[]> extractPlan(AStarNode node){
		ArrayList<boolean[]> plansArrayList = new ArrayList<>();
		if(node == null){
			//这意味着没有找到最佳路径, 尝试往回走一点,退一步海阔天空
			boolean[] action = TSimulator.WORST_SITUATION_ACTION;
			/*
			System.out.println("Cannot find " + 
					"best solution, use default solution:" + 
					TSimulator.printAction(action));*/
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
