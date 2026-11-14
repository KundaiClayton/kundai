---
title: "Read less, listen more: how I stopped reading my work"
description: "Eye strain made reading my work painful. Text-to-speech wasn't enough, so I used AI to build a voice layer for GitHub and my agents in five days. This is version 1, and where it's heading: the AI prompts me, and I decide."
date: 2026-11-14
type: Essay
status: wip
tags: ["life", "accessibility"]
featured: true
published: true
slug: "read-less-listen-more"
---

*Version 1, November 2026. I'll keep updating this as the setup changes.*
## Why I needed this
I've been getting headaches and eye strain on and off. They show up when I push hard at work, and lately they've been getting worse. I'm not going into the medical side here. The short version is that reading has become hard for me, especially long text, and especially lots of things at once.
That's a problem, because my work is mostly reading. At Aakitech I'm a co-founder, and I work as an architect and an executive. I oversee a lot of projects and make a lot of decisions, so I have to stay on top of everything. Most of it happens on GitHub: issues, pull requests, reviews, mentions, across many repos.
AI made the pile bigger. I use Claude Code and Codex every day, and they produce a lot: long replies, plans, PRs to review. Every one of those is something I'm supposed to read and check. So I started asking myself whether I could keep up with my work by listening instead.
## What I tried first
I started with ElevenLabs, using the ElevenReader extension. I'd copy text or point it at a page and listen. The voice was good, and for articles it worked.
For work it didn't. On a GitHub issue it read everything on the page, including the buttons, labels and menus. It didn't summarise, so a long thread took forever. And I still had to find the page, click around and copy things, so I wasn't really looking at the screen less.
What I actually needed was something that sorts my work, tells me what matters in a few sentences, and lets me act on it without going back to the screen.
## Building it
I built it with Claude Code and Codex over about five days, 10 to 14 November. I'd describe what was bothering me, often by voice, test what came back, and say what was still wrong. I kept a log of every decision and every round of feedback, which kept me in charge of where it was going.
The first thing I did was count. I had 160 unread GitHub notifications. 93 of them were already merged or closed. Clearing those with one key took me down to 67, and that did more for me than any voice.
The first voice was the built-in Mac one, and I couldn't stand it. It was slow and robotic, and it didn't pause between sentences. Switching to Kokoro, a voice model that runs locally on my Mac, is what made me actually want to listen.
After that, every change came from using it. Agent replies talked over each other, so they went into a queue I play when I'm ready. I couldn't tell which project a reply came from, so each one now starts with the agent, project and thread. I wanted to answer the thread I'd just heard, so one key opens it and starts my dictation. I couldn't tell if a mention was from yesterday or two months ago, so every item now says when I was tagged, and the inbox is sorted by what's due and what's waiting on me.
## Version 1: my setup today
Most of it sits on tools I already use. I didn't want a new app, and I didn't want new bills while I'm still testing it, so it runs on my existing Claude and Codex subscriptions instead of paid API keys.
**GitHub inbox.** I open `listen inbox` and it gives me a short spoken brief: how many things need me, what's due soon, what's old. Then it reads items one at a time. I press a key to mark something done, open it, hand it to Claude or Codex, or turn it into a task.
**Claude Code and Codex.** When an agent finishes, I hear a chime and a counter goes up in my menu bar. I play the replies when I'm ready, as a short summary or in full. If one agent is close to its usage limit, I get told, and one key hands the work to the other.
**TickTick.** This is where my priorities and deadlines live, and it syncs with my calendar. I didn't build a new integration for it. It goes through the TickTick connection I already have in Codex. Today's tasks are part of my spoken brief, and from the inbox I can press `t` to turn a GitHub item into a TickTick task with a date.
**Dictation.** I already used Hex for dictation, so replying by voice just opens the right thread and starts Hex. Nothing is sent until I send it.
**Reading anything else.** If I need to read something in any app, I select it and press one key, and it's read to me in the same voice.
**Telegram.** I added a Telegram bot for my phone, which is Android. It sends inbox cards with buttons and agent replies as voice notes. Honestly, I haven't used it much yet. It's slower than I'd like, so I keep going back to the laptop. The bot runs on my Mac, so I also still need to figure out how well it works when I'm out and the Mac isn't with me.
## What's next
Version 2 starts with testing Telegram properly on the go, and getting it fast enough that I actually reach for it.
The bigger change is who starts the work. Right now I still prompt the AI and wait. What I'm working towards is the opposite: agents do the prep overnight, things like catch-up briefs, PR review notes and first drafts of issues. In the morning I get a short brief and a handful of decisions. I approve, edit by voice, or say no. The agents draft, and I send. Nothing goes out without me.
So instead of me prompting the AI, the AI prompts me, and I stay the person who makes the call. If that works for me, I'd like to bring it to the rest of the team at Aakitech, because they're dealing with the same amount of reading.
