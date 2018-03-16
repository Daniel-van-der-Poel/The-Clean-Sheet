//MAIN FUNCTION

function calcMain() {

	//GETTING DATA FROM SHEET

	main.ac.armor = field.ac.armor.value;
	main.ac.shield = field.ac.shield.value;
	main.ac.dexCap = field.ac.dexCap.value;
	main.ac.otherAbility = field.ac.otherAbility.value;
	main.ac.other = field.ac.other.value;
	main.alert = isOn(field.alert);
	main.athlete = isOn(field.athlete);
	main.jack = isOn(field.jack);
	main.manual.all = isOn(field.manual.all);
	main.observant = isOn(field.observant);
	main.saveBonus = field.saveBonus.value;
	main.spell.ability = field.spell.ability.value;
	main.weight.total = 0;
	main.coins[5] = 0; //total gp value of coins
	main.xp.field[0] = Number(field.xp.field[0].value);
	main.xp.field[1] = Number(field.xp.field[1].value);
	main.xp.field[2] = Number(field.xp.field[2].value);
	main.xp.field[3] = Number(field.xp.field[3].value);

	//CONDITIONAL DATA FROM SHEET

	main.weight.inventorySize = this.getField("portraitSelection").value === 2 ? 24 : 36;
	main.armor.strReq = main.armor.armor in armorList ? armorList[main.armor.armor].strReq : 0;

	//LAYOUT

	applyLayout();

	if (main.spellFields === "") {
		setSpellFields();
	}

	//MANUAL OVERRIDES

	applyManual("ac");
	applyManual("initiative");
	applyManual("save");
	applyManual("skill");
	applyManual("spellcasting");

	//EXTRAS & HINTS

	applyHints();

	//CLASSES

	if (main.classes.field[0] !== String(field.classes[0].value).toLowerCase() || main.classes.field[1] !== String(field.classes[1].value).toLowerCase()) {
		main.classes.field[0] = String(field.classes[0].value).toLowerCase();
		main.classes.field[1] = String(field.classes[1].value).toLowerCase();
		calcClass();
	}

	//RACE & BACKGROUND TOOLTIPS

	applyRace();
	applyBackground();

	//ABILITY MODS, SAVES

	if (!main.manual.all) {
		calcAbility(0);
		calcAbility(1);
		calcAbility(2);
		calcAbility(3);
		calcAbility(4);
		calcAbility(5);
	}

	//SKILL MODS, INITIATIVE

	if (!main.manual.skill) {
		calcSkill(1);
		calcSkill(2);
		calcSkill(3);
		calcSkill(4);
		calcSkill(5);
		calcSkill(6);
		calcSkill(7);
		calcSkill(8);
		calcSkill(9);
		calcSkill(10);
		calcSkill(11);
		calcSkill(12);
		calcSkill(13);
		calcSkill(14);
		calcSkill(15);
		calcSkill(16);
		calcSkill(17);
		calcSkill(18);
		calcPassivePerception();
	}

	if (!main.manual.initiative) {
		calcInitiative();
	}

	//AC

	calcAC();

	//WEAPONS

	if (!main.manual.all) {
		calcWeapon(0);
		calcWeapon(1);
		calcWeapon(2);
		calcWeapon(3);
		calcWeapon(4);
		calcWeapon(5);
		calcWeapon(6);
	}

	//TOTAL WEIGHT

	calcWeight();

	//CARRYING CAPACITY, PUSH/DRAG/LIFT, SPEED TOOLTIP, FONT

	calcCarry();

	//XP TOTAL, FONT

	var tempTotalXp = main.xp.field[0] + main.xp.field[1] + main.xp.field[2] + main.xp.field[3];

	main.xp.total = tempTotalXp > 0 ? tempTotalXp : "";
	main.xp.bold = (isSet(main.xp.total) && isSet(main.xp.next) && main.xp.total >= main.xp.next) ? true : false;

	//STATISTICS

	calcStats();

	//SPELLCASTING STATS

	main.spell.dc = "";
	main.spell.attack = "";
	main.spell.name = "Spellcasting ability: determines the effectiveness of your spells";
	main.spell.preparedString = "";
	tempString = "Spells prepared: the number of spells you can prepare after a long rest";
	var temp = "";
	var temp2 = "";
	var tempSlot = "";

	calcSpellcastingMod(0);
	calcSpellcastingMod(1);
	calcSpellcastingMod(2);
	calcSpellcastingMod(3);
	calcSpellcastingMod(4);
	calcSpellcastingMod(5);

	if (!main.manual.spellcasting) {
		for (i = 0; i < main.spell.prepared.length; i++) {
			temp = main.spell.prepared[i];

			if (isSet(main.ability[temp[2]].mod)) {
				tempSlot = Math.max(Math.floor(temp[1] / classList[temp[0]].spellcastingProgression) + main.ability[temp[2]].mod, 1);
				tempString += "\n\n" + classList[temp[0]].name + ": " + tempSlot;
				tempString += (tempSlot > 1) ? " spells" : " spell";

				if (i > 0) {
					main.spell.preparedString += "/";
				}
				main.spell.preparedString += tempSlot;
			} else {
				tempString += "\n\n" + classList[temp[0]].name + ": " + main.ability[temp[2]].name + " modifier";
				temp2 = Math.floor(temp[1] / classList[temp[0]].spellcastingProgression);

				if (temp2 > 0) {
					tempString += " + " + temp2;
				}

				tempString += " (minimum of 1 spell)";
			}
		}

		field.spell.prepared.value = main.spell.preparedString;
	}

	field.spell.prepared.userName = tempString;

	//SETTING FIELD VALUES

	field.stat[0].value = main.stat.string[0];
	field.stat[1].value = main.stat.string[1];

	if (!main.manual.all) {
		field.weight.total.value = main.weight.total;
		field.weight.capacity.value = main.weight.capacity;
		field.weight.pushDragLift.value = main.weight.pushDragLift;
		field.xp.total.value = main.xp.total;
	}

	if (!main.manual.ac) {
		field.ac.ability.value = main.ac.ability;
		field.ac.ac.value = main.ac.ac;
	}

	if (!main.manual.spellcasting) {
		field.spell.dc.value = main.spell.dc;
		field.spell.attack.value = main.spell.attack;
	}

	field.speed.userName = main.speedName;
	field.spell.ability.userName = main.spell.name;
	field.xp.total.textFont = main.xp.bold ? font.HelvB : font.Helv;
	field.weight.total.textFont = main.weight.bold ? font.HelvB : font.Helv;}

function applyAll() {
	var a = isOn(event.target.name);

	if (a) {
		switchLock("a", !a);
		setButton(field.manual.ac, a);
		setButton(field.manual.initiative, a);
		setButton(field.manual.save, a);
		setButton(field.manual.skill, a);
		setButton(field.manual.spellcasting, a);
		setButton(field.hints.attacks, !a);
	} else {
		switchLock("a", !a);
		setButton(field.manual.ac, a);
		setButton(field.manual.initiative, a);
		setButton(field.manual.save, a);
		setButton(field.manual.skill, a);
		setButton(field.manual.spellcasting, a);
		calcClass();
		tick();
	}
}

function applyArmor() {
	engine = false;
	main.armor.raw = event.value;
	main.armor.parsed = cleanPlus(main.armor.raw.toLowerCase());
	main.armor.name = "Armor worn: pick an armor from the list and its details will be filled out automatically. Examples of input: \n\n\"Leather +2\": adds +2 to AC\n\"Leather (magical?!)\": parentheses are ignored\n\"*Leather\": non-standard names enable manual input";
	main.armor.plus = 0;
	main.armor.affix = "";
	main.armor.known = "";
	main.ac.dexCap = 1000;
	main.armor.type = " ";
	main.ac.armor = "";
	var armorParsed = main.armor.parsed;
	var tempCursor = armorParsed.search(/[+-]\d/);

	if (tempCursor != -1) { //parse +n bonus
		main.armor.plus = Number(armorParsed.slice(tempCursor, tempCursor + 2))
		main.armor.affix = " " + createMod(main.armor.plus);
		armorParsed = armorParsed.replace(/[+-]\d/, "");
		armorParsed = armorParsed.trim();
	}

	if (main.armor.raw.trim().length === 0) { //only spaces
		if (main.armor.raw.length <= 1) { //0 or 1 space --> clear, basic info
			field.ac.armor.value = "";
			field.armor.raw.userName = main.armor.name;
			field.ac.dexCap.value = main.ac.dexCap
			field.armor.type.value = main.armor.type;
			field.ac.armor.readonly = false;
			field.armor.type.readonly = false;
			setStealthDisadvantage(false);
		} else { // 2+ spaces ---> ignore input
			event.rc = false;
		}
	} else if (armorList[armorParsed] === undefined) { //input not in Armorlist ---> basic info
		field.armor.raw.userName = main.armor.name;
		field.ac.armor.readonly = false;
		field.armor.type.readonly = false;
	} else { //input in armorList
		if (armorList[armorParsed].ignore !== undefined && armorList[armorParsed].ignore) { //header ---> ignore input
			event.rc = false;
		} else { //actual armor --> get details
			main.armor.type = armorList[armorParsed].type;
			main.ac.dexCap = armorList[armorParsed].dexCap;
			main.armor.known = armorParsed;
			main.ac.armor = armorList[armorParsed].ac + Number(main.armor.plus);
			main.armor.name += ": " + armorList[armorParsed].name + main.armor.affix;
			setStealthDisadvantage(armorList[armorParsed].stealthDisadvantage);

			if (armorList[armorParsed].strReq > 0) {
				main.armor.name += " (requires Strength " + armorList[armorParsed].strReq + ")";
			} else if (main.armor.type !== "Special") {
				main.armor.name += " (no Strength requirement)";
			}

			field.ac.armor.value = main.ac.armor;
			field.armor.raw.userName = main.armor.name;
			field.ac.dexCap.value = main.ac.dexCap
			field.armor.type.value = main.armor.type;
			field.ac.armor.readonly = true;
			field.armor.type.readonly = true;
		}
	}
	engine = true;
}

function applyBackground() {
	var temp = field.background.value.toLowerCase();
	var temp2 = "";

	if (main.background.raw !== temp) {
		main.background.tooltip = "";
		main.background.known = "";
		main.background.raw = temp;
		if (temp in backgroundList && temp !== "") {
			main.background.known = temp;
			main.background.tooltip = backgroundList[temp].tooltip + "\n\nStarting equipment:\n";
			for (item in backgroundList[temp]["items"]) {
				temp2 = backgroundList[temp]["items"][item];
				main.background.tooltip += "\n\u2022 " + item;
				if (temp2.amount > 1) {
					main.background.tooltip += " (" + temp2.amount + ")";
				}
			}
			main.background.tooltip += "\n\u2022 " + backgroundList[temp].gold + " gp"
			field.background.userName = main.background.tooltip;

		} else {
			main.background.tooltip = backgroundList[""].tooltip;
			field.background.userName = main.background.tooltip;
		}

		main.background.raw = temp;
	}
}

function addComma(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function applyHints() {
	var temp = isOn(field.hints.attacks);
	var temp2 = "";

	if (main.hints.attacks !== temp) {
		switchField("attackHint", temp);
		switchField("weapon6", !temp);
		switchField("weapon7", !temp);
		switchField("attack6", !temp);
		switchField("attack7", !temp);
		switchField("damage6", !temp);
		switchField("damage7", !temp);
		switchField("type6", !temp);
		switchField("type7", !temp);
		switchField("crit6", !temp);
		switchField("crit7", !temp);
		switchField("weaponRange6", !temp);
		switchField("weaponRange7", !temp);
		switchField("advantageButton45", !temp);
		switchField("advantageButton46", !temp);
		switchField("advantageButton52", !temp);
		switchField("advantageButton70", !temp);
		switchField("advantageButton58", !temp);
		switchField("advantageButton59", !temp);

		main.hints.attacks = temp;
	}

	temp = isOn(field.hints.capacity);
	temp2 = isOn(field.hints.encumbrance);

	if (main.hints.capacity !== temp || main.hints.encumbrance !== temp2) {
		if (temp) {
			switchLayer("p2CapacityHints1", !temp2);
			switchLayer("p2CapacityHints2", temp2);
		} else {
			switchLayer("p2CapacityHints1", false);
			switchLayer("p2CapacityHints2", false);
		}

		main.hints.capacity = temp;
		main.hints.encumbrance = temp2;
	}

	temp = isOn(field.hints.skills);

	if (main.hints.skills !== temp) {
		switchLayer("p1SkillHints", temp);

		main.hints.skills = temp;
	}

	temp2 = isOn(field.hints.extras);

	if (main.hints.extras !== temp2) {
		switchLayer("extras", temp2);

		this.getField("menuButton").display = temp2 ? display.noPrint : display.hidden;
		main.hints.stats = "";
		main.hints.extras = temp2;
	}

	temp = isOn(field.hints.stats);

	if (main.hints.stats !== temp) {
		if (temp && temp2) {
			switchLayer("p1StatsHints", true);
		} else {
			switchLayer("p1StatsHints", false);
		}

		main.hints.stats = temp;
	}
}

function applyLayout() {
	var tempPortrait = field.layout[0].value;
	var tempLayout = field.layout[1].value;
	var temp = "";

	if (main.layout[0] !== tempPortrait || main.layout[1] !== tempLayout) {
		temp = (tempLayout - 1) * 3 + tempPortrait - 1;


		switchLayer(layerList1[0], layerMatrix1[temp][0]);
		switchLayer(layerList1[1], layerMatrix1[temp][1]);
		switchLayer(layerList1[2], layerMatrix1[temp][2]);
		switchLayer(layerList1[3], layerMatrix1[temp][3]);
		switchLayer(layerList1[4], layerMatrix1[temp][4]);
		switchLayer(layerList1[5], layerMatrix1[temp][5]);
		switchLayer(layerList1[6], layerMatrix1[temp][6]);
		switchLayer(layerList1[7], layerMatrix1[temp][7]);
		switchLayer(layerList1[8], layerMatrix1[temp][8]);
		switchLayer(layerList1[9], layerMatrix1[temp][9]);

		main.layout[0] = tempPortrait;
		main.layout[1] = tempLayout;

		setSpellFields();
	}

	tempLayout = field.layout[2].value;

	if (main.layout[2] !== tempLayout) {
		temp = tempLayout - 1;

		switchLayer(layerList2[0], layerMatrix2[temp][0]);
		switchLayer(layerList2[1], layerMatrix2[temp][1]);
		switchLayer(layerList2[2], layerMatrix2[temp][2]);
		switchLayer(layerList2[3], layerMatrix2[temp][3]);

		main.layout[2] = tempLayout;

		setSpellFields();
	}

	tempLayout = field.layout[3].value;

	if (main.layout[3] !== tempLayout) {
		temp = tempLayout - 1;

		switchLayer(layerList3[0], layerMatrix3[temp][0]);
		switchLayer(layerList3[1], layerMatrix3[temp][1]);
		switchLayer(layerList3[2], layerMatrix3[temp][2]);
		switchLayer(layerList3[3], layerMatrix3[temp][3]);

		main.layout[3] = tempLayout;

		setSpellFields();
	}
}

function applyManual(element) { //use save, skill, ac, initiative, spellcasting or all as element
	var a = isOn(field.manual[element]);

	if (main.manual[element] !== a) {
		main.manual[element] = a;
		if (a) {
			switchLock("a." + element, !a);
		} else {
			setButton(field.manual.all, a);
			switchLock("a." + element, !a);
			tick();
		}
	}
}

function applyRace() {
	var a = field.race.value.toLowerCase();

	if (main.race.raw !== a) {
		main.race.raw = a;
		main.race.known = "";
		var raceTooltip = "Race: after selecting a race this text will show its basic features. Standard races are listed first, then those from sources other than the Player's Handbook. After picking a race, the \"add traits\" button above will fill out many details.";
		var ageTooltip = "Age";
		var sizeTooltip = "Size";
		var heightTooltip = "Height";
		var weightTooltip = "Weight";
		var tempString = "";
		var temp = "";

		for (i = 0; i < 6; i++) {
			main.ability[i].bonus = "";
		}

		if (a !== "" && a in raceList) {
			main.race.known = a;
			raceTooltip = raceList[a]["name"] + "\n\nAbility scores: ";

			if (isSet(raceList[a].scores.all)) {
				raceTooltip += "all " + createMod(raceList[a].scores.all);
				temp = ", ";

				for (i = 0; i < 6; i++) {
					main.ability[i].bonus = raceList[a].scores.all;
				}
			}

			if (isSet(raceList[a].scores.basic)) {
				for (i = 0; i < 6; i++) {
					main.ability[i].bonus = raceList[a].scores.basic[i];
					if (raceList[a].scores.basic[i] != 0) {
						raceTooltip += temp + main.ability[i].name + " " + createMod(raceList[a].scores.basic[i]);
						temp = ", ";
					}
				}
			}

			if (isSet(raceList[a].scores.choose)) {
				for (i = 0; i < raceList[a].scores.choose.length; i++) {
					raceTooltip += temp + "choose " + numberList[raceList[a].scores.choose[i][0]] + ": " + createMod(raceList[a].scores.choose[i][1]);
					temp = ", ";
				}
			}

			raceTooltip += "\n\nSize: " + raceList[a]["size"] + "\n\nSpeed: " + setCase(raceList[a]["speed"], "lower");

			if (raceList[a]["features"] !== undefined) {
				raceTooltip += "\n\nFeatures:\n";
				for (i = 0; i < raceList[a]["features"].length; i++) {
					raceTooltip += "\n\u2022 " + raceList[a]["features"][i];
				}
			}

			if (raceList[a]["age"] !== undefined) {
				ageTooltip = "Age: " + setCase(raceList[a]["plural"], "lower") + raceList[a]["age"];
			}

			if (raceList[a]["size"] !== undefined) {
				sizeTooltip = "Size: " + raceList[a]["size"];
			}

			if (raceList[a]["height"] !== undefined) {
				heightTooltip = "Height: " + setCase(raceList[a]["plural"], "lower") + raceList[a]["height"];
			}

			if (raceList[a]["weight"] !== undefined) {
				weightTooltip = "Weight: " + setCase(raceList[a]["plural"], "lower") + raceList[a]["weight"];
			}
		}

		setAbilityTooltips();

		this.getField("race").userName = raceTooltip;
		this.getField("age").userName = ageTooltip;
		this.getField("size").userName = sizeTooltip;
		this.getField("height").userName = heightTooltip;
		this.getField("weight").userName = weightTooltip;
	}
}

function applyShield() {
	engine = false;
	main.shield.raw = event.value;
	main.shield.parsed = cleanPlus(main.shield.raw.toLowerCase());
	main.shield.name = "Shield carried: pick a shield from the list and its details will be filled out automatically. Examples of input: \n\n\"Shield +2\": adds +2 to AC\n\"Shield (magical?!)\": parentheses are ignored\n\"*Shield\": non-standard names enable manual input";
	main.shield.plus = 0;
	main.shield.affix = "";
	main.shield.known = "";
	main.ac.shield = "";
	var shieldParsed = main.shield.parsed;
	var tempCursor = shieldParsed.search(/[+-]\d/);

	if (tempCursor != -1) { //parse +n bonus
		main.shield.plus = Number(shieldParsed.slice(tempCursor, tempCursor + 2))
		main.shield.affix = " " + createMod(main.shield.plus);
		shieldParsed = shieldParsed.replace(/[+-]\d/, "");
		shieldParsed = shieldParsed.trim();
	}

	if (main.shield.raw.trim().length === 0) { //only spaces
		if (main.shield.raw.length <= 1) { //0 or 1 space --> clear, basic info
			field.ac.shield.value = "";
			field.shield.userName = main.shield.name;
			field.ac.shield.readonly = false;
		} else { // 2+ spaces ---> ignore input
			event.rc = false;
		}
	} else if (shieldList[shieldParsed] === undefined) { //input not in shieldlist ---> basic info
		field.shield.userName = main.shield.name;
		field.ac.shield.readonly = false;
	} else { //input in shieldList
		if (shieldList[shieldParsed].ignore !== undefined && shieldList[shieldParsed].ignore) { //header ---> ignore input
			event.rc = false;
		} else { //actual shield --> get details
			main.shield.type = shieldList[shieldParsed].type;
			main.shield.known = shieldParsed;
			main.ac.shield = shieldList[shieldParsed].ac + Number(main.shield.plus);
			main.shield.name += ": " + shieldList[shieldParsed].name + main.shield.affix;
			field.ac.shield.value = main.ac.shield;
			field.shield.userName = main.shield.name;
			field.ac.dexCap.value = main.ac.dexCap
			field.shield.type.value = main.shield.type;
			field.ac.shield.readonly = true;
		}
	}
	engine = true;
}

function applySpell() {
	engine = false;

	var input = event.value;
	var a = input.toString().toLowerCase();
	var b = event.target.name;
	var spell = this.getField(b);
	var number = Number(b.slice(5));
	var long = ((number >= 20 && number <= 38) || (number >= 80 && number <= 129) || (number >= 1010 && number <= 1041) || (number >= 130 && number <= 211)) ? false : true;

	var level = this.getField("level" + number);
	var time = this.getField("time" + number);
	var range = this.getField("range" + number);
	var duration = this.getField("duration" + number);
	var description = this.getField("description" + number);

	if (long) {
		var ritual = this.getField("ritual" + number);
		var components = this.getField("components" + number);
		var concentration = this.getField("concentration" + number);
		var source = this.getField("source" + number);
	}

	if (input === "" || input === undefined) {
		spell.userName = spellTooltips.name;
		level.value = "";
		level.userName = spellTooltips.level;
		time.value = "";
		time.userName = spellTooltips.time;
		range.value = "";
		range.userName = spellTooltips.range;
		duration.value = "";
		duration.userName = spellTooltips.duration;
		description.value = "";
		description.userName = spellTooltips.description;

		if (long) {
		ritual.value = "";
		ritual.userName = spellTooltips.ritual;
		components.value = "";
		components.userName = spellTooltips.components;
		concentration.value = "";
		concentration.userName = spellTooltips.concentration;
		source.value = "";
		source.userName = spellTooltips.source;
		}
	} else if (a in spellList) {
		var temp = spellList[a]
		var spellString1 = (temp.level === 0) ? setCase(temp.school, "upper") + " cantrip" : spellLevelList[temp.level] + " " + temp.school;
		spellString1 += (temp.ritual === true) ? "\nRitual" : "";
		var spellString2 = "Spell lists:\n";

		for (i = 0; i < temp.classes.length; i++) {
			spellString2 += "\n\u2022 " + setCase(temp.classes[i], "upper");
		}

		spell.userName = temp.name + "\n\n" + spellString1 + "\n\n" + spellString2;
		level.value = temp.level;
		level.userName = temp.level === 0 ? "Level: " + temp.level + " (cantrip)" : "Level: " + temp.level;
		time.value = temp.time;
		time.userName = "Casting time: " + abbreviationList[temp.time];
		range.value = temp.range;
		range.userName = "Range: " + setCase(temp.range, "lower");
		duration.value = temp.dismiss ? temp.duration + " (D)" : temp.duration;
		duration.userName = duration.value in abbreviationList ? "Duration: " + abbreviationList[duration.value] : "Duration: " + duration.value;
		description.value = temp.shorthand;
		description.userName = temp.description.length > 2000 ? temp.description.substring(0, 2001) + "...\n(Consult source for full description)" : temp.description;
		event.value = temp.name;

		if (long) {
			ritual.value = temp.ritual ? "Y" : "N"
			ritual.userName = temp.ritual ? "This spell can be cast as a ritual (if you have this class feature)" : "This spell cannot be cast as a ritual";
			components.value = temp.castingCost !== undefined ? temp.components + "**" : temp.initialCost !== undefined ? temp.components + "*" : temp.components;
			components.userName = temp.materialComponents === undefined ? "Components: " + abbreviationList[temp.components] : "Components: " + abbreviationList[temp.components] + "\n\nMaterial component: " + setCase(temp.materialComponents, "lower");
			concentration.value = temp.concentration ? "Y" : "N"
			concentration.userName = temp.concentration ? "This spell requires concentration" : "This spell does not require concentration";
			source.value = temp.source + temp.page;
			source.userName = temp.source in sourceList ? "Source: " + sourceList[temp.source] + ", page " + temp.page : "Source: " + temp.source + ", page " + temp.page;
		}
	}

	engine = true;
}

function applyTraits() {
	engine = false;

	var a = this.getField("race").value.toLowerCase();
	var b = this.getField("hiddenCounterRace").value.toLowerCase();
	var c = false;

	if (a in raceList) {
		var race = raceList[a];
		var oldRace = "";

		var popTrait = function(trait, number, target) {
			if (race[trait] !== undefined && race[trait][number] !== undefined) {
				this.getField(target + (number + 1)).value = race[trait][number];
			} else if (c && oldRace[trait] !== undefined && oldRace[trait][number] !== undefined) {
				this.getField(target + (number + 1)).value = "";
			}
		}

		if (b in raceList) {
			c = true;
			oldRace = raceList[b];
		} else {
			c = false;
		}

		this.getField("size").value = race["size"];
		this.getField("speed").value = race["speed"];

		if (race.stealth) {
			setStealth(3, true);
		} else if (c && !oldRace.stealth) {
			setStealth (0, true);
		}

		setRaceSkill(1, race, c, oldRace);
		setRaceSkill(2, race, c, oldRace);
		setRaceSkill(3, race, c, oldRace);
		setRaceSkill(4, race, c, oldRace);
		setRaceSkill(5, race, c, oldRace);
		setRaceSkill(6, race, c, oldRace);
		setRaceSkill(7, race, c, oldRace);
		setRaceSkill(8, race, c, oldRace);
		setRaceSkill(9, race, c, oldRace);
		setRaceSkill(10, race, c, oldRace);
		setRaceSkill(11, race, c, oldRace);
		setRaceSkill(12, race, c, oldRace);
		setRaceSkill(13, race, c, oldRace);
		setRaceSkill(14, race, c, oldRace);
		setRaceSkill(15, race, c, oldRace);
		setRaceSkill(16, race, c, oldRace);
		setRaceSkill(17, race, c, oldRace);
		setRaceSkill(18, race, c, oldRace);
		popTrait("profs", 0, "proficiency");
		popTrait("profs", 1, "proficiency");
		popTrait("profs", 2, "proficiency");
		popTrait("profs", 3, "proficiency");
		popTrait("profs", 4, "proficiency");
		popTrait("defenses", 0, "specialDefenses");
		popTrait("defenses", 1, "specialDefenses");
		popTrait("features", 0, "feature");
		popTrait("features", 1, "feature");
		popTrait("features", 2, "feature");
		popTrait("features", 3, "feature");
		popTrait("features", 4, "feature");
		popTrait("features", 5, "feature");
		popTrait("features", 6, "feature");
		popTrait("features", 7, "feature");

		if (race["armor"] !== undefined) {
			setButton ("armorProfButton1", race["armor"][0]);
			setButton ("armorProfButton2", race["armor"][1]);
			setButton ("armorProfButton3", race["armor"][2]);
			setButton ("armorProfButton4", race["armor"][3]);
		} else if (c && oldRace["armor"] !== undefined) {
			setButton ("armorProfButton1", false);
			setButton ("armorProfButton2", false);
			setButton ("armorProfButton3", false);
			setButton ("armorProfButton4", false);
		}

		if (race["weapon"] !== undefined) {
			this.getField("weapon1").value = "";
			this.getField("weapon1").value = race["weapon"];
		} else if (c && oldRace["weapon"] !== undefined) {
			this.getField("weapon1").value = "";
		}

		if (race["spell"] !== undefined) {
			this.getField("spell1").value = race["spell"][0];
			this.getField("spell1").value += race["spell"][1];
		} else if (c && oldRace["spell"] !== undefined) {
			this.getField("spell1").value = "";
		}
		this.getField("hiddenCounterRace").value = a;
	}

	engine = true;
}

function applyWeapon(n) {
	engine = false;

	//get number from current field if none is supplied

	if (n === undefined) {
		n = Number(event.target.name.slice(-1)) - 1;
		main.weapon[n].raw = event.value;
	} else {
		main.weapon[n].raw = field.weapon[n].raw.value;
	}

	//set starting variables

	main.weapon[n].parsed = main.weapon[n].raw.toLowerCase();
	main.weapon[n].parsed = cleanPlus(main.weapon[n].parsed);
	main.weapon[n].known = "";
	main.weapon[n].name = "";
	main.weapon[n].plus = 0;
	main.weapon[n].affix = "";
	main.weapon[n].attack = [];
	main.weapon[n].attackBonus = 0;
	main.weapon[n].attackName = "";
	main.weapon[n].damage = ["", "", ""];
	main.weapon[n].damageBonus = 0;
	main.weapon[n].damageName = "";
	main.weapon[n].type = [];
	main.weapon[n].crit = [];
	main.weapon[n].critName = "";
	main.weapon[n].range = "";
	main.weapon[n].monk = false;
	main.weapon[n].advantage = [0, 0, 0];
	var weaponParsed = main.weapon[n].parsed;
	var tempString = "";
	var tempString2 = "";
	var tempPattern = "";
	var tempCursor = "";

	//find bonuses, tidy up weaponParsed

	if (main.weapon[n].parsed.length > 2) {
		tempPattern = /[+-][1-9][aA]/; //+nA (attack bonus)
		tempCursor = weaponParsed.search(tempPattern);
		if (tempCursor != -1) {
			main.weapon[n].attackBonus = Number(weaponParsed.slice(tempCursor, tempCursor + 2));
			weaponParsed = weaponParsed.replace(tempPattern, "");
		}

		tempPattern = /[+-]\d[D]/i; //+nA (damage bonus)
		tempCursor = weaponParsed.search(tempPattern);
		if (tempCursor != -1) {
			main.weapon[n].damageBonus = Number(weaponParsed.slice(tempCursor, tempCursor + 2));
			weaponParsed = weaponParsed.replace(tempPattern, "");
		}

		tempPattern = /[+-]\d/; //+n (normal bonus)
		tempCursor = weaponParsed.search(tempPattern);
		if (tempCursor != -1) {
			main.weapon[n].plus = Number(weaponParsed.slice(tempCursor, tempCursor + 2));
			main.weapon[n].affix = " " + createMod(main.weapon[n].plus);
			weaponParsed = weaponParsed.replace(tempPattern, "");
		}
		weaponParsed = weaponParsed.trim();
	}

	//see if input is valid and if weapon is in weaponList

	if (main.weapon[n].raw.trim().length === 0) { //only spaces
		if (main.weapon[n].raw.length <= 1) { //0 or 1 space --> clear, basic info
			field.weapon[n].raw.userName = "Weapon or attack: pick a weapon from the list and its statistics will be calculated automatically based on your abilities, levels and profiencies. Examples of input: \n\n\"Longsword +2\": adds +2 to attack and damage\n\"Longsword +1a +3d\": adds +1 to attack and +3 to damage\n\"Longsword (magical?!) +2a\": parentheses are ignored\n\"*Longsword\": non-standard names enable manual input";
			field.weapon[n].raw.readonly = false;
			field.weapon[n].attack.value = "";
			field.weapon[n].attack.userName = "Attack bonus";
			field.weapon[n].damage.value = "";
			field.weapon[n].damage.userName = "Damage or effect";
			field.weapon[n].type.value = "";
			field.weapon[n].crit.value = "";
			field.weapon[n].crit.userName = "Damage on a critical hit, or saving throw DC";
			field.weapon[n].range.value = "";
			field.weapon[n].attack.readonly = false;
			field.weapon[n].damage.readonly = false;
			field.weapon[n].type.readonly = false;
			field.weapon[n].crit.readonly = false;
			field.weapon[n].range.readonly = false;
			setAdvantage(field.weapon[n].advantage[0], 0, true);
			setAdvantage(field.weapon[n].advantage[1], 0, true);
			setAdvantage(field.weapon[n].advantage[2], 0, true);
		} else { // 2+ spaces ---> ignore input
			event.rc = false;
		}
	} else if (weaponList[weaponParsed] === undefined) { //input not in weaponlist ---> basic info
		field.weapon[n].raw.userName = "Weapon or attack";
		field.weapon[n].attack.userName = "Attack bonus";
		field.weapon[n].damage.userName = "Damage or effect";
		field.weapon[n].crit.userName = "Damage on a critical hit, or saving throw DC";
		field.weapon[n].attack.readonly = false;
		field.weapon[n].damage.readonly = false;
		field.weapon[n].type.readonly = false;
		field.weapon[n].crit.readonly = false;
		field.weapon[n].range.readonly = false;
	} else { //input in weaponList
		if (weaponList[weaponParsed].ignore !== undefined && weaponList[weaponParsed].ignore) { //header ---> ignore input
			event.rc = false;
		} else { //actual weapon --> get details
			main.weapon[n].known = weaponParsed;
			main.weapon[n].attack = weaponList[weaponParsed].attack;
			main.weapon[n].damage = weaponList[weaponParsed].damage;
			main.weapon[n].type = weaponList[weaponParsed].type;
			main.weapon[n].crit = weaponList[weaponParsed].crit;
			main.weapon[n].range = weaponList[weaponParsed].range;
			main.weapon[n].twohanded = (isSet(weaponList[weaponParsed].twohanded) && weaponList[weaponParsed].twohanded) ? true : false;
			main.weapon[n].advantage = weaponList[weaponParsed].advantage;

			//first check if monk weapon

			if (weaponList[weaponParsed].name === "short sword"
					|| weaponList[weaponParsed].name === "unarmed strike"
					|| (main.weapon[n].type[0] === "simple" && main.weapon[n].type[1] === "melee" && main.weapon[n].twohanded === false)) {
				main.weapon[n].monk = true;
			}

			//preparing strings, monk weapons exceptions

			if (main.weapon[n].attack.length === 1) { //tooltips
				tempString = main.ability[main.weapon[n].attack[0]].name + " modifier";
			} else {
				tempString = main.ability[main.weapon[n].attack[0]].name + " or " + main.ability[main.weapon[n].attack[1]].name + " modifier (whichever is highest)";
			}

			if (weaponList[weaponParsed].ammunition) {
				tempString2 += "\n\u2022 Ammunition";
			}
			if (main.weapon[n].attack.length > 1) {
				tempString2 += "\n\u2022 Finesse";
			}
			if (weaponList[weaponParsed].heavy) {
				tempString2 += "\n\u2022 Heavy";
				main.weapon[n].monk = false;
			}
			if (weaponList[weaponParsed].light) {
				tempString2 += "\n\u2022 Light";
			}
			if (weaponList[weaponParsed].loading) {
				tempString2 += "\n\u2022 Loading";
			}
			if (weaponList[weaponParsed].reach) {
				tempString2 += "\n\u2022 Reach";
				main.weapon[n].range += " (reach)";
			}
			if (weaponList[weaponParsed].thrown) {
				tempString2 += "\n\u2022 Thrown";
			}
			if (weaponList[weaponParsed].twohanded) {
				tempString2 += "\n\u2022 Two-handed";
				main.weapon[n].monk = false;
			}
			if (main.weapon[n].monk) {
				tempString2 += "\n\u2022 Usable as monk weapon";
			}
			if (weaponList[weaponParsed].versatile) {
				tempString2 += "\n\u2022 Versatile";
			}
			if (tempString2.length > 0) {
				tempString2 = "\n" + tempString2;
			}

			main.weapon[n].name = setCase(weaponList[weaponParsed].name, "upper") + main.weapon[n].affix + ": " + weaponList[weaponParsed].type[0] + " " + weaponList[weaponParsed].type[1] + " weapon" + tempString2;
			main.weapon[n].attackName = "The attack bonus of your " + weaponList[weaponParsed].name + main.weapon[n].affix + " is based on your " + tempString + ", your proficiency bonus (if applicable), and any special modifiers";
			main.weapon[n].damageName = "The damage of your " + weaponList[weaponParsed].name + main.weapon[n].affix + " is based on the indicated base damage, your " + tempString + ", and any special modifiers";
			main.weapon[n].critName = "The critical hit damage of your " + weaponList[weaponParsed].name + main.weapon[n].affix + " is based on the indicated base damage, your " + tempString + ", and any special modifiers";

			if (weaponList[weaponParsed].name === "breath weapon") { //exceptions
				main.weapon[n].attackName = "After using your breath weapon" + main.weapon[n].affix + ", you must finish a short or long rest to use it again";
				main.weapon[n].critName = "The DC of your breath weapon" + main.weapon[n].affix + " is " + (8 + main.weapon[n].plus) + " + your Constitution modifier + your proficiency bonus + any special modifiers";
			} else if (weaponList[weaponParsed].name === "net") {
				main.weapon[n].damageName = "A Large or smaller creature hit with your net" + main.weapon[n].affix + " is restrained until it frees itself (1 action, Strength DC 10) or the net is destroyed (5 slashing damage)";
				main.weapon[n].critName = "A Large or smaller creature hit with your net" + main.weapon[n].affix + " is restrained until it frees itself (1 action, Strength DC 10) or the net is destroyed (5 slashing damage)";
			} else if (weaponList[weaponParsed].name === "lance") {
				main.weapon[n].attackName += "\n\nYou have disadvantage when you use your lance to attack a target within 5 ft. Your lance requires two hands to wield when you are not mounted.";
			}

			field.weapon[n].raw.userName = main.weapon[n].name;
			field.weapon[n].attack.userName = main.weapon[n].attackName;
			field.weapon[n].damage.userName = main.weapon[n].damageName;
			field.weapon[n].type.value = main.weapon[n].damage[2];
			field.weapon[n].crit.userName = main.weapon[n].critName;
			field.weapon[n].range.value = main.weapon[n].range;
			field.weapon[n].attack.readonly = true;
			field.weapon[n].damage.readonly = true;
			field.weapon[n].type.readonly = true;
			field.weapon[n].crit.readonly = true;
			field.weapon[n].range.readonly = true;
			setAdvantage(field.weapon[n].advantage[0], main.weapon[n].advantage[0], true);
			setAdvantage(field.weapon[n].advantage[1], main.weapon[n].advantage[1], true);
			setAdvantage(field.weapon[n].advantage[2], main.weapon[n].advantage[2], true);
		}
	}
	engine = true;
}

function calcAbility(n) {
	main.ability[n].score = field.ability[n].score.value;
	main.ability[n].saveProf = isOn(field.ability[n].saveButton) ? true : false;

	if (isSet(main.ability[n].score)) {
		main.ability[n].mod = Math.floor((main.ability[n].score - 10) / 2); //ability mods
		if (main.ability[n].saveProf) {//saves
			if (isSet(main.profBonus)) {
				main.ability[n].save = createMod(main.ability[n].mod + main.profBonus + main.saveBonus, true);
			} else {
				main.ability[n].save = "Prof" + createMod(main.ability[n].mod + main.saveBonus, false)
			}
		} else {
			main.ability[n].save = createMod(main.ability[n].mod + main.saveBonus, true)
		}
	} else {
		main.ability[n].mod = ""; //mods
		main.ability[n].save = ""; //saves
	}

	//set fields

	field.ability[n].mod.value = main.ability[n].mod;

	if (!main.manual.save) {
		field.ability[n].save.value = main.ability[n].save;
	}
}

function calcAC() {
	var tempDex = 0;
	var tempOther = 0;

	if (isSet(main.ability[1].mod)) { //if dex is set
		tempDex = (main.ac.dexCap === 0) ? 0 : Math.min(main.ability[1].mod, main.ac.dexCap);
	}

	if (main.ac.otherAbility === "Constitution") {
		tempOther = isSet(main.ability[2].mod) ? main.ability[2].mod : 0;
	} else if (main.ac.otherAbility === "Wisdom") {
		tempOther = isSet(main.ability[4].mod) ? main.ability[4].mod : 0;
	} else if (main.ac.otherAbility === "Constitution & Wisdom") {
		tempOther += isSet(main.ability[2].mod) ? main.ability[2].mod : 0;
		tempOther += isSet(main.ability[4].mod) ? main.ability[4].mod : 0;
	}

	main.ac.ability = (isSet(main.ability[1].mod) || main.ac.otherAbility.trim() !== "") ? tempDex + tempOther : "";

	if (isSet(main.ability[1].mod) || isSet(main.ac.armor) || main.ac.otherAbility.trim() !== "") {
		main.ac.armor = isSet(main.ac.armor) ? main.ac.armor : 10;
		main.ac.ac = Number(main.ac.armor) + Number(main.ac.shield) + Number(tempDex) + Number(tempOther) + Number(main.ac.other);
	} else {
		main.ac.ac = "";
	}
}

function calcCarry() {
	var tempCarryFactor = 1;

	if (isSet(main.race.known) && (raceList[main.race.known].carryFactor !== undefined)) {
		tempCarryFactor = raceList[main.race.known].carryFactor;
	}

	if (isSet(main.ability[0].score)) { //if str set, set capacity, push, fonts, tooltips speed/armorType
		if (main.encumbrance) { //variant encumbrance rule
			main.weight.pushDragLift = 30 * main.ability[0].score * tempCarryFactor;
			main.weight.capacity = addComma(5 * main.ability[0].score * tempCarryFactor) + "/" + 10 * addComma(main.ability[0].score * tempCarryFactor) + " lb.";
			main.armor.typeName = "Armor type";
			main.armor.bold = false;

			if (10 * main.ability[0].score * tempCarryFactor < main.weight.total) { //heavily encumbered
				main.weight.bold = true;
				main.speedName = "Speed: the maximum distance you can normally move during a turn\n\nHeavily encumbered: effective speed drops by 20 ft., disadvantage on ability checks, attack rolls and saving throws that use Strength, Dexterity or Constitution";
			} else if (5 * main.ability[0].score * tempCarryFactor < main.weight.total) { //encumbered
				main.weight.bold = true;
				main.speedName = "Speed: the maximum distance you can normally move during a turn\n\nEncumbered: effective speed drops by 10 ft.";
			} else { //not encumbered
				main.weight.bold = false;
				main.speedName = "Speed: the maximum distance you can normally move during a turn";
			}
		} else { //normal encumbrance rule
			main.weight.pushDragLift = 30 * main.ability[0].score * tempCarryFactor;
			main.weight.capacity = addComma(15 * main.ability[0].score * tempCarryFactor) + " lb.";

			if (15 * main.ability[0].score * tempCarryFactor < main.weight.total) { //encumbered
				main.weight.bold = true;
				main.speedName = "Speed: the maximum distance you can normally move during a turn\n\nEncumbered: effective speed drops by 10 ft.";
			} else { //not encumbered
				main.weight.bold = false;
				main.speedName = "Speed: the maximum distance you can normally move during a turn";
			}

			if (main.ability[0].score < main.armor.strReq) { //armorType tooltip and font
				main.armor.typeName = "Armor type: you do not meet your armor's Strength requirement of " + main.armor.strReq;
				main.armor.bold = true;
			} else {
				main.armor.typeName = "Armor type";
				main.armor.bold = false;
			}
		}
	} else {
		main.weight.pushDragLift = "";
		main.weight.capacity = "";
		main.armor.typeName = "Armor type";
		main.armor.bold = false;
		main.weight.bold = false;
		main.speedName = "Speed: the maximum distance you can normally move during a turn";
	}
}

function calcClass() {
	engine = false;

	main.classes.parsed = [[], []];
	main.classes.known = [[], []];
	main.classes.knownCaster = [];
	main.classes.name = ["", ""];
	main.level = 0;
	main.hd = [];
	main.hp.max = false;
	main.hp.name = "";
	main.monkLevel = 0;
	main.warlockLevel = 0;
	main.spell.casterLevel = 0;
	main.spell.prepared = [];
	main.spell.recovery = 0;
	main.spell.sorcery = 0;
	main.profBonusMod = isSet(this.getField("profBonusMod").value) ? this.getField("profBonusMod").value : 0;
	var n = "";
	var temp = "";
	var temp2 = "";
	var temp3 = "";
	var tempCaster = "";
	var tempCasterLevel = "";
	var tempSlot = "";
	var tempBook = [];
	var tempCasterNumber;
	var tempString = "";
	var tempSpell = "";
	var tempWarlock = false;
	var tempWarlockString = ["", "", "", "", "", "", "", "", ""];
	var tempKnown = "";
	var tempAlert = "";

	//detects classes and sets class tooltips

	parseClass(0);
	parseClass(1);

	//add all levels and set character level, xp next

	for (i = 0; i < main.classes.parsed[0].length; i++) {
		main.level += main.classes.parsed[0][i][1];
	}
	for (i = 0; i < main.classes.parsed[1].length; i++) {
		main.level += main.classes.parsed[1][i][1];
	}

	main.level = Math.min(main.level, 999);
	main.level = main.level < 1 ? "" : main.level;

	main.profBonus = isSet(main.level) ? Math.floor((main.level - 1 + main.profBonusMod) / 4) + 2 : ""; //calc profBonus
	main.xp.next = isSet(main.level) ? main.xp.req[Math.min(main.level - 1, 19)] : "";

	field.xp.next.value = main.xp.next;
	field.profBonus.value = main.profBonus;

	//set hp max tooltip

	if (main.hp.max !== false) {
		main.hp.name = "Maximum hit points: " + main.hp.max + " (hit dice) + " + main.level + " \u00D7 your Constitution modifier + any special modifiers";
	} else {
		main.hp.name = "Maximum hit points: based on your hit dice, your Constitution modifier, and any special modifiers";
	}

	field.hp.userName = main.hp.name;
	field.level.value = main.level;
	field.classes[0].userName = main.classes.name[0];
	field.classes[1].userName = main.classes.name[1];

	//set hit dice on sheet

	if (!isOn("manualAllButton")) {
		n = 1;
		if (main.hd.length > 0) {
			main.hd.sort(function (a, b) {
				return a - b;
			});
		}
		for (i = 0; i < main.hd.length; i++) {
			if (main.hd[i] !== undefined && n < 5) {
				this.getField("hd" + n).value = Math.min(main.hd[i][1], 999) + "d" + main.hd[i][0];
				n++;
			}
		}
		while (n < 5) {
			this.getField("hd" + n).value = "";
			n++;
		}
	}

	//spellcasting part

	temp = main.classes.knownCaster;

	if (temp.length > 0) {

		//sort casters according to highest effective caster level

		main.classes.knownCaster.sort(function(a, b) {
			var lvl1 = a[2];
			var lvl2 = b[2];
			if (Number(lvl1) > Number(lvl2)) {
				return -1;
			} else if (Number(lvl1) < Number(lvl2)) {
				return 1;
			} else {
				return 0;
			}
		});

		if (!main.manual.spellcasting) {
			field.spell.ability.value = temp[0][3]; //set spellcasting ability to that of hightest caster
		}

		for (i = 0; i < temp.length; i++) {
			tempCaster = classList[temp[i][0]];
			main.spell.casterLevel += temp[i][2]; //add effective caster level

			//create array of spell preparerers

			if (tempCaster.spellPrepared && temp[i][2] > 0) {
				main.spell.prepared[main.spell.prepared.length] = [];
				main.spell.prepared[main.spell.prepared.length - 1][0] = temp[i][0]; //class name
				main.spell.prepared[main.spell.prepared.length - 1][1] = temp[i][1]; //class level
				main.spell.prepared[main.spell.prepared.length - 1][2] = temp[i][3]; //spellcasting ability
			}

			if (tempCaster.arcaneRecovery) { //add arcane recovery
				main.spell.recovery += Math.ceil(temp[i][1] / 2)
			}

			if (tempCaster.sorceryPoints) { //add socery points
				main.spell.sorcery += temp[i][1] > 1 ? temp[i][1] : 0;
			}

			//create array with number of spells known

			tempKnown = [false, false, false, false, false, false, false, false, false, false];

			for (n = 0; n < Math.min(temp[i][1], 20); n++) {
				if (tempCaster.spellsKnown === 0) {
					tempKnown[tempCaster["spellsPerDay"][n].length] = "all"; //clerics, paladins etc.

				} else {
					if (tempKnown[tempCaster["spellsPerDay"][n].length] === false) {
						tempKnown[tempCaster["spellsPerDay"][n].length] = 0;
					}

					temp2 = n === 0 ? tempCaster.spellsKnown[n] : tempCaster.spellsKnown[n] - tempCaster.spellsKnown[n - 1]; //add known spells of highest current level

					//for those classes that allow it, for each level, replace one spell of the lowest level with one of the highest current level

					if (temp[i][0] === "bard" || temp[i][0] === "eldritch knight" || temp[i][0] === "ranger" || temp[i][0] === "arcane trickster" || temp[i][0] === "sorcerer" || temp[i][0] === "warlock") {
						for (j = 1; j < tempKnown.length; j++) {
							if (tempKnown[j] !== false && tempKnown[j] > 0) {
								tempKnown[j]--;
								temp2++;
								break;
							}
						}
					}
					tempKnown[tempCaster["spellsPerDay"][n].length] += temp2;
				}
			}

			if (tempCaster.cantripsKnown !== undefined) {
				tempKnown[0] = tempCaster.cantripsKnown[temp[i][1] - 1]; //set cantrips known
			} else {
				tempKnown[0] = false;
			}

			temp[i][4] = tempKnown; //where false = no spells know, true = all spells known, n = n spells known
		}
	}

	//set arcane recovery and sorcery points

	if (main.spell.recovery === 0) {
		main.spell.recovery = "";
	}
	if (main.spell.sorcery === 0) {
		main.spell.sorcery = "";
	}

	if (!main.manual.spellCasting) {
		field.spell.recovery.value = main.spell.recovery;
		field.spell.sorcery.value = main.spell.sorcery;
	}

	//set spell slot values

	tempCaster = false;

	if (temp.length === 1) { //single caster class
		tempCaster = temp[0][0];
		tempCasterLevel = Math.min(temp[0][1], 20);
		main.spell.casterLevel = tempCasterLevel;
	} else if (temp.length === 2 && main.warlockLevel > 0) { //2 caster classes, 1 warlock
		n = temp[0][0] === "warlock" ? 1 : 0;
		tempCaster = temp[n][0];
		tempCasterLevel = Math.min(temp[n][1], 20);
		main.spell.casterLevel = tempCasterLevel;
		tempWarlock = true;
	} else if (temp.length > 1 && main.spell.casterLevel > 0) { //multiple caster classes
		tempCaster = "wizard";

		if (main.warlockLevel > 0) {
			tempWarlock = true;
			tempCasterLevel = Math.min((main.spell.casterLevel - main.warlockLevel), 20);
		} else {
			tempCasterLevel = Math.min(main.spell.casterLevel, 20);
		}

		main.spell.casterLevel = tempCasterLevel;
	}

	for (i = 0; i < 9; i++) {
		if (!tempCaster) {
			main.spell.slot[i] = "";
		} else {
			temp2 = classList[tempCaster]["spellsPerDay"][tempCasterLevel - 1][i];
			tempSlot = (temp2 !== undefined) ? temp2 : 0;

			if (tempWarlock) {
				temp3 = classList["warlock"]["spellsPerDay"][main.warlockLevel - 1][i];
				if (temp3 !== undefined && temp3 !== 0) {
					if (tempSlot === 0) {
						tempSlot = temp3 + "*";
						if (temp3 === 1) {
							tempWarlockString[i] = " (this is a warlock spell slot, which is recovered after a short rest)"
						} else {
							tempWarlockString[i] = " (these are warlock spell slots, which are recovered after a short rest)"
						}
					} else {
						tempSlot = (tempSlot + temp3) + "*";
						if (temp3 === 1) {
							tempWarlockString[i] = " (" + temp3 + " of these is a warlock spell slot, which is recovered after a short rest)"
						} else {
							tempWarlockString[i] = " (" + temp3 + " of these are warlock spell slots, which are recovered after a short rest)"
						}
					}
				}
			}
			main.spell.slot[i] = tempSlot !== 0 ? tempSlot : "";
		}

		if (!main.manual.spellcasting) {
			field.spell.slot[i].value = main.spell.slot[i];
		}
	}

	//set spell slot tooltips (spellbooks)

	if (temp.length > 0 && !main.manual.spellcasting) {
		for (i = 1; i < 10; i++) {
			tempAlert = "";
			temp3 = "\n\n";
			tempString = "Spell slot: the number of " + spellLevelList[i] + " spells you can cast after resting" + tempWarlockString[i - 1];

			for (n = 0; n < main.classes.knownCaster.length; n++) {
				temp2 = main.classes.knownCaster[n];

				if (i === 1) {
					if (temp2[4][0] !== false) {
						tempString += temp3 + classList[temp2[0]].name + " cantrips known: " + temp2[4][0];
						temp3 = "\n";
					}
				}

				if (temp2[4][i] !== false) {
					tempString += temp3 + spellLevelList[i] + " " + classList[temp2[0]].name + " spells known: " + temp2[4][i];
					temp3 = "\n\n";

					if (temp2[0] === "bard" || temp2[0] === "eldritch knight" || temp2[0] === "ranger" || temp2[0] === "arcane trickster" || temp2[0] === "sorcerer" || temp2[0] === "warlock") {
						tempAlert = "\n\nThese numbers presume that whenever you add a spell, you choose one of the highest level possible. They also presume that whenever you are allowed to, you replace one of your lowest-level spells (excluding cantrips) with one of the highest level possible. You can, however, always choose to learn spells of a lower level instead."
					}

					if (temp2[0] === "wizard") {
						tempString += " (excluding copied spells)";
					}

					if (n > 5 && temp2[0] === "warlock") {
						tempString += " (excluding mystic arcana)";
					}
				}
			}
			field.spell.slot[i - 1].userName = tempString + tempAlert;
		}
	} else { //basic tooltips
		for (i = 0; i < 9; i++) {
			field.spell.slot[i].userName = "Spell slot: how many " + spellLevelList[i + 1] + " spells you can cast after resting";
		}
	}

	engine = true;
	calcMain();
}

function calcInitiative() {
	var tempMod = main.ability[1].mod;
	var tempAlert = main.alert ? 5 : 0;

	if (isSet(tempMod)) { //mod is set
		if (main.jack || main.athlete) {
			if (isSet(main.profBonus)) { //with all mods...
				if (main.jack) {
					 if (main.athlete){
						main.initiative = createMod(tempMod + tempAlert + Math.ceil(main.profBonus / 2) + Math.floor(main.profBonus / 2, true)); //jack and athlete
					 } else {
						main.initiative = createMod(tempMod + tempAlert + Math.floor(main.profBonus / 2), true); //jack
					 }
				} else {
					main.initiative = createMod(tempMod + tempAlert + Math.ceil(main.profBonus / 2), true); //athlete
				}
			} else {
				if (main.jack) {
					 if (main.athlete){
						main.initiative = "Prof" + createMod(tempAlert + tempMod); //jack and athlete
					 } else {
						main.initiative = "\u00BD\xD7prof" + createMod(tempAlert + tempMod); //jack
					 }
				} else {
					main.initiative = "\u00BD\xD7prof" + createMod(tempAlert + tempMod); //athlete
				}
			}
		} else {
			main.initiative = createMod(tempAlert + tempMod, true); //just ability mod
		}
	} else { //ability mod is not set
		main.initiative = "";
	}

	field.initiative.value = main.initiative; //set field
}

function calcPassivePerception() {
	if (isSet(main.ability[4].mod)) { //mod is set
		if (main.skill[12].status == 1) { //proficient
			if (isSet(main.profBonus)) {
				main.skill[0].mod = 10 + main.ability[4].mod + main.profBonus + 5 * main.observant;
			} else {
				main.skill[0].mod = (10 + main.ability[4].mod + 5 * main.observant) + "+prof";
			}
		} else if (main.skill[12].status == 2) { //expert
			if (isSet(main.profBonus)) {
				main.skill[0].mod = 10 + main.ability[4].mod + 2 * main.profBonus + 5 * main.observant;
			} else {
				main.skill[0].mod = (10 + main.ability[4].mod) + "+2\xD7prof";
			}
		} else { //not proficient
			if (main.jack) {
				if (isSet(main.profBonus)) {
					main.skill[0].mod = 10 + main.ability[4].mod + Math.floor(main.profBonus / 2) + 5 * main.observant;
				} else {
					main.skill[0].mod = (10 + main.ability[4].mod + 5 * main.observant) + "+\u00BD\xD7prof";
				}
			} else {
				main.skill[0].mod = 10 + main.ability[4].mod + 5 * main.observant;
			}
		}
	} else {
		main.skill[0].mod = "";
	}

	if (!main.manual.skill) {
		field.skill[0].mod.value = main.skill[0].mod;
	}
}

function calcSkill(n) {
	main.skill[n].status = field.skill[n].status.value;
	var tempMod = main.ability[main.skill[n].ability].mod;
	var tempModName = main.ability[main.skill[n].ability].shorthand;

	if (isSet(tempMod)) { //mod is set
		if (main.skill[n].status === 1) { //proficient
			if (isSet(main.profBonus)) {
				main.skill[n].mod = createMod(tempMod + main.profBonus, true);
			} else {
				main.skill[n].mod = "Prof" + createMod(tempMod);
			}
		} else if (main.skill[n].status === 2) { //expert
			if (isSet(main.profBonus)) {
				main.skill[n].mod = createMod(tempMod + 2 * main.profBonus, true);
			} else {
				main.skill[n].mod = "2\xD7prof" + createMod(tempMod);
			}
		} else if (main.jack || (main.athlete & main.skill[n].ability < 3)) {
			if (isSet(main.profBonus)) { //with all mods...
				if (main.jack) {
					 if (main.athlete & main.skill[n].ability < 3){
						main.skill[n].mod = createMod(tempMod + Math.ceil(main.profBonus / 2) + Math.floor(main.profBonus / 2), true); //jack and athlete
					 } else {
						main.skill[n].mod = createMod(tempMod + Math.floor(main.profBonus / 2), true); //jack
					 }
				} else {
					main.skill[n].mod = createMod(tempMod + Math.ceil(main.profBonus / 2), true); //athlete
				}
			} else {
				if (main.jack) {
					 if (main.athlete & main.skill[n].ability < 3){
						main.skill[n].mod = "Prof" + createMod(tempMod); //jack and athlete
					 } else {
						main.skill[n].mod = "\u00BD\xD7prof" + createMod(tempMod); //jack
					 }
				} else {
					main.skill[n].mod = "\u00BD\xD7prof" + createMod(tempMod); //athlete
				}
			}
		} else {
			main.skill[n].mod = createMod(tempMod, true); //just ability mod
		}
	} else { //ability mod is not set
		main.skill[n].mod = "";
	}

	field.skill[n].mod.value = main.skill[n].mod; //set field
}

function calcSpellcastingMod(n) {
	var tempMod = "";
	var tempName = "";
	var tempCheck = true;

	tempMod = main.ability[n].mod;
	if (isSet(main.profBonus) && isSet(tempMod)) {
		if (n === main.spell.ability) {
			main.spell.dc = 8 + tempMod + main.profBonus;
			main.spell.attack = createMod(tempMod + main.profBonus);
		}
		main.spell.name += "\n\n" + main.ability[n].name + ": spell DC " + (8 + tempMod + main.profBonus) + ", spell attack: " + createMod(tempMod + main.profBonus, true);
	} else { //nothing set
		if (n === main.spell.ability) {
				main.spell.dc = "";
				main.spell.attack = "";
		}
	}
}

function calcStats() {
	if (isOn(field.hints.stats)) {
		main.stat.number = [0, 0];
		main.stat.total = [0, 0];
		main.stat.value = [0, 0];
		main.stat.affix = ["", ""];
		var tempStat = "";

		for (n = 0; n < 6; n++) { //scores on sheet
			tempStat = main.ability[n].score;
			if (isSet(tempStat)) {
				main.stat.number[0]++;
				main.stat.total[0] += tempStat;
				if (tempStat === 9) {
					main.stat.value[0] += 1;
				} else if (tempStat === 10) {
					main.stat.value[0] += 2;
				} else if (tempStat === 11) {
					main.stat.value[0] += 3;
				} else if (tempStat === 12) {
					main.stat.value[0] += 4;
				} else if (tempStat === 13) {
					main.stat.value[0] += 5;
				} else if (tempStat === 14) {
					main.stat.value[0] += 7;
				} else if (tempStat === 15) {
					main.stat.value[0] += 9;
				} else if (tempStat > 15) {
					main.stat.value[0] += 9;
					main.stat.affix[0] = "+";
				}
			}
		}

		for (n = 0; n < 6; n++) { //rolled scores
			tempStat = main.stat.array[n];
			if (isSet(tempStat)) {
				main.stat.number[1]++;
				main.stat.total[1] += tempStat;
				if (tempStat === 9) {
					main.stat.value[1] += 1;
				} else if (tempStat === 10) {
					main.stat.value[1] += 2;
				} else if (tempStat === 11) {
					main.stat.value[1] += 3;
				} else if (tempStat === 12) {
					main.stat.value[1] += 4;
				} else if (tempStat === 13) {
					main.stat.value[1] += 5;
				} else if (tempStat === 14) {
					main.stat.value[1] += 7;
				} else if (tempStat === 15) {
					main.stat.value[1] += 9;
				} else if (tempStat > 15) {
					main.stat.value[1] += 9;
					main.stat.affix[1] = "+";
				}
			} else {
				break;
			}
		}

		main.stat.average[0] = Math.floor(main.stat.total[0] / main.stat.number[0] * 10) / 10;
		main.stat.average[1] = Math.floor(main.stat.total[1] / main.stat.number[1] * 10) / 10;

		if (main.stat.number[0] > 0) {
			if (main.stat.number[1] > 0) {
				main.stat.string[0] = main.stat.value[0] + main.stat.affix[0] + "/" + main.stat.value[1] + main.stat.affix[1];
				main.stat.string[1] = main.stat.average[0] + "/" + main.stat.average[1];
			} else {
				main.stat.string[0] = main.stat.value[0] + main.stat.affix[0];
				main.stat.string[1] = main.stat.average[0];
			}
		} else if (main.stat.number[1] > 0) {
				main.stat.string[0] = main.stat.value[1] + main.stat.affix[1];
				main.stat.string[1] = main.stat.average[1];
		} else {
				main.stat.string[0] = "";
				main.stat.string[1] = "";
		}
	}
}

function calcWeapon(n) {
	var temp = main.weapon[n];
	var tempString = "";
	temp.prof = false;

	if (isSet(temp.known)) {
		tempWeapon = weaponList[temp.known];
		tempDice = temp.damage[0];
		tempFaces = temp.damage[1];
		tempClass = "";
		tempClassCount = 0;

		//determine proficiency, adjust tooltip

		if ((tempWeapon.type[0] === "simple" && isOn("weaponProfButton1")) || (tempWeapon.type[0] === "martial" && isOn("weaponProfButton2")) || tempWeapon.type[0] === "special") { //check buttons
			temp.prof = true;
		} else { //scan proficiency fields if not yet proficient
			for (i = 1; i < 9; i++) {
				tempString = String(this.getField("proficiency" + i).value);
				tempString = tempString.toLowerCase();
				if (tempString.indexOf(tempWeapon.name) > -1) {
					temp.prof = true;
				}
			}
		}

		//set tempMod

		if (temp.monk && main.monkLevel > 0) {
			if (isSet(main.ability[0].mod) && isSet(main.ability[1].mod)) {
				tempMod = Math.max(main.ability[0].mod, main.ability[1].mod);
			} else {
				tempMod = false;
				tempModString = main.ability[0].shorthand + "/" + main.ability[1].shorthand;;
			}
		} else if (temp.attack.length === 1) {
			if (isSet(main.ability[temp.attack[0]].mod)) {
				tempMod = main.ability[temp.attack[0]].mod;
			} else {
				tempMod = false;
				tempModString = main.ability[temp.attack[0]].shorthand;
			}
		} else {
			if (isSet(main.ability[temp.attack[0]].mod) && isSet(main.ability[temp.attack[1]].mod)) {
				tempMod = Math.max(main.ability[temp.attack[0]].mod, main.ability[temp.attack[1]].mod);
			} else {
				tempMod = false;
				tempModString = main.ability[temp.attack[0]].shorthand + "/" + main.ability[temp.attack[1]].shorthand;;
			}
		}

		//monk weapons

		if (temp.monk) {
			if (main.monkLevel > 16) {
				tempFaces = Math.max(temp.damage[1], 10);
			} else if (main.monkLevel > 10) {
				tempFaces = Math.max(temp.damage[1], 8);
			} else if (main.monkLevel > 4) {
				tempFaces = Math.max(temp.damage[1], 6);
			} else if (main.monkLevel > 0) {
				tempFaces = Math.max(temp.damage[1], 4);
			}
		}

		//cantrip damage scaling

		if (tempWeapon.cantripDamage) {
			if (main.level > 16) {
				tempDice += 3;
			} else if (main.level > 10) {
				tempDice += 2;
			} else if (main.level > 4) {
				tempDice += 1;
			}
		}

		//breath weapon

		if (tempWeapon.name === "breath weapon") {
			if (main.level > 16) {
				tempDice = 5;
			} else if (main.level > 10) {
				tempDice = 4;
			} else if (main.level > 5) {
				tempDice = 3;
			}
		}

		//prepare damage and crit strings

		if (tempFaces === 1) { //prepare damage and crit strings
			tempDamage = tempDice * tempFaces; //damage for weapons with no variable damage
		} else {
			tempDamage = tempDice + "d" + tempFaces; //normal damage

		} if (temp.type[1] === "melee" && main.race.known === "half-orc") { //extra die for half-orcs with melee weapons
			if (tempFaces === 1) {
				tempCrit = (2 * tempDice + 1) * tempFaces; //no variable damage
			} else {
				tempCrit = (2 * tempDice + 1) + "d" + tempFaces; //normal
			}
		} else {
			if (tempFaces === 1) { //non-half-orc
				tempCrit = 2 * tempDice * tempFaces; //no variable damage
			} else {
				tempCrit = 2 * tempDice + "d" + tempFaces; //normal
			}
		}

		//complete attack, damage, crit strings

		if (tempWeapon.noModDamage) {
			if (tempMod !== false) { //setting attack, damage, crit strings

				if (temp.prof) {
					if (isSet(main.profBonus)) {
						temp.attackString = createMod(tempMod + main.profBonus + temp.plus + temp.attackBonus, true); //attack, mod available, prof, prof available
					} else { //main.profBonus not available
						temp.attackString = "Prof" + createMod(tempMod + temp.plus + temp.attackBonus); //attack, mod available, prof, prof not available
					}
				} else {
					temp.attackString = createMod(tempMod + temp.plus + temp.attackBonus, true); //attack, mod available, no prof
				}

				if (tempFaces === 1) { //
					temp.damageString = tempDamage + (temp.plus + temp.damageBonus); //damage, mod available, 1 face
					temp.critString = tempCrit + (temp.plus + temp.damageBonus); //crit damage, mod available, 1 face
				} else {
					temp.damageString = tempDamage + createMod(temp.plus + temp.damageBonus); //damage, mod available, 2+ tempFaces
					temp.critString = tempCrit + createMod(temp.plus + temp.damageBonus); //crit damage, mod available, 2+ faces
				}

			} else {
				if (temp.prof) {
					if (isSet(main.profBonus)) {
					temp.attackString = tempModString + createMod(main.profBonus + temp.plus + temp.attackBonus); //attack, mod not available, prof, prof available
					} else {
					temp.attackString = tempModString + "+prof" + createMod(temp.plus + temp.attackBonus); //attack, mod not available, prof, prof not available
					}
				} else {
					temp.attackString = tempModString + createMod(temp.plus + temp.attackBonus); //attack, mod not available, no prof
				}
				temp.damageString = tempDamage + createMod(temp.plus + temp.damageBonus); //damage, mod not available
				temp.critString = tempCrit + createMod(temp.plus + temp.damageBonus); //crit damage, mod not available
			}

		} else {
			if (tempMod !== false) { //setting attack, damage, crit strings
				if (temp.prof) {
					if (isSet(main.profBonus)) {
						temp.attackString = createMod(tempMod + main.profBonus + temp.plus + temp.attackBonus, true); //attack, mod available, prof, prof available
					} else { //main.profBonus not available
						temp.attackString = "Prof" + createMod(tempMod + temp.plus + temp.attackBonus); //attack, mod available, prof, prof not available
					}
				} else {
					temp.attackString = createMod(tempMod + temp.plus + temp.attackBonus, true); //attack, mod available, no prof
				}
				if (tempFaces === 1) { //
					temp.damageString = tempDamage + tempMod + (temp.plus + temp.damageBonus); //damage, mod available, 1 face
				} else {
					temp.damageString = tempDamage + createMod(tempMod + temp.plus + temp.damageBonus); //damage, mod available, 2+ tempFaces
				}
				if (tempFaces === 1) {
					temp.critString = tempCrit + tempMod + (temp.plus + temp.damageBonus); //crit damage, mod available, 1 face
				} else {
					temp.critString = tempCrit + createMod(tempMod + temp.plus + temp.damageBonus); //crit damage, mod available, 2+ faces
				}
			} else {
				if (temp.prof) {
					if (isSet(main.profBonus)) {
					temp.attackString = tempModString + createMod(main.profBonus + temp.plus + temp.attackBonus); //attack, mod not available, prof, prof available
					} else {
					temp.attackString = tempModString + "+prof" + createMod(temp.plus + temp.attackBonus); //attack, mod not available, prof, prof not available
					}
				} else {
					temp.attackString = tempModString + createMod(temp.plus + temp.attackBonus); //attack, mod not available, no prof
				}
				temp.damageString = tempDamage + "+" + tempModString + createMod(temp.plus + temp.damageBonus); //damage, mod not available
				temp.critString = tempCrit + "+" + tempModString + createMod(temp.plus + temp.damageBonus); //crit damage, mod not available
			}
		}

		//exceptions

		//weapons with save instead of normal crits

		if (tempWeapon.save !== undefined) {
			if (tempMod !== false) {
				if (isSet(main.profBonus)) {
					temp.critString = main.ability[tempWeapon.save[0]].shorthand + " DC " + (8 + tempMod + main.profBonus + temp.plus) + tempWeapon.save[1];
				}
				else {
					temp.critString = main.ability[tempWeapon.save[0]].shorthand + " DC " + (8 + tempMod + temp.plus) + "+prof";
				}
			} else if (isSet(main.profBonus)) {
				temp.critString = main.ability[tempWeapon.save[0]].shorthand + " DC " + (8 + main.profBonus + temp.plus) + "+" + main.ability[temp.attack[0]].shorthand;
			} else {
				temp.critString = main.ability[tempWeapon.save[0]].shorthand + " DC " + (8 + temp.plus) + "+prof+" + main.ability[temp.attack[0]].shorthand;
			}
		}

		//special attack/damage/crit strings

		if (tempWeapon.attackAffix !== undefined) {
			if (tempWeapon.attackAffix[1]) {
				temp.attackString = tempWeapon.attackAffix[0];
			} else {
				temp.attackString += tempWeapon.attackAffix[0];
			}
		}

		if (tempWeapon.damageAffix !== undefined) {
			if (tempWeapon.damageAffix[1]) {
				temp.damageString = tempWeapon.damageAffix[0];
			} else {
				temp.damageString += tempWeapon.damageAffix[0];
			}
		}

		if (tempWeapon.critAffix !== undefined) {
			if (tempWeapon.critAffix[1]) {
				temp.critString = tempWeapon.critAffix[0];
			} else {
				temp.critString += tempWeapon.critAffix[0];
			}
		}

		//eldritch blast

		if (tempWeapon.name === "Eldritch Blast") {
			if (main.level > 16) {
				temp.attackString += " (4)";
			} else if (main.level > 10) {
				temp.attackString += " (3)";
			} else if (main.level > 4) {
				temp.attackString += " (2)";
			}
		}

		//net

		if (tempWeapon.name === "net") {
			temp.damageString = "Restrain";
			temp.critString = "";
		}

		//set fields

		field.weapon[n].attack.value = main.weapon[n].attackString;
		field.weapon[n].damage.value = main.weapon[n].damageString;
		field.weapon[n].crit.value = main.weapon[n].critString;
	}
}

function calcWeight() {
	var tempItemName = "";
	var tempItemWeight = "";
	var tempItemAmount = "";
	var tempString = "";

	for (n = 1; n <= main.weight.inventorySize; n++) { //add weight of inventory items
		tempItemWeight = this.getField("itemWeight" + n).value;

		if (isSet(tempItemWeight)) {
			tempItemName = this.getField("item" + n).value;

			if (tempItemName[tempItemName.length - 1] !== "*") { //ignore items with asterisk at the end
				tempItemAmount = this.getField("itemAmount" + n).value;
				main.weight.total += isSet(tempItemAmount) ? tempItemWeight * tempItemAmount : tempItemWeight; //amount = 1 if none is given
			}
		}
	}

	//count coins

	tempItemWeight = 0;

	for (n = 0; n < 5; n++) {
		if (!isNaN(field.coins[n].value) && field.coins[n].value !== 0) {
			main.coins[n].number = Number(field.coins[n].value);
			main.coins[5] += main.coins[n].number * main.coins[n].value;
			tempItemWeight += Math.max(main.coins[n].number / 50, 0);
		} else {
			main.coins[n].number = 0;
		}
	}

	//set tooltips coins

	for (n = 0; n < 5; n++) {
		if (main.coins[n].number !== 0) {
			tempString = addComma(main.coins[n].number) + " " + main.coins[n].name;
			tempString += (main.coins[n].number === 1 || main.coins[n].number === -1) ? " piece\n" : " pieces\n";
			tempString += "Weight: " + addComma(Math.round(Math.max(main.coins[n].number / 50, 0))) + " lb.";
			tempString += (n !== 3) ? "\nValue: " + addComma(Math.round(main.coins[n].number * main.coins[n].value * 100) / 100) + " gp" : "";
		} else {
		tempString = setCase(main.coins[n].name, "upper") + " pieces";
		tempString += (n !== 3) ? ", each worth " + main.coins[n].value + " gp" : "";
		}
		tempString += "\n\nTotal coin weight: " + addComma(Math.round(tempItemWeight)) + " lb.";
		tempString += "\nTotal coin value: " + addComma(Math.round(main.coins[5] * 100) / 100) + " gp"
		field.coins[n].userName = tempString;
	}

	main.weight.total = Math.floor(main.weight.total + tempItemWeight);
	main.weight.total = main.weight.total === 0 ? "" : main.weight.total; //none if zero, otherwise round number
}

function clean(input, remove) {
	var charArray = (typeof remove !== "undefined") ? remove : [" ", "-", ".", ",", "\\", "/", ":", ";"];

	for (i = 0; i < charArray.length; i++) {
		input = input.split(charArray[i]).join("")
	}

	return input;
}

function cleanPlus(input) {
	input = input.replace(/\([^)]*\)/g, ""); //trim parentheses
	input = input.replace(/  +/g, " "); //remove double spaces
	input = trimEnd(input);
	return input;
}

function createMod(input, zero) {
	zero = zero === undefined ? false : zero;
	input = Number(input);

	if (isNaN(input)) {
		return input;
	} else if (input === 0 && zero === false) {
		return "";
	} else {
		if (input > 0) {
			return "+" + input;
		} else if (zero === "always") {
			return "+" + input;
		} else {
			return input;
		}
	}
}

function endsWith(input, query) {
	input = String(input).toLowerCase();
	query = query.toLowerCase();
	return (input.slice(-query.length) === query) ? true : false;
}

function getMenu() {
	var temp = app.popUpMenuEx.apply(app, main.menu);
	temp = temp === null ? "" : temp;
	temp = temp.toLowerCase();
	temp = temp.split(":");
	return temp;
}

function readValue(target, noundefined) {
	if (this.getField(target) !== null) { //field exists...
		if (noundefined) {
			if (this.getField(target).value === undefined) {
				return ""; //"" instead of undefined
			} else {
				return this.getField(target).value; //actual value
			}
		} else {
			return this.getField(target).value; //actual value, even if undefined
		}
	} else if (noundefined) {
		return ""; //return "" even though field doesn't exist
	}
}

function isOn(button) {
	return this.getField(button).isBoxChecked(0);
}

function isSet(input) {
	if (input === undefined || input === "") {
		return false;
	} else {
		return true;
	}
}

function nextAdvantage() { //for advantage button
	var n = event.target.name.slice(15); //gets number
	var temp = this.getField("advantageStatus" + n).value; //gets value of corresponding advantageStatus

	temp = temp > 2 ? 0 : temp + 1;

	this.getField("advantageStatus" + n).value = temp; //advance or reset advantageStatus
	this.getField(event.target.name).buttonSetIcon(iconList2[temp]);
}

function nextButton() { //for skill prof button
	var n = event.target.name.slice(11); //gets number after current skillButton
	var temp = this.getField("skillStatus" + n).value; //gets value of corresponding skillStatus

	temp > 1 ? temp = 0 : temp += 1;

	this.getField("skillStatus" + n).value = temp; //advance or reset skillStatus
	this.getField(event.target.name).buttonSetIcon(iconList1[temp]);
}

function nextStealth() { //like nextAdvantage but for Stealth
	var n = event.target.name.slice(15); //gets number
	var temp = this.getField("advantageStatus" + n).value; //gets value of corresponding advantageStatus

	temp > 2 ? temp = 0 : temp += 1;

	this.getField("advantageStatus" + n).value = temp; //advance or reset advantageStatus
	this.getField(event.target.name).buttonSetIcon(iconList2[temp]);

	if (temp < 2) {
		this.getField("stealthDisadvantageButton").checkThisBox(0, false); //+
	} else if (temp == 2) {
		this.getField("stealthDisadvantageButton").checkThisBox(0, true); //-
	}
}

function parseClass(n) {
	var temp = main.classes.field[n];
	var temp2 = "";
	var tempArray = [];
	var tempPosition = 0;
	var tempChar = "";
	var tempType = 0;
	var tempString = "";
	var tempDie = "";
	var tempFound = false;
	var tempClass = "";
	var tempLevel = "";
	var tempName = "";
	var multi = "";

	//remove special characters from raw string

	temp = clean(temp, ["-", ".", ",", "\\", "/", ":", ";", "(", ")"]);
	temp = cleanPlus(temp);

	//split raw string at string-number divides and push parts into temp array

	for (i = 0; i < temp.length; i++) {
		tempChar = parseInt(temp.charAt(i), 10); //try to cast current character as a decimal number

		if (isNaN(tempChar)) { //string detected
			if (tempType === "number") { //start of string, so push previous number unless there's nothing before it
				if (tempArray.length > 0) {
					tempArray.push(Number(temp.substring(tempPosition, i)));
				}
				tempPosition = i;
			}
			if (i === temp.length - 1) { //end of line, so push string
				tempArray.push(String(temp.substring(tempPosition, i + 1)).trim());
			}
			tempType = "string"; //

		} else { //number detected
			if (tempType === "string") { //start of number, so push previous string
				tempArray.push(String(temp.substring(tempPosition, i)).trim());
				tempPosition = i;
			}
			if (i === temp.length - 1 && tempArray.length > 0) { //end of line, so push number unless there's nothing before it
				tempArray.push(Number(temp.substring(tempPosition, i + 1)));
			}
			tempType = "number";
		}
	}

	if (false) { //output parsed input to fields for debugging
		for (i = 0; i < tempArray.length; i++) {
			setValue("feature" + (i + 1 + n * 10), tempArray[i]);
		}
	}

	main.classes.raw[n] = tempArray;

	//move elements tempArray into parsed array

	temp = [];

	for (i = 0; i < tempArray.length; i++) {
		if (typeof tempArray[i] === "string") {
			tempString = tempArray[i];
			if (tempString.length > 0) {
				temp[temp.length] = [];
				temp[temp.length - 1][0] = tempString;
				if (i === tempArray.length - 1) {
					temp[temp.length - 1][1] = 1; //set class level to 1 if none given
				}
			}
		} else if (typeof tempArray[i] === "number" && temp.length > 0) {
			temp[temp.length - 1][1] = Math.min(Math.max(tempArray[i], 1), 999);
		}
	}

	main.classes.parsed[n] = temp;
	temp = [];
	temp2 = [];

	//find known (caster) classes and push them into known array, add hd and hp, set monkLevel

	for (i = 0; i < main.classes.parsed[n].length; i++) {
		tempString = main.classes.parsed[n][i][0];
		tempLevel = main.classes.parsed[n][i][1];
		tempFound = false;

		for (key in classList) { //scan string for all classes, choosing subclasses over classes
			if (key !== "" && tempString.indexOf(key) !== -1) {
				if (!tempFound || classList[key].subclass !== undefined) {
					tempClass = key;
					tempFound = true;
				}
			}
		}

		if (tempFound) { //class detected
			tempDie = classList[tempClass].die;

			temp[temp.length] = []; //add to known classes
			temp[temp.length - 1][0] = tempClass;
			temp[temp.length - 1][1] = tempLevel;

			if (classList[tempClass].spellcastingProgression !== undefined) { //add to known casters
				temp2[temp2.length] = [];
				temp2[temp2.length - 1][0] = tempClass;
				temp2[temp2.length - 1][1] = tempLevel;
				temp2[temp2.length - 1][2] = Math.floor(Math.min(tempLevel, 20) / classList[tempClass].spellcastingProgression);
				temp2[temp2.length - 1][3] = classList[tempClass].spellcastingAbility
			}

			if (main.hd[tempDie] === undefined) { //add hd
				main.hd[tempDie] = [tempDie, tempLevel];
			} else {
				main.hd[tempDie][1] += tempLevel;
			}

			if (main.hp.max === false) { //add hp (first level)
				main.hp.max = tempDie + (tempLevel - 1) * (tempDie / 2 + 1);
			} else {
				main.hp.max += tempDie / 2 + 1;
			}

			if (tempClass === "monk") { //add monkLevel
				main.monkLevel += Math.min(tempLevel, 20);
			}

			if (tempClass === "warlock") { //add warlockLevel
				main.warlockLevel += Math.min(tempLevel, 20);
			}
		}
	}

	main.classes.known[n] = temp;
	main.classes.knownCaster.push.apply(main.classes.knownCaster, temp2);

	//SET CLASS TOOLTIP

	if (isSet(main.classes.known[n][0])) {
		main.classes.multiclass = (n === 1 && main.classes.raw[0].length > 0) ? true : false; //set multiclassing (for tooltip)
		multi = main.classes.multiclass ? 1 : 0;
		tempClass = classList[main.classes.known[n][0][0]];
		tempName = (main.classes.multiclass) ? tempClass.name + " (multiclass)" : tempClass.name;

		if (main.classes.multiclass) {
			tempName += "\n\nMulticlass prerequisites: " + main.ability[tempClass["prereqs"][0]].name + " " + tempClass["prereqs"][1];
			if (tempClass["prereqs"].length > 2) {
				tempName += tempClass["prereqs"][2] + main.ability[tempClass["prereqs"][3]].name + " " + tempClass["prereqs"][4];
			}
		} else if (tempClass["primaryAbility"].length === 1) {
			tempName += "\n\nPrimary ability: " + main.ability[tempClass["primaryAbility"][0]].name;
		} else if (tempClass["primaryAbility"][1] === " -or- ") {
			tempName += "\n\nPrimary ability: " + main.ability[tempClass["primaryAbility"][0]].name + tempClass["primaryAbility"][1] + main.ability[tempClass["primaryAbility"][2]].name;
		} else {
			tempName += "\n\nPrimary abilities: " + main.ability[tempClass["primaryAbility"][0]].name + tempClass["primaryAbility"][1] + main.ability[tempClass["primaryAbility"][2]].name;
		}

		if (tempClass["spellcastingAbility"] !== undefined) {
			tempName += "\n\nSpellcasting ability: " + main.ability[tempClass["spellcastingAbility"]].name;
		}

		tempName += "\n\nHit dice: d" + tempClass["die"] + " (" + (Math.ceil(tempClass["die"] / 2) + 1) + ")";

		if (!main.classes.multiclass) {
			tempName += "\n\nSaving throws: " + main.ability[tempClass["saves"][0]].name + " and " + main.ability[tempClass["saves"][1]].name;
		}

		if (tempClass["armor"][multi] !== undefined) {
			tempName += "\n\nArmor: "
			if (tempClass["armor"][multi][2]) {
				tempName += "all armor";
			} else if (tempClass["armor"][multi][1]) {
				tempName += "light and medium armor";
			} else if (tempClass["armor"][multi][0]) {
				tempName += "light armor";
			} else if (!tempClass["armor"][multi][3] && tempClass["armor"][multi][4] === undefined) {
				tempName += "none";
			}
			if (tempClass["armor"][multi][3]) {
				if (tempClass["armor"][multi][0] || tempClass["armor"][multi][1] || tempClass["armor"][multi][2]) {
					tempName += ", ";
					}
				tempName += "shields";
			}
			if (tempClass["armor"][multi][4] !== undefined) {
				tempName += tempClass["armor"][multi][4];
			}
		}

		if (tempClass["weapons"][multi] !== undefined) {
			tempName += "\n\nWeapons: "
			if (tempClass["weapons"][multi][1]) {
				tempName += "simple and martial weapons";
			} else if (tempClass["weapons"][multi][0]) {
				tempName += "simple weapons";
			}
			if (tempClass["weapons"][multi][2] !== undefined) {
				tempName += tempClass["weapons"][multi][2];
			} else if (!tempClass["weapons"][multi][0] && !tempClass["weapons"][multi][1]) {
				tempName += "none";
			}
		}

		if (tempClass["skills"][multi] !== undefined) {
			tempName += "\n\nSkills: "
			if (tempClass["skills"][multi][1] !== false) {
				tempName += "choose " + numberList[tempClass["skills"][multi][0]] + " from " + tempClass["skills"][multi][1];
			} else {
				tempName += "choose any " + numberList[tempClass["skills"][multi][0]];
			}
		}

		if (tempClass["tools"] !== undefined) {
			if (tempClass["tools"][multi] !== undefined) {
				tempName += "\n\nTools: " + tempClass["tools"][multi];
			}
		}

		if (!main.classes.multiclass) {
			tempName += "\n\nStarting equipment:\n\n" + tempClass["equipment"];
		}

	} else {
		tempName = classList[""]["tooltip"]; //default tooltip
	}

	main.classes.name[n] = tempName;
	field.classes[n].userName = tempName;
}

function popInv(item, weight, amount) {
	var a = "";
	var b = "";
	var c = "";
	var n = this.getField("portraitSelection").value === 2 ? 25 : 37;
	var newEntry = false;

	for (i = 1; i < n; i++) {
		if (this.getField("item" + i).value === item) {
			this.getField("itemAmount" + i).value += amount;
			newEntry = true;
			break;
		}
	}

	if (!newEntry) {
		for (i = 1; i < n; i++) {
			a = this.getField("item" + i);
			b = this.getField("itemWeight" + i);
			c = this.getField("itemAmount" + i);

			if (a.value == "" && b.value == "" && c.value == "") {
				a.value = item;
				b.value = weight;
				c.value = amount;
				break;
			}
		}
	}
}

function popSpell(spellName) {
	var temp = "";
	var searching = true;
	var i = 0;

	while (searching) {
		if (main.spellFields[i] === null || main.spellFields[i] === undefined) {
			break;
		}

		temp = this.getField("spell" + main.spellFields[i]);

		if (temp.value === "" || temp.value === " ") {
			temp.value = spellName;
			break;
		}

		i++;
	}
}

function popSpellbook(className, spellMin, spellMax, start) {
	className = className.toLowerCase();
	spellMin = Number(spellMin);
	spellMax = Number(spellMax);
	var temp = "";


	//popping the spells

	for (spellLevel = spellMin; spellLevel < spellMax + 1; spellLevel++) { //from min to max spell level
		if (spellLevel === 0) {
			popSpell(classList[className].name + " cantrips");
		} else {
			popSpell(spellLevelList[spellLevel] + " " + classList[className].name + " spells")
		}

		for (spell in spellList) {
			temp = spellList[spell];

			if (temp.classes.indexOf(className) > -1 && temp.level === spellLevel) { //check if class and level match input
				popSpell(temp.name);
			}
		}
	}
}

function popArmor() {
	var itemKnown = main.armor.known;
	var itemRaw = field.armor.raw.value;

	if (isSet(itemKnown)) {
		if (armorList[itemKnown].inventory) {
			popInv(itemRaw, armorList[itemKnown].weight, 1);
		}
	} else if (itemRaw.trim().length > 0) {
		popInv(itemRaw, "", 1);
	}
}

function popShield() {
	var itemKnown = main.shield.known;
	var itemRaw = field.shield.value;

	if (isSet(itemKnown)) {
		if (shieldList[itemKnown].inventory) {
			popInv(itemRaw, shieldList[itemKnown].weight, 1);
		}
	} else if (itemRaw.trim().length > 0) {
		popInv(itemRaw, "", 1);
	}
}

function popWeapon(n) {
	var temp = main.weapon[n].known;

	if (isSet(temp) && weaponList[temp].inventory) {
		popInv(field.weapon[n].raw.value, weaponList[temp].weight, 1);
	} else if (field.weapon[n].raw.value.trim().length > 0) {
		popInv(field.weapon[n].raw.value, "", 1);
	}
}

function reset() {
	engine = false;

	this.getField("portrait").buttonSetIcon(getField("multiButton4").buttonGetIcon()); //resets portrait

	for (i = 1; i < 19; i++) {
		setSkill(i, 0);
	}
	for (i = 1; i < 71; i++) {
		setAdvantage(i, 0, true);
	}
	for (i = 1; i < 8; i++) {
		setValue("weapon" + i, "", true);
	}

	this.getField("character").setFocus();

	engine = true;
	tick();
}

function rollStats() {
	main.stat.array = [];
	var tempDate = new Date();

	for (i = 0; i < 6; i++) {
		var rolls = [];
		for (j = 0; j < 4; j++) {
			rolls.push(Math.floor((Math.random() * 6) + 1));
		}
		rolls.sort(function (a, b) {
			return a - b;
		});
		rolls.splice(0, 1);
		main.stat.array.push(rolls.reduce(function (a, b) {
			return a + b;
		}));
	}
	main.stat.array.sort(function (a, b) {
		return a - b;
	});

	main.stat.raw[1] = main.stat.array.join(", ");
	main.stat.tries++;
	main.stat.date = util.printd("HH:MM:ss mmm d, yyyy ", tempDate);

	field.stat[2].value = main.stat.raw[1];
	field.stat[3].value = main.stat.tries;
	field.stat[4].value = main.stat.date;

	if (!this.getField("hintsStatsButton").isBoxChecked(0)) {
		getField("hintsStatsButton").checkThisBox(0, true);
	}
}

function setAbilityTooltips() {
	var temp = "";
	var temp2 = "";
	var temp3 = "";

	for (i = 0; i < 6; i++){
		temp = main.ability[i].name + ": measures your " + main.ability[i].measures;
		temp2 = 0;
		temp3 = "";

		if (main.ability[i].bonus != 0) {
			temp += "\n\nRacial adjustment: " + createMod(main.ability[i].bonus);
		}

		for (n = 1; n < 19; n++) {
			if (main.skill[n].ability === i) {
				if (temp2 > 0) {
					temp3 += ", ";
				}
				temp3 += main.skill[n].name;
				temp2 += 1;
			}
		}

		if (temp2 === 1) {
			 temp += "\n\nAssociated skill: " + temp3
		} else if (temp2 > 1) {
			temp += "\n\nAssociated skills: " + temp3
		}

		field.ability[i].score.userName = temp;
		field.ability[i].mod.userName = temp;
	}
}

function setAdvantage(n, status, override) {
	if (override === true) {
		this.getField("advantageStatus" + n).value = status;
		this.getField("advantageButton" + n).buttonSetIcon(iconList2[status]);
	} else if (this.getField("advantageStatus" + n).value !== 3) {
		this.getField("advantageStatus" + n).value = status;
		this.getField("advantageButton" + n).buttonSetIcon(iconList2[status]);
	}
}

function setButton(button, status) {
	if (this.getField(button) !== null) {
		if (isOn(button) !== status) {
			this.getField(button).checkThisBox(0, status);
		}
	}
}

function setCase(input, first, rest) {
	if (input === "" || input === undefined) {
		return input;
	} else if (first === "upper" && rest === "upper") {
		return input.toUpperCase();
	} else if (first === "upper" && rest === "lower") {
		return input.charAt(0).toUpperCase() + input.substring(1).toLowerCase();
	} else if (first === "lower" && rest === "upper") {
		return input.charAt(0).toLowerCase() + input.substring(1).toUpperCase();
	} else if (first === "lower" && rest === "lower") {
		return input.toLowerCase();
	} else if (first === "upper") {
		return input.charAt(0).toUpperCase() + input.substring(1);
	} else if (first === "lower") {
		return input.charAt(0).toLowerCase() + input.substring(1);
	} else {
		return input;
	}
}

function setInventory() {
	engine = false;
	var temp = "";
	var temp2 = "";
	var selection = getMenu();

	if (selection[1] === "background items") {
		var tempGold = this.getField("coins4");

		if (isSet(main.background.known)) {
			temp = backgroundList[main.background.known];

			if (isSet(tempGold.value)) {
				if (isNaN(tempGold.value)) {
					tempGold.value += " + " + temp.gold + " gp";
				} else {
					tempGold.value += temp.gold;
				}
			} else {
				tempGold.value = temp.gold;
			}

			for (item in temp.items) {
				popInv(item, temp.items[item].weight, temp.items[item].amount);
			}
		}

		engine = true;
		tick();

	} else if (selection[1] === "armor and shield") {
		popArmor();
		popShield();

		engine = true;
		tick();
	} else if (selection[1] === "weapons") {
		popWeapon(0);
		popWeapon(1);
		popWeapon(2);
		popWeapon(3);
		popWeapon(4);
		popWeapon(5);
		popWeapon(6);

		engine = true;
		tick();
	} else if (selection[1] === "all of the above") {
		var tempGold = this.getField("coins4");

		if (isSet(main.background.known)) {
			temp = backgroundList[main.background.known];

			if (isSet(tempGold.value)) {
				if (isNaN(tempGold.value)) {
					tempGold.value += " + " + temp.gold + " gp";
				} else {
					tempGold.value += temp.gold;
				}
			} else {
				tempGold.value = temp.gold;
			}

			for (item in temp.items) {
				popInv(item, temp.items[item].weight, temp.items[item].amount);
			}
		}

		popArmor();
		popShield();
		popWeapon(0);
		popWeapon(1);
		popWeapon(2);
		popWeapon(3);
		popWeapon(4);
		popWeapon(5);
		popWeapon(6);

		engine = true;
		tick();
	} else if (selection[1] === "alllevels") {
		temp = Math.max(classList[selection[0]]["spellLevels"][0], 1);
		temp2 = classList[selection[0]]["spellLevels"][1];

		popSpellbook (selection[0], temp, temp2);

		engine = true;
	} else if (selection[1] === "alloflevel") {
		popSpellbook (selection[0], selection[2], selection[2]);

		engine = true;
	} else if (selection[1] === "singlespell") {
		popSpell(selection[2]);

		engine = true;
	} else if (selection[1] === "sort items") {
		var itemArray = [];

		for (i = 0; i < 36; i++) {
			var d = i + 1;
			var a = this.getField("item" + d).value;
			var b = this.getField("itemWeight" + d).value;
			var c = this.getField("itemAmount" + d).value;
			itemArray[i] = [];
			itemArray[i].push(a);
			itemArray[i].push(b);
			itemArray[i].push(c);
		}
		itemArray.sort(function (a, b) {
			var x = a[0].toString().toLowerCase();
			var y = b[0].toString().toLowerCase();
			return (x === "" && y !== "") ? 1 : (x !== "" && y === "") ? -1 : x < y ? -1 : x > y ? 1 : 0;
		});
		for (i = 0; i < 36; i++) {
			var d = i + 1;
			this.getField("item" + d).value = itemArray[i][0];
			this.getField("itemWeight" + d).value = itemArray[i][1];
			this.getField("itemAmount" + d).value = itemArray[i][2];
		}

		engine = true;
		tick();
	} else if (selection[1] === "sort spells (slow)") {
		sortSpells();

		engine = true;
	} else if (selection[1] === "clear items") {
		for (i = 1; i < 37; i++) {
			this.getField("itemAmount" + i).value = ""
			this.getField("itemWeight" + i).value = ""
			this.getField("item" + i).value = ""
		}

		engine = true;
		tick();
	} else if (selection[1] === "clear spells (slow)") {
		for (i = 0; i < main.spellFields.length; i++) { //uncheck every prep button
			setButton("prepButton" + main.spellFields[i], false);
		}

		for (i = 0; i < main.spellFields.length; i++) {
			setValue("spell" + main.spellFields[i], "", true);
		}

		engine = true;

		for (i = 0; i < main.spellFields.length; i++) {
			setValue("spell" + main.spellFields[i], "", true);
		}

	} else if (selection[1] === "re-initialize") {
		engine = true;
		tick();
	} else if (selection[0] === "pack") {
		temp = packList[selection[1]];

		for (item in temp) {
			popInv(item, temp[item].weight, temp[item].amount);
		}

		engine = true;
		tick();
	}
	else {
		engine = true;
	}
}

function setLayout() {
	if (event.value === "MIDDLE" && main.layout[1] < 3) {
		field.layout[1].value = 4;
	}
}

function setMenu() {
	var mainMenu = [];

	var itemMenu = {};
	var packArray = [];

	var spellMenu = {};
	var spellArray = [];
	var spellSubArray = [];

	var inventoryMenu = {};
	var inventoryArray = ["Sort items", "Clear items", "-", "Sort spells (slow)", "Clear spells (slow)", "-", "Re-initialize"];

	var temp = "";

	var makeMenu = function(menu, name, array) {
		menu.cName = name;
		menu.oSubMenu = [];

		for (i = 0; i < array.length; i++) {
			menu.oSubMenu.push({cName: array[i], cReturn: name + ":" + array[i]})
		}
	}

	var addSubMenu = function(menu, name, array, prefix) {
		prefix = prefix === undefined ? "" : prefix;
		temp = [];

		for (i = 0; i < array.length; i++) {
			temp.push({cName: array[i], cReturn: prefix + name + ":" + array[i]})
		}

		menu.oSubMenu.push({cName: name, oSubMenu: temp});
	}

	makeMenu(itemMenu, "Add items", ["Background items", "Armor and shield", "Weapons", "-", "All of the above", "-"]);
	makeMenu(spellMenu, "Add spells", []);
	makeMenu(inventoryMenu, "Maintenance", inventoryArray);

	for (key in packList) {
		packArray.push(setCase(key, "upper"));
	}

	packArray.sort();
	addSubMenu(itemMenu, "Pack", packArray);

	spellMenu = {cName: "Add spells", oSubMenu: []};

	for (key in main.spellcaster) {
		temp = classList[key];
		tempSpell = "";
		spellArray = [];

		if (temp["spellLevels"][0] === 0) {
			spellArray = [{cName: "All spells except cantrips", cReturn: key + ":alllevels"}];
		} else {
			spellArray = [{cName: "All spells", cReturn: key + ":alllevels"}];
		}

		spellArray.push({cName: "-", cReturn: "-"});

		for (i = temp["spellLevels"][0]; i <= temp["spellLevels"][1]; i++) {
			if (i === 0) {
				spellSubArray = [{cName: "All cantrips", cReturn: key + ":alloflevel:" + i}];
			} else {
				spellSubArray = [{cName: "All " + spellLevelList[i] + " spells", cReturn: key + ":alloflevel:" + i}];
			}

			spellSubArray.push({cName: "-", cReturn: "-"});

			for (spell in spellList) {
				tempSpell = spellList[spell];

				if (tempSpell.level === i && tempSpell.classes.indexOf(key) > -1) {
					spellSubArray.push({cName: tempSpell.name, cReturn: key + ":singlespell:" + spell});
				}
			}

			if (i === 0) {
				spellArray.push({cName: "Cantrips", cReturn: key + ":" + i, oSubMenu: spellSubArray});
			} else {
				spellArray.push({cName: spellLevelList[i] + " spells", cReturn: key + ":" + i, oSubMenu: spellSubArray});
			}
		}
		spellMenu.oSubMenu.push({cName: classList[key].name, oSubMenu: spellArray});
	}

	mainMenu.push(itemMenu);
	mainMenu.push(spellMenu);
	mainMenu.push(inventoryMenu);

	main.menu = mainMenu;
}

function setRaceMenu() {
	var tempItems1 = [];
	var tempItems2 = [];

	for (i in raceList) {
		if (!raceList[i].ignore && raceList[i].source === "P") {
			tempItems1.push(setCase(i, "upper"));
		}
	}

	for (i in raceList) {
		if (!raceList[i].ignore && raceList[i].source !== "P") {
			tempItems2.push(setCase(i, "upper"));
		}
	}

	tempItems1.sort();
	tempItems2.sort();
	tempItems1.push("  ");
	tempItems1 = tempItems1.concat(tempItems2);

	this.getField("race").setItems(tempItems1);
}

function setRaceSkill(skill, race, replace, oldRace) {
	if (race["skills"].indexOf(skill) > -1) { //new race has skill
		setSkill(skill, 1); //make profient
	} else if (replace && oldRace["skills"].indexOf(skill) > -1) { //old race had but new race doesn't have skill
		setSkill(skill, 0); //make non-profient
	}

	if (race["advantages"].indexOf(skill) > -1) { //new race has advantage
		setAdvantage(skill + 12, 3); //set advantage
	} else if (replace && oldRace["advantages"].indexOf(skill) > -1) { //old race had but new race doesn't have skill
		setAdvantage(skill + 12, 0, true); //reset advantage
	}
}

function setRolls() {
	var temp = field.stat[2].value;

	if (temp.length > 0) {
		main.stat.array = [];
		temp = temp.split(", ");

		for (i = 0; i < temp.length; i++) {
			main.stat.array.push(Number(temp[i]));
		}
	}
}

function setSkill(n, status) { //set skill prof button
	this.getField("skillStatus" + n).value = status;
	this.getField("skillButton" + n).buttonSetIcon(iconList1[status]);
}

function setSpellcasters() {
	temp = [];
	main.spellcaster = {};

	for (tempClass in classList) {
		if (classList[tempClass]["spellcastingAbility"] !== undefined) {
			temp.push(tempClass);
		}
	}

	temp.sort();

	for (i = 0; i < temp.length; i++) {
		main.spellcaster[temp[i]] = [];
	}
}

function setSpellFields(){
	var fieldList = [];

	if (main.layout[1] === 1) {
		for (n = 1; n <= 19; n++) {
			fieldList.push(n);
		}
	} else if (main.layout[1] === 2) {
		for (n = 1; n <= 38; n++) {
			fieldList.push(n);
		}
	}

	if (main.layout[2] === 1) {
		for (n = 39; n <= 79; n++) {
			fieldList.push(n);
		}
	} else if (main.layout[2] === 2) {
		for (n = 80; n <= 109; n++) {
			fieldList.push(n);
		}
		for (n = 1010; n <= 1020; n++) {
			fieldList.push(n);
		}
		for (n = 110; n <= 129; n++) {
			fieldList.push(n);
		}
		for (n = 1021; n <= 1041; n++) {
			fieldList.push(n);
		}
	}

	if (main.layout[3] === 1) {
		for (n = 212; n <= 252; n++) {
			fieldList.push(n);
		}
	} else if (main.layout[3] === 2) {
		for (n = 130; n <= 211; n++) {
			fieldList.push(n);
		}
	}

	main.spellFields = fieldList;
}

function setStealth(status, override) { //like setButton but for stealth
	if (override === true) {
		this.getField("advantageStatus29").value = status;
		this.getField("advantageButton29").buttonSetIcon(iconList2[status]);
	} else if (this.getField("advantageStatus29").value !== 3) {
		this.getField("advantageStatus29").value = status;
		this.getField("advantageButton29").buttonSetIcon(iconList2[status]);
	}
	if (status < 2) {
		this.getField("stealthDisadvantageButton").checkThisBox(0, false);
	} else if (status === 2) {
		this.getField("stealthDisadvantageButton").checkThisBox(0, true);
	}
}

function setStealthDisadvantage(status) {

	if (status === undefined) {
		status = isOn(event.target.name) ? 2 : 0;
	} else {
		setButton ("stealthDisadvantageButton", status);
		status = status ? 2 : 0;
	}

	if (this.getField("advantageStatus29").value !== 3) {
		this.getField("advantageStatus29").value = status;
		this.getField("advantageButton29").buttonSetIcon(iconList2[status]);
	}
}

function setTitle() {
	var character = this.getField("character").value;
	var player = this.getField("player").value;
	var a = this.getField("a.characterLevel").value;
	var titleNew = "The Clean Sheet";

	if (character !== "" && a !== undefined) {
		titleNew = character;
		if (a !== "" && a !== undefined) {
			titleNew += ", level " + a;
		}
		if (player !== "") {
			titleNew += ", played by " + player;
		}
	}

	this.info.title = titleNew;
}

function setValue (target, data, includeempty) {
	if (this.getField(target) !== null) { //if target field exists...
		if (includeempty || data !== "") { //if data is not "" or "" is also written...
			if (this.getField(target).value !== data) { //if field is not already what is should be...
				this.getField(target).value = data;
			}
		}
	}
}

function setWeaponMenus() {
	var tempItems = [];

	for (i in weaponList) {
		if (weaponList[i].listName !== undefined) {
			tempItems.push(weaponList[i].listName);
		} else {
			tempItems.push(setCase(i, "upper"));
		}
	}

	this.getField("weapon1").setItems(tempItems);
	this.getField("weapon2").setItems(tempItems);
	this.getField("weapon3").setItems(tempItems);
	this.getField("weapon4").setItems(tempItems);
	this.getField("weapon5").setItems(tempItems);
	this.getField("weapon6").setItems(tempItems);
	this.getField("weapon7").setItems(tempItems);
}

function sortSpells() {
	var spellName = "";
	var tempArray = []; //array with all the spell names etc.

	var readSpell = function(i) { //gets the spell data from the sheet
		spellName = String(readValue("spell" + i), true); //read spell name

		if (spellName.toLowerCase() in spellList) { //spell name in list
			tempArray.push([]); //add array for this spell in tempArray
			tempArray[tempArray.length - 1].push(spellName); //add spell name to spell's array
			tempArray[tempArray.length - 1].push(readValue("level" + i, true)); //add spell level to spell's array
		} else if (spellName !== "" && !endsWith(spellName, "cantrips") && !endsWith(spellName, " spells")) { //if spell name is not in list and is not "" and and is not a header...
			tempArray.push([]); //add array for this spell in tempArray and put all the spell's fields into it
			tempArray[tempArray.length - 1].push(spellName);
			tempArray[tempArray.length - 1].push(readValue("level" + i, true));
			tempArray[tempArray.length - 1].push(readValue("ritual" + i, true));
			tempArray[tempArray.length - 1].push(readValue("time" + i, true));
			tempArray[tempArray.length - 1].push(readValue("range" + i, true));
			tempArray[tempArray.length - 1].push(readValue("components" + i, true));
			tempArray[tempArray.length - 1].push(readValue("duration" + i, true));
			tempArray[tempArray.length - 1].push(readValue("concentration" + i, true));
			tempArray[tempArray.length - 1].push(readValue("source" + i, true));
			tempArray[tempArray.length - 1].push(readValue("description" + i, true));
		}
	}

	var writeSpell = function(i) {
		var n = main.spellFields[i];
		//var temp2 = "done";
		if (tempArray[i] !== undefined) { //if the spell's array exists...
			//temp2 += tempArray[i][0];
			setValue("spell" + n, tempArray[i][0], true); //write spell name
			setValue("level" + n, tempArray[i][1], true); //write spell level, in case it's non-standard

			if (tempArray[i].length > 2) { //if there's more than name and level in the array, set all other fields...
				setValue("ritual" + n, tempArray[i][2], true); //write spell level
				setValue("time" + n, tempArray[i][3], true); //write spell level
				setValue("range" + n, tempArray[i][4], true); //write spell level
				setValue("components" + n, tempArray[i][5], true); //write spell level
				setValue("duration" + n, tempArray[i][6], true); //write spell level
				setValue("concentration" + n, tempArray[i][7], true); //write spell level
				setValue("source" + n, tempArray[i][8], true); //write spell level
				setValue("description" + n, tempArray[i][9], true); //write spell level
			}
		} else {
			setValue("spell" + n, "", true);
		}
		//this.getField("companion1").value = temp2;
	}

	//create array by reading all spell fields

	for (i = 0; i < main.spellFields.length; i++) {
		readSpell(main.spellFields[i]);
	}

	//sort by level, then name

	tempArray.sort(
		function (a, b) {
			var x = a[1].toString().toLowerCase(); //spell level a
			var y = b[1].toString().toLowerCase(); //spell level b
			var x2 = a[0].toString().toLowerCase(); //spell name a
			var y2 = b[0].toString().toLowerCase(); //spell name a

			if (x === "" && y !== "") { 					//level a is empty, level b is not
				return 1; //switch
			} else if (x !== "" && y === "") { 		//level a is not empty, level b is
				return -1;
			} else if (x < y) { 									//level a lower than b
				return -1;
			} else if (x > y) {										//level a higher than b
				return 1; //switch
			} else if (x2 === "" && y2 !== "") { 	//name a is empty, name b is not
				return 1; //switch
			} else if (x2 !== "" && y2 === "") { 	//name a is not empty, name b is
				return -1;
			} else if (x2 < y2) {									//name a comes before b
				return -1;
			} else if (x2 > y2) {									//name a comes after b
				return 1; //switch
			} else { 															//all other cases, included sames names and levels
				return 0;
			}
		}
	);

	//remove duplicates

	temp = 0;

	while (temp + 1 < tempArray.length) {
		if (String(tempArray[temp]) === String(tempArray[temp + 1])) { //if element temp equals element temp + 1...
			tempArray.splice(temp, 1); //delete element temp, and look again
		} else {
			temp++; //...else go to next element
		}
	}

	//add headers

	for (level = 0; level < 10; level++) {
		for (n = 0; n < tempArray.length; n++) {
			if (tempArray[n][1] === level) { //if spell level equals current level...
				if (level === 0) { //if current level is 0...
					tempArray.splice(n, 0, ["Cantrips", "", "", "", "", "", "", "", "", ""]); //add cantrip header
				} else { //else...
					tempArray.splice(n, 0, [(spellLevelList[level] + " spells"), "", "", "", "", "", "", "", "", ""]); //add spell level header header
				}
				break; //add no more than one header, and go to next spell level
			}
		}
	}

	//write sorted spell list

	for (i = 0; i < main.spellFields.length; i++) {
		writeSpell(i);
	}

	engine = true;

	for (i = 0; i < main.spellFields.length; i++) {
		writeSpell(i);
	}

	//uncheck every prep button

	for (i = 0; i < main.spellFields.length; i++) {
		setButton("prepButton" + main.spellFields[i], false);
	}
}

function startsWith(input, query) {
	input = String(input).toLowerCase();
	query = query.toLowerCase();
	return (input.slice(0, query.length) === query) ? true : false;
}

function switchField(field, action) {
	this.getField(field).display = action ? display.visible : display.hidden;
}

function switchLock(field, action) {
	this.getField(field).readonly = action;
}

function switchLayer(layer, action) {
	var a = this.getOCGs();
	for (i = 0; i < a.length; i++) {
		if (a[i].name === layer) {
			if (action) {
				a[i].state = true;
			} else if (!action) {
				a[i].state = false;
			} else {
				a[i].state = !a[i].state;
			}
		}
	}
}

function tick() {
	var temp = this.getField("hiddenCounterTick");
	if (temp.value !== "tick") {
		temp.value = "tick";
	} else {
		temp.value = "tock";
	}
}

function trimEnd(input) {
	return input.replace(/\s*$/,"");
}
