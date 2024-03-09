import Settings from "../settings"
import constants from "../utils/constants"

export const bingoPlusCommand = register("command", (...args) => {
    if (!args || !args[0]) return Settings.openGUI()

    if (args[0] == "help") {
        let line = `&6&m${ChatLib.getChatBreak(" ")}`
        let cmd = ''
        constants.COMMANDS_LIST.forEach(x => {cmd += x+'\n'})
        ChatLib.chat([line, constants.PREFIX, "", cmd, line].join("\n"))
    }

}).setName("b+").setAliases(["bingo+","bingop","bingoplus","bplus"])