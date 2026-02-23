//only load contents once all HTML has been loaded
document.addEventListener("DOMContentLoaded", () => {

    //adds content to the grid div
    const grid = document.querySelector(".grid")
    const doodler = document.createElement("div")
    let doodlerLeftSpace = 50;
    let startPoint = 150
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let scoreId = document.getElementById('score')
    let score = 0

    const startButton = document.querySelector('#startButton')
    startButton.addEventListener('click', function(){
            document.querySelector('.menu').style.display = 'none' //when start is clicked, menu goes away
            // grid.style.display = 'block' //grid becomes visible again
            start()
        })

    


    class Platform{
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315 //random number b/w 0-315

            //visual is the platform that gets displayed
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }


    function createPlatforms(){
        for(let i = 0; i < platformCount; i++){
            let platformGap = 600 / platformCount
            //let platformGap = document.getElementsByClassName('grid').style.width / platformCount
            let newPlatformBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatformBottom)

            //putting new platforms into array
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    //makes platforms actually move
    function movePlatforms(){
        platforms.forEach(platform => {
            let visual = platform.visual
            visual.style.bottom = platform.bottom + "px"
        
            //gets rid of platform that goes off screen
            if(platform.bottom < 10){
                let firstPlatform = platforms[0].visual
                firstPlatform.classList.remove('platform')
                platforms.shift()
                console.log(platforms)
                score ++

                //creates new platform at the top
                let newPlatform = new Platform(600)
                platforms.push(newPlatform)
            }
        })
    }



    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add("doodler")
        //making sure doodler is standing on first platform
        doodlerLeftSpace = platforms[0].left
        doodlerBottomSpace = platforms[0].bottom + 15
        doodler.style.left = doodlerLeftSpace + "px"
        doodler.style.bottom = doodlerBottomSpace + "px"
        startPoint = doodlerBottomSpace
    }

    

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 10
            doodler.style.bottom = doodlerBottomSpace + "px"

            // move platforms down at same rate doodler moves up
            if(doodlerBottomSpace > 200){
                platforms.forEach(platform => {
                    platform.bottom -= 10
                    platform.visual.style.bottom = platform.bottom + "px"
                })
            }

            if(doodlerBottomSpace > startPoint + 200){
                fall()
                isJumping = false
            }
        }, 30)
    }

    function fall(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function(){
            doodlerBottomSpace -= 8
            doodler.style.bottom = doodlerBottomSpace + "px"

            // move platforms down at same rate doodler moves up
            if(doodlerBottomSpace > 200){
                platforms.forEach(platform => {
                    platform.bottom -= 8
                    platform.visual.style.bottom = platform.bottom + "px"
                })
            }


            if(doodlerBottomSpace <= 0){
                gameOver()
            }

            //collision = jump again
            platforms.forEach(platform => {
                if((doodlerBottomSpace >= platform.bottom) && 
                (doodlerBottomSpace <= platform.bottom + 15) &&
                (doodlerLeftSpace + 60 >= platform.left) &&
                (doodlerLeftSpace <= platform.left + 85) &&
                (!isJumping)){
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    isJumping = true
                    jump()
                }
            })
        }, 30)
    }

    function control(e){
        //move left
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if(e.key === "ArrowLeft" || e.key === "a"){
            moveLeft()
        }
        //move right
        else if(e.key === "ArrowRight" || e.key === "d"){
            moveRight()
        }
        //move straight
        else if(e.key === "ArrowUp" || e.key === " " || e.key === "w"){
            moveStraight()
        }
        
    }

    function moveLeft(){
        clearInterval(leftTimerId)

        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } 
            else moveRight()
        }, 30)
    }

    function moveRight(){
        clearInterval(rightTimerId)

        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }
            else moveLeft()
        }, 30)
    }

    function moveStraight(){
        isGoingLeft = false
        isGoingRight = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true

        // remove platforms
        platforms.forEach(platform => platform.visual.remove())
        platforms = []

        // remove doodler
        doodler.remove()

        scoreId.innerHTML = "final score: " + score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)

        menu()
    }

    function start(){
        // reset state
        platforms = []
        score = 0
        isGameOver = false
        doodlerBottomSpace = 150
        startPoint = 150

        createPlatforms()
        createDoodler()
        setInterval(movePlatforms, 30)
        jump()

        document.addEventListener('keydown', control)
    }

    // start menu
    function menu(){
        document.querySelector('.menu').style.display = 'block'
    }

    menu()


})
