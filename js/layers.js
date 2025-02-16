addLayer("p", {
    name: "prestige",
    symbol: "P",
    row: 0,
    position: 0,
    startData() { return {
        unlocked: true,
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
            unlocked() {return hasUpgrade('p', 15)},
            content:[
                "main-display",
                "prestige-button",
                "resource-display",
                "buyables",
            ]
        },
        "Milestones": {
            unlocked() {return hasUpgrade('p', 31)},
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
            unlocked() {return hasUpgrade('p', 15)},
            display() {
                return "+" + format(this.base()) + " base points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: +" + format(this.effect()) + ""
            },
            purchaselimit() {
                return new Decimal(1000)
            },
            cost() {
                return new Decimal(3).mul(new Decimal('1.3').pow(this.bought()))
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
            unlocked() {return hasUpgrade('p', 25)},
            display() {
                return "x" + format(this.base())+ " base points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                return new Decimal(20)
            },
            cost() {
                return new Decimal(20).mul(new Decimal(2).pow(this.bought()))
            },
            base() {
                val = new Decimal(1.25)
                if(hasMilestone('p', 3)) val = val.add(new Decimal(0.05).mul(this.bought()))
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
            title: "pp multiplier ",
            unlocked() {return hasUpgrade('p', 32)},
            display() {
                return "x1.1 prestige points gain per purchase.<br><br>" +
                "bought: " + format(this.bought()) + " / "+ format(this.purchaselimit()) + "<br>" +
                "cost: " + format(this.cost()) + " prestige points<br>" +
                "effect: " + format(this.effect()) + "x"
            },
            purchaselimit() {
                return new Decimal(20)
            },
            cost() {
                return new Decimal(50).mul(new Decimal(1.5).pow(this.bought()))
            },
            base() {
                return new Decimal(1.1)
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
            done() {return this.unlocked() && hasUpgrade('p', 31)}
        },
        2: {
            requirementDescription: "Have 10,000 points at once",
            effectDescription: "x1.2 prestige points gain, and unlock a new upgrade.",
            unlocked() {return hasMilestone('p', 1)},
            done() {return this.unlocked() && player.points.gte(new Decimal('10000'))}
        },
        3: {
            requirementDescription: "Buy 'points multiplier ∞' 5 times",
            effectDescription: "every purchase of buyable 'points multiplier ∞', its base +0.05.",
            unlocked() {return hasMilestone('p', 1)},
            done() {return this.unlocked() && getBuyableAmount('p', 12).gte(new Decimal(5))}
        },
        4: {
            requirementDescription: "Have 100,000 points at once",
            effectDescription: "x1.3 prestige points gain.",
            unlocked() {return hasMilestone('p', 2)},
            done() {return this.unlocked() && player.points.gte(new Decimal('100000'))}
        },
    },
})
