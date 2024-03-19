import Settings from "../../settings"
import constants from "../../utils/constants"
import Bingo from "../../utils/Bingo";

const regex = /(HEART OF THE MOUNTAIN.*|BINGO GOAL COMPLETE!.*|Your Bingo leveled up to level 100!)/g 
// https://regex101.com/r/nHf4KU/2

register("chat", (event) => {
    if (!Settings.copy_achievements || !Bingo.enabled) return
    ChatLib.command(`ct copy ${event}`, true)
    ChatLib.chat(constants.PREFIX+"&aAchievement copied to clipboard!");
}).setCriteria(regex);