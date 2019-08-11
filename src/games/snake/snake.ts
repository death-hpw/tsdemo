/*
 * @Author: haopeiwei
 * @Date: 2019-08-07 17:34:23
 * @LastEditors: haopeiwei
 * @LastEditTime: 2019-08-11 16:05:31
 */
import "./snake.less";
// 盒子生成
let box: Element = document.querySelectorAll(".box")[0];
const fragment = document.createDocumentFragment();

// let nodes: Array<any> = [];


for (let i = 0; i < 1600; i++) {
  let ele: HTMLElement = document.createElement("div");
  ele.classList.add("item");
  ele.setAttribute("position", getLogLat(i));
  // if (i === 77 || i === 76 || i === 75) {
  //   ele.classList.add("snakeBody");
  // }
  // if (i === 78) {
  //   ele.classList.add("snakeBody");
  //   ele.classList.add("snakeHead");
  // }
  fragment.append(ele);
}

function getLogLat(i) {
  // if (i % 50 === 0)
  // nodes.push([(i % 50) + 1, Math.ceil((i + 1) / 50)]);
  // if ( i + 1)
  return `${[(i % 50) + 1, Math.ceil((i + 1) / 50)]}`;
}

// 宽高50 * 80  共1600个方块 坐标集合【1，50】 * 【1，32】
box.append(fragment);

// console.log("nodes", nodes);

function Node(x: number, y: number) {
  this.x = x;
  this.y = y;
}


function Snake() {
  this.foodPos = <Object>{ x: Number, y: Number };
  this.oldSnakeNodes = [];
  this.snakeNodes = [];
  this.snakeNodes.push(new Node(29, 2));
  this.snakeNodes.push(new Node(30, 2));
  this.snakeNodes.push(new Node(31, 2));
  this.snakeNodes.push(new Node(32, 2));
  // 末尾是蛇头
  this.snakeNodes.push(new Node(33, 2));
  Snake.prototype.removeSnakeAttr = function () {
    for (let i = 0; i < this.oldSnakeNodes.length; i++) {
      let xPos = this.oldSnakeNodes[i].x;
      let yPos = this.oldSnakeNodes[i].y;
      let snakeBodyElem = document.querySelector(`div[position="${[xPos, yPos]}"]`) as HTMLElement;
      snakeBodyElem.classList.remove("snakeHead");
      snakeBodyElem.classList.remove("snakeBody");
    }
  };
  Snake.prototype.printSnake = function (code: number, snakeHead: any) {
    // 是否吃到食物
    console.log("snakeHead", snakeHead);
    if (snakeHead) {
      if (snakeHead.x === this.foodPos.x && snakeHead.y === this.foodPos.y) {

        // this.snakeNodes.unshift(this.foodPos);
        console.log(" this.snakeNodes", this.snakeNodes, code);
      }
    }

    // const snakeHead
    this.oldSnakeNodes = [].concat(this.snakeNodes);

    for (let i = 0; i < this.snakeNodes.length; i++) {
      let xPos = this.snakeNodes[i].x;
      let yPos = this.snakeNodes[i].y;
      let snakeBodyElem = document.querySelector(`div[position="${[xPos, yPos]}"]`) as HTMLElement;
      snakeBodyElem.classList.remove("snakeHead");
      if (i === this.snakeNodes.length - 1) {
        snakeBodyElem.classList.add("snakeHead");
      } else {
        snakeBodyElem.classList.add("snakeBody");
      }
    }
  };
  // 游戏中止
  Snake.prototype.isGameOver = function (nodes: Array<{ x: number, y: number }>) {
    // 蛇头碰触边界
    return new Promise((reslove, reject) => {
      const headX = nodes[nodes.length - 1].x;
      const headY = nodes[nodes.length - 1].y;
      const snakeBody = nodes.slice(0, nodes.length - 1);
      // 超过边界
      if (headX > 50 || headX < 1 || headY < 1 || headY > 32) {
        reject();
        // 咬到自身
      } else if (snakeBody.some(d => (d.x === headX) && (d.y === headY))) {
        reject();
      }
      reslove();
    })
  };
  Snake.prototype.moveSnake = function (code: number) {
    // 新的蛇的坐标集合 是老坐标集合的后一位
    this.oldSnakeNodes = [].concat(this.snakeNodes);
    for (let k = 0; k < this.snakeNodes.length - 1; k++) {
      this.snakeNodes[k] = this.snakeNodes[k + 1];
    }
    console.log("this.snakeNodes", this.snakeNodes);
    console.log(this.snakeNodes[this.snakeNodes.length - 1]);
    let xHeader = this.snakeNodes[this.snakeNodes.length - 1].x;
    let yHeader = this.snakeNodes[this.snakeNodes.length - 1].y;
    switch (code) {
      case 39:
        //右  console.log("右");
        this.snakeNodes[this.snakeNodes.length - 1] = { x: xHeader + 1, y: yHeader };
        break;
      case 40:
        //下   console.log("下");
        this.snakeNodes[this.snakeNodes.length - 1] = { x: xHeader, y: yHeader + 1 };
        break;
      case 38:
        //上  console.log("上");
        this.snakeNodes[this.snakeNodes.length - 1] = { x: xHeader, y: yHeader - 1 };

        break;
      case 37:
        //左  console.log("左");
        this.snakeNodes[this.snakeNodes.length - 1] = { x: xHeader - 1, y: yHeader };
        break;

      default:
        break;
    }
    this.isGameOver(this.snakeNodes).then(() => {
      this.removeSnakeAttr();
      console.log(" this.snakeNodes[this.snakeNodes.length - 1]", this.snakeNodes[this.snakeNodes.length - 1]);
      this.printSnake(code, this.snakeNodes[this.snakeNodes.length - 1]);
    }).catch(() => {
      alert("游戏结束");
    })
  };
  // 绘制食物
  Snake.prototype.printFood = function () {
    // 1=>32 1=>50 且不在蛇身坐标点
    let food = this.randomFoodPos();
    this.foodPos = food;
    console.log(food, "食物啊");
    let snakeDom = document.querySelector(`div[position="${[food.x, food.y]}"]`) as HTMLElement;
    snakeDom.style.backgroundColor = "pink";
  };
  // 生成随机数
  Snake.prototype.randomFoodPos = function () {
    let position = { x: Math.floor(Math.random() * 50 + 1), y: Math.floor(Math.random() * 32 + 1) };
    if (this.snakeNodes.some(d => d.x === position.x || d.y === position.y)) {
      this.randomFoodPos();
    }
    return position;
  }

};

const snakeIns = new Snake();
// console.log("t", t);
snakeIns.printSnake();
snakeIns.printFood();

window.addEventListener("keydown", function (event) {
  let e = event || window.event;
  let code = e.keyCode || e.which
  if (code === 39 || code === 40 || code === 38 || code === 37) {
    snakeIns.moveSnake(code)
  }
})
