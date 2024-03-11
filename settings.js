import { @Vigilant, @SwitchProperty, @ButtonProperty, @TextProperty} from "Vigilance"

@Vigilant("Bingo+/config", "Bingo+ Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Bingo", "Chat", "Commands"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
    
class Settings {
    constructor() {
        this.initialize(this)
        
        this.setCategoryDescription("General",
            `
            &6Bingo&c+ &bv${JSON.parse(FileLib.read("Bingo+", "metadata.json")).version}
            &aBy ooffyy
            `
        )
    }

    chickenHeadTimerMove = new Gui()
    communityGoalDisplayMove = new Gui()

    // General

    @ButtonProperty({
        name: "Discord",
        description: "Join the Bingo+ Discord!",
        category: "General",
        placeholder: "Open"
    })
    joinDiscord() {
        java.awt.Desktop.getDesktop().browse(new java.net.URL('https://discord.gg/P8rahWWA7b').toURI());
        //ChatLib.command("ct copy https://discord.gg/P8rahWWA7b", true);
    }


    // Bingo

    @SwitchProperty({
        name: "Only on Bingo",
        description: "Only enable features in the &6Bingo &rcategory on Bingo profiles.",
        category: "Bingo"
    })
    only_on_bingo = true

    @SwitchProperty({
        name: "Community Goal Display",
        description: "Displays community goal data when on the Bingo Card menu.",
        category: "Bingo",
        subcategory: "Community Goal Display"
    })
    community_goal_display = true

    @ButtonProperty({
        name: "Move",
        description: "Move the Community Goal Display",
        category: "Bingo",
        subcategory: "Community Goal Display"
    })
    MoveCommunityGoalDisplay() {
        this.communityGoalDisplayMove.open()
    }

    @SwitchProperty({
        name: "Chicken Head Timer",
        description: "Displays a timer for the Chicken Head cooldown.",
        category: "Bingo",
        subcategory: "Chicken Head Timer"
    })
    chicken_head_timer = true

    @ButtonProperty({
        name: "Move",
        description: "Move the Chicken Head Timer.",
        category: "Bingo",
        subcategory: "Chicken Head Timer"
    })
    MoveChickenHeadTimer() {
        this.chickenHeadTimerMove.open()
    }

    @SwitchProperty({
        name: "Hide Egg Laid Message",
        description: "Hides the §r§aYou laid an egg!§r message.",
        category: "Bingo",
        subcategory: "Chicken Head Timer"
    })
    hide_egg_laid_message = false

    @SwitchProperty({
        name: "Copy Achievements",
        description: "Automatically copies Bingo achievements to clipboard.",
        category: "Bingo",
        subcategory: "Chat"
    })
    copy_achievements = true


    @SwitchProperty({
        name: "Baker Blocker",
        description: "Prevents you from running &e/openbaker &ron Bingo.",
        category: "Bingo",
        subcategory: "Blockers"
    })
    baker_blocker = true

    @SwitchProperty({
        name: "Block Party Travel Messages",
        description: "Block party travel notifications on Bingo.\n\n §9§l» §booffyy §eis traveling to §aPrivate Island §e§lFOLLOW§r\n §9§l» §6aphased §eis traveling to §aHub §e§lFOLLOW§r",
        category: "Bingo",
        subcategory: "Party"
    })
    block_party_travel_messages = false

    // Chat

    @SwitchProperty({
        name: "Fake Emojis",
        description: "Sends &6[MVP&c++&6]&r / &c[&fYOUTUBE&c]&r and Rank Gifting emojis without having the requirements! Run &e/emoji &ron Hypixel for the list of all emojis.\n&cMay be laggy!",
        category: "Chat",
        subcategory: "Sending"
    })
    fake_emojis = false

    @SwitchProperty({
        name: "Maxwell",
        description: "Automatically skips Maxwell's dialogue.",
        category: "Chat",
        subcategory: "Dialogue Skipper"
    })
    maxwell = true

    @SwitchProperty({
        name: "Sam",
        description: "Automatically skips Sam's dialogue.",
        category: "Chat",
        subcategory: "Dialogue Skipper"
    })
    sam = true

    @SwitchProperty({
        name: "Pesthunter Phillip",
        description: "Automatically skips Phillip's dialogue. &cIncomplete!",
        category: "Chat",
        subcategory: "Dialogue Skipper"
    })
    pesthunter_phillip = true

    @SwitchProperty({
        name: "Lone Adventurer",
        description: "Automatically skips the Lone Adventurer's dialogue.",
        category: "Chat",
        subcategory: "Dialogue Skipper"
    })
    lone_adventurer = true

    @SwitchProperty({
        name: "Block Sky Mall Messages",
        description: "Blocks the daily Sky Mall messages while outside the mining islands.\n\n§r§bNew day! §r§eYour §r§2Sky Mall §r§ebuff changed!§r\n§r§8§oYou can disable this messaging by toggling Sky Mall in your /hotm!§r",
        category: "Chat",
        subcategory: "Blockers"
    })
    block_sky_mall_messages = false

    // Commands
    @SwitchProperty({
        name: "SkyCrypt Auto Open",
        description: "Automatically opens a new window when running the &e/skycrypt &ror &e/sky &rcommand.",
        category: "Commands"
    })
    skycrypt_auto_open = false

    @TextProperty({
        name: "Century Cake Island",
        description: "Visits a Cake Hub when running &e/cake&r.\nDefault: BingoSplasher",
        category: "Commands"
    })
    century_cake_island = "BingoSplasher"
}

export default new Settings()
