// Approved afternoon script. Route conditions preserve earlier player choices.
export const chapterTwoAfternoon={
  "c2Lunch": {
    "title": "Something better than eggs",
    "place": "summer-lunch",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "After fixing my hair and changing, I head downstairs."
      },
      {
        "speaker": "",
        "text": "Rowan is setting a bowl of rice on the table."
      },
      {
        "speaker": "",
        "text": "There’s fried tilapia between our plates and a little bowl of sliced kamatis beside it."
      },
      {
        "speaker": "You",
        "text": "I thought we were having eggs."
      },
      {
        "speaker": "",
        "text": "He looks at the fish."
      },
      {
        "speaker": "Rowan",
        "text": "Found something better."
      },
      {
        "speaker": "You",
        "text": "You made all this?"
      },
      {
        "speaker": "Rowan",
        "text": "No, I invited someone over while you were upstairs."
      },
      {
        "speaker": "You",
        "text": "Okay, fine."
      },
      {
        "speaker": "",
        "text": "He pulls out a chair with his foot."
      },
      {
        "speaker": "Rowan",
        "text": "Come on. Eat."
      },
      {
        "speaker": "",
        "text": "I sit and take a small piece of fish."
      },
      {
        "speaker": "",
        "text": "He tries not to watch me taste it. Tries."
      },
      {
        "speaker": "You",
        "text": "Lola really did teach you."
      },
      {
        "speaker": "Rowan",
        "text": "Is that good?"
      },
      {
        "speaker": "You",
        "text": "Yes, Ro. It’s good."
      },
      {
        "speaker": "Rowan",
        "text": "Okay. Just checking."
      },
      {
        "speaker": "",
        "text": "He sits across from me."
      },
      {
        "speaker": "Rowan",
        "text": "When Mama started working longer hours, I had to learn something."
      },
      {
        "speaker": "You",
        "text": "You could’ve survived on noodles."
      },
      {
        "speaker": "Rowan",
        "text": "I tried. Lola found out."
      },
      {
        "speaker": "You",
        "text": "Oh, you were done."
      },
      {
        "speaker": "Rowan",
        "text": "She came over with groceries."
      },
      {
        "speaker": "",
        "text": "I laugh."
      },
      {
        "speaker": "You",
        "text": "Of course she did."
      },
      {
        "speaker": "",
        "text": "For a while, we just eat. The tomatoes taste the way I remember."
      },
      {
        "speaker": "You",
        "text": "You spent a lot of time with her, huh?"
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. I’d come over after work sometimes. Help with whatever she needed."
      },
      {
        "speaker": "",
        "text": "He picks a bone out of his fish."
      },
      {
        "speaker": "Rowan",
        "text": "She’d feed me whether I helped or not."
      },
      {
        "speaker": "You",
        "text": "That sounds like her."
      },
      {
        "speaker": "Rowan",
        "text": "She used to ask what you’d want to eat when you came back."
      },
      {
        "speaker": "",
        "text": "My spoon stops. He notices."
      },
      {
        "speaker": "Rowan",
        "text": "Sorry."
      },
      {
        "speaker": "You",
        "text": "No. It’s okay."
      },
      {
        "speaker": "",
        "text": "I look down at my plate."
      },
      {
        "speaker": "",
        "text": "I’ve been walking around her house, sleeping in her room, eating at her table."
      },
      {
        "speaker": "",
        "text": "I still haven’t visited her grave."
      },
      {
        "speaker": "You",
        "text": "Hey, Ro?"
      },
      {
        "speaker": "Rowan",
        "text": "Hmm?"
      },
      {
        "speaker": "You",
        "text": "Could we visit Lola today?"
      },
      {
        "speaker": "",
        "text": "He puts his spoon down."
      },
      {
        "speaker": "You",
        "text": "Her grave. I haven’t been yet."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. Of course."
      },
      {
        "speaker": "You",
        "text": "Would you come with me?"
      },
      {
        "speaker": "Rowan",
        "text": "If you want me there."
      },
      {
        "speaker": "You",
        "text": "I do."
      },
      {
        "speaker": "",
        "text": "He nods, then glances at the shopping bags beside the door."
      },
      {
        "speaker": "Rowan",
        "text": "I need to run to the market first. Is that okay? We can go after."
      },
      {
        "speaker": "You",
        "text": "What do you need?"
      },
      {
        "speaker": "Rowan",
        "text": "Mama asked me to pick up a few things."
      },
      {
        "speaker": "",
        "text": "He takes another bite."
      },
      {
        "speaker": "Rowan",
        "text": "And I should probably stop at the workshop."
      }
    ],
    "choices": [
      {
        "text": "Sure. I’ll wait for you.",
        "next": "c2Wait",
        "set": {
          "afternoonRoute": "wait",
          "graveTogether": true,
          "workshopVisited": false
        }
      },
      {
        "text": "Can I come with you?",
        "next": "c2Market",
        "set": {
          "afternoonRoute": "market",
          "graveTogether": true,
          "workshopVisited": true
        }
      },
      {
        "text": "Actually, I think I’d rather go alone.",
        "next": "c2AloneGrave",
        "set": {
          "afternoonRoute": "alone",
          "graveTogether": false,
          "workshopVisited": true
        }
      }
    ],
    "cgCue": {
      "key": "summer-lunch",
      "from": "After fixing my hair and changing, I head downstairs."
    }
  },
  "c2Wait": {
    "title": "A little time at home",
    "place": "living",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "Rowan",
        "text": "Okay. Might take a couple of hours. I need to drop Mama’s things off too."
      },
      {
        "speaker": "You",
        "text": "That’s fine. We’ve got the afternoon."
      },
      {
        "speaker": "",
        "text": "He reaches for a dish."
      },
      {
        "speaker": "You",
        "text": "Finish eating first."
      },
      {
        "speaker": "Rowan",
        "text": "I am."
      },
      {
        "speaker": "You",
        "text": "You just tried to clear the table."
      },
      {
        "speaker": "",
        "text": "He looks at the dish in his hand and puts it back."
      },
      {
        "speaker": "Rowan",
        "text": "Right."
      },
      {
        "speaker": "You",
        "text": "There’s no rush."
      },
      {
        "speaker": "Rowan",
        "text": "Okay."
      },
      {
        "speaker": "",
        "text": "I take another spoonful of rice."
      },
      {
        "speaker": "You",
        "text": "I’ll find something to do."
      },
      {
        "speaker": "Rowan",
        "text": "Please don’t reorganize the kitchen."
      },
      {
        "speaker": "You",
        "text": "Why would I do that?"
      },
      {
        "speaker": "Rowan",
        "text": "You said you were bored yesterday and started moving things."
      },
      {
        "speaker": "You",
        "text": "One chair."
      },
      {
        "speaker": "Rowan",
        "text": "And then another chair."
      },
      {
        "speaker": "You",
        "text": "They looked better there."
      },
      {
        "speaker": "Rowan",
        "text": "I walked into one."
      },
      {
        "speaker": "You",
        "text": "That sounds like a you problem."
      },
      {
        "speaker": "",
        "text": "He shakes his head, smiling."
      },
      {
        "speaker": "",
        "text": "After lunch, he picks up the shopping bags."
      },
      {
        "speaker": "Rowan",
        "text": "You’ll be okay?"
      },
      {
        "speaker": "You",
        "text": "Ro. I’m staying in the house."
      },
      {
        "speaker": "Rowan",
        "text": "I know."
      },
      {
        "speaker": "You",
        "text": "I’ll call if I need anything."
      },
      {
        "speaker": "Rowan",
        "text": "Okay. I’ll call out when I’m back."
      },
      {
        "speaker": "",
        "text": "He starts down the steps, then checks his pocket for his phone."
      },
      {
        "speaker": "",
        "text": "I watch until he reaches the gate."
      },
      {
        "speaker": "",
        "text": "Now what?"
      }
    ],
    "choices": [
      {
        "text": "Do a little gardening.",
        "next": "c2WaitGarden",
        "set": {
          "afternoonActivity": "garden"
        }
      },
      {
        "text": "Watch some TV.",
        "next": "c2WaitTV",
        "set": {
          "afternoonActivity": "tv"
        }
      },
      {
        "text": "Rest on the porch.",
        "next": "c2WaitRest",
        "set": {
          "afternoonActivity": "porch"
        }
      }
    ],
    "cgCue": {
      "key": "summer-lunch",
      "from": "Okay. Might take a couple of hours. I need to drop Mama’s things off too.",
      "until": "He starts down the steps"
    }
  },
  "c2WaitGarden": {
    "title": "The garden to myself",
    "place": "summer-solo-garden",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": null,
    "lines": [
      {
        "speaker": "",
        "text": "The house goes quiet after Rowan leaves."
      },
      {
        "speaker": "",
        "text": "I carry my glass to the kitchen, then look through the back door."
      },
      {
        "speaker": "",
        "text": "There are still weeds along the far side of the garden."
      },
      {
        "speaker": "Thought",
        "text": "Might as well do a little."
      },
      {
        "speaker": "",
        "text": "I find the gloves and an empty bucket beside the steps."
      },
      {
        "speaker": "",
        "text": "The patch we worked on yesterday looks better. I crouch beside the next one and push a leaf out of the way."
      },
      {
        "speaker": "You",
        "text": "Right. You're a weed. Pretty sure."
      },
      {
        "speaker": "",
        "text": "There's nobody here to argue with me."
      }
    ],
    "next": "c2SoloGarden"
  },
  "c2SoloGarden": {
    "title": "A little gardening",
    "place": "summer-solo-garden",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": null,
    "lines": [
      {
        "speaker": "",
        "text": "The garden is mine for a little while."
      }
    ],
    "next": "c2GardenAfter",
    "minigame": true,
    "soloGarden": true
  },
  "c2GardenAfter": {
    "title": "An afternoon in the garden",
    "place": "summer-solo-garden",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": null,
    "lines": [
      {
        "speaker": "",
        "text": "I sit back and look at the cleared soil.",
        "if": [
          "soloGardenResult",
          "cleared"
        ]
      },
      {
        "speaker": "You",
        "text": "Okay. That actually looks better.",
        "if": [
          "soloGardenResult",
          "cleared"
        ]
      },
      {
        "speaker": "",
        "text": "I tip the weeds into the garden waste pile.",
        "if": [
          "soloGardenResult",
          "cleared"
        ]
      },
      {
        "speaker": "",
        "text": "My knees are starting to complain.",
        "if": [
          "soloGardenResult",
          "stopped"
        ]
      },
      {
        "speaker": "",
        "text": "I pull one last weed, then set the bucket down.",
        "if": [
          "soloGardenResult",
          "stopped"
        ]
      },
      {
        "speaker": "You",
        "text": "The rest of you can wait.",
        "if": [
          "soloGardenResult",
          "stopped"
        ]
      },
      {
        "speaker": "",
        "text": "I empty what I've collected into the garden waste pile.",
        "if": [
          "soloGardenResult",
          "stopped"
        ]
      },
      {
        "speaker": "",
        "text": "I rinse the gloves and leave them to dry, then water the pots that need it."
      },
      {
        "speaker": "",
        "text": "It gets too hot to stay outside for long. I go in for water, cool off, and come back when the shade reaches the steps."
      },
      {
        "speaker": "",
        "text": "By the time I put everything away, a couple of hours have passed."
      }
    ],
    "next": "c2GardenReturn"
  },
  "c2GardenReturn": {
    "title": "Back from the market",
    "place": "summer-solo-garden",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "The front gate rattles."
      },
      {
        "speaker": "Rowan",
        "text": "{name}? You here?"
      },
      {
        "speaker": "You",
        "text": "Out back!"
      },
      {
        "speaker": "",
        "text": "He appears around the side of the house with the shopping bags."
      },
      {
        "speaker": "Rowan",
        "text": "Oh. You've been busy."
      },
      {
        "speaker": "You",
        "text": "A bit. I left some for you. You're welcome."
      },
      {
        "speaker": "",
        "text": "He looks at the patch, then at the bucket."
      },
      {
        "speaker": "Rowan",
        "text": "Very generous."
      },
      {
        "speaker": "You",
        "text": "Did you get everything done?"
      },
      {
        "speaker": "Rowan",
        "text": "The market was packed. Dropped Mama's things off too."
      },
      {
        "speaker": "You",
        "text": "And the workshop?"
      },
      {
        "speaker": "",
        "text": "He adjusts his grip on the bags."
      },
      {
        "speaker": "Rowan",
        "text": "Passed by. Didn't go in."
      },
      {
        "speaker": "You",
        "text": "Ro, I wasn't in a rush."
      },
      {
        "speaker": "Rowan",
        "text": "I know. I'll go back."
      },
      {
        "speaker": "",
        "text": "He looks at my hands."
      },
      {
        "speaker": "Rowan",
        "text": "Want to wash up before we go?"
      },
      {
        "speaker": "You",
        "text": "Yeah. Give me a minute."
      },
      {
        "speaker": "",
        "text": "I head inside while he puts the groceries away. We stop for flowers on the way to the cemetery."
      }
    ],
    "next": "c2GraveTogether"
  },
  "c2WaitTV": {
    "title": "An afternoon with the television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I find the remote beside the television and settle on the sofa."
      },
      {
        "speaker": "",
        "text": "It takes two presses before the screen lights up."
      },
      {
        "speaker": "",
        "text": "A woman is crying in a hospital corridor."
      },
      {
        "speaker": "You",
        "text": "Oh, I've seen this one."
      },
      {
        "speaker": "",
        "text": "I haven't. Ten minutes later, I'm still watching."
      },
      {
        "speaker": "",
        "text": "An advertisement interrupts just as someone opens a door."
      },
      {
        "speaker": "",
        "text": "I change the channel."
      }
    ],
    "next": "c2Channels0"
  },
  "c2Channel0_cooking": {
    "title": "A cooking show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "A host folds something into a pan while listing ingredients I already know we don't have."
      },
      {
        "speaker": "You",
        "text": "You lost me at the cream."
      },
      {
        "speaker": "",
        "text": "I watch anyway. It looks good."
      }
    ],
    "next": "c2Channels1"
  },
  "c2Channel0_quiz": {
    "title": "A game show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "The contestant stares at the last question."
      },
      {
        "speaker": "You",
        "text": "B. It's B."
      },
      {
        "speaker": "",
        "text": "They choose C."
      },
      {
        "speaker": "",
        "text": "The host announces that C is correct."
      },
      {
        "speaker": "You",
        "text": "Never mind."
      }
    ],
    "next": "c2Channels2"
  },
  "c2Channel0_movie": {
    "title": "An old movie.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I recognize one of the actors, but not the title."
      },
      {
        "speaker": "",
        "text": "I tell myself I'll watch until I figure out what's happening."
      },
      {
        "speaker": "",
        "text": "By the next commercial, I've tucked my feet onto the sofa."
      }
    ],
    "next": "c2Channels4"
  },
  "c2Channels0": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "What else is on?"
      }
    ],
    "choices": [
      {
        "text": "A cooking show.",
        "next": "c2Channel0_cooking",
        "set": {}
      },
      {
        "text": "A game show.",
        "next": "c2Channel0_quiz",
        "set": {}
      },
      {
        "text": "An old movie.",
        "next": "c2Channel0_movie",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel1_quiz": {
    "title": "A game show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "The contestant stares at the last question."
      },
      {
        "speaker": "You",
        "text": "B. It's B."
      },
      {
        "speaker": "",
        "text": "They choose C."
      },
      {
        "speaker": "",
        "text": "The host announces that C is correct."
      },
      {
        "speaker": "You",
        "text": "Never mind."
      }
    ],
    "next": "c2Channels3"
  },
  "c2Channel1_movie": {
    "title": "An old movie.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I recognize one of the actors, but not the title."
      },
      {
        "speaker": "",
        "text": "I tell myself I'll watch until I figure out what's happening."
      },
      {
        "speaker": "",
        "text": "By the next commercial, I've tucked my feet onto the sofa."
      }
    ],
    "next": "c2Channels5"
  },
  "c2Channels1": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "A game show.",
        "next": "c2Channel1_quiz",
        "set": {}
      },
      {
        "text": "An old movie.",
        "next": "c2Channel1_movie",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel2_cooking": {
    "title": "A cooking show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "A host folds something into a pan while listing ingredients I already know we don't have."
      },
      {
        "speaker": "You",
        "text": "You lost me at the cream."
      },
      {
        "speaker": "",
        "text": "I watch anyway. It looks good."
      }
    ],
    "next": "c2Channels3"
  },
  "c2Channel2_movie": {
    "title": "An old movie.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I recognize one of the actors, but not the title."
      },
      {
        "speaker": "",
        "text": "I tell myself I'll watch until I figure out what's happening."
      },
      {
        "speaker": "",
        "text": "By the next commercial, I've tucked my feet onto the sofa."
      }
    ],
    "next": "c2Channels6"
  },
  "c2Channels2": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "A cooking show.",
        "next": "c2Channel2_cooking",
        "set": {}
      },
      {
        "text": "An old movie.",
        "next": "c2Channel2_movie",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel3_movie": {
    "title": "An old movie.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I recognize one of the actors, but not the title."
      },
      {
        "speaker": "",
        "text": "I tell myself I'll watch until I figure out what's happening."
      },
      {
        "speaker": "",
        "text": "By the next commercial, I've tucked my feet onto the sofa."
      }
    ],
    "next": "c2Channels7"
  },
  "c2Channels3": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "An old movie.",
        "next": "c2Channel3_movie",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel4_cooking": {
    "title": "A cooking show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "A host folds something into a pan while listing ingredients I already know we don't have."
      },
      {
        "speaker": "You",
        "text": "You lost me at the cream."
      },
      {
        "speaker": "",
        "text": "I watch anyway. It looks good."
      }
    ],
    "next": "c2Channels5"
  },
  "c2Channel4_quiz": {
    "title": "A game show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "The contestant stares at the last question."
      },
      {
        "speaker": "You",
        "text": "B. It's B."
      },
      {
        "speaker": "",
        "text": "They choose C."
      },
      {
        "speaker": "",
        "text": "The host announces that C is correct."
      },
      {
        "speaker": "You",
        "text": "Never mind."
      }
    ],
    "next": "c2Channels6"
  },
  "c2Channels4": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "A cooking show.",
        "next": "c2Channel4_cooking",
        "set": {}
      },
      {
        "text": "A game show.",
        "next": "c2Channel4_quiz",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel5_quiz": {
    "title": "A game show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "The contestant stares at the last question."
      },
      {
        "speaker": "You",
        "text": "B. It's B."
      },
      {
        "speaker": "",
        "text": "They choose C."
      },
      {
        "speaker": "",
        "text": "The host announces that C is correct."
      },
      {
        "speaker": "You",
        "text": "Never mind."
      }
    ],
    "next": "c2Channels7"
  },
  "c2Channels5": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "A game show.",
        "next": "c2Channel5_quiz",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channel6_cooking": {
    "title": "A cooking show.",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "A host folds something into a pan while listing ingredients I already know we don't have."
      },
      {
        "speaker": "You",
        "text": "You lost me at the cream."
      },
      {
        "speaker": "",
        "text": "I watch anyway. It looks good."
      }
    ],
    "next": "c2Channels7"
  },
  "c2Channels6": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "A cooking show.",
        "next": "c2Channel6_cooking",
        "set": {}
      },
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2Channels7": {
    "title": "On television",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "I turn the remote over in my hand."
      }
    ],
    "choices": [
      {
        "text": "Keep watching for a while.",
        "next": "c2TVReturn",
        "set": {}
      }
    ]
  },
  "c2TVReturn": {
    "title": "A couple of hours later",
    "place": "summer-television",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "The afternoon slips by between shows and advertisements."
      },
      {
        "speaker": "",
        "text": "I get some water. Adjust the fan. Spend far too long watching a man demonstrate a mop I don't need."
      },
      {
        "speaker": "",
        "text": "When I check the time again, a couple of hours have passed."
      },
      {
        "speaker": "",
        "text": "The front gate rattles."
      },
      {
        "speaker": "",
        "text": "I lower my feet as Rowan comes through the door carrying groceries."
      },
      {
        "speaker": "Rowan",
        "text": "Hey. Sorry, that took a while."
      },
      {
        "speaker": "You",
        "text": "You're fine. I've been busy."
      },
      {
        "speaker": "",
        "text": "He looks at the television."
      },
      {
        "speaker": "Rowan",
        "text": "Clearly."
      },
      {
        "speaker": "",
        "text": "Another advertisement starts. I press the channel button."
      }
    ],
    "next": "c2TVNews"
  },
  "c2TVNews": {
    "title": "The local news",
    "place": "summer-news",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "The local news comes onjust as Rowan sets the bags on the table."
      },
      {
        "speaker": "",
        "text": "People are gathered outside a health center. A reporter stands beside the entrance."
      },
      {
        "speaker": "Reporter",
        "text": "The center will now open on Saturdays, with additional staff assigned to the morning clinic."
      },
      {
        "speaker": "",
        "text": "An older woman appears on screen."
      },
      {
        "speaker": "Resident",
        "text": "Malaking tulong. Before, I had to miss work just to get a checkup."
      },
      {
        "speaker": "",
        "text": "The report cuts to a man speaking with the staff."
      },
      {
        "speaker": "",
        "text": "On the screen: MAYOR SANCHEZ — SAINT LUIS."
      },
      {
        "speaker": "",
        "text": "Rowan glances at the television."
      },
      {
        "speaker": "",
        "text": "Then he stays looking at it."
      },
      {
        "speaker": "Mayor Sanchez",
        "text": "We've had people asking for weekend hours for a while. We finally have the staff for it."
      },
      {
        "speaker": "Reporter",
        "text": "Will the same schedule be introduced in other barangays?"
      },
      {
        "speaker": "Mayor Sanchez",
        "text": "That's the plan. We'll see how this first month goes."
      },
      {
        "speaker": "You",
        "text": "That's good. People won't have to miss work just to see someone."
      },
      {
        "speaker": "",
        "text": "Rowan takes a carton of eggs out of the bag."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. That should help."
      },
      {
        "speaker": "You",
        "text": "Your mayor seems pretty good."
      },
      {
        "speaker": "",
        "text": "His hand pauses before he sets the carton down."
      },
      {
        "speaker": "Rowan",
        "text": "Mm."
      },
      {
        "speaker": "You",
        "text": "Has he been mayor long?"
      },
      {
        "speaker": "Rowan",
        "text": "A few years."
      },
      {
        "speaker": "You",
        "text": "You don't sound very impressed."
      },
      {
        "speaker": "",
        "text": "He glances at me."
      },
      {
        "speaker": "Rowan",
        "text": "I just carried groceries uphill. Give me a minute."
      },
      {
        "speaker": "You",
        "text": "Sorry. I'll save the interview for later."
      },
      {
        "speaker": "",
        "text": "A small smile appears."
      },
      {
        "speaker": "Rowan",
        "text": "Thanks."
      },
      {
        "speaker": "",
        "text": "He gathers the bags again."
      },
      {
        "speaker": "You",
        "text": "Did you stop at the workshop?"
      },
      {
        "speaker": "Rowan",
        "text": "Passed by."
      },
      {
        "speaker": "You",
        "text": "Did you talk to Mang Nestor?"
      },
      {
        "speaker": "Rowan",
        "text": "Not yet."
      },
      {
        "speaker": "You",
        "text": "Ro, I wasn't going anywhere."
      },
      {
        "speaker": "",
        "text": "He looks toward the television, then back at me."
      },
      {
        "speaker": "Rowan",
        "text": "I know. I'll go back."
      },
      {
        "speaker": "",
        "text": "The report ends. I turn the volume down."
      },
      {
        "speaker": "You",
        "text": "Want to sit for a bit before we go?"
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. Let me put these away."
      },
      {
        "speaker": "",
        "text": "After a short rest, we head out together and buy flowers on the way."
      }
    ],
    "next": "c2GraveTogether"
  },
  "c2WaitRest": {
    "title": "A quiet afternoon on the porch",
    "place": "reunion-porch",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": null,
    "lines": [
      {
        "speaker": "",
        "text": "I take my water outside and settle into one of the porch chairs."
      },
      {
        "speaker": "",
        "text": "For a while, I watch people pass the gate."
      },
      {
        "speaker": "",
        "text": "Someone is trying to convince a dog to move out of the road. The dog seems comfortable where it is."
      },
      {
        "speaker": "",
        "text": "I check my phone, then put it facedown beside me."
      },
      {
        "speaker": "",
        "text": "There's nothing I need to answer right now."
      },
      {
        "speaker": "",
        "text": "The breeze reaches the porch in little bursts. I move my chair farther into the shade."
      },
      {
        "speaker": "",
        "text": "At some point, my eyes close."
      },
      {
        "speaker": "",
        "text": "When I open them, the patch of sunlight on the steps has moved."
      },
      {
        "speaker": "",
        "text": "I go inside for more water, then come back out. A neighbor waves from across the street. I wave back."
      },
      {
        "speaker": "",
        "text": "The next time I look at my phone, a couple of hours have passed."
      }
    ],
    "next": "c2PorchReturn"
  },
  "c2PorchReturn": {
    "title": "A voice at the gate",
    "place": "reunion-porch",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "back-together",
    "lines": [
      {
        "speaker": "Rowan",
        "text": "{name}!"
      },
      {
        "speaker": "",
        "text": "I lift my head."
      },
      {
        "speaker": "",
        "text": "He's at the gate, holding up a shopping bag."
      },
      {
        "speaker": "Rowan",
        "text": "Little help?"
      },
      {
        "speaker": "You",
        "text": "Oh. Yeah, coming."
      },
      {
        "speaker": "",
        "text": "I get up and open it for him."
      },
      {
        "speaker": "Rowan",
        "text": "Thanks. That handle was about to give up."
      },
      {
        "speaker": "You",
        "text": "How much did you buy?"
      },
      {
        "speaker": "Rowan",
        "text": "Somehow more than I went for."
      },
      {
        "speaker": "",
        "text": "I take the lighter bag and carry it inside."
      },
      {
        "speaker": "Rowan",
        "text": "Were you asleep?"
      },
      {
        "speaker": "You",
        "text": "For a bit."
      },
      {
        "speaker": "Rowan",
        "text": "Sorry. Did I wake you?"
      },
      {
        "speaker": "You",
        "text": "No. I've just been sitting out here."
      },
      {
        "speaker": "Rowan",
        "text": "Sounds nice."
      },
      {
        "speaker": "You",
        "text": "It was. You should try it sometime."
      },
      {
        "speaker": "",
        "text": "He smiles as he sets the groceries down."
      },
      {
        "speaker": "You",
        "text": "Did you get to the workshop?"
      },
      {
        "speaker": "Rowan",
        "text": "Walked past it. Didn't go in."
      },
      {
        "speaker": "You",
        "text": "You could've. I wasn't waiting by the door."
      },
      {
        "speaker": "Rowan",
        "text": "I know. I'll go back."
      },
      {
        "speaker": "",
        "text": "He starts unpacking."
      },
      {
        "speaker": "Rowan",
        "text": "Still want to go see Lola?"
      },
      {
        "speaker": "You",
        "text": "Yeah. Let me get my things."
      },
      {
        "speaker": "",
        "text": "We put the groceries away, then stop for flowers on the way to the cemetery."
      }
    ],
    "next": "c2GraveTogether"
  },
  "c2Market": {
    "title": "Coming along",
    "place": "summer-lunch",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "Rowan",
        "text": "Yeah. You want to?"
      },
      {
        "speaker": "You",
        "text": "I’m asking, aren’t I?"
      },
      {
        "speaker": "Rowan",
        "text": "Just making sure."
      },
      {
        "speaker": "",
        "text": "He smiles and reaches for his glass."
      },
      {
        "speaker": "Rowan",
        "text": "We can get flowers while we’re there."
      },
      {
        "speaker": "You",
        "text": "Okay. And go to the workshop."
      },
      {
        "speaker": "Rowan",
        "text": "We can skip that."
      },
      {
        "speaker": "You",
        "text": "Why?"
      },
      {
        "speaker": "Rowan",
        "text": "It might take a while."
      },
      {
        "speaker": "You",
        "text": "That’s fine."
      },
      {
        "speaker": "Rowan",
        "text": "You sure?"
      },
      {
        "speaker": "You",
        "text": "Ro."
      },
      {
        "speaker": "Rowan",
        "text": "Okay, okay."
      }
    ],
    "next": "c2MarketWalk",
    "cgCue": {
      "key": "summer-lunch",
      "from": "Yeah. You want to?"
    }
  },
  "c2MarketWalk": {
    "title": "At the market",
    "place": "street",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "hill",
    "lines": [
      {
        "speaker": "",
        "text": "At the market, someone seems to know him at every stall."
      },
      {
        "speaker": "",
        "text": "A vendor asks about his mother. Another calls him over to look at a broken stool."
      },
      {
        "speaker": "",
        "text": "He crouches to inspect it."
      },
      {
        "speaker": "Rowan",
        "text": "The joint’s coming loose."
      },
      {
        "speaker": "Vendor",
        "text": "Can you fix it?"
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. Tomorrow?"
      },
      {
        "speaker": "",
        "text": "The vendor nods."
      },
      {
        "speaker": "",
        "text": "As we leave, I glance at him."
      },
      {
        "speaker": "You",
        "text": "Do you get through here without picking up work?"
      },
      {
        "speaker": "Rowan",
        "text": "Sometimes I take the other entrance."
      }
    ],
    "next": "c2Workshop"
  },
  "c2Workshop": {
    "title": "The workshop",
    "place": "summer-workshop",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "The workshop smells of sawdust."
      },
      {
        "speaker": "",
        "text": "Mang Nestor looks up from a table he’s sanding."
      },
      {
        "speaker": "Mang Nestor",
        "text": "Rowan! Napag-isipan mo na?"
      },
      {
        "speaker": "",
        "text": "Rowan shifts the shopping bag to his other hand."
      },
      {
        "speaker": "Rowan",
        "text": "Not yet."
      },
      {
        "speaker": "Mang Nestor",
        "text": "Let me know by Friday, ha? I need to sort out the schedule."
      },
      {
        "speaker": "Rowan",
        "text": "I will."
      },
      {
        "speaker": "",
        "text": "Mang Nestor greets me, asks how long I’m staying, then returns to his work."
      }
    ],
    "next": "c2WorkshopAfter",
    "cgCue": {
      "key": "summer-workshop",
      "from": "The workshop smells of sawdust."
    }
  },
  "c2AloneGrave": {
    "title": "A little time alone",
    "place": "summer-lunch",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "Rowan pauses."
      },
      {
        "speaker": "Rowan",
        "text": "Oh."
      },
      {
        "speaker": "You",
        "text": "Sorry. I know I just asked you to come."
      },
      {
        "speaker": "Rowan",
        "text": "No, it’s okay."
      },
      {
        "speaker": "",
        "text": "He sets his glass down."
      },
      {
        "speaker": "You",
        "text": "I think I need a minute with her. By myself."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. I get it."
      },
      {
        "speaker": "You",
        "text": "You don’t mind?"
      },
      {
        "speaker": "Rowan",
        "text": "I wanted to come."
      },
      {
        "speaker": "",
        "text": "He gives me a small smile."
      },
      {
        "speaker": "Rowan",
        "text": "But we can go together another day."
      },
      {
        "speaker": "You",
        "text": "Okay."
      },
      {
        "speaker": "Rowan",
        "text": "Do you remember where it is?"
      },
      {
        "speaker": "You",
        "text": "Not really."
      },
      {
        "speaker": "Rowan",
        "text": "Hang on."
      },
      {
        "speaker": "",
        "text": "He finds a pen and writes directions on the back of a receipt."
      },
      {
        "speaker": "Rowan",
        "text": "Turn here, not at the first gate. That one’s usually locked."
      },
      {
        "speaker": "You",
        "text": "Got it."
      },
      {
        "speaker": "Rowan",
        "text": "There’s a flower stall across the road."
      },
      {
        "speaker": "",
        "text": "I fold the receipt and put it in my pocket."
      },
      {
        "speaker": "You",
        "text": "Thanks, Ro."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah."
      },
      {
        "speaker": "",
        "text": "He reaches for the shopping bags."
      },
      {
        "speaker": "Rowan",
        "text": "I’ll go see Mang Nestor, then."
      },
      {
        "speaker": "You",
        "text": "Good."
      },
      {
        "speaker": "Rowan",
        "text": "You sound like Mama."
      },
      {
        "speaker": "You",
        "text": "She’s probably right too."
      },
      {
        "speaker": "",
        "text": "We part at the corner. I stop for flowers on the way."
      }
    ],
    "next": "c2Grave",
    "cgCue": {
      "key": "summer-lunch",
      "from": "Rowan pauses."
    }
  },
  "c2GraveTogether": {
    "title": "At the cemetery",
    "place": "summer-grave",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "lola",
    "lines": [
      {
        "speaker": "",
        "text": "We walk through the gate together."
      },
      {
        "speaker": "",
        "text": "Rowan slows when we reach her grave."
      }
    ],
    "next": "c2Grave"
  },
  "c2Grave": {
    "title": "Hi, Lola",
    "place": "summer-grave",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "lola",
    "lines": [
      {
        "speaker": "",
        "text": "I recognize her name before I’m ready to stop walking."
      },
      {
        "speaker": "",
        "text": "For a moment, I just stand there."
      },
      {
        "speaker": "",
        "text": "Then I crouch and set down the flowers."
      },
      {
        "speaker": "You",
        "text": "Hi, Lola."
      },
      {
        "speaker": "",
        "text": "My voice comes out smaller than I expected."
      },
      {
        "speaker": "You",
        "text": "I’m back."
      },
      {
        "speaker": "",
        "text": "He stands beside me for a little while. Then he leans closer.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Want some time?",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "",
        "text": "I nod.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Please.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "I’ll be over there.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "",
        "text": "He walks toward a tree beside the path.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "",
        "text": "I adjust the flowers. Then adjust them again."
      },
      {
        "speaker": "You",
        "text": "Sorry I took so long."
      },
      {
        "speaker": "",
        "text": "There’s a little dirt on the edge of the stone. I brush it away with my fingers."
      },
      {
        "speaker": "You",
        "text": "The house is okay."
      },
      {
        "speaker": "",
        "text": "I swallow."
      },
      {
        "speaker": "You",
        "text": "Ro’s been looking after it."
      },
      {
        "speaker": "",
        "text": "A breeze moves through the leaves."
      },
      {
        "speaker": "You",
        "text": "He cooked for me today. Tilapia."
      },
      {
        "speaker": "",
        "text": "I let out a small laugh."
      },
      {
        "speaker": "You",
        "text": "It was good. You taught him properly."
      },
      {
        "speaker": "",
        "text": "For a while, I can’t say anything else."
      },
      {
        "speaker": "You",
        "text": "I wish you were here."
      },
      {
        "speaker": "",
        "text": "I look down at my hands."
      },
      {
        "speaker": "You",
        "text": "I don’t know. Things have been…"
      },
      {
        "speaker": "",
        "text": "I stop trying to finish the sentence."
      },
      {
        "speaker": "You",
        "text": "I just miss you."
      },
      {
        "speaker": "",
        "text": "I stay until I’m ready to stand."
      },
      {
        "speaker": "",
        "text": "He gets up when I reach the path, and we walk home together.",
        "conditions": [
          [
            "graveTogether",
            true
          ]
        ]
      },
      {
        "speaker": "",
        "text": "I follow Rowan’s directions back through the gate. When I get home, his market bags are on the kitchen table.",
        "conditions": [
          [
            "graveTogether",
            false
          ]
        ]
      }
    ],
    "next": "c2Mayumi"
  },
  "c2Mayumi": {
    "title": "A familiar voice",
    "place": "summer-mayumi",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "back-together",
    "lines": [
      {
        "speaker": "",
        "text": "Later that afternoon, a familiar voice comes through the open doorway."
      },
      {
        "speaker": "Mayumi",
        "text": "Tao po!"
      },
      {
        "speaker": "",
        "text": "I stop in the hall."
      },
      {
        "speaker": "You",
        "text": "Tita?"
      },
      {
        "speaker": "",
        "text": "She turns."
      },
      {
        "speaker": "Mayumi",
        "text": "Ay, anak."
      },
      {
        "speaker": "",
        "text": "She sets her bag on the nearest chair and looks at me."
      },
      {
        "speaker": "Mayumi",
        "text": "Come here. Can I hug you?"
      },
      {
        "speaker": "",
        "text": "I step forward. She holds me tightly for a moment."
      },
      {
        "speaker": "Mayumi",
        "text": "It’s good to see you."
      },
      {
        "speaker": "You",
        "text": "You too."
      },
      {
        "speaker": "",
        "text": "She draws back, still holding my arms."
      },
      {
        "speaker": "Mayumi",
        "text": "Look at you. Ang laki mo na."
      },
      {
        "speaker": "You",
        "text": "It’s been a while."
      },
      {
        "speaker": "Mayumi",
        "text": "Too long."
      },
      {
        "speaker": "",
        "text": "Rowan picks up the bag she left on the chair."
      },
      {
        "speaker": "Rowan",
        "text": "Kitchen?"
      },
      {
        "speaker": "Mayumi",
        "text": "Please. There’s bread in there."
      },
      {
        "speaker": "You",
        "text": "You brought food?"
      },
      {
        "speaker": "Mayumi",
        "text": "Of course."
      },
      {
        "speaker": "",
        "text": "We sit down."
      },
      {
        "speaker": "",
        "text": "She asks about the trip, about school, about how the house has been."
      },
      {
        "speaker": "",
        "text": "Then she asks whether I’ve eaten."
      },
      {
        "speaker": "You",
        "text": "Rowan cooked."
      },
      {
        "speaker": "Mayumi",
        "text": "Good. What did he make?"
      },
      {
        "speaker": "You",
        "text": "Tilapia."
      },
      {
        "speaker": "Mayumi",
        "text": "Oh, his safe choice."
      },
      {
        "speaker": "Rowan",
        "text": "You ate two pieces last time."
      },
      {
        "speaker": "Mayumi",
        "text": "Did I say it was bad?"
      },
      {
        "speaker": "",
        "text": "He looks at me."
      },
      {
        "speaker": "Rowan",
        "text": "See what I deal with?"
      },
      {
        "speaker": "",
        "text": "For a little while, the conversation stays easy."
      },
      {
        "speaker": "",
        "text": "Then Mayumi turns toward him."
      }
    ],
    "next": "c2Family",
    "cgCue": {
      "key": "summer-mayumi",
      "from": "Later that afternoon, a familiar voice comes through the open doorway."
    }
  },
  "c2Family": {
    "title": "An unanswered call",
    "place": "summer-mayumi",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": false,
    "music": "letters",
    "lines": [
      {
        "speaker": "Mayumi",
        "text": "Ro. Your father called."
      },
      {
        "speaker": "",
        "text": "He stops reaching for the bread."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. He called me too."
      },
      {
        "speaker": "Mayumi",
        "text": "Did you answer?"
      },
      {
        "speaker": "Rowan",
        "text": "I was out."
      },
      {
        "speaker": "Mayumi",
        "text": "He said he’s been trying since yesterday."
      },
      {
        "speaker": "",
        "text": "Rowan leans back."
      },
      {
        "speaker": "Rowan",
        "text": "What did he want?"
      },
      {
        "speaker": "Mayumi",
        "text": "He wants you at the municipal hall on Monday."
      },
      {
        "speaker": "Rowan",
        "text": "Why?"
      },
      {
        "speaker": "Mayumi",
        "text": "There’s a community meeting. He wants you to come with him."
      },
      {
        "speaker": "Rowan",
        "text": "And?"
      },
      {
        "speaker": "",
        "text": "She looks at him."
      },
      {
        "speaker": "Mayumi",
        "text": "A few mornings a week after that. He wants you to learn how the office works."
      },
      {
        "speaker": "You",
        "text": "Sorry. Your dad works there?"
      },
      {
        "speaker": "",
        "text": "Rowan glances at me."
      },
      {
        "speaker": "Rowan",
        "text": "He’s the mayor."
      },
      {
        "speaker": "You",
        "text": "Sanchez?",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "",
        "text": "He nods.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "The one on TV earlier?",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Yeah.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Why didn’t you say anything?",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "",
        "text": "He rubs the back of his neck.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "You were talking about the clinic. I didn’t know how to bring it up.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Oh.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "",
        "text": "I glance at the television.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "I didn’t know.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "I know. You didn’t say anything wrong.",
        "conditions": [
          [
            "afternoonActivity",
            "tv"
          ]
        ]
      },
      {
        "speaker": "",
        "text": "I wait for him to smile. He doesn’t.",
        "conditions": [
          [
            "afternoonActivity",
            "tv",
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Mayor Sanchez is your dad?",
        "conditions": [
          [
            "afternoonActivity",
            "tv",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Yeah.",
        "conditions": [
          [
            "afternoonActivity",
            "tv",
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "I didn’t know.",
        "conditions": [
          [
            "afternoonActivity",
            "tv",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "He wasn’t mayor when we were kids."
      },
      {
        "speaker": "",
        "text": "I remember a man who lived somewhere else. A name adults mentioned more often than a person I saw."
      },
      {
        "speaker": "You",
        "text": "Oh."
      },
      {
        "speaker": "",
        "text": "Mayumi gives Rowan a moment before continuing."
      },
      {
        "speaker": "Mayumi",
        "text": "He wants to introduce you to people."
      },
      {
        "speaker": "Rowan",
        "text": "They know me, Ma."
      },
      {
        "speaker": "Mayumi",
        "text": "You know what I mean."
      },
      {
        "speaker": "",
        "text": "He looks down at the table."
      },
      {
        "speaker": "You",
        "text": "Does he want you to work for him?"
      },
      {
        "speaker": "Rowan",
        "text": "For now."
      },
      {
        "speaker": "Mayumi",
        "text": "He thinks you could run someday."
      },
      {
        "speaker": "You",
        "text": "For mayor?"
      },
      {
        "speaker": "",
        "text": "Rowan nods."
      },
      {
        "speaker": "You",
        "text": "Do you want to?"
      },
      {
        "speaker": "Rowan",
        "text": "No."
      },
      {
        "speaker": "",
        "text": "The answer comes out immediately."
      },
      {
        "speaker": "",
        "text": "Mayumi folds her hands in her lap."
      },
      {
        "speaker": "Mayumi",
        "text": "Then tell him."
      },
      {
        "speaker": "Rowan",
        "text": "I will."
      },
      {
        "speaker": "Mayumi",
        "text": "When?"
      },
      {
        "speaker": "",
        "text": "He doesn’t answer."
      },
      {
        "speaker": "Rowan",
        "text": "I’ve had things to do."
      },
      {
        "speaker": "",
        "text": "She glances toward the front door."
      },
      {
        "speaker": "Mayumi",
        "text": "You told me you’d call after you fixed that."
      },
      {
        "speaker": "Rowan",
        "text": "There’s still the kitchen cupboard."
      },
      {
        "speaker": "Mayumi",
        "text": "Ro."
      },
      {
        "speaker": "",
        "text": "He rubs his face."
      },
      {
        "speaker": "Rowan",
        "text": "I know."
      },
      {
        "speaker": "Mayumi",
        "text": "I’m not telling you to take the job."
      },
      {
        "speaker": "Rowan",
        "text": "It’s not really a job."
      },
      {
        "speaker": "Mayumi",
        "text": "Whatever he’s offering. You don’t have to want it."
      },
      {
        "speaker": "",
        "text": "She waits until he looks at her."
      },
      {
        "speaker": "Mayumi",
        "text": "But he keeps asking me because you won’t answer him."
      },
      {
        "speaker": "Rowan",
        "text": "Sorry."
      },
      {
        "speaker": "Mayumi",
        "text": "Have you talked to Mang Nestor?"
      },
      {
        "speaker": "Rowan",
        "text": "He needs an answer by Friday.",
        "conditions": [
          [
            "workshopVisited",
            true
          ]
        ]
      },
      {
        "speaker": "Mayumi",
        "text": "Okay. And what are you going to tell him?",
        "conditions": [
          [
            "workshopVisited",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "I’m working on it.",
        "conditions": [
          [
            "workshopVisited",
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Not yet.",
        "conditions": [
          [
            "workshopVisited",
            false
          ]
        ]
      },
      {
        "speaker": "",
        "text": "Mayumi lets out a quiet breath.",
        "conditions": [
          [
            "workshopVisited",
            false
          ]
        ]
      },
      {
        "speaker": "Mayumi",
        "text": "You’ve wanted that for months.",
        "conditions": [
          [
            "workshopVisited",
            false
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "I know, Ma.",
        "conditions": [
          [
            "workshopVisited",
            false
          ]
        ]
      },
      {
        "speaker": "Mayumi",
        "text": "All right."
      },
      {
        "speaker": "",
        "text": "She reaches for her glass."
      },
      {
        "speaker": "Mayumi",
        "text": "Just don’t leave it so long that somebody else gets the place."
      }
    ],
    "next": "c2NewEnding",
    "cgCue": {
      "key": "summer-mayumi",
      "from": "Ro. Your father called."
    }
  },
  "c2NewEnding": {
    "title": "What Rowan wants",
    "place": "living",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "letters",
    "lines": [
      {
        "speaker": "",
        "text": "After Mayumi leaves, Rowan takes the glasses into the kitchen."
      },
      {
        "speaker": "",
        "text": "I follow him."
      },
      {
        "speaker": "",
        "text": "He puts one away and pushes the cupboard door closed. It swings open again."
      },
      {
        "speaker": "",
        "text": "He tries a second time."
      },
      {
        "speaker": "You",
        "text": "Ro."
      },
      {
        "speaker": "Rowan",
        "text": "The hinge is—"
      },
      {
        "speaker": "You",
        "text": "I know."
      },
      {
        "speaker": "",
        "text": "His hand stays on the door. Then he lets go."
      },
      {
        "speaker": "You",
        "text": "You could’ve told me."
      },
      {
        "speaker": "Rowan",
        "text": "About my dad?"
      },
      {
        "speaker": "You",
        "text": "Any of it."
      },
      {
        "speaker": "Rowan",
        "text": "You’d just got here."
      },
      {
        "speaker": "You",
        "text": "Yeah. To see you."
      },
      {
        "speaker": "",
        "text": "He looks at me."
      },
      {
        "speaker": "You",
        "text": "That includes the stuff you don’t want to talk about."
      },
      {
        "speaker": "",
        "text": "He rests his hands against the counter."
      },
      {
        "speaker": "Rowan",
        "text": "I don’t even know what he expects."
      },
      {
        "speaker": "You",
        "text": "Did you ask?"
      },
      {
        "speaker": "Rowan",
        "text": "He starts talking about meetings and people I should know. Then it’s what I should wear. What I should say."
      },
      {
        "speaker": "",
        "text": "He shakes his head."
      },
      {
        "speaker": "Rowan",
        "text": "I haven’t said yes to anything."
      },
      {
        "speaker": "You",
        "text": "Have you said no?"
      },
      {
        "speaker": "",
        "text": "He looks down."
      },
      {
        "speaker": "Rowan",
        "text": "Not properly."
      },
      {
        "speaker": "",
        "text": "For a moment, I think about a folder sliding across a table."
      },
      {
        "speaker": "",
        "text": "About laughing because I couldn’t get the answer out."
      },
      {
        "speaker": "You",
        "text": "Yeah. That part’s hard."
      },
      {
        "speaker": "",
        "text": "He gives a small nod."
      },
      {
        "speaker": "You",
        "text": "What do you want?"
      },
      {
        "speaker": "Rowan",
        "text": "The apprenticeship."
      },
      {
        "speaker": "Rowan",
        "text": "Mang Nestor offered to train me. Paid, regular hours. I keep putting off my answer.",
        "conditions": [
          [
            "porchTopic_rowan",
            true,
            true
          ],
          [
            "afternoonRoute",
            "market",
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Okay."
      },
      {
        "speaker": "Rowan",
        "text": "I like being there. Even when I’m doing the boring stuff."
      },
      {
        "speaker": "",
        "text": "His eyes move toward the tools beside the back door."
      },
      {
        "speaker": "Rowan",
        "text": "Mang Nestor let me help with a dining table last month. I kept finding excuses to look at it after we finished."
      },
      {
        "speaker": "",
        "text": "I smile."
      },
      {
        "speaker": "You",
        "text": "You were proud."
      },
      {
        "speaker": "Rowan",
        "text": "Yeah."
      },
      {
        "speaker": "",
        "text": "He smiles too, briefly."
      },
      {
        "speaker": "Rowan",
        "text": "I want to get good at that."
      },
      {
        "speaker": "You",
        "text": "Then tell him yes."
      },
      {
        "speaker": "Rowan",
        "text": "You make it sound easy."
      },
      {
        "speaker": "You",
        "text": "No. I think it’ll be awful for about ten minutes."
      },
      {
        "speaker": "",
        "text": "He laughs."
      },
      {
        "speaker": "You",
        "text": "Then you’ll have said it."
      },
      {
        "speaker": "Rowan",
        "text": "And then I get to call my dad."
      },
      {
        "speaker": "You",
        "text": "Okay. Maybe more than ten minutes."
      },
      {
        "speaker": "",
        "text": "He looks down, still smiling."
      },
      {
        "speaker": "",
        "text": "I lean against the doorway."
      },
      {
        "speaker": "You",
        "text": "You had time to go into the workshop. Were you worried about keeping me waiting?",
        "conditions": [
          [
            "afternoonRoute",
            "wait"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Partly.",
        "conditions": [
          [
            "afternoonRoute",
            "wait"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "And the other part?",
        "conditions": [
          [
            "afternoonRoute",
            "wait"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "I didn’t want to answer him yet.",
        "conditions": [
          [
            "afternoonRoute",
            "wait"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "You nearly skipped the workshop earlier.",
        "conditions": [
          [
            "afternoonRoute",
            "market"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Yeah. Thanks for not letting me.",
        "conditions": [
          [
            "afternoonRoute",
            "market"
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "I’m glad you went to the workshop.",
        "conditions": [
          [
            "afternoonRoute",
            "alone"
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "Me too. Even if I still haven’t answered him.",
        "conditions": [
          [
            "afternoonRoute",
            "alone"
          ]
        ]
      },
      {
        "speaker": "",
        "text": "He picks up a cloth and dries a glass that is already dry."
      },
      {
        "speaker": "Rowan",
        "text": "I wanted this week to be nice."
      },
      {
        "speaker": "You",
        "text": "It can still be nice."
      },
      {
        "speaker": "Rowan",
        "text": "You had a nightmare this morning. You visited Lola. I didn’t want to add my stuff."
      },
      {
        "speaker": "You",
        "text": "You’re allowed to have stuff."
      },
      {
        "speaker": "",
        "text": "He nods, but keeps turning the glass."
      },
      {
        "speaker": "You",
        "text": "And you don’t have to spend the whole summer looking after me."
      },
      {
        "speaker": "",
        "text": "His hands slow."
      },
      {
        "speaker": "Rowan",
        "text": "I like looking after you."
      },
      {
        "speaker": "You",
        "text": "I know. I like it too."
      },
      {
        "speaker": "",
        "text": "I wait."
      },
      {
        "speaker": "You",
        "text": "But you keep checking whether I’m okay. Like I’m going to disappear if lunch is bad."
      },
      {
        "speaker": "",
        "text": "He puts the glass down."
      },
      {
        "speaker": "",
        "text": "Neither of us says anything for a moment."
      },
      {
        "speaker": "Rowan",
        "text": "That sounds stupid when you say it like that."
      },
      {
        "speaker": "You",
        "text": "I didn’t say it was stupid."
      },
      {
        "speaker": "",
        "text": "He looks toward the open window."
      },
      {
        "speaker": "Rowan",
        "text": "I know you said you’re here for the summer."
      },
      {
        "speaker": "You",
        "text": "Yeah."
      },
      {
        "speaker": "Rowan",
        "text": "I guess I keep hoping you’ll change your mind."
      },
      {
        "speaker": "",
        "text": "My chest tightens."
      },
      {
        "speaker": "You",
        "text": "About leaving?"
      },
      {
        "speaker": "",
        "text": "He nods."
      },
      {
        "speaker": "Rowan",
        "text": "Not forever. Just… staying a bit longer."
      },
      {
        "speaker": "You",
        "text": "Ro…"
      },
      {
        "speaker": "Rowan",
        "text": "You don’t have to answer. I know you’ve got school."
      },
      {
        "speaker": "",
        "text": "He rubs the back of his neck."
      },
      {
        "speaker": "Rowan",
        "text": "I just got used to you being here really fast."
      },
      {
        "speaker": "You",
        "text": "I missed you too."
      },
      {
        "speaker": "",
        "text": "He looks at me."
      },
      {
        "speaker": "You",
        "text": "But don’t turn down something you want because you think you need to keep me company."
      },
      {
        "speaker": "Rowan",
        "text": "Okay."
      },
      {
        "speaker": "You",
        "text": "I mean it."
      },
      {
        "speaker": "Rowan",
        "text": "I know."
      },
      {
        "speaker": "",
        "text": "The cupboard door creaks beside us."
      },
      {
        "speaker": "",
        "text": "He glances at it. Then back at me."
      },
      {
        "speaker": "Rowan",
        "text": "Can I at least fix that?"
      },
      {
        "speaker": "",
        "text": "I laugh."
      },
      {
        "speaker": "You",
        "text": "Tomorrow."
      },
      {
        "speaker": "Rowan",
        "text": "Fine."
      },
      {
        "speaker": "",
        "text": "He leaves it open."
      },
      {
        "speaker": "",
        "text": "When I pictured coming back, I always imagined us younger."
      },
      {
        "speaker": "",
        "text": "Sitting on the steps. Arguing over nothing."
      },
      {
        "speaker": "",
        "text": "I hadn’t pictured unanswered calls or a workshop needing an answer by Friday."
      },
      {
        "speaker": "",
        "text": "There’s still a lot we don’t know about each other."
      },
      {
        "speaker": "",
        "text": "At least we’re talking now."
      }
    ],
    "ending": true,
    "openingEnd": true
  },
  "c2WorkshopAfter": {
    "title": "An answer by Friday",
    "place": "street",
    "time": "day",
    "day": 3,
    "chapter": 2,
    "chapterTwo": true,
    "afternoon": true,
    "opening": true,
    "continuation": true,
    "rowan": true,
    "music": "catching-up",
    "lines": [
      {
        "speaker": "",
        "text": "Outside, Rowan walks a little faster."
      },
      {
        "speaker": "You",
        "text": "Friday?"
      },
      {
        "speaker": "Rowan",
        "text": "Yeah."
      },
      {
        "speaker": "You",
        "text": "You didn’t mention that part.",
        "conditions": [
          [
            "porchTopic_rowan",
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "What’s he waiting for?",
        "conditions": [
          [
            "porchTopic_rowan",
            true,
            true
          ]
        ]
      },
      {
        "speaker": "Rowan",
        "text": "He offered me an apprenticeship. Paid, regular hours. I haven’t answered yet.",
        "conditions": [
          [
            "porchTopic_rowan",
            true,
            true
          ]
        ]
      },
      {
        "speaker": "You",
        "text": "Are you going to say yes?"
      },
      {
        "speaker": "",
        "text": "He slows down."
      },
      {
        "speaker": "Rowan",
        "text": "I want to."
      },
      {
        "speaker": "You",
        "text": "Then—"
      },
      {
        "speaker": "",
        "text": "His phone rings. He checks it."
      },
      {
        "speaker": "",
        "text": "For a second, he just stands there. Then he silences the call."
      },
      {
        "speaker": "You",
        "text": "You need to get that?"
      },
      {
        "speaker": "Rowan",
        "text": "No. I’ll call back."
      },
      {
        "speaker": "",
        "text": "He puts the phone away."
      },
      {
        "speaker": "Rowan",
        "text": "Come on. Flowers are this way."
      },
      {
        "speaker": "",
        "text": "We buy flowers, then drop the groceries at home before heading to the cemetery."
      }
    ],
    "next": "c2GraveTogether"
  }
};
