/* ============================================================
   SEARCH.JS — Rogue Trader Wiki Search Engine
   ============================================================ */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════
  // CONFIGURATION
  // Edit this list to add/remove wiki files from the search index.
  // ══════════════════════════════════════════════════════════  
const WIKI_FILES = [
    'wikis/air-forces-notes.md',
    'wikis/ambition-class-cruiser.md',
    'wikis/ammo-acid-shells.md',
    'wikis/ammo-airtorch-canister.md',
    'wikis/ammo-exterminator-cartridge.md',
    'wikis/ammo-grenades-and-launcher-munitions.md',
    'wikis/ammo-microburst-flask.md',
    'wikis/ammo-organgrinder-rounds.md',
    'wikis/ammo-ork-kustom-bitz.md',
    'wikis/ammo-snare-shells.md',
    'wikis/ammo-tox-dispenser.md',
    'wikis/ammo-toxic-shot.md',
    'wikis/ammo-tracer-shells.md',
    'wikis/ammo-unusual.md',
    'wikis/ammo-void-rounds.md',
    'wikis/appendix-vehicles.md',
    'wikis/armageddon-class-battlecruiser.md',
    'wikis/armour-notes.md',
    'wikis/armour.md',
    'wikis/attack-craft-assault-boat-operations.md',
    'wikis/attack-craft-attack-ship.md',
    'wikis/attack-craft-attacking-aircraft.md',
    'wikis/attack-craft-attacking-with-fighters.md',
    'wikis/attack-craft-bomber-operations.md',
    'wikis/attack-craft-combat-air-patrol.md',
    'wikis/attack-craft-fighter-operations.md',
    'wikis/attack-craft-launch-bay-capacity.md',
    'wikis/attack-craft-launch-bay-preparation.md',
    'wikis/attack-craft-raider-landing-bay.md',
    'wikis/attack-craft-ratings.md',
    'wikis/attack-craft-rules.md',
    'wikis/attack-craft-ships-without-bays.md',
    'wikis/attack-craft-small-craft.md',
    'wikis/attack-craft-torpedo-bombers.md',
    'wikis/avenger-class-grand-cruiser.md',
    'wikis/brute-ram-ship.md',
    'wikis/calixis-pattern-starhawk-bomber.md',
    'wikis/career-acquisitionist.md',
    'wikis/career-arch-militant.md',
    'wikis/career-astropath-transcendent.md',
    'wikis/career-augmenticist.md',
    'wikis/career-calixian-privateer.md',
    'wikis/career-eternal-praetorian.md',
    'wikis/career-explorator.md',
    'wikis/career-flight-marshal.md',
    'wikis/career-genetor.md',
    'wikis/career-gland-warrior.md',
    'wikis/career-kroot-mercenary.md',
    'wikis/career-kroot-shaper.md',
    'wikis/career-missionary.md',
    'wikis/career-navigator.md',
    'wikis/career-navis-scion.md',
    'wikis/career-ork-freebooter.md',
    'wikis/career-ork-kommando.md',
    'wikis/career-ork-mekboy.md',
    'wikis/career-path-format-guide.md',
    'wikis/career-reaver-of-unbeholden-reaches.md',
    'wikis/career-rogue-trader.md',
    'wikis/career-seneschal.md',
    'wikis/career-stalker.md',
    'wikis/career-torchbearer.md',
    'wikis/career-transubstantial-initiate.md',
    'wikis/career-vessel-of-the-fleet.md',
    'wikis/career-void-master.md',
    'wikis/career-xenographer.md',
    'wikis/carnage-class-cruiser.md',
    'wikis/carrack-class-transport.md',
    'wikis/chalice-class-battlecruiser.md',
    'wikis/character-corruption.md',
    'wikis/character-creation-explorer.md',
    'wikis/character-fear-and-damnation.md',
    'wikis/character-healing.md',
    'wikis/character-injury.md',
    'wikis/character-mutation.md',
    'wikis/character-mutations-list.md',
    'wikis/character-size-rules.md',
    'wikis/character-trait-non-imperial.md',
    'wikis/character-trait-speak-not-unto-the-alien.md',
    'wikis/character-traits-and-abilities.md',
    'wikis/character-traits.md',
    'wikis/chargen-alternate-career-ranks.md',
    'wikis/chargen-birthright-footfallen.md',
    'wikis/chargen-career-progression.md',
    'wikis/chargen-elite-advance-packages.md',
    'wikis/chargen-elite-advances-missed-ranks.md',
    'wikis/chargen-elite-advances.md',
    'wikis/chargen-expanding-origin-path.md',
    'wikis/chargen-homeworld-fortress.md',
    'wikis/chargen-homeworld-frontier.md',
    'wikis/chargen-homeworld-penal.md',
    'wikis/chargen-homeworld-planet-bound.md',
    'wikis/chargen-lineage.md',
    'wikis/chargen-motivation-drusian-adherent.md',
    'wikis/chargen-new-birthright-options.md',
    'wikis/chargen-new-home-worlds.md',
    'wikis/chargen-new-lure-of-void-options.md',
    'wikis/chargen-new-motivation-options.md',
    'wikis/chargen-new-trials-travails-options.md',
    'wikis/chargen-rank-four.md',
    'wikis/chargen-rank-one.md',
    'wikis/chargen-rank-three.md',
    'wikis/chargen-rank-two.md',
    'wikis/chargen-ship-and-warrant-path.md',
    'wikis/chargen-stage1-characteristics.md',
    'wikis/chargen-stage2-origin-path.md',
    'wikis/chargen-stage3-spend-xp.md',
    'wikis/chargen-stage4-character-details.md',
    'wikis/chargen-stage5-profit-and-ship-points.md',
    'wikis/chargen-stage6-equipment.md',
    'wikis/chargen-starting-profit.md',
    'wikis/chargen-taking-alternate-career-rank.md',
    'wikis/chargen-trial-angevin-crusade-veteran.md',
    'wikis/chargen-using-elite-advances.md',
    'wikis/chargen-warrant-age.md',
    'wikis/chargen-warrant-renown.md',
    'wikis/claymore-class-corvette.md',
    'wikis/cobras-of-wrath-of-saint-drusus-squadron.md',
    'wikis/combat-actions-and-orders.md',
    'wikis/combat-advance-action.md',
    'wikis/combat-attack-rules.md',
    'wikis/combat-catching-enemy-unprepared.md',
    'wikis/combat-cautious-advance.md',
    'wikis/combat-charge-action.md',
    'wikis/combat-declaring-victory.md',
    'wikis/combat-dig-in-action.md',
    'wikis/combat-disengage-action.md',
    'wikis/combat-escape-action.md',
    'wikis/combat-feint-action.md',
    'wikis/combat-flank-action.md',
    'wikis/combat-follow-my-lead-order.md',
    'wikis/combat-forced-march.md',
    'wikis/combat-hit-and-run.md',
    'wikis/combat-initiative.md',
    'wikis/combat-joining-the-fray.md',
    'wikis/combat-movement.md',
    'wikis/combat-offence-and-defence.md',
    'wikis/combat-on-the-advance.md',
    'wikis/combat-orders.md',
    'wikis/combat-push-through-action.md',
    'wikis/combat-rounds-and-turns.md',
    'wikis/combat-special-circumstances.md',
    'wikis/combat-surprise-rules.md',
    'wikis/combat-taking-turns.md',
    'wikis/combat-terrain-and-cover.md',
    'wikis/combat-victory-conditions.md',
    'wikis/component-craftsmanship-facilities.md',
    'wikis/component-installation.md',
    'wikis/components-archeotech.md',
    'wikis/components-auger-arrays.md',
    'wikis/components-augur-arrays.md',
    'wikis/components-calamity-vents.md',
    'wikis/components-cargo-passenger.md',
    'wikis/components-cherubim-aerie.md',
    'wikis/components-civilian-quarters.md',
    'wikis/components-command-decks.md',
    'wikis/components-communications-array.md',
    'wikis/components-craftsmanship-morale.md',
    'wikis/components-craftsmanship.md',
    'wikis/components-crew-quarters.md',
    'wikis/components-defensive-countermeasures.md',
    'wikis/components-defensive-turrets.md',
    'wikis/components-drives.md',
    'wikis/components-engine-decks.md',
    'wikis/components-ghost-eye-scanner.md',
    'wikis/components-ghost-field-array.md',
    'wikis/components-gun-decks.md',
    'wikis/components-landing-bays.md',
    'wikis/components-life-sustainer-crew-quarters.md',
    'wikis/components-life-sustainers.md',
    'wikis/components-lower-decks.md',
    'wikis/components-mining-systems.md',
    'wikis/components-navigation-spires.md',
    'wikis/components-ork.md',
    'wikis/components-phase-reality-field.md',
    'wikis/components-plasma-drives.md',
    'wikis/components-power-shields.md',
    'wikis/components-rakgol.md',
    'wikis/components-stryxis.md',
    'wikis/components-teleportariums.md',
    'wikis/components-torpedo-decks.md',
    'wikis/components-torpedo-tubes.md',
    'wikis/components-upgrades.md',
    'wikis/components-void-shields.md',
    'wikis/components-xenos-warp-engine.md',
    'wikis/components-xenos.md',
    'wikis/conquest-class-star-galleon.md',
    'wikis/crew-indentured-workers.md',
    'wikis/crew-ratings.md',
    'wikis/crew-role-armsman.md',
    'wikis/crew-role-bosun.md',
    'wikis/crew-role-chief-astropath.md',
    'wikis/crew-role-fleet-commissar.md',
    'wikis/crew-role-gun-captain.md',
    'wikis/crew-role-master-gunner.md',
    'wikis/crew-role-master-of-arms.md',
    'wikis/crew-role-master-of-ordnance.md',
    'wikis/crew-role-officer-of-the-watch.md',
    'wikis/crew-role-principal-navigator.md',
    'wikis/crew-role-sergeant-at-arms.md',
    'wikis/crew-role-ships-confessor.md',
    'wikis/crew-role-ships-master.md',
    'wikis/crew-role-ships-surgeon.md',
    'wikis/crew-role-tech-priest-majoris.md',
    'wikis/crew-servitors.md',
    'wikis/crew-voidsmen.md',
    'wikis/darkstar-fighter-kaelor-origin.md',
    'wikis/defiant-class-light-cruiser.md',
    'wikis/devastation-class-cruiser.md',
    'wikis/dictator-class-cruiser.md',
    'wikis/dominator-class-cruiser.md',
    'wikis/dragonship.md',
    'wikis/eagle-bomber-kaelor-origin.md',
    'wikis/eclipse-cruiser.md',
    'wikis/economy-acquisition-rules.md',
    'wikis/economy-arming-for-conquest.md',
    'wikis/economy-availability-rules.md',
    'wikis/economy-backing.md',
    'wikis/economy-counting-the-cost.md',
    'wikis/economy-endeavours.md',
    'wikis/economy-expanded-acquisition.md',
    'wikis/economy-influence-reputation-location.md',
    'wikis/economy-influence-rules.md',
    'wikis/economy-location-influence-availability.md',
    'wikis/economy-men-of-quality.md',
    'wikis/economy-merchant-cartels-gelt-brokers.md',
    'wikis/economy-multiple-acquisition-tests.md',
    'wikis/economy-profit-factor.md',
    'wikis/economy-rewards-measure-of-success.md',
    'wikis/economy-rewards.md',
    'wikis/economy-sacrificing-quality.md',
    'wikis/economy-ship-points.md',
    'wikis/economy-systems-of-ambition.md',
    'wikis/economy-using-profit-factor.md',
    'wikis/economy-vehicle-acquisition.md',
    'wikis/economy-wealth-and-acquisitions.md',
    'wikis/economy-working-as-mercenary.md',
    'wikis/endeavour-class-light-cruiser.md',
    'wikis/endeavours-background.md',
    'wikis/endeavours-component.md',
    'wikis/endeavours-crew-improvements.md',
    'wikis/endeavours-meta-and-background.md',
    'wikis/endeavours-meta.md',
    'wikis/endeavours-ship-upgrades.md',
    'wikis/equipment-abhumans.md',
    'wikis/equipment-archeotech-and-xenostech.md',
    'wikis/equipment-archeotech-mirror-shield.md',
    'wikis/equipment-armour.md',
    'wikis/equipment-augments-enhancements.md',
    'wikis/equipment-bionics-and-implants.md',
    'wikis/equipment-bionics-blackbone-bracing.md',
    'wikis/equipment-bionics-gastral.md',
    'wikis/equipment-bionics-vitae-supplacement.md',
    'wikis/equipment-clothing.md',
    'wikis/equipment-cybernetics.md',
    'wikis/equipment-delphis-ironclad-power-armour.md',
    'wikis/equipment-drugs-and-consumables.md',
    'wikis/equipment-eldar-forceshield.md',
    'wikis/equipment-eldar-raider-armour.md',
    'wikis/equipment-flexsteel-suit.md',
    'wikis/equipment-force-field-conversion-locke.md',
    'wikis/equipment-force-field-displacer-mars.md',
    'wikis/equipment-force-field-power-ryza.md',
    'wikis/equipment-force-field-refractor-mars.md',
    'wikis/equipment-force-fields.md',
    'wikis/equipment-frost-thermal-armour.md',
    'wikis/equipment-gear.md',
    'wikis/equipment-internal-blade.md',
    'wikis/equipment-internal-power-cell.md',
    'wikis/equipment-kroot-armoury.md',
    'wikis/equipment-kroot-gear.md',
    'wikis/equipment-mind-ward.md',
    'wikis/equipment-nephium-fuel-tank.md',
    'wikis/equipment-ork-armour.md',
    'wikis/equipment-ork-armoury.md',
    'wikis/equipment-ork-grenades.md',
    'wikis/equipment-pain-ward.md',
    'wikis/equipment-salvation-shield.md',
    'wikis/equipment-standard-issue.md',
    'wikis/equipment-tools.md',
    'wikis/exorcist-class-grand-cruiser.md',
    'wikis/facility-deep-void-station.md',
    'wikis/facility-fleet-base-metis.md',
    'wikis/facility-naval-installation.md',
    'wikis/facility-navy-docks.md',
    'wikis/facility-planetary-shipyards.md',
    'wikis/facility-station-defences.md',
    'wikis/faction-adeptus-mechanicus.md',
    'wikis/faction-eldar-holofields-special.md',
    'wikis/faction-eldar-overview.md',
    'wikis/faction-eldar-special-rules.md',
    'wikis/faction-eldar-weapon-rules.md',
    'wikis/faction-eldar-webway.md',
    'wikis/faction-kroot-characteristics.md',
    'wikis/faction-kroot-corruption.md',
    'wikis/faction-kroot-gender.md',
    'wikis/faction-kroot-insanity.md',
    'wikis/faction-kroot-kindreds.md',
    'wikis/faction-kroot-overview.md',
    'wikis/faction-kroot-player-characters.md',
    'wikis/faction-kroot-race-overview.md',
    'wikis/faction-kroot-talents.md',
    'wikis/faction-kroot-traits.md',
    'wikis/faction-navis-nobilite.md',
    'wikis/faction-ork-assault-craft.md',
    'wikis/faction-ork-characteristics.md',
    'wikis/faction-ork-in-koronus-expanse.md',
    'wikis/faction-ork-origin-da-klan.md',
    'wikis/faction-ork-origin-orky-know-wotz.md',
    'wikis/faction-ork-overview.md',
    'wikis/faction-ork-physiology.md',
    'wikis/faction-ork-player-characters.md',
    'wikis/faction-ork-psychology.md',
    'wikis/faction-ork-special-rules.md',
    'wikis/faction-rakgol-overview.md',
    'wikis/faction-rakgol-special-rules.md',
    'wikis/faction-rakgol-weapon-rules.md',
    'wikis/faction-stryxis-environmental-architect.md',
    'wikis/faction-stryxis-overview.md',
    'wikis/faction-stryxis-special-rules.md',
    'wikis/faction-xenos-alien-biology.md',
    'wikis/faction-xenos-characters.md',
    'wikis/faction-xenos-exotic-overview.md',
    'wikis/faction-xenos-overview.md',
    'wikis/falchion-class-frigate.md',
    'wikis/fighta-bomma.md',
    'wikis/firing-the-nova-cannon.md',
    'wikis/goliath-class-factory-ship.md',
    'wikis/gothic-class-cruiser.md',
    'wikis/ground-war-rules.md',
    'wikis/hades-class-heavy-cruiser.md',
    'wikis/hammer-battlekroozer.md',
    'wikis/hellbringer-planetary-assault-ship.md',
    'wikis/hellebore.md',
    'wikis/hemlock.md',
    'wikis/hulls-battlecruiser.md',
    'wikis/hulls-cruiser.md',
    'wikis/hulls-frigate.md',
    'wikis/hulls-grand-cruiser.md',
    'wikis/hulls-light-cruiser.md',
    'wikis/hulls-overview.md',
    'wikis/hulls-raider.md',
    'wikis/hulls-transport.md',
    'wikis/iconoclast-class-destroyer.md',
    'wikis/imperial-starship-types.md',
    'wikis/infidel-class-raider.md',
    'wikis/iniquity-pattern-doomfire-bomber.md',
    'wikis/iniquity-pattern-dreadclaw-drop-pod.md',
    'wikis/iniquity-pattern-swiftdeath-fighter.md',
    'wikis/interplanetary-craft-common.md',
    'wikis/kroot-warsphere.md',
    'wikis/kroozer.md',
    'wikis/lathe-pattern-shark-assault-boat.md',
    'wikis/launch-bays-and-attack-craft.md',
    'wikis/launch-bays-overview.md',
    'wikis/launching-torpedoes.md',
    'wikis/lunar-variants.md',
    'wikis/mars-class-battlecruiser.md',
    'wikis/mass-combat-attacking-units.md',
    'wikis/mass-combat-brushfire-war.md',
    'wikis/mass-combat-convoy-duty.md',
    'wikis/mass-combat-crusades.md',
    'wikis/mass-combat-end-of-strategic-round.md',
    'wikis/mass-combat-endeavour-sizes.md',
    'wikis/mass-combat-endeavour-themes.md',
    'wikis/mass-combat-endeavours-and-profit.md',
    'wikis/mass-combat-endeavours.md',
    'wikis/mass-combat-logistics-objectives.md',
    'wikis/mass-combat-mustering-troops.md',
    'wikis/mass-combat-outfitting-forces.md',
    'wikis/mass-combat-overview.md',
    'wikis/mass-combat-planetary-invasion.md',
    'wikis/mass-combat-raids.md',
    'wikis/mass-combat-reasons-for-war.md',
    'wikis/mass-combat-rules.md',
    'wikis/mass-combat-sabotage.md',
    'wikis/mass-combat-special-abilities.md',
    'wikis/mass-combat-special-rules.md',
    'wikis/mass-combat-strategic-goals.md',
    'wikis/mass-combat-strategic-withdrawal.md',
    'wikis/mass-combat-tactical-objectives.md',
    'wikis/mass-combat-targets-and-strategic-values.md',
    'wikis/mass-combat-theatre.md',
    'wikis/mass-combat-transporting-deploying-forces.md',
    'wikis/mass-combat-unit-attrition-cohesion.md',
    'wikis/mass-combat-unit-characteristics.md',
    'wikis/mass-combat-unit-strength-morale.md',
    'wikis/mass-combat-unit-types.md',
    'wikis/mass-combat-units-and-formations.md',
    'wikis/mass-combat-waging-war.md',
    'wikis/mass-combats.md',
    'wikis/modifier-summary.md',
    'wikis/navigator-gaining-powers.md',
    'wikis/navigator-gene-rules.md',
    'wikis/navigator-mutations-list.md',
    'wikis/navigator-power-overview.md',
    'wikis/navigator-powers-list.md',
    'wikis/navigator-powers-new.md',
    'wikis/navigator-using-powers.md',
    'wikis/navigator-warp-eye.md',
    'wikis/nightshade.md',
    'wikis/nova-dragon.md',
    'wikis/overlord-class-battlecruiser.md',
    'wikis/patrols.md',
    'wikis/pestilaan-light-cruiser.md',
    'wikis/psychic-ability-rules.md',
    'wikis/psychic-an-alien-mind.md',
    'wikis/psychic-astropath-burnout.md',
    'wikis/psychic-astropath-powers-new.md',
    'wikis/psychic-astropathic-choirs.md',
    'wikis/psychic-chaos-mind.md',
    'wikis/psychic-corrupting-the-flesh.md',
    'wikis/psychic-discipline-divination.md',
    'wikis/psychic-discipline-telekinesis.md',
    'wikis/psychic-discipline-telepathy.md',
    'wikis/psychic-disciplines-list.md',
    'wikis/psychic-from-beyond-powers.md',
    'wikis/psychic-immolate-the-soul.md',
    'wikis/psychic-mental-alacrity.md',
    'wikis/psychic-phenomena-table.md',
    'wikis/psychic-powers-cross-system.md',
    'wikis/psychic-powers-new.md',
    'wikis/psychic-psyker-types.md',
    'wikis/psychic-stupefy-the-soul.md',
    'wikis/psychic-techniques-list.md',
    'wikis/psychic-warp-manipulation.md',
    'wikis/rakgol-bloodfury-assault-craft.md',
    'wikis/rakgol-butcher.md',
    'wikis/rakgol-mangler.md',
    'wikis/rakgol-mauler.md',
    'wikis/rank-admiral.md',
    'wikis/rank-captain.md',
    'wikis/rank-commander.md',
    'wikis/rank-commodore.md',
    'wikis/rank-lieutenant.md',
    'wikis/rank-lord-admiral.md',
    'wikis/rank-lord-captain.md',
    'wikis/rank-lord-high-admiral.md',
    'wikis/rank-midshipman.md',
    'wikis/rank-rear-admiral.md',
    'wikis/rank-solar-admiral.md',
    'wikis/rank-vice-admiral.md',
    'wikis/ranks-battlefleet-overview.md',
    'wikis/ranks-commissioned-officers.md',
    'wikis/ranks-honourifics-and-special.md',
    'wikis/ranks-warrant-officers.md',
    'wikis/repulsive-class-grand-cruiser.md',
    'wikis/retaliator-class-grand-cruiser.md',
    'wikis/rogue-trader-vessel-example.md',
    'wikis/rules-adverse-conditions.md',
    'wikis/rules-allies-enemies-rivals.md',
    'wikis/rules-atomic-assists.md',
    'wikis/rules-campaign.md',
    'wikis/rules-carrying-capacity.md',
    'wikis/rules-celestial-phenomena.md',
    'wikis/rules-combat-mechanics.md',
    'wikis/rules-combat-overview.md',
    'wikis/rules-communication.md',
    'wikis/rules-complications.md',
    'wikis/rules-contacts.md',
    'wikis/rules-dark-heresy-crossover.md',
    'wikis/rules-dice.md',
    'wikis/rules-dodge-reaction.md',
    'wikis/rules-dodge.md',
    'wikis/rules-exploration.md',
    'wikis/rules-fortune-and-fate.md',
    'wikis/rules-interaction-challenges.md',
    'wikis/rules-interaction-lore-skills-social.md',
    'wikis/rules-interaction.md',
    'wikis/rules-making-contact.md',
    'wikis/rules-maps-markers-miniatures.md',
    'wikis/rules-measured-response.md',
    'wikis/rules-misfortunes.md',
    'wikis/rules-movement.md',
    'wikis/rules-other-considerations.md',
    'wikis/rules-roll-result-upgrade.md',
    'wikis/rules-social-interaction-challenges.md',
    'wikis/rules-tests.md',
    'wikis/shadow-cruiser.md',
    'wikis/shadowhunter.md',
    'wikis/ship-anatomy-overview.md',
    'wikis/shipops-air-strike.md',
    'wikis/shipops-artillery-barrage.md',
    'wikis/shipops-electronic-warfare.md',
    'wikis/shipops-planetary-bombardment-medium.md',
    'wikis/shipops-planetary-bombardment.md',
    'wikis/shipops-rally.md',
    'wikis/shipops-reconnoitre.md',
    'wikis/shipops-triage.md',
    'wikis/shipops-unsecured-supplies.md',
    'wikis/ships-battlecruisers-overview.md',
    'wikis/ships-battleships-overview.md',
    'wikis/ships-chaos-reavers.md',
    'wikis/ships-corsair.md',
    'wikis/ships-cruisers-overview.md',
    'wikis/ships-eldar-craftworld.md',
    'wikis/ships-eldar-wraithbone.md',
    'wikis/ships-frigates-overview.md',
    'wikis/ships-grand-cruisers-overview.md',
    'wikis/ships-light-cruisers-overview.md',
    'wikis/ships-npc-starships.md',
    'wikis/ships-npc-vessels.md',
    'wikis/ships-ork-roks-and-scrap-fleets.md',
    'wikis/ships-raiders-overview.md',
    'wikis/ships-rogue-trader-vessel-examples.md',
    'wikis/ships-stryxis.md',
    'wikis/ships-thulian-explorator-vessel.md',
    'wikis/ships-transports-overview.md',
    'wikis/ships-xebec-and-stryxis-usage.md',
    'wikis/short-and-wide-salvos.md',
    'wikis/shrike-class-raider.md',
    'wikis/skills-and-talents-overview.md',
    'wikis/skills-basic-and-advanced.md',
    'wikis/skills-descriptions.md',
    'wikis/skills-descriptors.md',
    'wikis/skills-gaining.md',
    'wikis/skills-groups.md',
    'wikis/skills-training-and-mastery.md',
    'wikis/skills-training-vs-instinct.md',
    'wikis/slaughter-class-cruiser.md',
    'wikis/soulcage-slaveship.md',
    'wikis/squadron-being-shot-at.md',
    'wikis/squadron-below-full-strength.md',
    'wikis/squadron-composition-rules.md',
    'wikis/squadron-crew-and-orders.md',
    'wikis/squadron-elimination-rules.md',
    'wikis/squadron-formation-rules.md',
    'wikis/squadron-massed-fire-rules.md',
    'wikis/squadrons-overview.md',
    'wikis/star-dragon.md',
    'wikis/starship-additional-components.md',
    'wikis/starship-additional-facilities.md',
    'wikis/starship-anatomy-detailed.md',
    'wikis/starship-attracting-attention.md',
    'wikis/starship-background-packages.md',
    'wikis/starship-bridge.md',
    'wikis/starship-combat-astropath-actions.md',
    'wikis/starship-combat-astropaths-navigators.md',
    'wikis/starship-combat-disrupting-empyrean.md',
    'wikis/starship-combat-navigator-actions.md',
    'wikis/starship-combat-rules.md',
    'wikis/starship-combat-warp-wake.md',
    'wikis/starship-construction.md',
    'wikis/starship-crew-numbers.md',
    'wikis/starship-crew-population-morale.md',
    'wikis/starship-crew-roles.md',
    'wikis/starship-critical-hits.md',
    'wikis/starship-destruction-rules.md',
    'wikis/starship-essential-components.md',
    'wikis/starship-fleet-actions.md',
    'wikis/starship-hulls-new.md',
    'wikis/starship-manoeuvrability.md',
    'wikis/starship-manoeuvre-rules.md',
    'wikis/starship-manoeuvre-variable.md',
    'wikis/starship-mustering-the-fleet.md',
    'wikis/starship-naval-discipline.md',
    'wikis/starship-npc-ship-damage.md',
    'wikis/starship-salvage-rules.md',
    'wikis/starship-serving-aboard.md',
    'wikis/starship-servitor-crew.md',
    'wikis/starship-shipboard-navigators.md',
    'wikis/starship-stripping-the-husk.md',
    'wikis/starship-structural-integrity.md',
    'wikis/starship-supplemental-components.md',
    'wikis/starship-tactical-cruising-speed.md',
    'wikis/starship-travel-non-combat.md',
    'wikis/starship-watches.md',
    'wikis/sword-frigates-of-triumph-squadron-sq.md',
    'wikis/table-npc-ship-critical-hits.md',
    'wikis/table-ork-capital-ship-upgrades.md',
    'wikis/table-percentage-roll-examples.md',
    'wikis/table-vehicle-critical-hits.md',
    'wikis/talents-descriptions.md',
    'wikis/talents-gaining.md',
    'wikis/talents-groups.md',
    'wikis/talents-prerequisites.md',
    'wikis/talon-squadron.md',
    'wikis/the-imperial-regiment.md',
    'wikis/the-role-of-fate.md',
    'wikis/torpedoes-and-critical-hits.md',
    'wikis/torpedoes-nova-cannons-and-launch-bays-replenishment.md',
    'wikis/travel-interplanetary-flight.md',
    'wikis/travel-interstellar-flight.md',
    'wikis/triumph-of-saint-drusus.md',
    'wikis/turbulent-class-heavy-frigate.md',
    'wikis/unit-air-forces-pl8.md',
    'wikis/unit-anti-air-forces.md',
    'wikis/unit-armour-pl7.md',
    'wikis/unit-artillery-pl6.md',
    'wikis/unit-cavalry-pl4.md',
    'wikis/unit-infantry-pl4.md',
    'wikis/unit-mechanised-infantry-pl5.md',
    'wikis/universe-class-mass-conveyor.md',
    'wikis/vehicle-aquila-lander.md',
    'wikis/vehicle-arvus-lighter.md',
    'wikis/vehicle-calixis-fury-interceptor.md',
    'wikis/vehicle-chiropteran-scout.md',
    'wikis/vehicle-drop-pod.md',
    'wikis/vehicle-gun-cutter.md',
    'wikis/vehicle-halo-barge.md',
    'wikis/vehicle-hephaestus-ore-seeker.md',
    'wikis/vehicle-land-speeder.md',
    'wikis/vehicle-rhino-apc.md',
    'wikis/vehicle-scout-bike.md',
    'wikis/vehicle-sentinel-walker.md',
    'wikis/vehicle-stormtrooper-detachment.md',
    'wikis/vehicle-venator-air-yacht.md',
    'wikis/vehicle-warbike.md',
    'wikis/vehicles-aerial-combat-attacking.md',
    'wikis/vehicles-aerial-combat.md',
    'wikis/vehicles-aerial-evasive-manoeuvring.md',
    'wikis/vehicles-aerial-floor-it.md',
    'wikis/vehicles-aerial-high-speed-chases.md',
    'wikis/vehicles-aerial-immelmann-turn.md',
    'wikis/vehicles-aerial-jink.md',
    'wikis/vehicles-aerial-ram.md',
    'wikis/vehicles-aerial-sideslip.md',
    'wikis/vehicles-aerial-speed-stall.md',
    'wikis/vehicles-aerial-tactical-manoeuvring.md',
    'wikis/vehicles-aerial-tight-turn.md',
    'wikis/vehicles-attacks.md',
    'wikis/vehicles-characteristics.md',
    'wikis/vehicles-classifications.md',
    'wikis/vehicles-combat-rules.md',
    'wikis/vehicles-crashes.md',
    'wikis/vehicles-damage-rules.md',
    'wikis/vehicles-driving-and-flying.md',
    'wikis/vehicles-movement.md',
    'wikis/vehicles-repair-rules.md',
    'wikis/vehicles-sample-list.md',
    'wikis/vehicles-shooting-weapons.md',
    'wikis/viper-class-scout-sloop.md',
    'wikis/void-dragon.md',
    'wikis/warp-drive-and-protection.md',
    'wikis/warp-drive-rules.md',
    'wikis/warp-engines-components.md',
    'wikis/warp-gellar-fields.md',
    'wikis/warp-imperial-space-travel.md',
    'wikis/warp-space-hulks.md',
    'wikis/warp-travel-navigation.md',
    'wikis/weapons-ammunition.md',
    'wikis/weapons-boarding-torpedoes.md',
    'wikis/weapons-chaos-components.md',
    'wikis/weapons-clanger-torpedo-tubes.md',
    'wikis/weapons-eldar-lances.md',
    'wikis/weapons-eldar.md',
    'wikis/weapons-force.md',
    'wikis/weapons-general.md',
    'wikis/weapons-guidance-modifications.md',
    'wikis/weapons-guided-torpedoes.md',
    'wikis/weapons-howler-cannons.md',
    'wikis/weapons-kroot-bow.md',
    'wikis/weapons-kroot-hunting-rifle.md',
    'wikis/weapons-kroot.md',
    'wikis/weapons-lances.md',
    'wikis/weapons-macrobatteries.md',
    'wikis/weapons-macroweaponry.md',
    'wikis/weapons-melee-chain.md',
    'wikis/weapons-melee-exotic.md',
    'wikis/weapons-melee-ork.md',
    'wikis/weapons-melee-overview.md',
    'wikis/weapons-nova-cannons.md',
    'wikis/weapons-ork-dethburna.md',
    'wikis/weapons-ork-eavy-gunz.md',
    'wikis/weapons-ork-gunz.md',
    'wikis/weapons-ork-kannonz.md',
    'wikis/weapons-ork-zzap-kannons.md',
    'wikis/weapons-ork.md',
    'wikis/weapons-power.md',
    'wikis/weapons-primitive.md',
    'wikis/weapons-rakgol.md',
    'wikis/weapons-ranged-archeotech.md',
    'wikis/weapons-ranged-bolt.md',
    'wikis/weapons-ranged-combi.md',
    'wikis/weapons-ranged-exotic.md',
    'wikis/weapons-ranged-flame.md',
    'wikis/weapons-ranged-las.md',
    'wikis/weapons-ranged-launchers.md',
    'wikis/weapons-ranged-melta.md',
    'wikis/weapons-ranged-overview.md',
    'wikis/weapons-ranged-plasma.md',
    'wikis/weapons-ranged-solid-projectile.md',
    'wikis/weapons-ranged-xenos.md',
    'wikis/weapons-roarer-beam.md',
    'wikis/weapons-seeking-torpedoes.md',
    'wikis/weapons-shock.md',
    'wikis/weapons-short-burn-torpedoes.md',
    'wikis/weapons-standard-guidance-systems.md',
    'wikis/weapons-stryxis.md',
    'wikis/weapons-systems-overview.md',
    'wikis/weapons-torpedo-types.md',
    'wikis/weapons-torpedoes.md',
    'wikis/weapons-turbo-batteries.md',
    'wikis/weapons-upgrades.md',
    'wikis/weapons-warheads-melta.md',
    'wikis/weapons-warheads-plasma.md',
    'wikis/weapons-warheads-virus.md',
    'wikis/weapons-warheads-vortex.md',
    'wikis/weapons-warheads.md',
    'wikis/wraithship.md',
  ];

  // ── Utilities ─────────────────────────────────────────────

  function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function stripMarkdown(md) {
    return md
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^\s*>\s+/gm, '')
      .trim();
  }

  /** Extract the filename stem (no path, no extension, no #anchor) for redirect matching */
  function fileStem(filePath) {
    return filePath.split('/').pop().replace(/\.md$/, '').toLowerCase();
  }

  // ── Index structure ───────────────────────────────────────
  // We build an array of "documents": each heading + its following text becomes one entry.

  /**
   * Parse a markdown file into sections:
   * [{ file, heading, headingSlug, level, text, plainText }]
   */
  function parseSections(filePath, mdText) {
    const lines    = mdText.split('\n');
    const sections = [];

    let currentHeading     = '';
    let currentHeadingSlug = '';
    let currentLevel       = 0;
    let bodyLines          = [];

    // Extract first H1/H2 as file title
    let fileTitle = fileStem(filePath).replace(/-/g, ' ');
    const titleMatch = mdText.match(/^#{1,2}\s+(.+)/m);
    if (titleMatch) fileTitle = titleMatch[1];

    function flush() {
      const text = bodyLines.join('\n').trim();
      sections.push({
        file:         filePath,
        fileTitle:    fileTitle,
        heading:      currentHeading,
        headingSlug:  currentHeadingSlug,
        level:        currentLevel,
        text:         text,
        plainText:    stripMarkdown(text),
      });
      bodyLines = [];
    }

    lines.forEach(function (line) {
      const hMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (hMatch) {
        flush();
        currentLevel       = hMatch[1].length;
        currentHeading     = hMatch[2].replace(/\*+/g, '').trim();
        currentHeadingSlug = slugify(currentHeading);
      } else {
        bodyLines.push(line);
      }
    });
    flush();

    return sections;
  }

  // ── Fuzzy match ───────────────────────────────────────────

  /**
   * Very lightweight fuzzy scorer.
   * Returns a score [0..1] where 1 = perfect match.
   */
  function fuzzyScore(query, text) {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    if (t.includes(q)) return 1; // exact substring
    let score = 0;
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) { score++; qi++; }
    }
    if (qi < q.length) return 0; // not all chars found in order
    return score / Math.max(t.length, q.length);
  }

  /**
   * Score a section against a query.
   * Returns a combined score weighted by title match vs body match.
   */
  function scoreSection(section, query) {
    const q = query.toLowerCase();

    // Heading / title match gets heavy weight
    const headingScore  = fuzzyScore(q, section.heading || section.fileTitle) * 4;
    const fileTitleScore = fuzzyScore(q, section.fileTitle) * 2;

    // Plain-text body match: check each sentence
    const sentences = section.plainText.split(/[.!?]\s+/);
    let bodyScore = 0;
    sentences.forEach(function (s) {
      const sc = fuzzyScore(q, s);
      if (sc > bodyScore) bodyScore = sc;
    });

    return headingScore + fileTitleScore + bodyScore;
  }

  // ── Exact search ──────────────────────────────────────────

  function exactScore(section, query) {
    const q = query.toLowerCase();
    const inHeading = (section.heading || '').toLowerCase().includes(q) ? 3 : 0;
    const inTitle   = section.fileTitle.toLowerCase().includes(q) ? 2 : 0;
    const inBody    = section.plainText.toLowerCase().includes(q) ? 1 : 0;
    return inHeading + inTitle + inBody;
  }

  // ── Snippet extraction ────────────────────────────────────

  function extractSnippet(text, query, maxLen) {
    maxLen = maxLen || 300;
    const lower = text.toLowerCase();
    const q     = query.toLowerCase();
    const idx   = lower.indexOf(q);
    let start   = 0;
    if (idx > 60) start = idx - 60;
    const snip = text.slice(start, start + maxLen);
    // Highlight matches
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapeHtml(snip).replace(re, '<mark>$1</mark>') + (snip.length >= maxLen ? '…' : '');
  }

  // ── Render results ────────────────────────────────────────

  function renderResults(results, query, isExact) {
    const container = document.getElementById('search-results');
    const status    = document.getElementById('search-status');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML =
        '<div class="search-no-results">' +
          '<p>No results found for <strong>"' + escapeHtml(query) + '"</strong></p>' +
          '<p style="margin-top:8px;font-size:0.8rem;">Try different keywords or check spelling.</p>' +
        '</div>';
      status.textContent = 'No results';
      return;
    }

    status.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '') +
      ' for "' + query + '"' + (isExact ? ' (exact match)' : ' (fuzzy match)');

    container.innerHTML = results.map(function (r) {
      const section  = r.section;
      const href     = 'wiki.html?file=' + encodeURIComponent(section.file) +
                       (section.headingSlug && section.level > 0 ? '#' + section.headingSlug : '');
      const titleStr = section.heading && section.level > 0
        ? section.fileTitle + ' › ' + section.heading
        : section.fileTitle;
      const snippet  = extractSnippet(section.plainText, query, 300);
      const sectionBadge = section.heading && section.level > 0
        ? '<span class="search-result-section">' + escapeHtml(section.heading) + '</span><br>'
        : '';

      return '<div class="search-result" onclick="window.location.href=\'' + href + '\'">' +
               '<div class="search-result-title">' + escapeHtml(titleStr) + '</div>' +
               '<div class="search-result-path">' + escapeHtml(section.file) + '</div>' +
               sectionBadge +
               '<div class="search-result-snippet">' + snippet + '</div>' +
             '</div>';
    }).join('');
  }

  // ── Auto-redirect ─────────────────────────────────────────
  // If query matches a heading ID or file stem exactly, redirect immediately.

  function tryAutoRedirect(query, index) {
    const q     = query.toLowerCase().trim();
    const qSlug = slugify(q);

    // 1. Exact file stem match
    for (let i = 0; i < WIKI_FILES.length; i++) {
      if (fileStem(WIKI_FILES[i]) === q || fileStem(WIKI_FILES[i]) === qSlug) {
        window.location.href = 'wiki.html?file=' + encodeURIComponent(WIKI_FILES[i]);
        return true;
      }
    }

    // 2. Exact heading match across all sections
    for (let i = 0; i < index.length; i++) {
      const s = index[i];
      if (s.heading && (s.heading.toLowerCase() === q || slugify(s.heading) === qSlug)) {
        const anchor = s.headingSlug ? '#' + s.headingSlug : '';
        window.location.href = 'wiki.html?file=' + encodeURIComponent(s.file) + anchor;
        return true;
      }
    }

    // 3. Exact file title match
    for (let i = 0; i < index.length; i++) {
      const s = index[i];
      if (s.fileTitle.toLowerCase() === q) {
        window.location.href = 'wiki.html?file=' + encodeURIComponent(s.file);
        return true;
      }
    }

    return false;
  }

  // ── Index loading ─────────────────────────────────────────

  let searchIndex = [];
  let loadedFiles = 0;
  let totalFiles  = 0;

  function loadIndex(onComplete) {
    totalFiles = WIKI_FILES.length;
    if (totalFiles === 0) { onComplete([]); return; }

    const status = document.getElementById('search-status');

    WIKI_FILES.forEach(function (filePath) {
      fetch(filePath)
        .then(function (r) {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        })
        .then(function (mdText) {
          const sections = parseSections(filePath, mdText);
          searchIndex = searchIndex.concat(sections);
        })
        .catch(function () {
          // File not found — add a placeholder so the file is known to exist
          searchIndex.push({
            file:         filePath,
            fileTitle:    fileStem(filePath).replace(/-/g, ' '),
            heading:      '',
            headingSlug:  '',
            level:        0,
            text:         '',
            plainText:    '',
          });
        })
        .finally(function () {
          loadedFiles++;
          if (status) {
            status.textContent = 'Indexing manuscripts… ' + loadedFiles + '/' + totalFiles;
          }
          if (loadedFiles >= totalFiles) {
            onComplete(searchIndex);
          }
        });
    });
  }

  // ── Run search ────────────────────────────────────────────

  function runSearch(query) {
    if (!query.trim()) return;

    // Detect exact mode: "quoted string"
    let isExact = false;
    let q = query.trim();
    if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith("'") && q.endsWith("'"))) {
      isExact = true;
      q = q.slice(1, -1);
    }

    const status = document.getElementById('search-status');
    if (status) status.textContent = 'Searching…';

    loadIndex(function (index) {
      // Auto-redirect check (case-insensitive, no quotes required)
      if (tryAutoRedirect(q, index)) return;

      // Score all sections
      const scored = index.map(function (section) {
        const score = isExact ? exactScore(section, q) : scoreSection(section, q);
        return { section: section, score: score };
      });

      // Filter and sort
      const results = scored
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 40); // cap results

      renderResults(results, q, isExact);
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    const input  = document.getElementById('search-input');
    const btn    = document.getElementById('search-btn');
    if (!input || !btn) return;

    // Check for ?q= in URL
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      input.value = qParam;
      runSearch(qParam);
    }

    // Search on button click
    btn.addEventListener('click', function () {
      runSearch(input.value);
    });

    // Search on Enter
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runSearch(input.value);
    });

    // Update URL on search
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const newUrl = 'search.html?q=' + encodeURIComponent(input.value.trim());
        history.replaceState(null, '', newUrl);
      }
    });

    btn.addEventListener('click', function () {
      const newUrl = 'search.html?q=' + encodeURIComponent(input.value.trim());
      history.replaceState(null, '', newUrl);
    });

    // Focus search input
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
