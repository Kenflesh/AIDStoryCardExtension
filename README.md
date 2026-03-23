# StoryCard Extension
Это простой скрипт для AI Dungeon, который позволяет исправить несколько серьёзных проблем Story Cards, которые делают это бесполезной и мёртвой механикой.

Какие есть проблемы у оригинальной системы?
1. Всё завязано на Triggers. Если ты не назвал что-то, для ИИ это не существует, даже если у тебя 400 карточек, результата будет 0, ИИ просто не будет знать о их существовании, и не будет вспоминать самостоятельно.
2. Оно обязано вводиться в чат или выводиться ИИ, чтобы попасть в контекст. До тех пор информации из карточек всё так же не существует, даже если прямые слова триггеры написать в Plot Essentials или Author's Note.
3. Карточки - не более чем справочник информации, который сам по себе ничего не делает. Даже если ты прямым текстом скажешь что враг существует, ИИ подумает "Ну существует и существует, даже упоминать не буду, вместо этого опишу запах". И всё потому что у него нет инструкции как-то внедрять это в контекст, он просто ставит жирную расшифровку слова-триггера и не более.
4. После прямогоупоминания карточки ИИ спустся уже пару ходов ИИ начнёт забываться, из-за чего, если тебе необходимо использовать какую-то информацию больше чем 1 ход, тебе придётся писать это каждый ход, что просто невыносимо.

Все эти проблемы не решались никак и никем, заставляя меня страдать. Даже знаменитый и чуть ли не обязательный для всех игроков Auto-Cards от LewdLeah никак не решал эти проблемы и становился просто бесполезным грузом: даже когда её скрипт генерировал тебе карточку, ты ничего не получал, потому что карточка продолжала лежать мёртвым грузом из-за системы Triggers.

# Что делает мой скрипт?
Всё очень просто: он добавляет в контекст эти карточки, чтобы они перестали быть мёртвым грузом. ИИ начинает о них вспоминать, знать их или буквально вызывать адаптируя обстоятельства как в карточке.
Из-за простого добавления в контекст ничего не ломается, и появляется возможность их разумного использования.

В текущий момент есть следующие функции:
1. Система Events - вызов карточки с описанным тобой событием с каким-то шансом, когда событие срабатывает, сюжет начинает подстраиваться под него. Для этого ты можешь создать карточку с типом Event (В Type выбираешь Custom, и там вводишь Event), дать название и описание, например "Твоё оружие ломается". В Triggers ты можешь написать weight=5 (5 в этом случае - в 5 раз чаще чем ивенты с weight 1 (если не указать, оно равно 1) и duration=5 (кол-во ходов, во время которых ИИ будет думать что этот ивент происходит, полезно если он должен быть затянут.
2. Вспоминание StoryCard - при каждом ходе с шансом ИИ вспоминает одну из карточек, и пытается добавить её в контекст. Для этого надо либо поставить useOnlyAutouseCards=false (все карточки ивентов смогут попадаться), либо в нужных тебе, о которых иногда будет вспоминать ИИ, написать в Triggers слово autouse.
3. Держание в контексте - ты можешь написать в alwaysIncludeCards название карточек, например alwaysIncludeCards = ["Castle","Demon Lord"] и тогда твой ИИ будет всегда держать эти данные в контексте, при этом не надо будет копировать тот же самый текст из карточек в разделы Plot Essentials или Author's Note, и не надо писать никакое слово Trigger. Они всегда вызваны, и ИИ всегда их видит как World Info.

Благодаря этому все твои карточки перестают быть бесполезным хламом который не работает, ты можешь разнообразить своё приключение заставляя их напрямую создавать действия в твоём приключении и сам ИИ не будет забывать те карточки, которые ты считаешь важным. Всё это значительно преобразует систему StoryCard, отвязывая её от ненавистных мной Triggers, она начинает пассивно работать на твои приключения и давать тебе разнообразие.

Всё это легко настраивается, легко используется, никак не мешает приключению если ты не используешь этот скрипт, не засоряет контекст бесполезной информацией, не ворует контекст генерации ответа на что-то другое (как делают Auto-Cards и InnerSelf которым необходимо тратить часть генерации контента на то, что нужно лично им), не ломает вывод нейросети и работает самостоятельно как только ты что-то настроил.

Я считаю что подобное обязано быть в каждом сценарии без исключений (это подойдёт буквально куда угодно от реальных приключений до nsfw), и не понимаю почему никто это не реализовал до сих пор.

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
