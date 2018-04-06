// game js file

var log = console.log.bind(console)

var loadImgFromPath = function(path){
    var img = new Image()
    img.src = path
    return img
}

// 工厂方法 创建对象
var Paddle = function(){
    var img = loadImgFromPath('block.png')
    var o = {   // o is obj
        img : img,
        x : 100,
        y : 200,
        speed : 15,
    }
    o.moveLeft = function(){
        o.x -= o.speed
    }
    o.moveRight = function(){
        o.x += o.speed
    }
    o.collide = function(ball){
        if(ball.y + ball.img.height > o.y){
            if(ball.x > o.x && ball.x < o.x + o.img.width){
                return true
            }
        }
        return false
    }
    return o
}

var Ball = function(){
    var img = loadImgFromPath('ball.png')
    var o = {
        img : img,
        x : 150,
        y : 170,
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
        if(paddle.collide(ball)){
            ball.speedY *= -1
        }
        ball.move()
    }
    game.draw = function(){
        game.drawImage(paddle)
        game.drawImage(ball)
    }
}

// js程序入口
_main_()
