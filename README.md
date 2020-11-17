# @lyngs/chain

`@lyngs/chain` is a module that can be use to build `onion-model` basis chain object.

## Install

Install `@lyngs/chain` with **NPM**: 

```jsx
npm i -s @lyngs/chain
```

## Initialize

To create a chain, just simply call `chain()`:

```jsx
import { chain } from '@lyngs/chain';
const instance = chain();
```

Create with `params`:

```jsx
const instance = chain({ caller: this }, someValue, anotherValue);
```

## Properties

`chain-instance` provides some properties to be use:

[Properties of chain-instance](readme-resources/Properties%20of%20chain-instance%202cbeabcd4e324494a2503981cdf79dcd.csv)

### use(injection)

To add a `chain-node`, use method `use()`:

```jsx
instance.use(async (context, next) => {
	context.to = 'forward'; // update context
	await next(); // push chain to the next node
});
```

`context` in chain will continualy be passed in `chain-nodes`, across the whole life-circle of chain.

```jsx
// first-node
instance.use(async (context, next) => {
	context.to = 'forward';
	await next();
});
// last-node
instance.use(async (context, next) => {
	console.log(context.to); // 'forward'
	await next();
});
```

When all `chain-nodes` finished their jobs, stacks start to pop up.

Behavior like this, it's looking just like an onion, so that's why we call it `onion-model`:

```jsx
// first-node
instance.use(async (context, next) => {
	console.log(context.to); // undefined
	await next();
	console.log(context.to); // 'backward'
});
// last-node
instance.use(async (context, next) => {
	await next();
	context.to = 'backward';
});
```

### context(...params)

If you're trying to merge something to `context`, use method `context()`:

```jsx
instance.use(async (context, next) => {
	instance.context({
		to: 'forward'
	})
	await next();
});
```

### start()

Use this method to start the whole chain progress.

`chain-nodes` you added will line up in a queue, waiting to be call:

```jsx
instance
	.use(...)
	.use(...)
	.start();
```

### cancel()

If your're trying to cancel or stop the whole chain progress, you can use this method:

```jsx
instance
	.use(...)
	.use(async (context, next) => {
		if (context.catch) {
			instance.cancel();
		}
		await next();
	})
	.use(...) // if context.catch exists, then this chain-node won't be called
	.start();
```

Or you can simply cancel the progress by passing a param in the calling of `next()`:

```jsx
instance
	.use(...)
	.use(async (context, next) => {
		await next(!context.catch);
	})
	.use(...) // if context.catch exists, then this chain-node won't be called
	.start();
```

### hack(injection: (rootContext) ⇒ rootContext)

[**Warn**] you need to be careful with this function.

Inside of `chain-instance`, there are some properties hidden in.

Those are what developers normally wouldn't need to know about.

But to make sure the module have the abblity to grow, there is an API for developers to visit those hidden properties.

Method `hack()` can help you hack in the `rootContext` property of `chain-instance`, and then you can edit it manually:

```jsx
instance.hack((root) => {
	root.queue.unshift({ ... }); // editing property 'queue' manually
	return root;
});
```

One thing must be clear: 

editing the `rootContext` might break the layout of `chain-instance`.

And when the layout broke, `chain-instance` might not work as it should be.

So if you must use this function, then treat `rootContext` carefully.