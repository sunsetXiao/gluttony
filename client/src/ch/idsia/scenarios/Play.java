package ch.idsia.scenarios;

import ch.idsia.ai.agents.Agent;
import ch.idsia.ai.agents.AgentsPool;
import ch.idsia.ai.agents.human.HumanKeyboardAgent;
import ch.idsia.ai.tasks.ProgressTask;
import ch.idsia.ai.tasks.Task;
import ch.idsia.mario.engine.GlobalOptions;
import ch.idsia.tools.CmdLineOptions;
import ch.idsia.tools.EvaluationOptions;

/**
 * Created by IntelliJ IDEA.
 * User: julian
 * Date: May 5, 2009
 * Time: 12:46:43 PM
 */

/**
 * The <code>Play</code> class shows how simple is to run an iMario benchmark.
 * It shows how to set up some parameters, create a task,
 * use the CmdLineParameters class to set up options from command line if any.
 * Defaults are used otherwise.
 *
 * @author  Julian Togelius, Sergey Karakovskiy
 * @version 1.0, May 5, 2009
 * @since   JDK1.0
 */

public class Play {
    /**
     * <p>An entry point of the class.
     *
     * @param args input parameters for customization of the benchmark.
     *
     * @see ch.idsia.scenarios.MainRun
     * @see ch.idsia.tools.CmdLineOptions
     * @see ch.idsia.tools.EvaluationOptions
     *
     * @since   iMario1.0
     */

    public static void main(String[] args) 
    {        
    	  //Agent controller = new HumanKeyboardAgent();
    		
         // Agent controller =  AgentsPool.load ("ch.idsia.ai.agents.ai.ForwardAgent");
    	 //Agent controller =  AgentsPool.load ("competition.cig.robinbaumgarten.AStarAgent");
    	 //Agent controller =  AgentsPool.load ("competition.cig.andysloane.AndySloane_BestFirstAgent");
    	//Agent controller =  AgentsPool.load ("competition.cig.peterlawford.PeterLawford_SlowAgent");
    	//Agent controller =  AgentsPool.load ("ch.idsia.ai.agents.ai.MyAgent");
    	Agent controller =  AgentsPool.load ("competition.cig.robinbaumgarten.MyAgent");
          //AgentsPool.addAgent(controller);
         EvaluationOptions options = new CmdLineOptions(new String[0]);

        options.setAgent(controller);
        
        Task task = new ProgressTask(options);
        options.setMaxFPS(false);
       // GlobalOptions.FPS = 4;
   
        options.setVisualization(true);
        options.setNumberOfTrials(1);
        
        
        options.setMatlabFileName("");
        options.setLevelRandSeed((int) (Math.random () * Integer.MAX_VALUE));
        options.setLevelDifficulty(5);
        
        task.setOptions(options);

        System.out.println ("Score: " + task.evaluate (controller)[0]);

        
    }
}
