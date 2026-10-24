// Runes, souls or relics needed per enchantment step, by item type.
const ENCHANT_COUNTS = { helmetBootCapeOffhand: 96, armorBag: 192, oneHandedWeapon: 288, twoHandedWeapon: 384 };
// Enchanting into .1 uses runes, .2 souls, .3 relics; items can't be enchanted into .4.
const ENCHANT_STONES = { 1: 'Rune', 2: 'Soul', 3: 'Relic' };
// Recipes from ao-bin-dumps items.json; every material matches the item's tier and enchantment.
const ITEMS = {
  bag: { name: 'Bag', base: 'BAG', recipe: [['cloth', 'CLOTH', 8], ['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.armorBag },
  soldierBoots: { name: 'Soldier boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_SET1', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  knightBoots: { name: 'Knight boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_SET2', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  guardianBoots: { name: 'Guardian boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_SET3', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  // Artifact boots also need 1 artifact of the item's tier; artifacts have no enchantment and are never returned.
  graveguardBoots: { name: 'Graveguard boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_UNDEAD', recipe: [['metal bars', 'METALBAR', 8], ['ancient bindings', 'ARTEFACT_SHOES_PLATE_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  demonBoots: { name: 'Demon boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_HELL', recipe: [['metal bars', 'METALBAR', 8], ['demonic filling', 'ARTEFACT_SHOES_PLATE_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  judicatorBoots: { name: 'Judicator boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_KEEPER', recipe: [['metal bars', 'METALBAR', 8], ['inscribed bindings', 'ARTEFACT_SHOES_PLATE_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  duskweaverBoots: { name: 'Duskweaver boots', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_FEY', recipe: [['metal bars', 'METALBAR', 8], ['veilweaver claws', 'ARTEFACT_SHOES_PLATE_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  bootsOfValor: { name: 'Boots of valor', group: 'Warrior · Plate boots', base: 'SHOES_PLATE_AVALON', recipe: [['metal bars', 'METALBAR', 8], ['exalted greave', 'ARTEFACT_SHOES_PLATE_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  soldierArmor: { name: 'Soldier armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_SET1', recipe: [['metal bars', 'METALBAR', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  knightArmor: { name: 'Knight armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_SET2', recipe: [['metal bars', 'METALBAR', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  guardianArmor: { name: 'Guardian armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_SET3', recipe: [['metal bars', 'METALBAR', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  graveguardArmor: { name: 'Graveguard armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_UNDEAD', recipe: [['metal bars', 'METALBAR', 16], ['ancient chain rings', 'ARTEFACT_ARMOR_PLATE_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  demonArmor: { name: 'Demon armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_HELL', recipe: [['metal bars', 'METALBAR', 16], ['demonic plates', 'ARTEFACT_ARMOR_PLATE_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  judicatorArmor: { name: 'Judicator armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_KEEPER', recipe: [['metal bars', 'METALBAR', 16], ['preserved animal fur', 'ARTEFACT_ARMOR_PLATE_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  duskweaverArmor: { name: 'Duskweaver armor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_FEY', recipe: [['metal bars', 'METALBAR', 16], ['veilweaver carapace', 'ARTEFACT_ARMOR_PLATE_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  armorOfValor: { name: 'Armor of valor', group: 'Warrior · Plate armor', base: 'ARMOR_PLATE_AVALON', recipe: [['metal bars', 'METALBAR', 16], ['exalted plating', 'ARTEFACT_ARMOR_PLATE_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  soldierHelmet: { name: 'Soldier helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_SET1', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  knightHelmet: { name: 'Knight helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_SET2', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  guardianHelmet: { name: 'Guardian helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_SET3', recipe: [['metal bars', 'METALBAR', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  graveguardHelmet: { name: 'Graveguard helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_UNDEAD', recipe: [['metal bars', 'METALBAR', 8], ['ancient padding', 'ARTEFACT_HEAD_PLATE_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  demonHelmet: { name: 'Demon helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_HELL', recipe: [['metal bars', 'METALBAR', 8], ['demonic scraps', 'ARTEFACT_HEAD_PLATE_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  judicatorHelmet: { name: 'Judicator helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_KEEPER', recipe: [['metal bars', 'METALBAR', 8], ['carved skull padding', 'ARTEFACT_HEAD_PLATE_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  duskweaverHelmet: { name: 'Duskweaver helmet', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_FEY', recipe: [['metal bars', 'METALBAR', 8], ['veilweaver mandibles', 'ARTEFACT_HEAD_PLATE_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  helmetOfValor: { name: 'Helmet of valor', group: 'Warrior · Plate helmets', base: 'HEAD_PLATE_AVALON', recipe: [['metal bars', 'METALBAR', 8], ['exalted visor', 'ARTEFACT_HEAD_PLATE_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  mercenaryHood: { name: 'Mercenary hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_SET1', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  hunterHood: { name: 'Hunter hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_SET2', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  assassinHood: { name: 'Assassin hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_SET3', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  stalkerHood: { name: 'Stalker hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_MORGANA', recipe: [['leather', 'LEATHER', 8], ['imbued visor', 'ARTEFACT_HEAD_LEATHER_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  hellionHood: { name: 'Hellion hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_HELL', recipe: [['leather', 'LEATHER', 8], ['demonhide padding', 'ARTEFACT_HEAD_LEATHER_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  specterHood: { name: 'Specter hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_UNDEAD', recipe: [['leather', 'LEATHER', 8], ['ghastly visor', 'ARTEFACT_HEAD_LEATHER_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  mistwalkerHood: { name: 'Mistwalker hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_FEY', recipe: [['leather', 'LEATHER', 8], ['flawless griffin beak', 'ARTEFACT_HEAD_LEATHER_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  hoodOfTenacity: { name: 'Hood of tenacity', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_AVALON', recipe: [['leather', 'LEATHER', 8], ['augured padding', 'ARTEFACT_HEAD_LEATHER_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  dragonslayerHood: { name: 'Dragonslayer hood', group: 'Hunter · Leather hoods', base: 'HEAD_LEATHER_DRAGON', recipe: [['leather', 'LEATHER', 8], ['dragonhide crown', 'ARTEFACT_HEAD_LEATHER_DRAGON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  scholarCowl: { name: 'Scholar cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_SET1', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  clericCowl: { name: 'Cleric cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_SET2', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  mageCowl: { name: 'Mage cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_SET3', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  druidCowl: { name: 'Druid cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_KEEPER', recipe: [['cloth', 'CLOTH', 8], ['druidic preserved beak', 'ARTEFACT_HEAD_CLOTH_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  fiendCowl: { name: 'Fiend cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_HELL', recipe: [['cloth', 'CLOTH', 8], ['infernal cloth visor', 'ARTEFACT_HEAD_CLOTH_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  cultistCowl: { name: 'Cultist cowl', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_MORGANA', recipe: [['cloth', 'CLOTH', 8], ['alluring padding', 'ARTEFACT_HEAD_CLOTH_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  feyscaleHat: { name: 'Feyscale hat', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_FEY', recipe: [['cloth', 'CLOTH', 8], ['intact fey fibula', 'ARTEFACT_HEAD_CLOTH_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  cowlOfPurity: { name: 'Cowl of purity', group: 'Mage · Cloth cowls', base: 'HEAD_CLOTH_AVALON', recipe: [['cloth', 'CLOTH', 8], ['sanctified mask', 'ARTEFACT_HEAD_CLOTH_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  scholarRobe: { name: 'Scholar robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_SET1', recipe: [['cloth', 'CLOTH', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  clericRobe: { name: 'Cleric robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_SET2', recipe: [['cloth', 'CLOTH', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  mageRobe: { name: 'Mage robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_SET3', recipe: [['cloth', 'CLOTH', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  druidRobe: { name: 'Druid robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_KEEPER', recipe: [['cloth', 'CLOTH', 16], ['druidic feathers', 'ARTEFACT_ARMOR_CLOTH_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  fiendRobe: { name: 'Fiend robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_HELL', recipe: [['cloth', 'CLOTH', 16], ['infernal cloth folds', 'ARTEFACT_ARMOR_CLOTH_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  cultistRobe: { name: 'Cultist robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_MORGANA', recipe: [['cloth', 'CLOTH', 16], ['alluring amulet', 'ARTEFACT_ARMOR_CLOTH_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  feyscaleRobe: { name: 'Feyscale robe', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_FEY', recipe: [['cloth', 'CLOTH', 16], ['fey dorsal wing', 'ARTEFACT_ARMOR_CLOTH_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  robeOfPurity: { name: 'Robe of purity', group: 'Mage · Cloth robes', base: 'ARMOR_CLOTH_AVALON', recipe: [['cloth', 'CLOTH', 16], ['sanctified belt', 'ARTEFACT_ARMOR_CLOTH_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  mercenaryJacket: { name: 'Mercenary jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_SET1', recipe: [['leather', 'LEATHER', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  hunterJacket: { name: 'Hunter jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_SET2', recipe: [['leather', 'LEATHER', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  assassinJacket: { name: 'Assassin jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_SET3', recipe: [['leather', 'LEATHER', 16]], enchantCount: ENCHANT_COUNTS.armorBag },
  stalkerJacket: { name: 'Stalker jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_MORGANA', recipe: [['leather', 'LEATHER', 16], ['imbued leather folds', 'ARTEFACT_ARMOR_LEATHER_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  hellionJacket: { name: 'Hellion jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_HELL', recipe: [['leather', 'LEATHER', 16], ['demonhide leather', 'ARTEFACT_ARMOR_LEATHER_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  specterJacket: { name: 'Specter jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_UNDEAD', recipe: [['leather', 'LEATHER', 16], ['ghastly leather', 'ARTEFACT_ARMOR_LEATHER_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  mistwalkerJacket: { name: 'Mistwalker jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_FEY', recipe: [['leather', 'LEATHER', 16], ['untarnished griffin feathers', 'ARTEFACT_ARMOR_LEATHER_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  jacketOfTenacity: { name: 'Jacket of tenacity', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_AVALON', recipe: [['leather', 'LEATHER', 16], ['augured sash', 'ARTEFACT_ARMOR_LEATHER_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  dragonslayerJacket: { name: 'Dragonslayer jacket', group: 'Hunter · Leather jackets', base: 'ARMOR_LEATHER_DRAGON', recipe: [['leather', 'LEATHER', 16], ['dragonhide padding', 'ARTEFACT_ARMOR_LEATHER_DRAGON', 1, true]], enchantCount: ENCHANT_COUNTS.armorBag },
  mercenaryShoes: { name: 'Mercenary shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_SET1', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  hunterShoes: { name: 'Hunter shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_SET2', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  assassinShoes: { name: 'Assassin shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_SET3', recipe: [['leather', 'LEATHER', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  stalkerShoes: { name: 'Stalker shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_MORGANA', recipe: [['leather', 'LEATHER', 8], ['imbued soles', 'ARTEFACT_SHOES_LEATHER_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  hellionShoes: { name: 'Hellion shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_HELL', recipe: [['leather', 'LEATHER', 8], ['demonhide bindings', 'ARTEFACT_SHOES_LEATHER_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  specterShoes: { name: 'Specter shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_UNDEAD', recipe: [['leather', 'LEATHER', 8], ['ghastly bindings', 'ARTEFACT_SHOES_LEATHER_UNDEAD', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  mistwalkerShoes: { name: 'Mistwalker shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_FEY', recipe: [['leather', 'LEATHER', 8], ['griffin underfur', 'ARTEFACT_SHOES_LEATHER_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  shoesOfTenacity: { name: 'Shoes of tenacity', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_AVALON', recipe: [['leather', 'LEATHER', 8], ['augured fasteners', 'ARTEFACT_SHOES_LEATHER_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  dragonslayerShoes: { name: 'Dragonslayer shoes', group: 'Hunter · Leather shoes', base: 'SHOES_LEATHER_DRAGON', recipe: [['leather', 'LEATHER', 8], ['dragonhide trim', 'ARTEFACT_SHOES_LEATHER_DRAGON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  scholarSandals: { name: 'Scholar sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_SET1', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  clericSandals: { name: 'Cleric sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_SET2', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  mageSandals: { name: 'Mage sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_SET3', recipe: [['cloth', 'CLOTH', 8]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  druidSandals: { name: 'Druid sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_KEEPER', recipe: [['cloth', 'CLOTH', 8], ['druidic bindings', 'ARTEFACT_SHOES_CLOTH_KEEPER', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  fiendSandals: { name: 'Fiend sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_HELL', recipe: [['cloth', 'CLOTH', 8], ['infernal cloth bindings', 'ARTEFACT_SHOES_CLOTH_HELL', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  cultistSandals: { name: 'Cultist sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_MORGANA', recipe: [['cloth', 'CLOTH', 8], ['alluring bindings', 'ARTEFACT_SHOES_CLOTH_MORGANA', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  feyscaleSandals: { name: 'Feyscale sandals', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_FEY', recipe: [['cloth', 'CLOTH', 8], ['fey dragonscales', 'ARTEFACT_SHOES_CLOTH_FEY', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand },
  sandalsOfPurity: { name: 'Sandals of purity', group: 'Mage · Cloth sandals', base: 'SHOES_CLOTH_AVALON', recipe: [['cloth', 'CLOTH', 8], ['sanctified bindings', 'ARTEFACT_SHOES_CLOTH_AVALON', 1, true]], enchantCount: ENCHANT_COUNTS.helmetBootCapeOffhand }
};

// Title case for item and artifact names, keeping short joining words lowercase (e.g. Boots of Valor).
function titleCase(text) {
  return text.replace(/\S+/g, (word, index) => index && ['of', 'the', 'and'].includes(word) ? word : word[0].toUpperCase() + word.slice(1));
}

function buildVariants(item) {
  return Array.from({ length: 25 }, (_, index) => {
    const tier = 4 + Math.floor(index / 5);
    const enchantment = index % 5;
    const material = name => `T${tier}_${name}${enchantment ? `_LEVEL${enchantment}@${enchantment}` : ''}`;
    const stone = ENCHANT_STONES[enchantment];
    return {
      tier,
      enchantment,
      id: `T${tier}_${item.base}${enchantment ? `@${enchantment}` : ''}`,
      materials: item.recipe.filter(([, , , artifact]) => !artifact).map(([name, id, count]) => ({ name, id: material(id), count })),
      artifact: item.recipe.filter(([, , , artifact]) => artifact).map(([name, id, count]) => ({ name: titleCase(name), id: `T${tier}_${id}`, count }))[0] || null,
      enchant: stone ? { name: stone, id: `T${tier}_${stone.toUpperCase()}`, count: item.enchantCount } : null
    };
  });
}
let currentItem = 'bag';
let variants = buildVariants(ITEMS[currentItem]);
const rows = document.querySelector('#prices');
const status = document.querySelector('#status');
const search = document.querySelector('#search');
const returnRateValue = document.querySelector('#return-rate');
const refresh = document.querySelector('#refresh');
// Checkbox groups share a name, so namedItem returns a list of their boxes.
const filters = document.querySelector('#filters').elements;
// Market data server: Americas.
const SERVER = 'west';
const city = filters.namedItem('city');
const quality = filters.namedItem('quality');
const focus = document.querySelector('#focus');
const bonusDay = filters.namedItem('bonus-day');
const bonusCity = document.querySelector('#bonus-city');
const formatter = new Intl.NumberFormat('en-US');
// Resource return rate (%) by focus, then bonus day (0/10/20), then [normal city, bonus city].
const RETURN_RATES = {
  no: { 0: [15.3, 24.8], 10: [21.9, 30.1], 20: [27.5, 34.6] },
  yes: { 0: [43.5, 47.9], 10: [46.5, 50.5], 20: [49.2, 52.8] }
};
let lastRender = [[], false, new Map()];

// Checkbox groups: every checked value, e.g. ['Lymhurst', 'Martlock'].
function checked(group) {
  return Array.from(group).filter(box => box.checked).map(box => box.value);
}

function returnRate() {
  return RETURN_RATES[focus.checked ? 'yes' : 'no'][bonusDay.value][bonusCity.checked ? 1 : 0];
}

// Merge records for one item across the selected cities/qualities: each side is the average of the
// prices that exist, dated by the newest observation, with a count of how many prices went in.
// Each city's primary theme colour, shown as a dot next to prices that came from that city.
const CITY_COLORS = {
  'Fort Sterling': '#dbe9f4',
  Martlock: '#4f86d9',
  Lymhurst: '#5fb35a',
  Bridgewatch: '#e3a33b',
  Thetford: '#7e4fb0',
  Caerleon: '#3d3d3d',
  Brecilien: '#3fb5a8'
};

function averageRecords(records) {
  const merged = new Map();
  for (const record of records) {
    const entry = merged.get(record.item_id) || merged.set(record.item_id, { item_id: record.item_id, buy: [], sell: [] }).get(record.item_id);
    if (record.buy_price_max > 0) entry.buy.push([record.buy_price_max, record.buy_price_max_date, record.city]);
    if (record.sell_price_min > 0) entry.sell.push([record.sell_price_min, record.sell_price_min_date, record.city]);
  }
  const side = prices => prices.length ? { price: Math.round(prices.reduce((sum, [price]) => sum + price, 0) / prices.length), date: prices.map(([, date]) => date).sort().at(-1), count: prices.length, cities: [...new Set(prices.map(([, , city]) => city))] } : { price: 0, date: null, count: 0, cities: [] };
  return new Map([...merged.values()].map(({ item_id, buy, sell }) => {
    const b = side(buy), s = side(sell);
    return [item_id, { item_id, buy_price_max: b.price, buy_price_max_date: b.date, buy_count: b.count, buy_cities: b.cities, sell_price_min: s.price, sell_price_min_date: s.date, sell_count: s.count, sell_cities: s.cities }];
  }));
}
let activeRequest;
const BLACK_MARKET = 'Black Market';

function observation(date) {
  if (!date || date.startsWith('0001')) return null;
  const parsed = new Date(/[zZ]$|[+-]\d\d:\d\d$/.test(date) ? date : `${date}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function priceCell(record, side, loading, className = side) {
  const cell = document.createElement('td');
  cell.className = className;
  const amount = record?.[side === 'buy' ? 'buy_price_max' : 'sell_price_min'];
  const date = observation(record?.[side === 'buy' ? 'buy_price_max_date' : 'sell_price_min_date']);
  const value = document.createElement('span');
  value.className = `price${amount > 0 ? '' : ' missing'}`;
  value.textContent = amount > 0 ? formatter.format(amount) : '—';
  // Buy and sell orders get a dot per city their price came from.
  const sources = className === side && amount > 0 ? record[`${side}_cities`] || [] : [];
  if (sources.length) {
    const dots = document.createElement('span');
    dots.className = 'city-dots';
    dots.append(...sources.map(name => {
      const dot = document.createElement('i');
      dot.style.background = CITY_COLORS[name];
      dot.dataset.city = name;
      dot.setAttribute('aria-label', name);
      return dot;
    }));
    value.prepend(dots);
  }
  cell.append(value);
  const age = document.createElement('span');
  age.className = 'age';
  const count = record?.[side === 'buy' ? 'buy_count' : 'sell_count'] || 0;
  if (amount > 0 && date) {
    const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
    age.textContent = (count > 1 ? `Avg. of ${count} · ` : '') + (minutes < 1 ? 'Just observed' : minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`);
    age.classList.toggle('stale', minutes >= 1440);
    age.title = count > 1 ? `Average of ${count} prices; newest observed ${date.toLocaleString()}` : `Observed ${date.toLocaleString()}`;
  } else {
    age.textContent = loading ? 'Loading…' : amount > 0 ? 'Observation time unknown' : '';
  }
  cell.append(age);
  return cell;
}

function materialCell(variant, materialPrices, loading, rate) {
  const cell = document.createElement('td');
  cell.className = 'materials';
  const costs = variant.materials.map(material => material.count * (materialPrices.get(material.id)?.sell_price_min || 0));
  const complete = costs.every(cost => cost > 0);
  const value = document.createElement('span');
  value.className = `price${complete ? '' : ' missing'}`;
  value.textContent = complete ? formatter.format(Math.round(costs.reduce((sum, cost) => sum + cost, 0) * (1 - rate / 100))) : '—';
  const detail = document.createElement('span');
  detail.className = 'age';
  detail.textContent = complete ? variant.materials.map(material => `${material.count} ${material.name}`).join(' + ') : '';
  detail.title = variant.materials.map((material, index) => `${material.count} × ${material.id}: ${costs[index] > 0 ? formatter.format(costs[index]) : (loading ? 'loading' : 'no sell order')}`).join('\n') + `\nBefore ${rate}% return: ${complete ? formatter.format(costs.reduce((sum, cost) => sum + cost, 0)) : '—'}`;
  cell.append(value, detail);
  return cell;
}

// Artifacts are never returned, so this is the full price with no return rate applied.
// Listings are sparse, so artifacts use their estimated market value: the average sale price from recent history.
function artifactCell(variant, artifactPrices, loading) {
  const cell = document.createElement('td');
  cell.className = 'artifact';
  const artifact = variant.artifact;
  const estimate = artifact && artifactPrices.get(artifact.id);
  const price = estimate?.price;
  const value = document.createElement('span');
  value.className = `price${price > 0 ? '' : ' missing'}`;
  value.textContent = price > 0 ? formatter.format(artifact.count * price) : '—';
  const detail = document.createElement('span');
  detail.className = 'age';
  detail.textContent = price > 0 ? artifact.name : artifact && loading ? 'Loading…' : '';
  if (artifact) detail.title = `${artifact.count} × ${artifact.id}` + (estimate ? `
Average of ${formatter.format(estimate.sold)} sales across all cities, ${estimate.from} to ${estimate.to}` : '');
  cell.append(value, detail);
  return cell;
}

function enchantCell(variant, enchantPrices, loading) {
  const cell = document.createElement('td');
  cell.className = 'enchant';
  const value = document.createElement('span');
  const detail = document.createElement('span');
  detail.className = 'age';
  const enchant = variant.enchant;
  const average = enchant && enchantPrices.get(enchant.id);
  const price = average?.price;
  value.className = `price${price > 0 ? '' : ' missing'}`;
  value.textContent = price > 0 ? formatter.format(enchant.count * price) : '—';
  if (enchant) {
    detail.textContent = price > 0 ? `${enchant.count} ${enchant.name.toLowerCase()}s` : '';
    detail.title = `${enchant.count} × ${enchant.id}: ${price > 0 ? `${formatter.format(price)} each (Royal City average of lowest asks in ${average.cities.join(', ')})` : loading ? 'loading' : 'no sell orders in any city'}`;
  }
  cell.append(value, detail);
  return cell;
}

function render(market = { indexed: new Map(), blackMarket: new Map() }, loading = false, materialPrices = new Map(), enchantPrices = new Map(), artifactPrices = new Map()) {
  lastRender = [market, loading, materialPrices, enchantPrices, artifactPrices];
  const rate = returnRate();
  returnRateValue.textContent = `${rate}%`;
  const { indexed, blackMarket } = market;
  // Hide the Artifact column for items whose recipe has no artifact.
  rows.closest('table').classList.toggle('no-artifact', !variants.some(variant => variant.artifact));
  rows.replaceChildren(...variants.map(variant => {
    const row = document.createElement('tr');
    if (!variant.enchantment && variant.tier > 4) row.className = 'tier-start';
    const label = document.createElement('td');
    label.innerHTML = `<span class="variant"><span class="tier-icon tier-${variant.tier}" aria-hidden="true">${['IV', 'V', 'VI', 'VII', 'VIII'][variant.tier - 4]}</span>${variant.tier}.${variant.enchantment}</span>`;
    row.append(label, priceCell(indexed.get(variant.id), 'buy', loading), priceCell(indexed.get(variant.id), 'sell', loading), priceCell(blackMarket.get(variant.id), 'buy', loading, 'black'), materialCell(variant, materialPrices, loading, rate), artifactCell(variant, artifactPrices, loading), enchantCell(variant, enchantPrices, loading));
    return row;
  }));
}

async function loadPrices() {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const timeout = setTimeout(() => controller.abort(), 20000);
  refresh.disabled = true;
  rows.setAttribute('aria-busy', 'true');
  status.className = '';
  status.textContent = '';
  render(undefined, true);
  const locations = checked(city);
  const qualities = checked(quality).map(Number);
  try {
    const ids = variants.map(variant => encodeURIComponent(variant.id)).join(',');
    const params = new URLSearchParams({ locations: [...locations, BLACK_MARKET].join(','), qualities: qualities.join(',') });
    const materialIds = variants.flatMap(variant => [...variant.materials, variant.artifact, variant.enchant].filter(Boolean).map(material => encodeURIComponent(material.id))).join(',');
    // Enchanting stones are priced as an average across all cities, so fetch every city for this request.
    const cities = Array.from(city, box => box.value);
    // Royal Cities: excludes Caerleon and Brecilien.
    const royalCities = ['Bridgewatch', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford'];
    const materialParams = new URLSearchParams({ locations: cities.join(','), qualities: '1' });
    const artifactIds = variants.map(variant => variant.artifact?.id).filter((id, index, ids) => id && ids.indexOf(id) === index);
    const [response, materialResponse, artifactHistory] = await Promise.all([
      fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/prices/${ids}.json?${params}`, { signal: controller.signal }),
      fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/prices/${materialIds}.json?${materialParams}`, { signal: controller.signal }),
      artifactIds.length ? fetch(`https://${SERVER}.albion-online-data.com/api/v2/stats/history/${artifactIds.map(encodeURIComponent).join(',')}.json?time-scale=24&qualities=1`, { signal: controller.signal }) : null
    ]);
    for (const result of [response, materialResponse, artifactHistory].filter(Boolean)) if (!result.ok) throw new Error(result.status === 429 ? 'Too many requests. Please wait a moment and refresh.' : `Market service returned ${result.status}. Please try again.`);
    const [data, materialData, historyData = []] = await Promise.all([response.json(), materialResponse.json(), artifactHistory?.json()]);
    if (!Array.isArray(data) || !Array.isArray(materialData) || !Array.isArray(historyData)) throw new Error('Unexpected market response. Please try again.');
    if (activeRequest !== controller) return;
    const records = data.filter(record => qualities.includes(Number(record.quality)));
    const market = {
      indexed: averageRecords(records.filter(record => locations.includes(record.city))),
      blackMarket: averageRecords(records.filter(record => record.city === BLACK_MARKET))
    };
    const materialPrices = averageRecords(materialData.filter(record => locations.includes(record.city)));
    const enchantPrices = new Map();
    for (const { enchant } of variants) {
      if (!enchant) continue;
      const listings = materialData.filter(record => record.item_id === enchant.id && royalCities.includes(record.city) && record.sell_price_min > 0);
      if (listings.length) enchantPrices.set(enchant.id, { price: Math.round(listings.reduce((sum, record) => sum + record.sell_price_min, 0) / listings.length), cities: listings.map(record => record.city) });
    }
    // Volume-weighted average sale price over the history window (about the last 4 weeks), across all cities.
    const artifactPrices = new Map();
    for (const id of artifactIds) {
      const days = historyData.filter(series => series.item_id === id && cities.includes(series.location)).flatMap(series => series.data).filter(day => day.item_count > 0 && day.avg_price > 0);
      const sold = days.reduce((sum, day) => sum + day.item_count, 0);
      if (!sold) continue;
      const dates = days.map(day => day.timestamp.slice(0, 10)).sort();
      artifactPrices.set(id, { price: Math.round(days.reduce((sum, day) => sum + day.avg_price * day.item_count, 0) / sold), sold, from: dates[0], to: dates.at(-1) });
    }
    render(market, false, materialPrices, enchantPrices, artifactPrices);
  } catch (error) {
    if (activeRequest !== controller) return;
    render();
    status.className = 'error';
    status.textContent = error.name === 'AbortError' ? 'Request timed out. Refresh to try again.' : error instanceof TypeError ? 'Could not connect to market data. Check your connection and refresh.' : error.message;
  } finally {
    clearTimeout(timeout);
    if (activeRequest === controller) {
      refresh.disabled = false;
      rows.setAttribute('aria-busy', 'false');
    }
  }
}

document.querySelector('#filters').addEventListener('submit', event => { event.preventDefault(); loadPrices(); });
function showItem() {
  const item = ITEMS[currentItem];
  variants = buildVariants(item);
  document.querySelector('#item-name').textContent = titleCase(item.name);
  document.querySelector('.item-art img').src = `https://render.albiononline.com/v1/item/T4_${item.base}.png?quality=1&size=217`;
  document.querySelector('.item-art img').alt = `${item.name} in Albion Online`;
  document.title = `${item.name} prices · Albion market`;
}

// Each checkbox group needs at least one box checked.
[city, quality].forEach(group => group.forEach(box => box.addEventListener('change', () => {
  if (!checked(group).length) box.checked = true;
})));
[city, quality].forEach(group => group.forEach(box => box.addEventListener('change', loadPrices)));
// Search bar: a combobox over ITEMS; choosing a result switches the page to that item.
const searchResults = document.querySelector('#search-results');
let activeResult = -1;

function showResults() {
  const query = search.value.trim().toLowerCase();
  if (!query) return hideResults();
  const matches = Object.entries(ITEMS).filter(([, item]) => item.name.toLowerCase().includes(query));
  activeResult = Math.min(activeResult, matches.length - 1);
  searchResults.replaceChildren(...matches.map(([key, item], index) => {
    const result = document.createElement('li');
    result.setAttribute('role', 'option');
    result.id = `result-${key}`;
    result.dataset.value = key;
    result.setAttribute('aria-selected', String(index === activeResult));
    const name = document.createElement('span');
    name.textContent = item.name;
    const group = document.createElement('small');
    group.textContent = item.group || '';
    result.append(name, group);
    return result;
  }));
  if (!matches.length) searchResults.innerHTML = '<li class="empty">No matching items</li>';
  searchResults.hidden = false;
  search.setAttribute('aria-expanded', 'true');
  if (activeResult >= 0) search.setAttribute('aria-activedescendant', searchResults.children[activeResult].id);
  else search.removeAttribute('aria-activedescendant');
}

function hideResults() {
  searchResults.hidden = true;
  search.setAttribute('aria-expanded', 'false');
  search.removeAttribute('aria-activedescendant');
  activeResult = -1;
}

function chooseResult(value) {
  search.value = '';
  searchClear.hidden = true;
  search.blur();
  if (currentItem === value) return;
  currentItem = value;
  showItem();
  loadPrices();
}

search.addEventListener('focus', showResults);
const searchClear = document.querySelector('#search-clear');
search.addEventListener('input', () => { activeResult = -1; searchClear.hidden = !search.value; showResults(); });
// mousedown keeps focus in the input, so clearing doesn't close and reopen the list.
searchClear.addEventListener('mousedown', event => event.preventDefault());
searchClear.addEventListener('click', () => {
  search.value = '';
  searchClear.hidden = true;
  hideResults();
  search.focus();
});
search.addEventListener('blur', hideResults);
search.addEventListener('keydown', event => {
  const options = searchResults.hidden ? [] : [...searchResults.querySelectorAll('[role="option"]')];
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!options.length) return;
    activeResult = (activeResult + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
    showResults();
  } else if (event.key === 'Enter' && options.length) {
    event.preventDefault();
    chooseResult(options[Math.max(activeResult, 0)].dataset.value);
  } else if (event.key === 'Escape') {
    search.blur();
  }
});
// mousedown fires before the input's blur, so the choice lands before the list closes.
searchResults.addEventListener('mousedown', event => {
  event.preventDefault();
  const option = event.target.closest('[role="option"]');
  if (option) chooseResult(option.dataset.value);
});
[focus, ...bonusDay, bonusCity].forEach(input => input.addEventListener('change', () => render(...lastRender)));
showItem();
loadPrices();
