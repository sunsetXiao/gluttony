package ch.idsia.ai.agents.ai;

import ch.idsia.ai.agents.Agent;
import ch.idsia.mario.environments.Environment;

import competition.cig.robinbaumgarten.astar.MySimulator;
import competition.cig.robinbaumgarten.astar.LevelScene;
import competition.cig.robinbaumgarten.astar.TSimulator;
import competition.cig.robinbaumgarten.astar.TaylorsSimulator;


public class MyAgent extends BasicAIAgent implements Agent
{
	boolean[] action = new boolean[Environment.numberOfButtons];
	private TSimulator sim;						// 场景模拟器
	byte[][] scene;									// 场景信息
	float[] enemies;								// 敌人信息
    private int currentStep = 0;					// 制定的行动方案执行的步数
    public static final int continousSteps = 4;		// 每次连续执行或模拟的步数
    boolean[][] ActionChoice;						// 可选的行动列表
    int choice;										// 选择的行动代号
    int[][][] possibleMax = new int[9][9][9];		//粗略计算的各行动序列对于的x位移量
    boolean findBestChoice;							// 是否找到最佳的行动选择
 	int preDam;										// 模拟前mario受伤害的值
 	float preX, preY;								// 模拟前mario的x、y位置
// 	private long count = 0, time = 0;				// 算法所用时间  
 	
    public MyAgent(){
       super("MyAgent");
       sim = new TSimulator();
       init();
    }
    
    private void init() 
    {
    	// 初始化可选的动作列表
    	ActionChoice    = new boolean[10][];
    	ActionChoice[0] = new boolean[] {false,true,false,false,true};
    	ActionChoice[1] = new boolean[] {false,true,false,true,true};
    	ActionChoice[2] = new boolean[] {false,true,false,false,false};
    	ActionChoice[3] = new boolean[] {false,true,false,true,false};
    	ActionChoice[4] = new boolean[] {false,false,false,false,false};
    	ActionChoice[5] = new boolean[] {false,false,false,true,false};
    	ActionChoice[6] = new boolean[] {true,false,false,false,false};
    	ActionChoice[7] = new boolean[] {true,false,false,true,false};
    	ActionChoice[8] = new boolean[] {true,false,false,false,true};
    	
    	// 初始化粗略估计的最大x位移值
    	for(int i = 0;i < 9;i++)
    	{
    		for(int j = 0;j < 9;j++)
    		{
    			for(int k = 0;k < 9;k++)
    			{
    				possibleMax[i][i][k] = boolToInt(ActionChoice[i]) + boolToInt(ActionChoice[j]) + boolToInt(ActionChoice[k]);
    			}
    		}
    	}
    }
    
    public int boolToInt(boolean[] ac)
    {
    	if(ac[1] && ac[4])	return 2;
    	if(ac[1])			return 1;
    	if(ac[4])			return -2;
    	if(ac[0])			return -1;
    	return 0;
    }// 根据行动粗略地估计x位移量并转化为int
   
    public void decideAction()
    {
		// 如果mario前面是一个炮台，就让它跳吧
		if(scene[11][12] == 46 || scene[11][12] == 30)
		{
			for(int i = 0;i < 5;i++)
			{
				action[i] = ActionChoice[choice][i];
			}
			action[3] = true;
		}
		// 如果没有找到最佳路径，那就拼命往回走吧
		else if(!findBestChoice)
		{
			action[0] = true;
			action[1] = false;
			action[3] = false;
			action[4] = true;
		}
		// 如果找到最佳路径，那就根据选择的动作走下去吧
		else
		{
			for(int i = 0;i < 5;i++)
			{
				action[i] = ActionChoice[choice][i];
			}
		}
    }
    
    private void continueStep()
    {	
		// 下面两种情况为mario卡在了台阶前，通过改变相应的动作使mario脱离困境
		if(action[3] && preY == sim.levelScene.mario.y)
		// 情形1：由于mario的jump键一直处于被按下状态
		{
			action[3] = false;
		}
		else if(!action[3] && preY == sim.levelScene.mario.y && preX == sim.levelScene.mario.x)
		// 情形2：mario的行动为一直往右走但是并不跳，于是可以将动作设定为往回走一步
		// 通过这样来改变场景状态从而改变搜索到的行动策略
		{
			action[0] = true;
			action[1] = false;
			action[4] = true;
		}
    }
    
    public boolean[] getAction(Environment observation)
    {
 //   	long startTime = System.currentTimeMillis();		// 获得起始时间
    	
		scene  = observation.getLevelSceneObservationZ(0);	// 得到场景
		enemies = observation.getEnemiesFloatPos();			// 得到敌人位置
		
		sim.advanceStep(action);							//
		sim.setLevelPart(scene, enemies);					// 更新场景
		
    	if(currentStep > 0)			// 如果此前制定好的行动中还有未执行完的则继续执行
    	{
    		currentStep--;
    		continueStep();			// 解决一些mario被困住的情况
    		return action;
    	}
    	
     	LevelScene tpl = sim.backupState();			// 备份场景
     	preDam = sim.getMarioDamage();   			// 模拟前受伤
     	preX = sim.levelScene.mario.x; 				// 模拟前x
     	preY = sim.levelScene.mario.y; 				// 模拟前y
     	findBestChoice = false; 					// 是否找到最佳路径
     	float max = -96;							// 记录行动序列完成后x的增加量
     	int   max1= -6;								// 记录粗略估计的x增量
     	
     	System.out.println("PreX:" + preX + "-PreY:" + preY);
     	// 搜索所有可能的路径，从中找到最优路径（伤害为0且x增量尽可能大）
     	// 共搜索12步，分为3段，每段的4步动作一样
		for(int i = 0;i < 8;i++)					// 第一个4步
		{
			//sim.restoreState(tpl);
			//tpl = sim.backupState();
			// 如果找到最佳路径则根据粗略估计的x增量进行剪枝判断
			if(findBestChoice)						
			{
				if(max1 > possibleMax[i][0][0]+2)	break;
			}
			
			// 将连续的4步动作输入模拟器
			for(int s = 0;s < continousSteps;s++)	
				sim.advanceStep(ActionChoice[i]);
			
			// 如果受到伤害则剪枝		
			if(sim.getMarioDamage() > preDam)
			{
				sim.restoreState(tpl);				//保存回去场景
				tpl = sim.backupState();
				continue;
			}
			LevelScene secondSavedLevelScene = sim.backupState();
			for(int j = 0;j < 9;j++)				// 第二个4步
			{
				//sim.restoreState(secondSavedLevelScene);
				//secondSavedLevelScene = sim.backupState();
				if(findBestChoice)					// 同上
				{
					if(max1 > possibleMax[i][j][0]+2)	break;
				}
				for(int s = 0;s < continousSteps;s++)
					sim.advanceStep(ActionChoice[j]);
				if(sim.getMarioDamage() > preDam)
				{
					sim.restoreState(tpl);					
					tpl = sim.backupState();
					continue;
				}
				
				LevelScene thirdLevelScene = sim.backupState();
				for(int k = 0;k < 9;k++)			// 第三个4步
				{
					//sim.restoreState(thirdLevelScene);
					//thirdLevelScene = sim.backupState();
					if(findBestChoice)				// 同上
					{
						if(max1 > possibleMax[i][j][k]+2)	break;
					}
					
					for(int s = 0;s < continousSteps;s++)
						sim.advanceStep(ActionChoice[k]);
					
					// 受到伤害则不可能是最佳路径
					if(sim.getMarioDamage() > preDam )	
					{
						sim.restoreState(tpl);			
						tpl = sim.backupState();
						continue;
					}
					// 如果没有受到伤害则可能是最佳路径
					else							
					{
						// 如果此时x增量比此时最大x增量大，则此路径为当前最佳路径
						if(max < sim.levelScene.mario.x - preX)
						{
							findBestChoice = true;
							max = sim.levelScene.mario.x - preX;
							max1= possibleMax[i][j][k];
							choice = i;
						}

						sim.restoreState(tpl);				//保存回去场景
						tpl = sim.backupState();
					}
				}
			}		
		}
		
		decideAction();
		currentStep = 1;										// 每次连续行动2次
//		System.out.println(choice);
//		time += System.currentTimeMillis()-startTime;			// 算法所需时间
//    	System.out.print(System.currentTimeMillis()-startTime);
//    	count++;
//    	System.out.println(time / count);
    	return action;
    }
    
}
