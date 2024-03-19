import { data } from "../../utils/constants"
import Settings from "../../settings"

import { registerWhen, getTabList, getValue, removeUnicode } from "../../utils/utils"
import Skyblock from "../../utils/Skyblock"

const tablistRegex = /.*Players \((\d{1,2})\)/

let opened = false
let moveGui = false

let lines = ''

let total = 0
let enjoyers = 0
let ironman = []
let leechers = []

let width = 150
let height = 1

let guiX, guiY

register("step", () => { // opened and location manager
    guiX = data.splasherDisplay.x
    guiY = data.splasherDisplay.y

    opened = false
    if (!Settings.splasher_display || !Skyblock.inSkyblock) return
    opened = Skyblock.subArea === 'Pet Care' || Skyblock.subArea === 'Dungeon Hub' || Settings.splasher_display_everywhere || Settings.splasherDisplayMove.isOpen()
    moveGui = Settings.splasherDisplayMove.isOpen()
})

/*
register("chat", (msg) => {
    hubNumber = msg
}).setCriteria(/Request join for Hub #(\d{1,2}) \(.*\).../)
// https://regex101.com/r/WQx3UY/1
*/

register("step", () => { // line constructor
    if (opened) {
        lines = ''
        total = 0
        enjoyers = 0
        ironman = []
        leechers = []

        const { x, y, z } = Player

        const selfName = Player?.getName()

        // put everyone in the lists
        const nearbyPlayers = World.getAllPlayers().filter(player => player.getUUID().version() === 4 && Math.hypot(x - player.x, y - player.y, z - player.z) < 5)

        nearbyPlayers.forEach(user => {
            const name = user.getDisplayName().text
            if (user.getName() !== selfName) {
                if (name.includes('Ⓑ')) enjoyers++
                else if (name.includes('♲')) ironman.push(name)
                else leechers.push(name)
            }
        })

        const area = Skyblock.area;
        const server = Skyblock.server;

        // player count 
        let playerMax = null
        let playerCount = null
        if (area === 'Hub') {
            if (server[0] === 'M') playerMax = 80
            else if (server[0] === 'm') playerMax = 24
        }
        if (area === 'Dungeon Hub') playerMax = 24

        const tabLine = removeUnicode(getTabList()[0])
        if (tabLine !== null) {
            if (tablistRegex.test(tabLine)) playerCount = getValue(tabLine, tablistRegex, '??')
        }

        let playerLine = ''
        let slotsLeft = playerMax-playerCount
        if (playerCount === null | playerMax === null) playerLine = null
        else if (slotsLeft > 0) playerLine = `&e&l${slotsLeft} &eslots left &8(&7${playerCount}&8/${playerMax})`
        else playerLine = `&c&lFull! &8(&c${playerCount}&8/${playerMax})`


        lines += `&2&lHub Info&r\n`
        //lines += ` &3Hub ${hubNumber}\n`
        if (playerLine) lines += ` ${playerLine}\n`
        if (Skyblock.server) lines += ` &7${Skyblock.server}&r\n\n`
        

        if (enjoyers.length) lines += `&6&lEnjoyers: ${enjoyers}&r\n\n`
        if (ironman.length) lines += `&7&l♲ Ironman:&r\n ${ironman.join('\n ')}\n`
        if (leechers.length) lines += `&c&lൠ Leechers:&r\n ${leechers.join('\n ')}\n`

    }
}).setFps(5)

const renderDisplay = () => {
    height = (lines.replace(/[^\n]/g, "").length)*9 +10
    const rectangle = new Rectangle(Renderer.color(0, 0, 0, 50), guiX, guiY, width, height) // background
    rectangle.draw()

    Renderer.translate(guiX, guiY, 1000)
    Renderer.scale(data.splasherDisplay.scale ?? 1)
    
    Renderer.drawStringWithShadow(lines, 5, 5) // text

    Renderer.retainTransforms(false)
    Renderer.finishDraw()
}

registerWhen(register("renderOverlay", () => { // thanks bloom
    if (!opened) return
    renderDisplay()
}), () => opened)

register("dragged", (dx, dy, x, y) => {
    if (moveGui) {
        data.splasherDisplay.x = x
        data.splasherDisplay.y = y
        data.save()
    }
})