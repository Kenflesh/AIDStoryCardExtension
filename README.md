# StoryCard Extension

A simple script for AI Dungeon that fixes several major issues with Story Cards, which otherwise make the mechanic largely useless.

## Problems With the Original System

1. Everything relies on triggers. If something is not explicitly named, it effectively does not exist for the AI. Even if you have hundreds of cards, the AI will not acknowledge them unless a trigger appears in the text.

2. Information only enters the context when it appears in the chat or the AI output. Until then, the information stored in cards effectively does not exist, even if trigger words are written in Plot Essentials or Author's Note.

3. Story Cards function only as a reference. Even if you explicitly state that an enemy exists, the AI may simply ignore it because there is no instruction telling it how to incorporate that information into the narrative.

4. After a card is triggered, the AI often forgets about it within a few turns. If the information must remain relevant for longer than one turn, it must be repeatedly reintroduced, which quickly becomes frustrating.

## What This Script Does

This script solves these problems by inserting selected Story Cards directly into the context. As a result, the AI can remember them, reference them naturally, or incorporate them into the story when appropriate.

Because the script only injects context rather than altering core mechanics, it does not break the generation system and allows cards to be used in a more flexible and intelligent way.

## Features

### 1. Event System

The script can trigger Story Cards as events with a configurable probability. When an event triggers, the narrative begins adapting to the event described in the card.

To create an event:

- Create a Story Card
- Set **Type** to **Custom**
- Enter `Event` as the custom type
- Provide a title and description (for example: "Your weapon breaks")

Optional trigger parameters:

- `weight=5` — the event will appear five times more often than events with weight 1
- `duration=5` — the number of turns during which the AI will treat the event as active

### 2. Story Card Recall

On each turn, the script may randomly recall one of your Story Cards and insert it into the context.

Two modes are available:

- Set `useOnlyAutouseCards=false` to allow all cards to be selected
- Add the trigger `autouse` to specific cards if you want only certain cards to be eligible

### 3. Persistent Context Cards

You can force specific cards to always remain in the context.

Example configuration: alwaysIncludeCards = ["Castle", "Demon Lord"]


The AI will always keep these cards in memory without requiring trigger words or manual duplication of the information in Plot Essentials or Author's Note.

## Why This Matters

With this system, Story Cards stop being passive data that rarely affects the story. Instead, they actively influence the narrative by:

- introducing events
- reminding the AI about relevant world information
- keeping important lore in memory

This transforms Story Cards from a static reference system into a dynamic storytelling tool.

## Why should you include this script in your scenario?
The script is lightweight, configurable, and does not interfere with normal gameplay if you choose not to use specific features. It does not pollute the context with unnecessary data and does not consume generation output for internal scripting tasks.

## Script Installation Guide

Enabling scripts in AI Dungeon is straightforward. If you have never done it before, do not worry—the process is simpler than it may sound.

### Step‑by‑Step Installation

1. Open your scenario in **AI Dungeon**.
2. Click **Edit Scenario**.
3. Open the **DETAILS** tab.
4. Scroll down to the **Scripting** section.
5. Enable the option **Scripts Enabled**.
6. Click **EDIT SCRIPTS**.

You will see several script files in the editor:

- **Library**
- **Input**
- **Context**
- **Output**

For each of these files, do the following:

1. Open the corresponding script file from this repository.
2. Copy its contents.
3. Paste the contents into the matching editor file in AI Dungeon.

Example:

- Copy the contents of `Library.js` → paste into **Library**
- Copy the contents of `Input.js` → paste into **Input**
- Copy the contents of `Context.js` → paste into **Context**
- Copy the contents of `Output.js` → paste into **Output**

After inserting the contents of all files, click the **Save** button located in the **top‑right corner** of the script editor.

Once saved, the script will be active and you can immediately start your adventure.

### Using Multiple Scripts Together

If you want to combine this script with other AI Dungeon scripts, read the comments inside the files.

Comments are marked with `//` and are located primarily in the **Context** and **Library** files. These comments explain how to merge scripts safely and how the systems interact.

Reading those comments should provide enough information to integrate multiple scripts without breaking functionality.
Once installed, the script will automatically begin working according to its configuration.
