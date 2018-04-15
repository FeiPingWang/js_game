// game js file
var log = console.log.bind(console)

var loadImgFromPath = function(path){
    var img = new Image()
    img.src = path
    return img
}

// 判断a,b是否相交
var isCollide = function(a, b){
    var x01 = a.x, y01 = a.y, x02 = a.x + a.img.width, y02 = a.y + a.img.height
    var x11 = b.x, y11 = b.y, x12 = b.x + b.img.width, y12 = b.y + b.img.height
    var zx = Math.abs(x01 + x02 -x11 - x12)
    var x  = Math.abs(x01 - x02) + Math.abs(x11 - x12)
    var zy = Math.abs(y01 + y02 - y11 - y12)
    var y  = Math.abs(y01 - y02) + Math.abs(y11 - y12)
    if(zx <= x && zy <= y){
        return true
    }
    return false
}

// 工厂方法 创建对象
var Paddle = function(){
    var img = loadImgFromPath('paddle.png')
    var o = {   // o is obj
        img : img,
        x : 100,
        y : 230,
        speed : 15,
    }
    o.moveLeft = function(){
        o.move(o.x - o.speed)
    }
    o.moveRight = function(){
        o.move(o.x + o.speed)
    }
    o.move = function(x){
        if(x < 0){
            x = 0
        }
        if(x > 400 - o.img.width) {
            x = 400 - o.img.width
        }
        o.x = x
    }
    return o
}

var Ball = function(){
    var img = loadImgFromPath('ball.png')
    var o = {
        img : img,
        x : 150,
        y : 200,
        speedX : 10,
        speedY : 10,
        fired : false,
    }
    o.move = function(){
        if(o.fired){
            if(o.x < 0 || o.x > 400){
                o.speedX = -o.speedX
            }
            if(o.y < 0 || o.y > 300){
                o.speedY = -o.speedY
            }
            o.x += o.speedX
            o.y += o.speedY
        }
    }
    o.fire = function(){
        o.fired = true
    }
    o.rebound = function(){
        o.speedY *= -1
    }
    return o
}

var Block = function(){
    var img = loadImgFromPath('block.png')
    var o = {
        img : img,
        x : 100,
        y : 40,
        alive : true,
    }
    o.kill = function(){
        o.alive = false
    }
    return o
}

var Game = function(){
    var g = {
        actions : {},
        keydowns : {},
    }
    var canvas = document.querySelector('#canvas')
    var context = canvas.getContext('2d')
    g.canvas = canvas
    g.context = context

    window.addEventListener('keydown', function(event) {
        g.keydowns[event.key] = true
    })
    window.addEventListener('keyup', function(event) {
        g.keydowns[event.key] = false
    })
    // 注册事件
    g.registerAction = function(key, callback) {
        g.actions[key] = callback
    }
    g.drawImage = function(Obj){
        g.context.drawImage(Obj.img, Obj.x, Obj.y)
    }
    // 相当于主循环了
    setInterval(function(){
        var actions = Object.keys(g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            if(g.keydowns[key]) {
                g.actions[key]()
            }
        }
        g.update()
        g.draw()
    }, 1000/30)
    return g
}

var _main_ = function(){
    var paddle = Paddle()
    var game = Game()
    var ball = Ball()

    var blocks = new Array()
    for(var i = 0; i < 5; i++){
        var b = Block()
        b.x = i * 100
        b.y = 50
        blocks.push(b)
    }

    game.registerAction('a', function(){
        paddle.moveLeft()
    })
    game.registerAction('d', function(){
        paddle.moveRight()
    })
    game.registerAction('f', function(){
        ball.fire()
    })
    game.update = function(){
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)

        if(isCollide(paddle, ball)){
            ball.rebound()
        }
        for(var i = 0; i < blocks.length; i++){
            if(isCollide(ball, blocks[i])){
                blocks[i].kill()
                ball.rebound()
            }
        }

        ball.move()
    }
    game.draw = function(){
        game.drawImage(paddle)
        game.drawImage(ball)

        for(var i = 0; i < blocks.length; i++){
            if(blocks[i].alive){
                game.drawImage(blocks[i])
            }
        }


    }
}

// js程序入口
_main_()
