package competition.cig.robinbaumgarten.astar;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Point;
import java.util.Iterator;
import java.util.Vector;

import javax.swing.JFrame;
import javax.swing.JPanel;

public class VisualizeSimulator extends JFrame{
	
	public static VisualizeSimulator getSingleton(){
		if(SINGLETON == null){
			SINGLETON = new VisualizeSimulator();
		}
		return SINGLETON;
		
	}
	private static VisualizeSimulator SINGLETON = null;
	public VisualizeSimulator(){
		super();
		panel = new MyPanel();
		this.add(panel);
		this.setPreferredSize(panel.getPreferredSize());
		this.setSize(panel.getPreferredSize());
		this.setVisible(true);
	}
	
	private MyPanel panel;
	public void drawTrace(LevelScene scene,AStarNode targetNode){
		float x = scene.mario.x;
		float y = scene.mario.y;
		Point marioPosPoint = new Point(11 * 16,11 * 16);
		AStarNode node = targetNode;
		
		Vector<Point> vector = new Vector<>();
		float[] pos = new float[2];
		while(node != null && node.parentNode != null){
			pos[0] = node.sceneSnapShot.mario.x - x;
			pos[1] = node.sceneSnapShot.mario.y - y;
			vector.add(floatToInt(pos));
			node = node.parentNode;
		}
		panel.setPos(marioPosPoint, vector);
		//this.invalidate();
		paintAll(getGraphics());
	}
	private Point floatToInt(float[] pos){
		return new Point((int)((11 + pos[0] / 16) * 16),(int)((11 + pos[1] / 16) * 16));
	}
	private class MyPanel extends JPanel{
		Point marioPos;
		Vector<Point> tracePos = new Vector<>();
		private static final int RECT_LENGTH = 5; 
		public MyPanel(){
			super();
			this.setPreferredSize(new Dimension(22 * 16,22 * 16));
		}
		public void setPos(Point mp,Vector<Point> vp){
			marioPos = mp;
			tracePos = vp;
		}
		
		@Override
		public void paintComponent(Graphics g){
			g.setColor(Color.WHITE);
			g.clearRect(0, 0, this.getWidth(), this.getHeight());
			g.setColor(Color.BLACK);
			g.drawRect(marioPos.x - RECT_LENGTH,
					marioPos.y - RECT_LENGTH, 
					RECT_LENGTH * 2, RECT_LENGTH * 2);
			Iterator<Point> iterator = tracePos.iterator();
			while(iterator.hasNext()){
				Point point = iterator.next();
				g.drawOval(point.x - RECT_LENGTH / 2,
						point.y - RECT_LENGTH / 2, 
						RECT_LENGTH, RECT_LENGTH);
			}
		}
	}
}
