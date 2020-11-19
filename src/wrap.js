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
  useHook,
  removeHook,
  removeHooks,
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
  async start() {
    await startProgress(this._context)();
    return this;
  }
  cancel() {
    cancelProgress(this._context);
    return this;
  }

  // hooks
  on(type, callback) {
    useHook(this._context, () => this._context.data, type, callback);
    return this;
  }
  off(target) {
    if (typeof target === 'function') {
      removeHook(this._context, target);
    } else {
      removeHooks(target);
    }
    return this;
  }
  emit(type) {
    triggerHook(this._context, type);
    return this;
  }

  // life-circle-hooks
  onStart(callback) {
    this.on('onStart', callback);
    return this;
  }
  onProgress(callback) {
    this.on('onProgress', callback);
    return this;
  }
  onBeforeCancel(callback) {
    this.on('onBeforeCancel', callback);
    return this;
  }
  onCanceled(callback) {
    this.on('onCanceled', callback);
    return this;
  }
  onBubbling(callback) {
    this.on('onBubbling', callback);
    return this;
  }
  onFinish(callback) {
    this.on('onFinish', callback);
    return this;
  }

  // hack-hooks
  onBeforeHack(callback) {
    this.on('onBeforeHack', callback);
    return this;
  }
  onHacked(callback) {
    this.on('onHacked', callback);
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
  useHook,
  removeHook,
  triggerHook,

  // classes
  ChainBuilder,

  // wraps
  chain,
};