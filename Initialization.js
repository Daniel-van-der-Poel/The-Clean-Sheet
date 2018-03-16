app.runtimeHighlight = false;
app.focusRect = false;
var engine = false;

setRolls();
setSpellcasters();
setMenu();
calcMain();
applyWeapon(0);
applyWeapon(1);
applyWeapon(2);
applyWeapon(3);
applyWeapon(4);
applyWeapon(5);
applyWeapon(6);

engine = true;

tick();
