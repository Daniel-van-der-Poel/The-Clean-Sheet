# The Clean Sheet
Character Sheet for 5E D&D, including the source files

*To change the workings of the sheet:* 
  - Edit the JavaScript files.
  - Import the files into the PDF using Acrobat.

*To change the layout:*
  - Edit the InDesign file (mind the layers).
  - Run custom scripts to change the formatting and validations of the elements in Acrobat (check out my PDF Helpers repo).
  - Import the Javascript files into the PDF using Acrobat.
  
I'm no longer working on this sheet, *so feel free to edit it, fork it etc*. Have fun!

And please realise this was my first applied coding, ever.

*How to use this sheet*

[URL="http://www.enworld.org/forum/rpgdownloads.php?do=download&downloadid=1086"]The Clean Sheet[/URL] is a 5th Edition character sheet that can be used both as a digital and as a physical sheet. It's compact (two pages can be enough), easy to use, flexible, and uncluttered. This post will help you get the most out of the sheet.

[HR][/HR]
[B]Quick tips[/B]

[LIST]
[*]Choose a layout you like. Pages 2-4 have a dropdown menu on top that provides options.
[*]Hover over fields to see their tooltips. Tooltips often provide detailed information based on your input. For instance, once you pick a class, the tooltip will show info such as hit dice, skills, and starting equipment.
[*]Stats of known weapons, armors and shields are calculated automatically. Change their name, for instance with an *, to switch to manual input in all fields. Comments in parentheses are ignored for this purpose.
[*]You can indicate advantage/disadvantage/special by clicking in the right upper corner of many fields. A small plus, minus, or asterisk will appear.
[*]Use the latest standalone version of Acrobat. Other readers don't play well with this sheet.
[*]Make sure JavaScript is enabled: Preferences --> JavaScript --> Enable Acrobat JavaScript
[*]Hide ugly borders and markers: Preferences --> Forms --> Show focus rectangle/Show text field overflow/Show border hover (all off)

[/LIST]
[HR][/HR]
[B]How to make a character in 10 steps[/B]

[LIST=1]
[*][B][COLOR="#0000FF"]ROLL[/COLOR][/B] the dice and apply the results or use point buy (enable [B][COLOR="#0000FF"]STATS[/COLOR][/B] to see the current point buy value).
[*]Choose a race and click [B][COLOR="#0000FF"]ADD TRAITS[/COLOR][/B].
[*]Add the race’s ability score increase (see race tooltip).
[*]Choose a background and a class.
[*]Select saving throw and skill proficiencies using the class and background tooltips.
[*]Fill out your hit point maximum using the tooltip.
[*]Choose armor and weapons based on the starting equipment of your class (again, see tooltip).
[*]On page 2, add items to your inventory with [B][COLOR="#0000FF"]ADD ITEMS AND SPELLS[/COLOR][/B], [COLOR="#808080"][B]ADD ITEMS[/B][/COLOR], [COLOR="#808080"][B]ALL OF THE ABOVE[/B][/COLOR]. Manually add any other equipment granted by your class.
[*]Consult the Player's Handbook and fill out your class features and spells (you can use the above button for adding whole levels of spells).
[*]Fill out additional info such as alignment, age, and personal characteristics.
[/LIST]
[HR][/HR]
[B]Classes[/B]

You can select two classes using the drop-down menus. The tooltip of the second class will show you the requirements of and proficiencies gained by multiclassing into that class. Enter the class level directly after the name of the class, for instance "Barbarian 3". The character level in upper right corner will be updated automatically. If you enter no class level, the sheet will assume that you have one level in a class.

Your character level, proficiency bonus, hit dice, spell slots, and number of prepared spells will be calculated for you using the multiclassing rules in the Player’s Handbook. You can also enter more than two classes by typing in their names and levels, for example: 

"Fighter 5, Arcane Trickster 2, Ranger 2"
"Wizard (Abjurer) 5, Druid (Circle of the Land) 4, Rogue 2"

Any known classes and levels will be detected, which in this example creates a 20th-level character. All class levels (even those of unknown classes) will be added to your character level. All known spellcasting classes will be taken into account for calculating spell slots.

[HR][/HR]
[B]Armor[/B]

Selecting a known armor automatically updates the type, base AC and Dexterity cap. If your Constitution and/or Wisdom modifier contributes to your AC, you can select that using the drop-down menu next to the Dexterity cap. A general AC modifier can be entered after "Other Items  Feats".

[HR][/HR]
[B]Weapons[/B]

If you enter the name of a known weapon, its details (attack, damage etc.) will be completed automatically and kept up-to-date. For easy reference, the weapon list also contains all cantrips that deal damage, such as Fire Bolt. If you type in the name of the cantrip, make sure to add the governing ability, for example "Fire Bolt, Intelligence".

When determining proficiency for auto-calculation, the sheets checks the [B]WEAPON[/B] buttons on page 1 (button right) and, if necessary, scans the [B]OTHER PROFICIENCIES & LANGUAGES[/B] fields for the weapon’s name. 

If you want to manually edit a known weapon’s stats, chance its name by so that its not in the list. This will make the auto-calculation for that weapon stop and enable manual input. Example:

"*Longsword"

If you have a magical weapon, you can add the bonus like this: 

“Longsword +2”
"Longsword +5 (stolen from Bob the Troll)" (will still auto-calculate, since comments in parentheses are ignored)

Seperate modifiers to attack and damage can be added like this:

"Longbow +2A +1D" (will calculate with an extra +2 to attack and +1 to damage)

Finesse weapons, including monk weapons, will use Strength or Dexterity, whichever is highest. Loading and some special weapons have an asterisk next to their attack value to alert you. The damage of breath weapons, cantrips and monk weapons is calculated according to your class/character level. The half-orc bonus to critical hits is also taken into account. Versatile weapons have two entries: normal and two-handed:

"Longsword" (1d8 base damage)
"Longsword, two-handed" (1d10 base damage)

[HR][/HR]
[B]Skills[/B]

Click the circle next to a skill once to indicate proficiency (light grey), or twice to indicate expertise (dark grey).

[HR][/HR]
[B]Inventory[/B]

The sheet calculates the total weight of your items and coins. You can add "*" to the name of items that you do not carry (e.g. "Mule*") to have their weight excluded from the total. You can switch to the variant encumbrance rule using the blue button on top of page 2.

The tooltips of the fields for coins will update with info on their total value and weight.

You can add items from page 1 (armor, weapons etc.) as well as complete item packs using the button [B][COLOR="#0000FF"]ADD ITEMS AND SPELLS[/COLOR][/B], [COLOR="#808080"][B]ADD ITEMS[/B][/COLOR].

[HR][/HR]
[B]Spellcasting[/B]

Spell slots, number of spells prepared, spell recovery and sorcery points are calculated using the classes and levels entered one page 1. The special rule for the warlock’s Pact Magic is taken into account. To enable spell recovery of a Circle of the Land Druid, enter your class as "Druid (Circle of the Land)". If you have both normal and warlock spell slots, an asterisk indicates which are the warlock's. See the tooltip for details.

In addition, the tooltip of each spell slot shows how many spells you know per spellcasting class and per level. The spellcasting ability is set to that of your highest caster, but the tooltip shows the spellcasting stats for every ability.

[HR][/HR]
[B]Spells[/B]

If you enter the name of a known spell, its details (level, components etc.) will be completed for you. The spell name's tooltip shows its school and classes that can use the spell. Look at the tooltip of the description* for more information about the spell's effects. Furthermore, one asterisk in the components field indicates that spell has a costly material component; two asterisks indicates that this costly component is consumed in the casting. In all cases, the spell's material components are described in the tooltip.

The [B][COLOR="#0000FF"]ADD ITEMS AND SPELLS[/COLOR][/B] button allows you to enter one or all spell levels of a class at once. For example, you can select [COLOR="#808080"][B]ADD SPELLS[/B][/COLOR], [COLOR="#808080"][B]PALADIN[/B][/COLOR], [B][COLOR="#808080"]ALL SPELLS[/COLOR][/B] to enter all paladin spells in one go. This may take a few seconds. The sheet will only use visible blank spots, so the sheet's current layout determines where the spells will appear.

You can sort you spells using [B][COLOR="#0000FF"]ADD ITEMS AND SPELLS[/COLOR][/B], [COLOR="#808080"][B]MAINTENANCE[/B][/COLOR], [COLOR="#808080"][B]SORT SPELLS[/B][/COLOR]. This function is mostly aimed at wizards, who frequently add spells at different levels and may want to tidy their list. The function will sort all your spells, first by level, then by name. It ignores to which classes the spells originally belonged and create a new headers for each spell level. It also removes any duplicate spells.

[HR][/HR]
[B]Portrait[/B]

You can add a portrait to your sheet. One the second page, use the [COLOR="#0000FF"][B]PORTRAIT[/B][/COLOR] drop-down menu. Click the frame and add an image. Only pdf images are supported (a limitation of the pdf format itself), but there are free tools to convert jpgs to pdfs. The top portrait has an 8 x 13 ratio, the middle one a 11 x 13 ratio.

[HR][/HR]
[B]Other features[/B]

[LIST]
[*]In general, the sheet will only display what can be calculated at a given point. For example, skills are not shown until you have entered the associated ability scores. In some cases, the sheet will tell you what’s missing.
[*]You can manually override parts of the sheet’s auto-calculation with the [B][COLOR="#0000FF"]MANUAL[/COLOR][/B] buttons on top of page 1.
[*]The after selecting a known race, the age, height and weight tooltips show the typical values for that race.
[*]The hit dice tooltips contain info on their use.
[*]The death saving throw tooltips tell you how these checks work.
[*]The documents title will change to your character’s name and level once you save it. 
[*]You can switch to the variant encumbrance rule using the button on page 2.
[*]If you want a perfect pencil & paper version, try the skill [B][COLOR="#0000FF"]HINT[/COLOR][/B] button on page 1.
[*]You can select multiple armor/weapon proficiencies in one go by clicking the highest one (e.g. click heavy armor to switch on light and medium as well).
[*]If you are encumbered, the total weight will be displayed with a bold font. Check the speed tooltip for some of the effects.
[*]Similarly, if you have enough experience points for a new level, the amount will be displayed with a bold font.
[/LIST]
[HR][/HR]
[B]Known issues[/B]

Adding all spells of class may take a while, especially when the sheet is full. If this is a problem, you can always add the levels one by one. Similarly, clearing all spells may take quite a while. Sometimes one or two spells linger, in which case you'll have to clear again.

If the sheet becomes unresponsive, you can try [COLOR="#0000FF"][B]ADD ITEMS & SPELLS[/B][/COLOR], [COLOR="#808080"][B]MAINTENANCE[/B][/COLOR], [B][COLOR="#808080"]RE-INITIALIZE[/COLOR][/B].

[HR][/HR]
[B]Feedback[/B]

...is very welcome! In particular help with finding bugs and typos, for these can be hard to spot.

[HR][/HR]
[B]Thanks/credits[/B]

*Morepurplemorebetter’s spell descriptions were the basis for those in this sheet, as he kindly allowed me to work with them. Thanks! You can check out his (spell) sheets [URL=" [url]http://www.enworld.org/forum/rpgdownloads.php?do=download&downloadid=1180[/url]
"]here[/URL].

MadIrishman’s great 3rd Edition sheets where the inspiration for this sheet. MadIrishman was nice enough to let me take his design for a spin. Check out his designs [URL=" http://www.mad-irishman.net/"]here[/URL].

Thanks to all those who provided feedback!
