package competition.cig.robinbaumgarten.astar;

import competition.cig.robinbaumgarten.astar.level.Level;

public class MySimulator {
	
    public LevelScene levelScene;
	
	public MySimulator()
	{
		levelScene = new LevelScene();
		levelScene.init();	
		levelScene.level = new Level(1500,15);
	}// 构造函数
	
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
