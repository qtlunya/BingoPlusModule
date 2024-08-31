import { onHypixelConnect } from "./Events"
import { generateRandomString } from "./utils"
import { HypixelModAPI } from "../../HypixelModAPI"
import settings from "../settings"
import constants from "./constants"
import request from "../../requestV2"

const partyLeaderRegex = [
    /^You have joined (?:\[.*?\] )?(\w{1,16})'s? party!$/, // https://regex101.com/r/gVoOq1/2
    /^Party Leader: (?:\[.*?\] )?(\w{1,16}) ●$/, // https://regex101.com/r/zcdveP/1
    /^The party was transferred to (?:\[.*?\] )?(\w{1,16}) by (?:\[.*?\] )?(?:\w{1,16})$/, // https://regex101.com/r/XGjPZp/2
    /^(?:\[.*?\] )?(?:\w{1,16}) has promoted (?:\[.*?\] )?(\w{1,16}) to Party Leader$/ // https://regex101.com/r/Ru6glS/1
]

const partyResetRegex = [
    /^You have been kicked from the party by (?:\[.*?\] )?(?:\w{1,16}) $/, // https://regex101.com/r/14gC5l/1
    "You left the party.",
    "The party was disbanded because the party leader disconnected."
]

// TODO: add these to a repo

/**
 * Commands which should not append the random string to the end
 */
const alwaysNoRandomString = [
    'say', 'speak',
    'repeat', 'rep',
    'customrep', 'customrepeat', 'crep', 'crepeat',
    'poll',
    // custom commands not mentioned publicly
    'flea', 'bf',
    'disable', 'enable', 'cmd',
]

/**
 * Commands which should only append a random string to the end when there is an argument present
 */
const whenArgsRandomString = [
    'promote', 'pro', 'prom', 'promo',
    'kick', 'remove',
    'ban', 'block',
    'unblock', 'unban',
    'invite', 'inv',
    'query', // if this gets added
    'transfer',
]

export default new class Party {
    constructor() {
        this.inParty = false
        this.leader = null
        HypixelModAPI.requestPartyInfo()

        //register("step", () => {
        //    ChatLib.chat(`${this.leader}`)
        //}).setFps(1)

        // Leader
        partyLeaderRegex.forEach(regex => {
            register("chat", (leader) => {
                this.inParty = true
                this.leader = leader
            }).setCriteria(regex)
        })

        // Reset
        partyResetRegex.forEach(regex => {
            register("chat", () => {
                this.reset()
            }).setCriteria(regex)
        })
        
        register("serverDisconnect", () => {
            this.reset()
        })

        // get leader by modapi packet
        onHypixelConnect(() => {
            // delayed bc skytils freaks out
            setTimeout(() => {
                HypixelModAPI.requestPartyInfo()
            }, 1000)
        })

        HypixelModAPI.on("partyInfo", data => {
            const leaderUUID = Object.keys(data).find(key => data[key] === "LEADER")
            if (!leaderUUID) {
                this.reset()
                return
            }

            request({
                url: `https://api.mojang.com/user/profile/${leaderUUID}`,
                json: true
            }).then(api => {
                this.leader = api.name
            }).catch(err => {
                ChatLib.chat(`${constants.PREFIX}&7Error fetching mojang uuid->username api: &f"${err.cause}"\n${constants.PREFIX}&7please report this to ooffyy on discord`)
            })
        })
    }

    inBingoParty() {
        return this.inParty && this.leader === constants.BINGOPARTY_IGN
    }

    reset() {
        this.inParty = false
        this.leader = null
    }

    /**
     * Adds on a random string of characters to bypass if eligible
     * @param {String} string string to append
     * @returns formatted/unformatted string
     */
    addRandomString(string) {
        if (!settings().bingoPartyCommandRandomString) return
        args = string.split(" ")

        if (whenArgsRandomString.some(cmd => cmd == args[0]) && !args[1]) return string
        if (alwaysNoRandomString.includes(args[0])) return string

        // TODO: potentially make something for commands like an [END] for the bot to interpret and omit
        return string + ` ${generateRandomString(string.length * .33 < 6 ? 6 : string.length * .33)}`
    }
}
