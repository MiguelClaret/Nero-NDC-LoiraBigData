---
sidebar_position: 3
custom_edit_url: null
---

# Interface design

# SeedSafe Front-End Documentation

## Introduction
This section of the documentation presents the design philosophy behind the **SeedSafe** platform's front-end and how it was intentionally crafted to impact the daily experience of our key personas: the smallholder producer, the impact-focused investor, and the technical auditor. Rather than merely showcasing technical components, this section highlights the design thinking journey that shaped a simple, intuitive, and inclusive interface.

SeedSafe was built using a human-centered approach that emphasized empathy, progressive disclosure, and accessibility. The platform needed to be more than functional—it had to inspire trust, reduce barriers to blockchain adoption, and convey complex processes (like tokenization and carbon credit validation) in a digestible, non-intimidating way.

## Design Philosophy & Persona Impact

### Smallholder Producer
For the smallholder producer with limited digital literacy, the interface prioritizes clarity and gradual learning. We adopted progressive disclosure techniques that show information step-by-step, so the user isn’t overwhelmed. Key actions—like registering a harvest or understanding tokenization—are broken into simple forms with direct language and familiar analogies. Visual feedback, badges for sustainable practices, and delayed wallet creation mean the producer can interact with the platform confidently and without fear of making mistakes.

### Impact-Focused Investor
The investor persona seeks transparency and impact. To meet these expectations, the marketplace interface was designed with clean visuals, traceable metrics, and responsive modals that clearly outline fees and benefits. Trust is earned through clarity—pricing per kilogram, carbon credits earned, producer history, and embedded explanations ensure that every interaction supports informed decision-making. Instead of being forced to understand blockchain before exploring, the investor is invited to engage when ready, supported by a Paymaster system that hides technical complexity.

### Technical Auditor
The technical auditor needs precision without noise. Their dashboard isolates relevant data and simplifies what could otherwise be a deeply technical process. By offering a chatbot (AgroBot) capable of explaining token mechanics and validation logic, we reduce cognitive load and allow the auditor to focus on certifying credibility. The interface privileges structured presentation, trustable audit logs, and a step-by-step submission process.

## Key Screenshots and Visual Flow

### 1. Initial Landing Page
This is the first contact point for users. It presents the platform’s mission, value proposition, and a simplified introduction to Web3 without requiring login.


<p style={{textAlign: 'center'}}>Figure 1: Initial Landing Page</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/landing_page.png").default} style={{width: 800}} alt="Initial Landing Page" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>


### 2. Marketplace - Investor View
Allows the investor to explore tokenized crop offerings, understand their impact, and view relevant data.


<p style={{textAlign: 'center'}}>Figure 2: Marketplace Interface - Investor Perspective</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/marketplace.png").default} style={{width: 800}} alt="Marketplace Interface - Investor Perspective" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>


### 3. Purchase Modal - Investor Action
When an investor decides to invest, this modal summarizes the purchase process in a clear and intuitive way, with automated fee calculation and Paymaster sponsorship.

<p style={{textAlign: 'center'}}>Figure 3: Purchase Modal in Action</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/marketplace_buy.png").default} style={{width: 800}} alt="Purchase Modal in Action" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

### 4. Auditor Dashboard
Focused on objective analysis, this interface offers a professional and structured view to support technical validation tasks.

<p style={{textAlign: 'center'}}>Figure 4: Auditor Dashboard</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/auditorPage.png").default} style={{width: 800}} alt="Auditor Dashboard" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

## Persistent Support: AgroBot Chat Assistant
AgroBot is our embedded AI-powered assistant that lives at the bottom corner of every screen. It is designed to:

- Help users understand tokenization, carbon credits, and financing options.
- Guide newcomers through the platform with contextual tips.
- Clarify doubts without requiring external research.

This tool reduces the learning curve for all users—especially those new to blockchain—by making information accessible through conversation.

<p style={{textAlign: 'center'}}>Figure 5: AgroBot Chat Open on Screen Corner</p>
<div style={{margin: 15}}>
    <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/chatbot_open.png").default} style={{width: 800}} alt="AgroBot Chat Open on Screen Corner" />
        <br />
    </div>
</div>
<p style={{textAlign: 'center'}}>Source: Produced by the Authors (2025).</p>

## Interface as a Bridge
Throughout all screens, the interface works as a bridge between two worlds:

- **Traditional familiarity**: Fonts, layout, and interactions were chosen to resemble Web2 apps, easing adoption.
- **Web3 power**: Tokenization, AA wallet logic, and Paymaster gasless flows run silently in the background, surfacing only when relevant.

Animations, adaptive design, and contextual tips guide users without requiring prior blockchain knowledge. Our frontend doesn't expect users to adapt to technology—it adapts to them.

## Inclusive UX by Design
- **Non-blocking onboarding**: No wallet required to explore.
- **Progressive engagement**: Each persona reaches commitment points organically.
- **Contextual transitions**: Actions only appear when they make sense to the user’s journey.
- **Educational AI assistant**: AgroBot offers learning without judgment.

## Conclusion
SeedSafe's interface was not built to showcase tech—it was built to serve people. Every screen, interaction, and transition was crafted based on the stories, pains, and aspirations of real users. Through empathy and inclusive UX design, SeedSafe enables traditional producers, cautious investors, and precise auditors to thrive together in a decentralized, sustainable future.

This is what makes SeedSafe’s front-end truly impactful: not the code behind it, but the people it empowers.


