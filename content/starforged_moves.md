# Starforged — Moves (Section 1)

> Extracted verbatim from `docs/Starforged_Reference_Guide.pdf`, pages 5–26 ("Section 1: Moves" through the page before "Section 2: Oracles"). Text is transcribed as-is; only markup (headings, bullets, tables, bold, color-tagging) has been reconstructed from the PDF's font/fill-color metadata. Nothing has been paraphrased or invented.

## Formatting & color legend (extracted from PDF metadata)

Unlike the Ironsworn compendium, **Starforged color-codes each move category** with a distinct accent, extracted directly from the vector-fill colors behind each category's section header/sidebar in the source PDF:

| Category | Hex | Swatch source |
|---|---|---|
| Session Moves | `#3F8C8A` | teal — section header fill, p.10 |
| Adventure Moves | `#206087` | blue — section header fill, p.11–12 |
| Quest Moves | `#805A90` | purple — section header fill, p.13 |
| Connection Moves | `#4A5791` | indigo — section header fill, p.14 |
| Exploration Moves | `#427FAA` | cyan-blue — section header fill, p.15–16 |
| Combat Moves | `#818992` | slate gray — section header fill, p.17–18 |
| Suffer Moves | `#883529` | brick red — section header fill, p.19–20 |
| Recover Moves | `#488B44` | green — section header fill, p.21–22 |
| Threshold Moves | `#1D1D1B` | near-black — section header fill, p.23 |
| Legacy Moves | `#4F5A69` | dark slate-blue — section header fill, p.24 |
| Fate Moves | `#8F477B` | magenta — section header fill, p.25–26 |

Neutral / structural palette (used across all categories):

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#1D1D1B` | Body text |
| `paper` | `#FFFFFF` | Page background |
| `accent-red` | `#CA181A` | Starforged signature red — rules callouts / emphasis glyphs |
| `stripe-light` | `#DDE2E8` | Table row stripe / sidebar card fill |
| `stripe-mid` | `#B7C3CF` | Secondary table stripe / rule lines |

Typography:
- **Display font** "Poster Gothic Round ATF" → move titles and category banners, all-caps in the original. Category banners render in white-on-accent-color; move titles render in ink-on-white.
- **Body font** "Proxima Nova Condensed" → paragraph text. `Extrabold` variant is used for the *trigger clause* of each move and for the **strong hit / weak hit / miss** outcome labels; `Regular` for the rest of the prose; `Semibold`/`Bold` appear in tables and callouts.
- Bullet glyph in source: `✴` (four-point star, set in Minion Pro) → rendered below as `-`.
- Sidebars (light-gray card, `stripe-light` fill) contain flavor/procedural asides next to a category's moves — reproduced below as blockquotes.
- *Editorial addition, not in source:* move names are italicized here (e.g. *Pay the Price*) whenever one move's text references another move, purely to make cross-linking easy for a UI build. The original PDF does **not** italicize these — it keeps them in regular weight.

---

## A–Z Moves Index

| Move | Category | Reference Guide p. | Rulebook p. |
|---|---|---|---|
| Advance | Legacy | 23 | 225 |
| Aid Your Ally | Adventure | 11 | 152 |
| Ask the Oracle | Fate | 24 | 229 |
| Battle | Combat | 17 | 197 |
| Begin a Session | Session | 9 | 141 |
| Change Your Fate | Session | 9 | 143 |
| Check Your Gear | Adventure | 11 | 153 |
| Clash | Combat | 16 | 193 |
| Companion Takes a Hit | Suffer | 18 | 204 |
| Compel | Adventure | 10 | 150 |
| Confront Chaos | Exploration | 15 | 177 |
| Continue a Legacy | Legacy | 23 | 226 |
| Develop Your Relationship | Connection | 13 | 164 |
| Earn Experience | Legacy | 23 | 224 |
| End a Session | Session | 9 | 145 |
| Endure Harm | Suffer | 18 | 200 |
| Endure Stress | Suffer | 18 | 202 |
| Enter the Fray | Combat | 16 | 188 |
| Explore a Waypoint | Exploration | 14 | 174 |
| Face Danger | Adventure | 10 | 147 |
| Face Death | Threshold | 22 | 217 |
| Face Defeat | Combat | 17 | 196 |
| Face Desolation | Threshold | 22 | 218 |
| Finish an Expedition | Exploration | 14 | 178 |
| Forge a Bond | Connection | 13 | 166 |
| Forsake Your Vow | Quest | 12 | 160 |
| Fulfill Your Vow | Quest | 12 | 158 |
| Gain Ground | Combat | 16 | 190 |
| Gather Information | Adventure | 10 | 149 |
| Heal | Recover | 20 | 210 |
| Hearten | Recover | 20 | 211 |
| Lose Momentum | Suffer | 18 | 199 |
| Make a Connection | Connection | 13 | 163 |
| Make a Discovery | Exploration | 15 | 176 |
| Overcome Destruction | Threshold | 22 | 220 |
| Pay the Price | Fate | 25 | 232 |
| Reach a Milestone | Quest | 12 | 157 |
| React Under Fire | Combat | 16 | 191 |
| Repair | Recover | 21 | 214 |
| Resupply | Recover | 20 | 212 |
| Sacrifice Resources | Suffer | 19 | 205 |
| Secure an Advantage | Adventure | 10 | 148 |
| Set a Course | Exploration | 14 | 180 |
| Set a Flag | Session | 9 | 142 |
| Sojourn | Recover | 20 | 209 |
| Strike | Combat | 16 | 192 |
| Swear an Iron Vow | Quest | 12 | 156 |
| Take a Break | Session | 9 | 144 |
| Take Decisive Action | Combat | 17 | 194 |
| Test Your Relationship | Connection | 13 | 165 |
| Undertake an Expedition | Exploration | 14 | 169 |
| Withstand Damage | Suffer | 19 | 206 |

*For details on making moves, see Chapter 3 (page 136) of the Starforged rulebook. You can review an expanded summary for each move using the rulebook page references in the table above.*

---

## Moves Quick Reference

**"WHEN YOU…"**
This is a move trigger. When you do this thing, or encounter this situation, make the move.

**"ROLL +[STAT/METER/OTHER]"**
This is the basic action roll. Most action rolls are made by adding the value of a stat to your action die. Moves may indicate a stat you should use, such as "roll +iron." If it doesn't, or gives you a choice, use the stat that best fits the situation and your approach.

Some moves and asset abilities will prompt you to use a condition meter or other value instead of a stat.

**"ADD +X"**
Add this value to your action die. For most action rolls, your action die + stat + adds is your final action score. If you gain multiple prompts to "add +x" for a single action, those bonuses stack.

**"TAKE +X"**
Add this number to the indicated meter. For example, "take +2 momentum" tells you to add 2 to your current momentum meter.

Your assets may offer additional bonuses for a move. Unless stated otherwise, this bonus is added to anything else you gain as a result of the action. If you take +2 momentum as part of a move, and you are aided by an asset that tells you to "take +1 momentum" on the same move, you gain a total of +3 momentum.

Some common move terms are detailed below. For a more complete glossary of terms, see page 124.

**"MARK PROGRESS"**
When a move or asset ability prompts you to mark progress, check the rank of the challenge and fill in the appropriate number of boxes or ticks in your progress track.

If a move prompts you to mark progress, and you have an asset ability that also instructs you to mark progress for that action, you may mark progress again. In other words, "mark progress" stacks. Every instance of progress earned within the same action allows you to mark the appropriate number of boxes or ticks per the rank of the challenge.

**"MARK PROGRESS TWICE"**
If a move or asset ability prompts you to "mark progress twice," mark double the number of ticks or boxes per the rank of the challenge. For example, marking progress twice on a troublesome challenge would mean marking 6 boxes (instead of 3). Any additional instances of "mark progress" in the same action stack on top of this reward.

**"PROGRESS MOVE"**
This is a special type of move to resolve the outcome of a goal or challenge. When you make a progress move, tally the number of filled boxes on your progress track as your progress score. Only add fully filled boxes (those with four ticks). Then, roll your challenge dice, compare to your progress score, and resolve a strong hit, weak hit, or miss as normal.

You may not burn momentum on this roll, and you are not affected by negative momentum. In addition, assets abilities do not affect progress rolls unless they define a specific benefit for a progress move.

---

## Session Moves `#3F8C8A`

### BEGIN A SESSION
**When you begin a significant session or chapter of play**, do all of the following.
- Identify or adjust flagged content and *Set a Flag*.
- Review or recap what happened last session.
- Set the scene by envisioning your character's current situation and intent.

In addition, you may spotlight a new danger, opportunity, or insight. This can include a scene hidden from your character's perspective. If you do, envision a brief vignette (you may roll or choose on the table below for inspiration). Then, all players take +1 momentum as you return to play from the viewpoint of your characters.

| Roll | Result |
|---|---|
| 1–10 | Flashback reveals an aspect of your background or nature |
| 11–20 | Flashback reveals an aspect of another character, place, or faction |
| 21–30 | Influential character or faction is introduced or given new detail |
| 31–40 | Seemingly unrelated situations are shown to be connected |
| 41–50 | External factors create new danger, urgency, or importance for a quest |
| 51–60 | Important character is put in danger or suffers a misadventure |
| 61–70 | Key location is made unsafe or becomes mired in conflict |
| 71–80 | Unexpected return of an enemy or threat |
| 81–90 | Peril lies ahead or lurks just out of view |
| 91–100 | Unforeseen aid is on the way or within reach |

### SET A FLAG
**When you identify situations or topics you don't want to include, don't want to envision in detail, or otherwise may need mindfulness when approaching**, that content is now flagged.

When you encounter content flagged as something to approach mindfully, pause to consider or discuss its role in your story. When you come across flagged content that you would rather adjust or omit, *Change Your Fate*.

### CHANGE YOUR FATE
**When you encounter flagged content, reject an oracle, resist a consequence, or otherwise need to shift your circumstances within the game for your comfort or enjoyment**, pause and identify what needs to be changed. Choose as many options as appropriate.
- Reframe: This didn't happen the way you first thought. Envision the moment from another perspective in a way that diminishes or changes the content.
- Refocus: This is not the most important thing happening right now. Envision how the spotlight shifts to change the focus.
- Replace: This happens but with a small adjustment. Switch out an element and envision how this new detail changes the scenario.
- Redirect: Adjust the trajectory to involve a helping hand. Envision how another person or party becomes involved.
- Reshape: The situation changes completely. Envision what happened instead.

### TAKE A BREAK
**When you resolve a progress move or complete an intense scenario**, take a few deep breaths and take some time to attend to the needs of your body. Reflect on what just happened and how it made you feel. Then, choose one.
- Move on: Continue the session. You or an ally may add +1 on the next move (not a progress move), bolstered by your reflection and past experiences.
- Stop for now: *End a Session*.

### END A SESSION
**When you end a significant session or chapter of play**, reflect on the events of the game and identify any missed opportunities to mark progress.
- If you strengthened your ties to a connection, *Develop Your Relationship*.
- If you moved forward on a quest, *Reach a Milestone*.

If there is a quest, connection, or other situation you would like to give focus in your next session, make note of it and take +1 momentum.

---

## Adventure Moves `#206087`

> **Sidebar** — The adventure moves encompass broadly useful actions to overcome obstacles, reinforce your position, conduct investigations, influence others, and support your fellow protagonists. When you face a peril or try to gain leverage, and another move does not apply, you'll likely find your answer among these moves.

### FACE DANGER
**When you attempt something risky or react to an imminent threat**, envision your action and roll. If you act…
- With speed, mobility, or agility: **Roll +edge**
- With resolve, command, or sociability: **Roll +heart**
- With strength, endurance, or aggression: **Roll +iron**
- With deception, stealth, or trickery: **Roll +shadow**
- With expertise, focus, or observation: **Roll +wits**

**On a strong hit**, you are successful. Take +1 momentum.

**On a weak hit**, you succeed, but not without a cost. Make a suffer move (-1).

**On a miss**, you fail, or a momentary success is undermined by a dire turn of events. *Pay the Price*.

### SECURE AN ADVANTAGE
**When you assess a situation, make preparations, or attempt to gain leverage**, envision your action and roll. If you act…
- With speed, mobility, or agility: **Roll +edge**
- With resolve, command, or sociability: **Roll +heart**
- With strength, endurance, or aggression: **Roll +iron**
- With deception, stealth, or trickery: **Roll +shadow**
- With expertise, focus, or observation: **Roll +wits**

**On a hit**, you succeed. **On a strong hit**, take both. **On a weak hit**, choose one.
- Take +2 momentum
- Add +1 on your next move (not a progress move)

**On a miss**, you fail or your assumptions betray you. *Pay the Price*.

### GATHER INFORMATION
**When you search for clues, conduct an investigation, analyze evidence, or do research**, roll +wits.

**On a strong hit**, you discover something helpful and specific. The path you must follow or action you must take to make progress is made clear. Envision what you learn. Then, take +2 momentum.

**On a weak hit**, the information provides new insight, but also complicates your quest. Envision what you discover. Then, take +1 momentum.

**On a miss**, your investigation unearths a dire threat or reveals an unwelcome truth that undermines your quest. *Pay the Price*.

### COMPEL
**When you try to persuade someone or make them an offer**, envision your approach. If you…
- Charm, pacify, encourage, or barter: **Roll +heart**
- Threaten or incite: **Roll +iron**
- Lie or swindle: **Roll +shadow**

**On a strong hit**, they'll do what you want or agree to your conditions. Take +1 momentum.

**On a weak hit**, as above, but their agreement comes with a demand or complication. Envision their counteroffer.

**On a miss**, they refuse or make a demand that costs you greatly. *Pay the Price*.

### AID YOUR ALLY
**When you act in direct support of an ally**, envision how you aid them. Then, *Secure an Advantage* or *Gain Ground* to take action. If you score a hit, they (instead of you) take the benefits of the move.

If you *Gain Ground* and score a strong hit, you are both in control. On a weak hit, your ally is in control but you are in a bad spot.

### CHECK YOUR GEAR
**When you check to see if you have a specific helpful item or resource**, roll +supply.

**On a strong hit**, you have it, and are ready to act. Take +1 momentum.

**On a weak hit**, you have it, but must choose one.
- Your supply is diminished: *Sacrifice Resources* (-1)
- It's not quite right, and causes a complication or delay: *Lose Momentum* (-2)

**On a miss**, you don't have it and the situation grows more perilous. *Pay the Price*.

---

## Quest Moves `#805A90`

### SWEAR AN IRON VOW
**When you swear upon iron to complete a quest**, write your vow and give it a rank. Then, roll +heart. If you swear this vow to a connection, add +1; if you share a bond, add +2.

**On a strong hit**, you are emboldened and it is clear what you must do next. Take +2 momentum.

**On a weak hit**, you are determined but begin your quest with more questions than answers. Take +1 momentum, and envision what you do to find a path forward.

**On a miss**, you must overcome a significant obstacle before you begin your quest. Envision what stands in your way.

### REACH A MILESTONE
**When you make headway in your quest by doing any of the following**…
- overcoming a critical obstacle
- gaining meaningful insight
- completing a perilous expedition
- acquiring a crucial item or resource
- earning vital support
- defeating a notable foe

…you may mark progress per the rank of the vow.

### FULFILL YOUR VOW
*Progress Move*

**When you reach the end of your quest**, roll the challenge dice and compare to your progress.

**On a strong hit**, your vow is fulfilled. Mark a reward on your quests legacy track per the vow's rank: troublesome=1 tick; dangerous=2 ticks; formidable=1 box; extreme=2 boxes; epic=3 boxes. Any allies who shared this vow also mark the reward.

**On a weak hit**, as above, but there is more to be done or you realize the truth of your quest. If you *Swear an Iron Vow* to set things right, take your full legacy reward. Otherwise, make the legacy reward one rank lower (none for a troublesome quest).

**On a miss**, your vow is undone through an unexpected complication or realization. Envision what happens and choose one.
- Give up on the quest: *Forsake Your Vow*.
- Recommit to the quest: Roll both challenge dice, take the lowest value, and clear that number of progress boxes. Then, raise the vow's rank by one (if not already epic).

### FORSAKE YOUR VOW
**When you renounce your quest, betray your promise, or the goal is lost to you**, clear the vow.

Then, envision the impact of this failure and choose one or more as appropriate to the nature of the vow. Any allies who shared this vow may also envision a cost.
- You are demoralized or dispirited: *Endure Stress*
- A connection loses faith: *Test Your Relationship* when you next interact.
- You must abandon a path or resource: Discard an asset.
- Someone else pays a price: Envision how a person, being, or community bears the cost of the failure.
- Someone else takes advantage: Envision how an enemy gains power.
- Your reputation suffers: Envision how this failure marks you.

---

## Connection Moves `#4A5791`

### MAKE A CONNECTION
**When you search out a new relationship or give focus to an existing relationship (not an ally or companion)**, roll +heart.

**On a strong hit**, you create a connection. Give them a role and rank. Whenever your connection aids you on a move closely associated with their role, add +1 and take +1 momentum on a hit.

**On a weak hit**, as above, but this connection comes with a complication or cost. Envision what they reveal or demand.

**On a miss**, you don't make a connection and the situation worsens. *Pay the Price*.

### DEVELOP YOUR RELATIONSHIP
**When you reinforce your relationship with a connection by doing any of the following**…
- swearing a vow to undertake a perilous quest in their service
- completing a quest to their benefit
- leveraging their help in desperate circumstances
- giving them something of worth
- sharing a profound moment
- standing with them against hardship
- overcoming a test of your relationship

…you may mark progress per the rank of the connection.

If you already share a bond with the connection, do not mark progress. Instead, roll +their rank to learn the impact on your legacy: troublesome=+1; dangerous=+2; formidable=+3; extreme=+4; epic=+5. On a strong hit, mark 2 ticks on your bonds legacy track. On a strong hit with a match, you may also envision how recent events bolstered your connection's standing and raise their rank by one (if not already epic). On a weak hit, take +2 momentum. On a miss, take no lasting benefit.

### TEST YOUR RELATIONSHIP
**When your relationship with a connection is tested through conflict, betrayal, or circumstance**, roll +heart. If you share a bond, add +1.

**On a strong hit**, *Develop Your Relationship*.

**On a weak hit**, *Develop Your Relationship*, but also envision a demand or complication as a fallout of this test.

**On a miss**, or if you have no interest in maintaining this relationship, choose one.
- Lose the connection: Envision how this impacts you and *Pay the Price*.
- Prove your loyalty: Envision what you offer or what they demand, and *Swear an Iron Vow* (formidable or greater) to see it done. Until you complete the quest, take no benefit for the connection. If you refuse or fail, the connection is permanently undone.

### FORGE A BOND
*Progress Move*

**When your relationship with a connection is ready to evolve**, roll the challenge dice and compare to your progress.

**On a strong hit**, you now share a bond. Mark a reward on your bonds legacy track per the connection's rank: troublesome=1 tick; dangerous=2 ticks; formidable=1 box; extreme=2 boxes; epic=3 boxes. Any allies who share this connection also mark the reward. Then, choose one.
- Bolster their influence: When they aid you on a move closely associated with their role, add +2 instead of +1.
- Expand their influence: Give them a second role. When they aid you on a move closely associated with either role, add +1 and take +1 momentum on a hit.

**On a weak hit**, as above, but they ask something more of you first. To gain the bond and the legacy reward, envision the nature of the request, and do it (or *Swear an Iron Vow* to see it done).

**On a miss**, they reveal a motivation or background that puts you at odds. If you recommit to this relationship, roll both challenge dice, take the lowest value, and clear that number of progress boxes. Then, raise the connection's rank by one (if not already epic).

---

## Exploration Moves `#427FAA`

### UNDERTAKE AN EXPEDITION
**When you trailblaze a route through perilous space, journey over hazardous terrain, or survey a mysterious site**, give the expedition a name and rank.

Then, for each segment of the expedition, envision your approach. If you…
- Move at speed: **Roll +edge**
- Keep under the radar: **Roll +shadow**
- Stay vigilant: **Roll +wits**

**On a strong hit**, you reach a waypoint. Envision the location and mark progress per the rank of the expedition.

**On a weak hit**, as above, but this progress costs you. Choose one.
- Suffer costs en route: Make a suffer move (-2), or two suffer moves (-1).
- Face a peril at the waypoint: Envision what you encounter.

**On a miss**, you are waylaid by a crisis, or arrive at a waypoint to confront an immediate hardship or threat. Do not mark progress, and *Pay the Price*.

### EXPLORE A WAYPOINT
**When you divert from an expedition to examine a notable location**, roll +wits.

**On a strong hit**, choose one. On a strong hit with a match, you may instead *Make a Discovery*.
- Find an opportunity: Envision a favorable insight, situation, resource, or encounter. Then, take +2 momentum.
- Gain progress: Mark progress on your expedition, per its rank.

**On a weak hit**, you uncover something interesting, but it is bound up in a peril or reveals an ominous aspect of this place. Envision what you encounter. Then, take +1 momentum.

**On a miss**, you encounter an immediate hardship or threat, and must *Pay the Price*. On a miss with a match, you may instead *Confront Chaos*.

### FINISH AN EXPEDITION
*Progress Move*

**When your expedition comes to an end**, roll the challenge dice and compare to your progress.

**On a strong hit**, you reach your destination or complete your survey. Mark a reward on your discoveries legacy track per expedition's rank: troublesome=1 tick; dangerous=2 ticks; formidable=1 box; extreme=2 boxes; epic=3 boxes. Any allies who shared this expedition also mark the reward.

**On a weak hit**, as above, but you face an unforeseen complication at the end of your expedition. Make the legacy reward one rank lower (none for a troublesome expedition), and envision what you encounter.

**On a miss**, your destination is lost to you, or you come to understand the true nature or cost of the expedition. Envision what happens and choose one.
- Abandon the expedition: Envision the cost of this setback and *Pay the Price*.
- Return to the expedition: Roll both challenge dice, take the lowest value, and clear that number of progress boxes. Then, raise the expedition's rank by one (if not already epic).

### SET A COURSE
**When you follow a known route through perilous space, across hazardous terrain, or within a mysterious site**, roll +supply.

**On a strong hit**, you reach your destination and the situation there favors you. Take +1 momentum.

**On a weak hit**, you arrive, but face a cost or complication. Choose one.
- Suffer costs en route: Make a suffer move (-2), or two suffer moves (-1).
- Face a complication at the destination: Envision what you encounter.

**On a miss**, you are waylaid by a significant threat, and must *Pay the Price*. If you overcome this obstacle, you may push on safely to your destination.

### MAKE A DISCOVERY
**When your exploration of a waypoint uncovers something wondrous**, roll on the table below or choose one. Then, envision the nature of the discovery and how it is revealed. When you first experience or engage with the discovery, you and your allies may mark two ticks on your discoveries legacy track.

| Roll | Discovery |
|---|---|
| 1–4 | Advanced technology waiting to be harnessed or salvaged |
| 5–9 | Ancient archive or message |
| 10–12 | Artificial consciousness evolved to a higher state |
| 13–17 | Clues to a crucial resource or uncharted domain |
| 18–20 | Envoy from another time or reality |
| 21–24 | Extraordinary natural phenomenon |
| 25–27 | First contact with intelligent life |
| 28–32 | Gateway to another time or alternate reality |
| 33–36 | Key to unlocking a language or method of communication |
| 37–41 | Lost or hidden people |
| 42–45 | Majestic or unusual lifeforms |
| 46–50 | Marvel of ancient engineering |
| 51–53 | Miraculously preserved artifact or specimen |
| 54–58 | Monumental architecture or artistry of an ancient civilization |
| 59–63 | Mysterious device or artifact of potential value |
| 64–68 | New understanding of an enduring mystery |
| 69–72 | Pathway or means of travel to a distant location |
| 73–77 | Person or lifeform with phenomenal abilities |
| 78–82 | Place of awe-inspiring beauty |
| 83–87 | Rare and valuable resource |
| 88–92 | Safeguarded or idyllic location |
| 93–96 | Visions or prophesies of the future |
| 97–100 | Roll twice |

### CONFRONT CHAOS
**When your exploration of a waypoint uncovers something dreadful**, decide the number of aspects: one, two, or three. Roll that number of times or choose that number of aspects on the table below. Then, envision how the encounter begins.

For each result, when you first confront that aspect within the scope of the encounter, you and your allies may mark one tick on your discoveries legacy track.

| Roll | Aspect |
|---|---|
| 1–4 | Baneful weapon of mass destruction |
| 5–9 | Cataclysmic environmental effects |
| 10–12 | Dead given unnatural life |
| 13–17 | Destructive lifeform of monstrous proportion |
| 18–20 | Dread hallucinations or illusions |
| 21–24 | Harbingers of an imminent invasion |
| 25–27 | Horde of insatiable hunger or fury |
| 28–32 | Horrific lifeforms of inscrutable purpose |
| 33–36 | Impostors in human form |
| 37–41 | Machines made enemy |
| 42–45 | Malignant contagion or parasite |
| 46–50 | Messenger or signal with a dire warning |
| 51–53 | Passage to a grim alternate reality |
| 54–58 | People corrupted by chaos |
| 59–63 | Powerful distortions of time or space |
| 64–68 | Signs of an impending catastrophe |
| 69–72 | Site of a baffling disappearance |
| 73–77 | Site of a horrible disaster |
| 78–82 | Site of terrible carnage |
| 83–87 | Technology nullified or made unstable |
| 88–92 | Technology warped for dark purpose |
| 93–96 | Vault of dread technology or power |
| 97–100 | Worshipers of great and malevolent powers |

---

## Combat Moves `#818992`

> **Sidebar** — In a fight, your character is in one of two positions: in control or in a bad spot. If you are in control, you can make proactive moves such as *Gain Ground* and *Strike*. When in a bad spot, you must make reactive moves such as *React Under Fire* and *Clash*. The outcome of a combat move will describe your current position.
>
> When you make a move that doesn't define your position (such as a suffer move), follow these guidelines: **On a strong hit**, you are in control. **On a weak hit or miss**, you are in a bad spot.

### ENTER THE FRAY
**When you initiate combat or are forced into a fight**, envision your objective and give it a rank. If the combat includes discrete challenges or phases, set an objective with a rank for each.

Then, roll to see if you are in control. If you are…
- On the move: **Roll +edge**
- Facing off against your foe: **Roll +heart**
- In the thick of it at close quarters: **Roll +iron**
- Preparing to act against an unaware foe: **Roll +shadow**
- Caught in a trap or sizing up the situation: **Roll +wits**

**On a strong hit**, take both. **On a weak hit**, choose one.
- Take +2 momentum
- You are in control

**On a miss**, the fight begins with you in a bad spot.

### GAIN GROUND
**When you are in control and take action in a fight to reinforce your position or move toward an objective**, envision your approach and roll. If you are…
- In pursuit, fleeing, or maneuvering: **Roll +edge**
- Charging boldly into action, coming to the aid of others, negotiating, or commanding: **Roll +heart**
- Gaining leverage with force, powering through, or making a threat: **Roll +iron**
- Hiding, preparing an ambush, or misdirecting: **Roll +shadow**
- Coordinating a plan, studying a situation, or cleverly gaining leverage: **Roll +wits**

**On a hit**, you stay in control. **On a strong hit**, choose two. **On a weak hit**, choose one.
- Mark progress
- Take +2 momentum
- Add +1 on your next move (not a progress move)

**On a miss**, your foe gains the upper hand, the fight moves to a new location, or you encounter a new peril. You are in a bad spot and must *Pay the Price*.

### REACT UNDER FIRE
**When you are in a bad spot and take action in a fight to avoid danger or overcome an obstacle**, envision your approach and roll. If you are…
- In pursuit, fleeing, dodging, getting back into position, or taking cover: **Roll +edge**
- Remaining stalwart against fear or temptation: **Roll +heart**
- Blocking or diverting with force, or taking the hit: **Roll +iron**
- Moving into hiding or creating a distraction: **Roll +shadow**
- Changing the plan, finding a way out, or cleverly bypassing an obstacle: **Roll +wits**

**On a strong hit**, you succeed and are in control. Take +1 momentum.

**On a weak hit**, you avoid the worst of the danger or overcome the obstacle, but not without a cost. Make a suffer move (-1). You stay in a bad spot.

**On a miss**, the situation worsens. You stay in a bad spot and must *Pay the Price*.

### STRIKE
**When you are in control and assault a foe at close quarters**, roll +iron; when you attack at a distance, roll +edge.

**On a strong hit**, mark progress twice. You dominate your foe and stay in control.

**On a weak hit**, mark progress twice, but you expose yourself to danger. You are in a bad spot.

**On a miss**, the fight turns against you. You are in a bad spot and must *Pay the Price*.

### CLASH
**When you are in a bad spot and fight back against a foe at close quarters**, roll +iron; when you exchange fire at a distance, roll +edge.

**On a strong hit**, mark progress twice. You overwhelm your foe and are in control.

**On a weak hit**, mark progress, but you are dealt a counterblow or setback. You stay in a bad spot and must *Pay the Price*.

**On a miss**, your foe dominates this exchange. You stay in a bad spot and must *Pay the Price*.

### TAKE DECISIVE ACTION
*Progress Move*

**When you seize an objective in a fight**, envision how you take decisive action. Then, roll the challenge dice and compare to your progress.

If you are in control, check the result as normal. If you are in a bad spot, count a strong hit without a match as a weak hit, and a weak hit as a miss.

**On a strong hit**, you prevail. Take +1 momentum. If any objectives remain and the fight continues, you are in control.

**On a weak hit**, you achieve your objective, but not without cost. Roll on the table below or choose one. If the fight continues, you are in a bad spot.

| Roll | Cost |
|---|---|
| 1–40 | It's worse than you thought: Make a suffer move (-2) |
| 41–52 | Victory is short-lived: A new peril or foe appears |
| 53–64 | You face collateral damage: Something is lost, damaged, or broken |
| 65–76 | Others pay the price: Someone else suffers the cost |
| 77–88 | Others won't forget: You are marked for vengeance |
| 89–100 | It gets complicated: The true nature of a foe or objective is revealed |

**On a miss**, you are defeated or your objective is lost. *Pay the Price*.

### FACE DEFEAT
**When you abandon or are deprived of an objective**, envision the consequence of this failure, clear the objective, and *Pay the Price*. If the fight continues, you may create a new objective and give it a rank to represent the changing situation. If any objectives remain, the fight continues and you are in a bad spot.

### BATTLE
**When you fight a battle and it happens in a blur**, envision your objective and roll. If you primarily…
- Fight at range, or using your speed and the environment to your advantage: **Roll +edge**.
- Fight depending on your courage, leadership, or companions: **Roll +heart**.
- Fight in close to overpower your foe: **Roll +iron**.
- Fight using trickery to befuddle your foe: **Roll +shadow**.
- Fight using careful tactics to outsmart your foe: **Roll +wits**.

**On a strong hit**, you achieve your objective unconditionally. You and any allies who joined the battle may take +2 momentum.

**On a weak hit**, you achieve your objective, but not without cost. *Pay the Price*.

**On a miss**, you are defeated or the objective is lost. *Pay the Price*.

---

## Suffer Moves `#883529`

> **Sidebar** — When you bear the brunt of a failed action or make a concession, the suffer moves help resolve the cost. These moves are typically made when you must *Pay the Price* and face a hardship that directly impacts your well-being and readiness, or as prompted by a move or asset.
>
> If you mark an impact as an outcome of a suffer move, reduce your max momentum and momentum reset.
>
> **Max Momentum** — Your max momentum is reduced by 1 for each marked impact. For example, one impact will drop your max momentum to +9. Three impacts will reduce it to +7.
>
> **Momentum Reset** — If you have one marked impact, your momentum reset is +1 (instead of +2). If you have more than one marked impact, your momentum reset is 0 (instead of +2).

### LOSE MOMENTUM
**When you are delayed or disadvantaged**, suffer -1 momentum for a minor setback, -2 for a serious setback, or -3 for a major setback.

When your momentum is at its minimum (-6) and you must suffer -momentum, choose one.
- Envision how the price is paid and apply the cost to a different suffer move.
- Envision how this undermines your progress on a vow, expedition, connection, or combat. Then, clear 1 unit of progress on that track per its rank: troublesome=3 boxes; dangerous=2 boxes; formidable=1 box; extreme=2 ticks; epic=1 tick.

### ENDURE HARM
**When you face physical injury, fatigue, or illness**, suffer -1 health for minor harm, -2 for serious harm, or -3 for major harm. If your health is 0, *Lose Momentum* equal to any remaining harm.

Then, if your health is 0 or you choose to resist the harm, roll +health or +iron, whichever is higher.

**On a strong hit**, choose one.
- Shake it off: If you are not wounded, take +1 health
- Embrace the pain: Take +1 momentum

**On a weak hit**, if you are not wounded, you may *Lose Momentum* (-1) in exchange for +1 health. Otherwise, press on.

**On a miss**, it's worse than you thought. Suffer an additional -1 health or *Lose Momentum* (-2). If your health is 0, you must also mark wounded or permanently harmed, or roll on the table below.

| Roll | Result |
|---|---|
| 1–10 | You suffer mortal harm. *Face Death*. |
| 11–20 | You are dying. Within an hour or two, you must *Heal* and raise your health above 0, or *Face Death*. |
| 21–35 | You are unconscious and out of action. If left alone, you come back to your senses in an hour or two. If you are vulnerable to ongoing harm, *Face Death*. |
| 36–50 | You are reeling. If you engage in any vigorous activity before taking a breather, roll on this table again (before resolving the other move). |
| 51–100 | You are still standing. |

### ENDURE STRESS
**When you face mental strain, shock, or despair**, suffer -1 spirit for minor stress, -2 for serious stress, or -3 for major stress. If your spirit is 0, *Lose Momentum* equal to any remaining stress.

Then, if your spirit is 0 or you choose to resist the stress, roll +spirit or +heart, whichever is higher.

**On a strong hit**, choose one.
- Shake it off: If you are not shaken, take +1 spirit
- Embrace the darkness: Take +1 momentum

**On a weak hit**, if you are not shaken, you may *Lose Momentum* (-1) in exchange for +1 spirit. Otherwise, press on.

**On a miss**, it's worse than you thought. Suffer an additional -1 spirit or *Lose Momentum* (-2). If your spirit is 0, you must also mark shaken or traumatized, or roll on the table below.

| Roll | Result |
|---|---|
| 1–10 | You are overwhelmed. *Face Desolation*. |
| 11–25 | You give up. *Forsake Your Vow*. |
| 26–50 | You give in to fear or compulsion, and act against your better instincts. |
| 51–100 | You persevere. |

### COMPANION TAKES A HIT
**When your companion faces physical hardship**, they suffer -1 health for minor harm, -2 for serious harm, or -3 for major harm. If your companion's health is 0, *Lose Momentum* equal to any remaining harm.

Then, if their health is 0 or you choose to test their resilience, roll +your companion's health.

**On a strong hit**, your companion rallies. Give them +1 health.

**On a weak hit**, if your companion's health is not 0, you may *Lose Momentum* (-1) and give them +1 health. Otherwise, they press on.

**On a miss**, it's worse than you thought. They suffer an additional -1 health or you *Lose Momentum* (-2). If your companion's health is 0, they are out of action until given aid. If their health is 0 and you rolled a miss with a match on this move, they are dead or destroyed; discard the asset.

### SACRIFICE RESOURCES
**When you lose or consume resources**, suffer -1 supply for a minor loss, -2 for a serious loss, or -3 for a major loss.

If your supply is exhausted (reduced to 0), mark unprepared. When you suffer a loss of resources while unprepared, envision how this causes you hardship and apply the cost to a different suffer move.

### WITHSTAND DAMAGE
**When your vehicle faces a damaging situation or environment**, suffer -1 integrity for minor damage, -2 for serious damage, or -3 for major damage. If your integrity is 0, *Lose Momentum* equal to any remaining damage.

Then, if your integrity is 0 or you choose to resist the damage, roll +integrity.

**On a strong hit**, choose one.
- Bypass: If your vehicle is not battered, take +1 integrity
- Ride it out: Take +1 momentum

**On a weak hit**, if your vehicle is not battered, you may *Lose Momentum* (-1) in exchange for +1 integrity. Otherwise, press on.

**On a miss**, it's worse than you thought. Suffer an additional -1 integrity or *Lose Momentum* (-2). If your integrity is 0, also suffer a cost according to the vehicle type.
- Command vehicle: Mark the vehicle as battered or cursed, mark a module as broken, destroy a broken module by discarding it, or roll on the table below. If the command vehicle is destroyed, *Overcome Destruction*.
- Support vehicle: Mark the vehicle as battered or roll on the table below. If the vehicle is destroyed, discard the asset.
- Incidental vehicle: Roll on the table below.

| Roll | Result |
|---|---|
| 1–10 | Immediate catastrophic destruction. All aboard must *Endure Harm* or *Face Death*, as appropriate. |
| 11–25 | Destruction is imminent and unavoidable. If you do not have the means or intention to get clear, *Endure Harm* or *Face Death*, as appropriate. |
| 26–40 | Destruction is imminent, but can be averted if you *Repair* your vehicle and raise its integrity above 0. If you fail, see 11–25. |
| 41–55 | You cannot *Repair* this vehicle until you *Resupply* and obtain a crucial replacement part. If you roll this result again prior to that, see 11–25. |
| 56–70 | The vehicle is crippled or out of your control. To get it back in action, you must *Repair* and raise its integrity above 0. |
| 71–85 | It's a rough ride. All aboard must make the *Endure Harm*, *Endure Stress*, or *Companion Takes a Hit* move, suffering a serious (-2) cost. |
| 86–95 | You've lost fuel, energy, or cargo. *Sacrifice Resources* (-2). |
| 96–100 | Against all odds, the vehicle holds together. |

---

## Recover Moves `#488B44`

### SOJOURN
**When you spend time recovering within a community**, roll +heart.

**On a strong hit**, this is a safe refuge. You and your allies may each choose two recover moves: *Heal*, *Hearten*, *Repair*, or *Resupply*. Instead of rolling, assume an automatic strong hit for each. An individual move can be taken more than once.

**On a weak hit**, as above, but time is short or resources are strained. You and your allies each make one recover move instead of two, with no more than three moves total among the group.

**On a miss**, choose one.
- The community needs your help, or makes a costly demand in exchange for safe harbor. Envision what they ask of you. If you do it, or *Swear an Iron Vow* to see it done, resolve this move as a strong hit.
- You find no relief, and the situation grows worse. *Pay the Price*.

### HEAL
**When you receive medical care or provide treatment**, envision the situation and roll. If you…
- Receive treatment from someone (not an ally): **Roll +iron**
- Mend your own wounds: **Roll +iron or +wits**, whichever is lower
- Obtain treatment for a companion: **Roll +heart**
- Provide care: **Roll +wits**

**On a strong hit**, the care is helpful. If you (or the ally under your care) are wounded, clear the impact and take or give +2 health. Otherwise, take or give +3 health.

**On a weak hit**, as above, but the recovery costs extra time or resources. Choose one: *Lose Momentum* (-2) or *Sacrifice Resources* (-2).

**On a miss**, the aid is ineffective and the situation worsens. *Pay the Price*.

### HEARTEN
**When you socialize, share intimacy, or find a moment of peace**, roll +heart.

**On a strong hit**, you find companionship or comfort and your spirit is strengthened. If you are shaken, clear the impact and take +1 spirit. Otherwise, take +2 spirit. If you make this move as you *Sojourn*, take +1 more.

**On a weak hit**, as above, but this indulgence is fleeting. Envision an interruption, complication, or inner conflict. Then, *Lose Momentum* (-1).

**On a miss**, you take no comfort and the situation worsens. *Pay the Price*.

### RESUPPLY
**When you attempt to bolster your readiness**, envision the opportunity and your approach. If you…
- Barter or make an appeal: **Roll +heart**
- Threaten or seize: **Roll +iron**
- Steal or swindle: **Roll +shadow**
- Scavenge or craft: **Roll +wits**

**On a strong hit**, choose one.
- If you are unprepared, clear the impact and take +1 supply. Otherwise, take +2 supply.
- If you are in need of a specific item or resource that can reasonably be obtained, you acquire it. Take +1 momentum.

**On a weak hit**, as above, but you must first deal with a cost, complication, or demand. Envision the nature of this obstacle.

**On a miss**, you encounter an unexpected peril. *Pay the Price*.

### REPAIR
> **Sidebar** — When you *Repair* and score a hit, you gain repair points. This is a limited resource used only within the scope of the move to prioritize and make repairs. The amount of repair points you earn varies according to the situation and the outcome of the move, per the included table.
>
> **At a Facility** — Access to a well-equipped location suited to making repairs, such as a dockyard or repair shop.
>
> **In the Field** — On your own in the depths of space, on a remote planet, or in a community that lacks equipment and infrastructure.
>
> **Under Fire** — In the midst of a crisis, such as in combat, navigating a hazardous environment, under extreme time pressure, or dealing with life-and-death mechanical failures.

**When you make repairs to your vehicles, modules, mechanical companions, or other devices**, envision the situation and roll. If you…
- Make your own repairs, or direct a companion to make repairs: **Roll +wits**
- Obtain repairs from someone (not an ally): **Roll +supply**

**On a hit**, you gain repair points as appropriate to the situation, per the table below. Additionally, you may *Sacrifice Resources* and exchange each -1 of supply for 1 extra repair point (up to 3 points).

| Situation | Strong Hit | Weak Hit |
|---|---|---|
| At a facility | 5 points | 3 points |
| In the field | 3 points | 1 point |
| Under fire | 2 points | 0 points |

Spend repair points as follows. Unused points are discarded.
- Clear the battered impact on a vehicle: 2 points
- Fix one broken module: 2 points
- Take +1 integrity on a vehicle: 1 point
- Take +1 health for a mechanical companion: 1 point
- Repair any other device: 3 points
- Repair any other device, but with a complication or malfunction: 2 points

**On a miss**, the repairs are not made and the situation worsens. *Pay the Price*.

---

## Threshold Moves `#1D1D1B`

### FACE DEATH
**When you encounter a situation where death is an immediate and unavoidable outcome**, you are dead. When you are instead brought to the brink of death with a chance for recovery or redemption, roll +heart.

**On a strong hit**, you are cast back into the mortal world.

**On a weak hit**, choose one.
- You die, but not before making a noble sacrifice. Envision your final moments.
- There is more to be done. Envision what is revealed or asked of you at death's door, and *Swear an Iron Vow* to complete an extreme quest. You return to the mortal world and must mark doomed. When you complete the death-bound quest, clear the impact.

**On a miss**, you are dead.

### FACE DESOLATION
**When you are brought to the brink of desolation**, roll +heart.

**On a strong hit**, you resist and press on.

**On a weak hit**, choose one.
- Your spirit breaks, but not before you make a noble sacrifice. Envision your final moments.
- You see a vision of a dreaded event coming to pass. Envision that dark future, and *Swear an Iron Vow* to prevent it through an extreme quest. You return to your senses and must mark tormented. When you complete the soul-bound quest, clear the impact.

**On a miss**, you succumb to despair or horror and are lost.

### OVERCOME DESTRUCTION
*Progress Move*

**When your command vehicle is destroyed or irrevocably lost**, you must discard the asset, along with any modules and docked support vehicles.

If you survive, you may use your connections to replace some of what was lost. To learn the cost, roll the challenge dice and compare to the progress on your bonds legacy track.

**On a strong hit**, you may call in a favor. This comes without conditions.

**On a weak hit**, you owe someone. You must mark indebted and *Swear an Iron Vow* to complete an extreme quest in their service. When you complete the duty-bound quest, clear the impact.

**On a miss**, as with the weak hit result, but this quest is against your nature, forces you to *Forsake Your Vow* on another quest, or is in the service of an enemy.

If you accept the cost, take 1 experience for every marked ability on the discarded assets (minimum 3 experience). Spend this experience only on a new command vehicle, modules, and support vehicles.

---

## Legacy Moves `#4F5A69`

### EARN EXPERIENCE
**When you fill a box (four ticks) on any legacy track**, take 2 experience. This experience may be spent when you *Advance*.

Once you completely fill the tenth box on any legacy track, clear that track. You may start again marking progress on the cleared track, but earn experience at a reduced rate of 1 experience (instead of 2) for each filled progress box. If you make a progress roll against this track, resolve the outcome as if at 10 progress.

### ADVANCE
**When you develop your abilities, improve your resources, gain a reward, or boost your influence**, you may spend 3 experience to add a new asset, or 2 experience to upgrade an asset. Choose from the following categories as appropriate to your focus and opportunities.
- Module: Upgrade your command vehicle
- Support Vehicle: Acquire or improve a secondary vehicle
- Path: Bolster your personal capabilities or follow a new calling
- Companion: Gain or improve a trusted helper
- Deed: Learn from your experiences or build a legacy

### CONTINUE A LEGACY
*Progress Move*

**When you retire from your life as Ironsworn, or succumb to death or desolation**, you may create a new character in your established setting. If you do, roll the challenge dice and compare to each of the former character's legacy tracks: quests, bonds, and discoveries (one roll per track).

For each strong hit, choose one from below, or one from the weak hit or miss options.
- Follow their path: Take one path or companion asset from the former character (at no cost), including any marked abilities.
- Share a connection: Take one connection from the former character, including any accrued progress or bond benefits.
- Accept an inheritance: Take the former character's command vehicle and one module or support vehicle (at no cost), including any marked abilities.

For each weak hit, choose one from below, or one from the miss options.
- See it through: Choose one of the former character's unfinished quests, and *Swear an Iron Vow* (with an automatic strong hit) to see it done. You may immediately mark up to half their earned progress (round down) on this quest.
- Rebuild a connection: Name one of the former character's connections, and envision how time or circumstances have changed them in a dramatic way. When you *Make a Connection* with them, take an automatic strong hit and mark two ticks on your bonds legacy track.
- Explore familiar ground: Name a location that was meaningful to the former character. When you first visit that place, envision how it has changed or is endangered. Then, mark two ticks on your discoveries legacy track.

For each miss, choose one.
- Deal with the aftermath: Envision how one of your former character's foes has gained power or influence.
- Switch loyalties: Envision how you begin in opposition to your former character's beliefs, goals, or allegiances.
- Open Pandora's Box: Envision how an advancement or discovery has unleashed unexpectedly dire consequences.

---

## Fate Moves `#8F477B`

### ASK THE ORACLE
**When you seek to resolve questions, reveal details, discover locations, determine how other characters respond, or trigger encounters or events**, you may…
- Draw a conclusion: Decide the answer based on the most interesting and obvious result.
- Spark an idea: Use an oracle table or other random prompt.
- Ask a yes/no question: Decide the odds of a yes, and roll on the table below to check the answer.
- Pick two: Envision two options. Rate one as likely, and roll on the table below to see if it is true. If not, it is the other.

| Odds | The answer is yes if you roll… |
|---|---|
| Small Chance | 10 or less |
| Unlikely | 25 or less |
| 50/50 | 50 or less |
| Likely | 75 or less |
| Almost Certain | 90 or less |

On a match, envision an extreme result or twist.

> **Sidebar** — In solo or co-op play, *Ask the Oracle* when you have a question about the outcome of an action, an aspect of your setting, or a narrative event.
>
> A match on your oracle dice when rolling on the yes/no table indicates an extreme result, interesting twist, or dramatic complication.
>
> In guided play, the guide is the oracle. When the players pose a question or a situation creates uncertainty, the guide can decide an answer, *Ask the Oracle* for inspiration, or turn the question back to the players.

### PAY THE PRICE
**When you suffer the outcome of an action**, choose one.
- Make the most obvious negative outcome happen.
- *Ask the Oracle* for inspiration. Interpret the answer as a hardship or complication appropriate to the situation.
- Roll on the table below. If the result doesn't fit the situation, roll again.

| Roll | Price |
|---|---|
| 1–2 | A trusted individual or community acts against you |
| 3–4 | An individual or community you care about is exposed to danger |
| 5–7 | You encounter signs of a looming threat |
| 8–10 | You create an opportunity for an enemy |
| 11–14 | You face a tough choice |
| 15–18 | You face the consequences of an earlier choice |
| 19–22 | A surprising development complicates your quest |
| 23–26 | You are separated from something or someone |
| 27–32 | Your action causes collateral damage or has an unintended effect |
| 33–38 | Something of value is lost or destroyed |
| 39–44 | The environment or terrain introduces a new hazard |
| 45–50 | A new enemy is revealed |
| 51–56 | A friend, companion, or ally is in harm's way (or you are, if alone) |
| 57–62 | Your equipment or vehicle malfunctions |
| 63–68 | Your vehicle suffers damage |
| 69–74 | You waste resources |
| 75–81 | You are harmed |
| 82–88 | You are stressed |
| 89–95 | You are delayed or put at a disadvantage |
| 96–100 | Roll twice |

> **Sidebar** — Make the *Pay the Price* move when prompted by another move due to a negative outcome, or when the current situation naturally leads to a cost through your choices or actions.
>
> To determine the cost when you *Pay the Price*, you may decide the outcome yourself, *Ask the Oracle* for insight, or roll on the included table. In guided play, look to the guide for a ruling.
>
> The price you pay can be a narrative consequence that complicates things for your character, or a combination of a narrative and mechanical cost. But be mindful of pacing; don't drop the hammer after one bad roll. Start with lesser complications and consequences appropriate to the situation, and apply escalating danger and hardships if the failures stack up.

---

*(End of Section 1: Moves. The source PDF continues into "Section 2: Oracles" and "Section 3: Codex" — Core Oracles, Space Encounters, Planets, Settlements, Starships, Characters, Creatures, Factions, Derelicts, Precursor Vaults, Location Themes, Misc Oracles, Rules Summary, Clocks, Scene Challenges, Glossary — which are outside the scope of this moves-only extraction.)*
