input.onButtonPressed(Button.A, function () {
    A0 = pins.analogReadPin(AnalogPin.P0)
    B0 = pins.analogReadPin(AnalogPin.P1)
    位置 = 1
    角度 = 0
    方向 = 1
    ボール.set(LedSpriteProperty.X, 位置)
    ボール.set(LedSpriteProperty.Y, 角度)
    乱数移動 = 0
    角度変化 = 1
    上下移動 = 0
    球速 = 600
    basic.pause(5000)
    music.playTone(988, music.beat(BeatFraction.Sixteenth))
    ゲーム開始 = 1
})
let 乱数移動 = 0
let ゲーム開始 = 0
let 球速 = 0
let 上下移動 = 0
let 角度変化 = 0
let 方向 = 0
let ボール: game.LedSprite = null
let 角度 = 0
let 位置 = 0
let B0 = 0
let A0 = 0
bluetooth.startUartService()
let A = 0
let B = 0
A0 = 1023
B0 = 1023
let ボリュームA = pins.analogReadPin(AnalogPin.P0)
let ボリュームB = pins.analogReadPin(AnalogPin.P1)
let ラケットA = game.createSprite(0, A)
let ラケットB = game.createSprite(4, B)
位置 = 1
角度 = 2
ボール = game.createSprite(位置, 角度)
方向 = 1
角度変化 = 1
上下移動 = 0
球速 = 600
let 空振り = 0
ゲーム開始 = 0
game.setScore(0)
basic.forever(function () {
    ボリュームA = pins.analogReadPin(AnalogPin.P0)
    ボリュームB = pins.analogReadPin(AnalogPin.P1)
    A = Math.round(Math.map(ボリュームA, 0, A0, 4, 0))
    B = Math.round(Math.map(ボリュームB, 0, B0, 0, 4))
    ラケットA.set(LedSpriteProperty.Y, A)
    ラケットB.set(LedSpriteProperty.Y, B)
    basic.pause(100)
})
basic.forever(function () {
    if (ゲーム開始 != 0) {
        if (ボール.get(LedSpriteProperty.X) == 4) {
            方向 = -1
            上下移動 = randint(-1, 1)
            球速 = randint(20, 30) * 20
        } else if (ボール.get(LedSpriteProperty.X) == 0) {
            方向 = 1
            上下移動 = randint(-1, 1)
            球速 = randint(20, 30) * 20
        } else {
            if (上下移動 != 0) {
                if (ボール.get(LedSpriteProperty.Y) == 0) {
                    上下移動 = 角度変化
                } else if (ボール.get(LedSpriteProperty.Y) == 4) {
                    上下移動 = 角度変化 * -1
                }
            }
        }
        if (角度 + 上下移動 + 乱数移動 < 0) {
            乱数移動 = 0
        } else if (角度 + 上下移動 + 乱数移動 > 4) {
            乱数移動 = 0
        }
        位置 += 方向
        角度 += 上下移動 + 乱数移動
        ボール.set(LedSpriteProperty.X, 位置)
        ボール.set(LedSpriteProperty.Y, 角度)
        if (位置 == 4) {
            乱数移動 = Math.trunc(randint(-150, 150) / 100)
        } else if (位置 == 0) {
            乱数移動 = Math.trunc(randint(-150, 150) / 100)
        } else {
            乱数移動 = 0
        }
        bluetooth.uartWriteNumber(位置)
        basic.pause(球速)
        空振り = 0
        if (位置 == 4) {
            if (!(ボール.isTouching(ラケットB))) {
                空振り = 1
            } else {
                music.playTone(988, music.beat(BeatFraction.Sixteenth))
            }
        } else if (位置 == 0) {
            if (!(ボール.isTouching(ラケットA))) {
                空振り = 2
            } else {
                music.playTone(988, music.beat(BeatFraction.Sixteenth))
            }
        }
        if (空振り != 0) {
            game.addScore(1)
            music.playTone(131, music.beat(BeatFraction.Quarter))
            if (空振り == 1) {
                位置 = 3
                角度 = B
                方向 = -1
            } else {
                位置 = 1
                角度 = A
                方向 = 1
            }
            ボール.set(LedSpriteProperty.X, 位置)
            ボール.set(LedSpriteProperty.Y, 角度)
            乱数移動 = 0
            角度変化 = 1
            上下移動 = 0
            球速 = 600
            basic.pause(3000)
            music.playTone(988, music.beat(BeatFraction.Sixteenth))
        }
    }
})
