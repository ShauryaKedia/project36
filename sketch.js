//Create variables here
var dog, dogImg, happyDogImg,  database, foodS, foodStock, milkBottle,sadDog;
var feed, add;
var fedTime, lastFed;
var foodObj;
var readState,changeState;
var bedroomImg,gardenImg,washroomImg;

function preload(){
  dogImg = loadImage("Dog.png")
  happyDogImg = loadImage("happydog.png")
  bedroomImg = loadImage("images/Bed Room.png")
  gardenImg = loadImage("images/Garden.png")
  washroomImg = loadImage("images/Wash Room.png")


}

function setup() {
  createCanvas(1000,500);
  database = firebase.database();

  foodObj=new Food()  
  dog = createSprite(500,300,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95)
  feed.mousePressed(feedDog)
  
  add=createButton("Add Food");
  add.position(800,95)
  add.mousePressed(addFoods)
  

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}


function draw() {  
  background(46, 139, 87)
   
  foodObj.display()

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })



  fill(255,255,254)
  textSize(15)
  if(lastFed>=12){
    text("Last Fed: "+ lastFed%12+"PM",350,30);
  }
  else if(lastFed==0){
    text("Last Fed: 12AM",350,30);
  }
  else{
    text("Last Fed: ", lastFed + "AM", 350,30)
  }

  currentTime=hour()
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
    else if(currentTime==(lastFed+2)){
      update("sleeping");
      foodObj.bedroom();
    }
    else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("bathing");
      foodObj.washroom();
    }
    else{
      update("hungry");
      foodObj.display()
    }

    if(gameState!="hungry"){
      feed.hide()
      add.hide()
      dog.remove();
    }
    else{
      feed.show()
      add.show()

    }

  drawSprites();

}

function readStock(data){
     foodS=data.val();
     foodObj.updateFoodStock(foodS)
}


function feedDog(){
  dog.addImage(happyDogImg)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

