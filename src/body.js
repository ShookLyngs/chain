// chain(body): body methods

import { merge } from "@lyngs/merge";
import { generateToken } from "./util";

const ChainStatus = {
  Ready:    Symbol('ready'),
  Progress: Symbol('progress'),
  Finished: Symbol('finished'),
  Canceled: Symbol('canceled'),
};

const initializeContext = (...params) => {
  const context = {
    token: generateToken(),
    queue: [],
    hooks: {
      // life-circle
      onStart: [],
      onProgress: [],
      onBeforeCancel: [],
      onCanceled: [],
      onFinish: [],
      // hack-in
      onBeforeHack: [],
      onHacked: [],
    },
    data: {
      caller: null,
      status: ChainStatus.Ready,
    },
  };
  return merge(context, ...params);
};

const useMiddleware = (context, injection, next) => {
  if (typeof injection !== 'function') {
    throw new Error('injection must be an instance of Function');
  }
  context.queue.push({
    token: context.token,
    name: injection.name ?? 'anonymous',
    action: () => injection(context.data, next),
  });
};

const createNext = (context) => {
  const queue = context.queue;
  return async (forward = true) => {
    if (!forward) {
      cancelProgress(context);
    }
    if (context.data.status === ChainStatus.Canceled) {
      throw { status: ChainStatus.Canceled };
    }

    if (queue.length) {
      const task = queue.shift();
      triggerHook(context, 'onProgress', task);

      await task.action(context, createNext(context));
    } else {
      context.data.status = ChainStatus.Finished;
      triggerHook(context, 'onFinish');
    }
  };
};

const startProgress = (context) => {
  return async () => {
    triggerHook(context, 'onStart');

    context.data.status = ChainStatus.Progress;
    try {
      await createNext(context)();
    } catch(error) {
      if (error.status === ChainStatus.Canceled) {
        triggerHook(context, 'onCanceled');
      } else {
        throw error;
      }
    }
  };
};

const cancelProgress = (context) => {
  triggerHook(context, 'onBeforeCancel');
  context.data.status = ChainStatus.Canceled;
};

const hackContext = (context, injection) => {
  triggerHook(context, 'onBeforeHack');

  if (typeof injection !== 'function') {
    throw new Error('injection must be an instance of Function');
  }
  context = injection(context);

  triggerHook(context, 'onHacked');
  return context;
};

const registerHook = (context, type, isTriggerImmediately = false) => {
  if (!type) {
    throw new Error(`require param 'type'`);
  }
  if (!context.hooks) {
    context.hooks = {};
  }
  if (!context.hooks[type]) {
    context.hooks[type] = [];

    if (isTriggerImmediately) {
      triggerHook(context, type);
    }
  } else {
    console.warn(`Hook ${type} has been registered before`);
  }
};

const registerHooks = (context, types, isTriggerImmediately = false) => {
  if (!Array.isArray(types) && Object.prototype.toString.call(types) !== '[object Object]') {
    types = [ types ];
  }
  if (Array.isArray(types)) {
    // prevent same-types in a queue
    [ ...(new Set(types)) ].forEach((type) => {
      registerHook(context, type, isTriggerImmediately);
    });
  } else if (Object.prototype.toString.call(types) === '[object Object]') {
    for (const key in types) {
      if (!Object.prototype.hasOwnProperty.call(types, key)) continue;
      registerHook(context, types[key]?.type, types[key]?.trigger);
    }
  }
};

const useHook = (context, getData, type, callback) => {
  // empty-error
  if (!type) {
    throw new Error(`can't find param 'type'`);
  }
  // callback type-error
  if (typeof callback !== 'function') {
    throw new Error(`param 'callback' must be an instance of Function`);
  }

  // check type's type-check and push it to list
  if (context.hooks[type] !== void 0) {
    const token = generateToken();
    context.hooks[type].push({ token, getData, callback });
    return token;
  } else {
    throw new Error(`can't find hook type: ${type}`);
  }
};

const removeHook = (context, token) => {
  if (!token) {
    throw new Error(`can't find param 'token'`);
  }
  const hooks = context.hooks;
  for (let key in hooks) {
    if (!Object.prototype.hasOwnProperty.call(hooks, key)) continue;
    if (!hooks[key]?.length) continue;
    hooks[key] = hooks[key].filter(hook => hook.token !== token);
  }
};

const triggerHook = (context, type, ...params) => {
  if (!type) {
    throw new Error(`can't find param 'type'`);
  }

  const hooks = context?.hooks?.[type];
  if (hooks?.length || hooks?.length === 0) {
    hooks.forEach((hook) => {
      hook.callback(hook.getData(), ...params);
    });
    return true;
  } else {
    console.warn(`hook doesn't exists: ${type}`);
    return false;
  }
};

export {
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
};