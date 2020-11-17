// chain(wrap): pack body methods to a class

import { merge } from "@lyngs/merge";
import {
  // symbols
  ChainStatus,

  // original-methods
  initializeContext,
  useMiddleware,
  createNext,
  startProgress,
  cancelProgress,
  hackContext,
  registerHook,
  registerHooks,
  useHook,
  removeHook,
  triggerHook,
} from './body';


class ChainBuilder {
  // initialize chain instance
  constructor(...params) {
    // create context
    this._context = initializeContext();
    merge(this._context.data, ...params);

    return this;
  }

  // context
  context(...params) {
    merge(this._context.data, ...params);
    return this;
  }
  hack(injection) {
    hackContext(this._context, injection);
    return this;
  }

  // middleware
  use(injection) {
    useMiddleware(
      this._context,
      injection,
      createNext(this._context)
    );
    return this;
  }
  start() {
    startProgress(this._context)();
    return this;
  }
  cancel() {
    cancelProgress(this._context);
    return this;
  }

  // hooks
  useHook(type, callback, getToken) {
    const token = useHook(this._context, () => this._context.data, type, callback);
    if (typeof token === 'function') {
      getToken(token);
    }
    return this;
  }
  removeHook(token) {
    removeHook(this._context, token);
    return this;
  }
  registerHook(type) {
    registerHooks(this._context, type);
    return this;
  }
  triggerHook(type) {
    triggerHook(this._context, type);
    return this;
  }

  // life-circle-hooks
  onStart(callback, getToken) {
    this.useHook('onStart', callback, getToken);
    return this;
  }
  onProgress(callback, getToken) {
    this.useHook('onProgress', callback, getToken);
    return this;
  }
  onBeforeCancel(callback, getToken) {
    this.useHook('onBeforeCancel', callback, getToken);
    return this;
  }
  onCanceled(callback, getToken) {
    this.useHook('onCanceled', callback, getToken);
    return this;
  }
  onFinish(callback, getToken) {
    this.useHook('onFinish', callback, getToken);
    return this;
  }
  onBeforeHack(callback, getToken) {
    this.useHook('onBeforeHack', callback, getToken);
    return this;
  }
  onHacked(callback, getToken) {
    this.useHook('onHacked', callback, getToken);
    return this;
  }
}

const chain = (...params) => new ChainBuilder(...params);

export default ChainBuilder;
export {
  // enum
  ChainStatus,

  // original-methods
  initializeContext,
  useMiddleware,
  createNext,
  cancelProgress,
  hackContext,
  registerHook,
  registerHooks,
  useHook,
  removeHook,
  triggerHook,

  // classes
  ChainBuilder,

  // wraps
  chain,
};