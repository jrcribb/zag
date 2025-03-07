"use strict";

var _xstate = require("xstate");
const {
  actions,
  createMachine,
  assign
} = _xstate;
const {
  choose
} = actions;
const fetchMachine = createMachine({
  id: "collapsible",
  initial: ctx.open ? "open" : "closed",
  context: {
    "isOpenControlled": false,
    "isOpenControlled": false,
    "isOpenControlled": false,
    "isOpenControlled": false
  },
  exit: ["clearInitial", "cleanupNode"],
  on: {
    UPDATE_CONTEXT: {
      actions: "updateContext"
    }
  },
  states: {
    closed: {
      tags: ["closed"],
      on: {
        "CONTROLLED.OPEN": "open",
        OPEN: [{
          cond: "isOpenControlled",
          actions: ["invokeOnOpen"]
        }, {
          target: "open",
          actions: ["setInitial", "computeSize", "invokeOnOpen"]
        }]
      }
    },
    closing: {
      tags: ["open"],
      activities: ["trackExitAnimation"],
      on: {
        "CONTROLLED.CLOSE": "closed",
        "CONTROLLED.OPEN": "open",
        OPEN: [{
          cond: "isOpenControlled",
          actions: ["invokeOnOpen"]
        }, {
          target: "open",
          actions: ["setInitial", "invokeOnOpen"]
        }],
        CLOSE: [{
          cond: "isOpenControlled",
          actions: ["invokeOnExitComplete"]
        }, {
          target: "closed",
          actions: ["setInitial", "computeSize", "invokeOnExitComplete"]
        }],
        "ANIMATION.END": {
          target: "closed",
          actions: ["invokeOnExitComplete", "clearInitial"]
        }
      }
    },
    open: {
      tags: ["open"],
      activities: ["trackEnterAnimation"],
      on: {
        "CONTROLLED.CLOSE": "closing",
        CLOSE: [{
          cond: "isOpenControlled",
          actions: ["invokeOnClose"]
        }, {
          target: "closing",
          actions: ["setInitial", "computeSize", "invokeOnClose"]
        }],
        "SIZE.MEASURE": {
          actions: ["measureSize"]
        },
        "ANIMATION.END": {
          actions: ["clearInitial"]
        }
      }
    }
  }
}, {
  actions: {
    updateContext: assign((context, event) => {
      return {
        [event.contextKey]: true
      };
    })
  },
  guards: {
    "isOpenControlled": ctx => ctx["isOpenControlled"]
  }
});