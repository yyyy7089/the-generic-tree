addLayer("p", {
    name: "prestige",
    symbol: "P",
    row: 0,
    position: 0,
    startData() { return {
        unlocked: true,
        total: new Decimal(0),
		points: new Decimal(0),
    }},
    color: "#7FCFFF",
    requires: new Decimal(10),
    resource: "prestige points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasMilestone('p', 2)) mult = mult.mul(new Decimal('1.2'))
        if(hasMilestone('p', 4)) mult = mult.mul(new Decimal('1.3'))
        if(getBuyableAmount('p', 13).gt(0)) mult = mult.mul(buyableEffect('p', 13))
        if(getBuyableAmount('p', 23).gt(0)) mult = mult.mul(buyableEffect('p', 23))
        if(hasMilestone('p', 7)) mult = mult.mul(new Decimal(2))
        if(hasMilestone('r', 1)) mult = mult.mul(new Decimal(2))
        if(hasUpgrade('r', 24)) mult = mult.mul(new Decimal(2))
        if(hasMilestone('t', 1)) mult = mult.mul(new Decimal(2))
        if(hasMilestone('t', 2)) mult = mult.mul(new Decimal(2))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: {
        "Upgrades": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
            ]
        },
        "Buyables": {
            unlocked() {return hasUpgrade('p', 15) || hasUpgrade('r', 21) || inChallenge('t', 11)},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "buyables",
            ]
        },
        "Milestones": {
            unlocked() {return hasUpgrade('p', 31) || inChallenge('t', 11)},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "milestones",
            ]
        },
    },
    upgrades: {
        11: {
            unlocked() {return !inChallenge('t', 11)},
            title: "points gain I",
            description: "+1 base points gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "points gain II",
            description: "+1 base points gain.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade('p', 11)},
        },
        13: {
            title: "points gain III",
            description: "+1 base points gain.",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade('p', 12)},
        },
        14: {
            title: "points gain IV",
            description: "+1 base points gain.",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade('p', 13)},
        },
        15: {
            title: "tired of repeating this",
            description: "A new tab, 'buyables'!",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('p', 14)},
        },
        21: {
            title: "points multiplier I",
            description: "x1.25 points gain.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('p', 15)},
        },
        22: {
            title: "points multiplier II",
            description: "x1.25 points gain.",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade('p', 21)},
        },
        23: {
            title: "points multiplier III",
            description: "x1.25 points gain.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade('p', 22)},
        },
        24: {
            title: "points multiplier IV",
            description: "x1.25 points gain.",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade('p', 23)},
        },
        25: {
            title: "tired of repeating this II",
            description: "unlock a new buyable.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade('p', 24)},
        },
        31: {
            title: "our first buyable kinda suck",
            description: "unlock a new tab.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('p', 25)},
        },
        32: {
            title: "realized there's no reason to repeat",
            description: "unlock a new buyable.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('p', 25)},
        },
        33: {
            title: "buyable madness I",
            description: "unlock a new buyable.",
            cost: new Decimal('2e6'),
            unlocked() {return hasMilestone('p', 6)},
        },
        34: {
            title: "buyable madness II",
            description: "unlock a new buyable.",
            cost: new Decimal('3e6'),
            unlocked() {return hasMilestone('p', 6)},
        },
        35: {
            title: "buyable madness III",
            description: "unlock a new buyable.",
            cost: new Decimal('4e6'),
            unlocked() {return hasMilestone('p', 6)},
        },
    },
    buyableCostDiv() {
        val = new Decimal(1)
        if(hasUpgrade('t', 21)) val = val.mul(new Decimal('1.5'))
        if(hasUpgrade('t', 22)) val = val.mul(new Decimal('1.5'))
        return val
    },
    buyables: {
        11: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "points gain ∞",
            unlocked() {return hasUpgrade('p', 15) || hasUpgrade('r', 21) || inChallenge('t', 11)},
            display() {
                return "+" + format(this.base()) + " base points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: +" + format(this.effect()) + ""
            },
            purchaselimit() {
                return new Decimal(50)
            },
            cost() {
                return new Decimal(3).mul(new Decimal('1.3').pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                if(hasMilestone('p', 1)) return new Decimal(2).pow(this.bought().div(10).floor())
                return new Decimal(1)
            },
            effect() {
                return this.base().mul(this.bought())
            },
        },
        12: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "points multiplier ∞",
            unlocked() {return hasUpgrade('p', 25) || hasUpgrade('r', 21) || inChallenge('t', 11)},
            display() {
                return "x" + format(this.base())+ " points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                val = new Decimal(10)
                if(getBuyableAmount('r', 11).gt(0)) val = val.add(buyableEffect('r', 11))
                return val
            },
            cost() {
                return new Decimal(20).mul(new Decimal(2).pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                val = new Decimal(1.25)
                if(hasMilestone('p', 3)) val = val.add(new Decimal(0.05).mul(this.bought()))
                if(val.gte(new Decimal(2))) val = new Decimal(2)
                return val
            },
            effect() {
                return this.base().pow(this.bought())
            },
        },
        13: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "pp multiplier",
            unlocked() {return hasUpgrade('p', 32) || hasUpgrade('r', 21) || inChallenge('t', 11)},
            display() {
                return "x" + format(this.base()) + " prestige points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                return new Decimal(20)
            },
            cost() {
                return new Decimal(50).mul(new Decimal(1.5).pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                val = new Decimal(1.1)
                if(hasMilestone('p', 5)) val = val.add(new Decimal(0.01).mul(this.bought()))
                return val
            },
            effect() {
                return this.base().pow(this.bought())
            },
        },
        21: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "points gain ∞ II",
            unlocked() {return hasUpgrade('p', 33) || hasUpgrade('r', 22) || inChallenge('t', 11)},
            display() {
                return "+" + format(this.base()) + " base points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: +" + format(this.effect()) + ""
            },
            purchaselimit() {
                val =  new Decimal(200)
                if(hasUpgrade('r', 15)) val = val.add(new Decimal(800))
                return val
            },
            cost() {
                return new Decimal('1e5').mul(new Decimal('1.015').pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                val = new Decimal(10)
                if(hasUpgrade('r', 15)) val = val.mul(new Decimal(2))
                return val
            },
            effect() {
                return this.base().mul(this.bought())
            },
        },
        22: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "points multiplier ∞ II",
            unlocked() {return hasUpgrade('p', 34) || hasUpgrade('r', 22) || inChallenge('t', 11)},
            display() {
                return "x" + format(this.base())+ " points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                val = new Decimal(100)
                if(getBuyableAmount('r', 12).gt(0)) val = val.add(buyableEffect('r', 12))
                return val
            },
            cost() {
                return new Decimal('1e5').mul(new Decimal('1.03').pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                return new Decimal('1.02')
            },
            effect() {
                return this.base().pow(this.bought())
            },
        },
        23: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "pp multiplier II",
            unlocked() {return hasUpgrade('p', 35) || hasUpgrade('r', 22) || inChallenge('t', 11)},
            display() {
                return "x" + format(this.base()) + " prestige points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                val = new Decimal(100)
                if(getBuyableAmount('r', 12).gt(0)) val = val.add(buyableEffect('r', 12))
                return val
            },
            cost() {
                return new Decimal('1e5').mul(new Decimal('1.03').pow(this.bought())).div(layers[this.layer].buyableCostDiv())
            },
            base() {
                return new Decimal('1.01')
            },
            effect() {
                return this.base().pow(this.bought())
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "Unlock this tab",
            effectDescription: "every 10 purchases of buyable 'points gain ∞', its base is doubled.",
            unlocked() {return true},
            done() {return this.unlocked() && (hasUpgrade('p', 31) || inChallenge('t', 11))}
        },
        2: {
            requirementDescription: "Have 10,000 points at once",
            effectDescription: "x1.2 prestige points gain.",
            unlocked() {return hasMilestone('p', 1)},
            done() {return this.unlocked() && player.points.gte(new Decimal('10000'))}
        },
        3: {
            requirementDescription: "Buy <i>points multiplier ∞</i> 5 times",
            effectDescription: "every purchase of buyable <i>points multiplier ∞</i>, its base +0.05.<br>(capped at x2.00)",
            unlocked() {return hasMilestone('p', 1)},
            done() {return this.unlocked() && getBuyableAmount('p', 12).gte(new Decimal(5))}
        },
        4: {
            requirementDescription: "Have 100,000 points at once",
            effectDescription: "x1.3 prestige points gain.",
            unlocked() {return hasMilestone('p', 2)},
            done() {return this.unlocked() && player.points.gte(new Decimal('100000'))}
        },
        5: {
            requirementDescription: "Buy <i>pp multiplier</i> 10 times",
            effectDescription: "every purchase of buyable <i>pp multiplier</i>, its base +0.01.",
            unlocked() {return hasMilestone('p', 3)},
            done() {return this.unlocked() && getBuyableAmount('p', 13).gte(new Decimal(10))}
        },
        6: {
            requirementDescription: "buy any of first three buyables 80 times",
            effectDescription: "unlock new upgrades.",
            unlocked() {return hasMilestone('p', 5)},
            done() {return this.unlocked() && getBuyableAmount('p', 11).add(getBuyableAmount('p', 12)).add(getBuyableAmount('p', 13)).gte(new Decimal(80))}
        },
        7: {
            requirementDescription: "Have 1e9 points at once",
            effectDescription: "x2 points & pretige points gain, and unlock a new layer.",
            unlocked() {return hasMilestone('p', 4)},
            done() {return this.unlocked() && player.points.gte(new Decimal('1e9'))}
        },
        8: {
            requirementDescription: "Have 1e9 prestige points at once",
            effectDescription: "x1.5 points gain.",
            unlocked() {return hasMilestone('p', 7)},
            done() {return this.unlocked() && player.p.points.gte(new Decimal('1e9'))}
        },
        9: {
            requirementDescription: "Have 1e10 prestige points at once",
            effectDescription: "x1.5 points gain.",
            unlocked() {return hasMilestone('p', 8)},
            done() {return this.unlocked() && player.p.points.gte(new Decimal('1e10'))}
        },
        10: {
            requirementDescription: "Have 1e12 prestige points at once",
            effectDescription: "x2 points gain.",
            unlocked() {return hasMilestone('p', 9)},
            done() {return this.unlocked() && player.p.points.gte(new Decimal('1e12'))}
        },
    },
})
addLayer("r", {
    name: "rebirth",
    symbol: "R",
    row: 1,
    position: 0,
    startData() { return {
        unlocked: true,
        total: new Decimal(0),
		points: new Decimal(0),
    }},
    color: "#9F9F9F",
    requires: new Decimal('1e10'),
    resource: "rebirth points",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    branches: ['p'],
    layerShown() {
        return hasMilestone('p', 7) || player.r.total.gt(new Decimal(0))
    },
    gainMult() {
        mult = new Decimal(1)
        if(hasMilestone('r', 3)) mult = mult.mul(new Decimal(2))
        if(hasUpgrade('r', 25)) mult = mult.mul(new Decimal(2))
        if(hasMilestone('t', 1)) mult = mult.mul(new Decimal(2))
        if(hasMilestone('t', 2)) mult = mult.mul(new Decimal(2))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Upgrades": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
            ]
        },
        "Buyables": {
            unlocked() {return hasMilestone('r', 2)},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "buyables",
            ]
        },
        "Milestones": {
            unlocked() {return true},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "milestones",
            ]
        },
    },
    upgrades: {
        11: {
            title: "points gain V",
            description: "+10 base points gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "points gain VI",
            description: "+90 base points gain.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade(this.layer, 11)},
        },
        13: {
            title: "points gain VII",
            description: "+200 base points gain.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade(this.layer, 12)},
        },
        14: {
            title: "points gain VIII",
            description: "+200 base points gain.",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade(this.layer, 13)},
        },
        15: {
            title: "points gain ∞ II+",
            description: "double <i>points gain ∞ II</i> base and increase its purchase limit by 800.00.",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade(this.layer, 14) && hasUpgrade(this.layer, 22)},
        },
        21: {
            title: "buyable unlock keeper I",
            description: "first row of prestige layer buyables are always unlocked.",
            cost: new Decimal(1),
        },
        22: {
            title: "buyable unlock keeper II",
            description: "second row of prestige layer buyables are always unlocked.",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade(this.layer, 21)},
        },
        23: {
            title: "focus on points",
            description: "points gain x2.",
            cost: new Decimal(100),
            unlocked() {return hasMilestone(this.layer, 4)},
        },
        24: {
            title: "focus on pp",
            description: "prestige points gain x2.",
            cost: new Decimal(100),
            unlocked() {return hasMilestone(this.layer, 4)},
        },
        25: {
            title: "focus on rp",
            description: "rebirth points gain x2.",
            cost: new Decimal(100),
            unlocked() {return hasMilestone(this.layer, 4)},
        },
        31: {
            title: "focus on tp",
            description: "unlock a new layer.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade(this.layer, 23) && hasUpgrade(this.layer, 24) && hasUpgrade(this.layer, 25)},
        },
    },
    buyables: {
        11: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "buyable uncapper I",
            unlocked() {return hasMilestone(this.layer, 2)},
            display() {
                return "increase <i>points multiplier ∞</i>'s max level by " + format(this.base()) + ".<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " rebirth points<br>" +
                "effect: +" + format(this.effect()) + ""
            },
            purchaselimit() {
                return new Decimal(5)
            },
            cost() {
                return new Decimal(1).mul(new Decimal(2).pow(this.bought()))
            },
            base() {
                return new Decimal(1)
            },
            effect() {
                return this.base().mul(this.bought())
            },
        },
        12: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "buyable uncapper II",
            unlocked() {return hasMilestone(this.layer, 3)},
            display() {
                return "increase <i>points multiplier ∞ 2</i>, <i>pp multiplier 2</i>'s max levels by " + format(this.base()) + " each.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " rebirth points<br>" +
                "effect: +" + format(this.effect()) + ""
            },
            purchaselimit() {
                return new Decimal(5)
            },
            cost() {
                return new Decimal(2).mul(new Decimal(2).pow(this.bought()))
            },
            base() {
                return new Decimal(10)
            },
            effect() {
                return this.base().mul(this.bought())
            },
        },
        13: {
            style(){
                return {
                    'height': '180px',
                    'width': '180px'
                }
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, this.bought().add(1))
            },
            canClick() {return this.canAfford()},
            canAfford() { return player[this.layer].points.gte(this.cost()) && this.bought().lt(this.purchaselimit()) },
            bought() { return getBuyableAmount(this.layer, this.id)},
            title: "pp multiplier III",
            unlocked() {return hasMilestone(this.layer, 4)},
            display() {
                return "x" + format(this.base()) + " prestige points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " rebirth points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                return new Decimal(4)
            },
            cost() {
                return new Decimal(50).mul(new Decimal(2).pow(this.bought()))
            },
            base() {
                return new Decimal('1.5')
            },
            effect() {
                return this.base().pow(this.bought())
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 total rebirth points",
            effectDescription: "double prestige points gain.",
            unlocked() {return true},
            done() {return this.unlocked() && player.r.total.gte(new Decimal(1))}
        },
        2: {
            requirementDescription: "3 total rebirth points",
            effectDescription: "unlock buyables (for this layer).",
            unlocked() {return hasMilestone(this.layer, 1)},
            done() {return this.unlocked() && player.r.total.gte(new Decimal(3))}
        },
        3: {
            requirementDescription: "10 total rebirth points",
            effectDescription: "double rebirth points gain and unlock a new buyable.",
            unlocked() {return hasMilestone(this.layer, 2)},
            done() {return this.unlocked() && player.r.total.gte(new Decimal(10))}
        },
        4: {
            requirementDescription: "100 total rebirth points",
            effectDescription: "unlock some new upgrades and a new buyable.",
            unlocked() {return hasMilestone(this.layer, 3)},
            done() {return this.unlocked() && player.r.total.gte(new Decimal(100))}
        },
    },
})
addLayer("t", {
    name: "transcend",
    symbol: "T",
    row: 2,
    position: 0,
    startData() { return {
        unlocked: true,
        total: new Decimal(0),
		points: new Decimal(0),
    }},
    color: "#AF7FFF",
    requires: new Decimal('500'),
    resource: "transcend points",
    baseResource: "rebirth points",
    baseAmount() {return player.r.points},
    type: "normal",
    exponent: 0.25,
    branches: ['r'],
    layerShown() {
        return hasUpgrade('r', 31) || player[this.layer].total.gt(new Decimal(0))
    },
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "t", description: "T: Reset for transcend points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Upgrades": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
            ]
        },
        "Buyables": {
            unlocked() {return false},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "buyables",
            ]
        },
        "Milestones": {
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "milestones",
            ]
        },
        "Challenges": {
            unlocked() {return hasMilestone('t', 3)},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "challenges",
            ]
        },
    },
    upgrades: {
        11: {
            title: "points gain IX",
            description: "+20 base points gain.",
            cost: new Decimal(1),
            unlocked() {
                return true
            },
        },
        12: {
            title: "points gain X",
            description: "+80 base points gain.",
            cost: new Decimal(1),
            unlocked() {
                return hasUpgrade(this.layer, 11)
            },
        },
        21: {
            title: "cheaper buyables I",
            description: "/1.5 all pp buyables' prices.",
            cost: new Decimal(1),
            unlocked() {
                return true
            },
        },
        22: {
            title: "cheaper buyables II",
            description: "/1.5 all pp buyables' prices, again.",
            cost: new Decimal(1),
            unlocked() {
                return hasUpgrade(this.layer, 21)
            },
        },
    },
    milestones: {
        1: {
            requirementDescription: "1 total transcend points",
            effectDescription: "x1.5 points gain and x2 pp & rp gain.",
            unlocked() {return true},
            done() {return this.unlocked() && player[this.layer].total.gte(new Decimal(1))}
        },
        2: {
            requirementDescription: "2 total transcend points",
            effectDescription: "x2 pp & rp gain again.",
            unlocked() {return true},
            done() {return this.unlocked() && player[this.layer].total.gte(new Decimal(2))}
        },
        3: {
            requirementDescription: "3 total transcend points",
            effectDescription: "unlock challenges.",
            unlocked() {return true},
            done() {return this.unlocked() && player[this.layer].total.gte(new Decimal(3))}
        },
    },
    challenges: {
        11: {
            unlocked(){return hasMilestone(this.layer, 3)},
            name: "no upgrades",
            fullDisplay: "you cannot buy pp upgrade 11, but milestone tab and all buyables are unlocked from the beginning.<br><br>"
            + "goal: 5.00e9 points<br>"
            + "reward: <i>points multiplier I</i>~<i>IV</i>'s multiplier is changed to 1.5<br>(won't show visually)",
            canComplete: function(){return player.points.gte(new Decimal('5e9'))}
        },
    },
})