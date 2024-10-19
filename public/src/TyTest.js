class Example extends Phaser.Scene
{
    preload(){
        //this.load.setBaseURL('./assets');
        this.load.image('Startblock', './assets/StartBlock.png');
        this.load.image('Fireblock', './assets/FireBlock.png');
        this.load.image('GoBlock', './assets/GoBlock.png');
    }
    constructor()
    {
        super();
    }

    create()
    {
        const body1 = this.matter.add.image(400, 150, 'Startblock').setStatic(true).setName("Start");
        const body2 = this.matter.add.image(600, 350, 'Fireblock').setStatic(true).setName("Fire");
        const Gobody = this.matter.add.image(200, 550, 'GoBlock').setStatic(true).setName("Go");
        Gobody.setInteractive();
        
        const fillOver = 0xff0000;
        const strokeOver = 0xffff00;
        const lineThicknessOver = 4;

        var Connections = {}

        // Dragging stuff
        const bodies = [ body1, body2];
        var SelectedBlock = -1 // the block we are dragging
        var isDragging = false // If we are dragging
        var ConnectedBlock // The block we are connecting to
        this.input.on('pointermove', function (pointer) {
            const x = pointer.worldX;
            const y = pointer.worldY;

            if (isDragging  && SelectedBlock !=null){

                bodies[SelectedBlock].setPosition(x,y)
                
                //remove this from table
                for(var i in Connections){
                    if(Connections[i] == SelectedBlock){
                        delete Connections[i]
                        break;
                    }
                }
                var tempBlock = SelectedBlock
                while (Connections[tempBlock]!= null){
                    var bounds = bodies[tempBlock].getBounds();
                    var newX = bounds.x + bounds.width/2;
                    var newY = bounds.y + bounds.height+bounds.height/2;
                    bodies[Connections[tempBlock]].setPosition(newX,newY);
                    tempBlock= Connections[tempBlock]
                };
                
                // ConnectingBlocks
                var hit = false
                for (let i = 0; i < bodies.length; i++)
                {
                    const body = bodies[i];
                    if (i!= SelectedBlock){ //If not the block we are moving
                        if (this.matter.containsPoint(body, x, y))
                        {
                            hit = true
                            ConnectedBlock = i
                            this.matter.world.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
                            //body.setTint(0xffffff)
                        }
                        else
                        {
                            //body.setTint(0xff0000)
                            this.matter.world.setBodyRenderStyle(body);
                        }
                    }

                }
                if (!hit) {
                    ConnectedBlock = null;
                }
            }
            else
            {   
                var hit = false
                for (let i = 0; i < bodies.length; i++)
                {
                    const body = bodies[i];

                    if (this.matter.containsPoint(body, x, y))
                    {
                        hit = true
                        SelectedBlock = i
                        this.matter.world.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
                    }
                    else
                    {
                        this.matter.world.setBodyRenderStyle(body);
                    }
                }
                if (!hit) {
                    SelectedBlock = null;
                }
            }
            

        }, this);
        this.input.on('pointerdown', function (pointer) {
            isDragging = true;
        },this);
        this.input.on('pointerup', function (pointer) {
            isDragging = false;
            
            if (ConnectedBlock!=null && SelectedBlock != null){
                //If we are connecting with something then connect
                var MainBody = bodies[ConnectedBlock];
                var MovedBody = bodies[SelectedBlock];

                var MainBounds = MainBody.getBounds();
                var MovedBounds = MovedBody.getBounds();

                var ConnectionPointX = MainBounds.x + MainBounds.width/2;
                var ConnectionPointY = MainBounds.y + MainBounds.height + MovedBounds.height/2;

                MovedBody.setPosition(ConnectionPointX,ConnectionPointY);

                //Add list to array of commands
                if (Connections[ConnectedBlock]!=null){ // If it already exists then we want to place this new block in the middle
                    var temp = Connections[ConnectedBlock]
                    delete Connections[ConnectedBlock]
                    Connections[ConnectedBlock] = SelectedBlock
                    Connections[SelectedBlock] = temp

                    //move everthing down
                    var tempBlock = SelectedBlock
                    while (Connections[tempBlock]!= null){
                        var bounds = bodies[tempBlock].getBounds();
                        var newX = bounds.x + bounds.width/2;
                        var newY = bounds.y + bounds.height+bounds.height/2;
                        bodies[Connections[tempBlock]].setPosition(newX,newY);
                        tempBlock= Connections[tempBlock]
                    };
                }
                Connections[ConnectedBlock] = SelectedBlock
                console.log(Connections)
            };
            


        },this);
        
        Gobody.on('pointerup', () =>
        {
            //Run the code
            //Find the Start Block
            var startID = null
            var i
            for (i in Connections){
                console.log(bodies[i].name)
                if (bodies[i].name == "Start"){
                    startID = i;
                    
                }
            }
            console.log(startID)
            var tempID = startID
            while (Connections[tempID] != null){
                console.log(bodies[Connections[tempID]].name)
                if (bodies[Connections[tempID]].name == "Fire")
                {
                    Gobody.destroy();
                    console.log("fired")
                }
               
                tempID = Connections[tempID];
            }


        });

    }
    update ()
    {
        
    }
}



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            debug: {}
        }
    },
    scene: Example
};

const game = new Phaser.Game(config);