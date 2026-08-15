/**
 * Robust finite state machine for game and entity lifecycles.
 */
export class StateMachine {
  constructor(initialState = null) {
    this.states = new Map();
    this.currentState = null;
    this.previousState = null;
    if (initialState) {
      this.addState(initialState);
      this.transitionTo(initialState);
    }
  }

  addState(name, config = {}) {
    this.states.set(name, {
      enter: config.enter || (() => {}),
      update: config.update || (() => {}),
      exit: config.exit || (() => {}),
    });
    return this;
  }

  transitionTo(name, payload = {}) {
    if (!this.states.has(name)) {
      console.warn(`[StateMachine] Unknown state "${name}"`);
      return;
    }

    if (this.currentState && this.states.get(this.currentState)) {
      this.states.get(this.currentState).exit();
    }

    this.previousState = this.currentState;
    this.currentState = name;
    this.states.get(name).enter(payload);
  }

  update(dt) {
    if (this.currentState && this.states.get(this.currentState)) {
      this.states.get(this.currentState).update(dt);
    }
  }

  is(stateName) {
    return this.currentState === stateName;
  }
}
