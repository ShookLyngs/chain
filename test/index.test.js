import { expect } from 'chai';
import { chain } from '../dist';

describe(`create chain()`, () => {
  it('pass <context> across the normal <life-circle>', (done) => {
    chain({ name: 'shook' })
      .use(async (context, next) => {
        expect(context.name).to.equal('shook');
        context.step = 1;
        await next();
        expect(context.step).to.equal(2);
        done();
      })
      .use(async (context, next) => {
        expect(context.step).to.equal(1);
        await next();
        context.step = 2;
      })
      .start();
  });

  it('hooks [ onStart, onProgress, onFinish, onBeforeHack, onHacked ]', (done) => {
    const calls = {
      // life-circle
      onStart: 0,
      onProgress: 0,
      onFinish: 0,
      // hack
      onBeforeHack: 0,
      onHacked: 0,
    };
    const instance = chain({ name: 'shook' });
    instance
      .use(async (context, next) => {
        await next();
        expect(calls).to.eql({
          // life-circle
          onStart: 1,
          onProgress: 2,
          onFinish: 1,
          // hack
          onBeforeHack: 1,
          onHacked: 1,
        });
        done();
      })
      .use(async (context, next) => {
        instance.hack((root) => root);
        await next();
      })
      .onStart(() => {
        ++calls.onStart;
      })
      .onProgress(() => {
        ++calls.onProgress;
      })
      .onBeforeHack(() => {
        ++calls.onBeforeHack;
      })
      .onHacked(() => {
        ++calls.onHacked;
      })
      .onFinish(() => {
        ++calls.onFinish;
      })
      .start();
  });

  it('hooks [ onBeforeCancel, onCanceled ]', (done) => {
    const calls = {
      // life-circle
      onStart: 0,
      onProgress: 0,
      onFinish: 0,
      onBeforeCancel: 0,
      onCanceled: 0,
      // hack
      onBeforeHack: 0,
      onHacked: 0,
    };
    const instance = chain({ name: 'shook' });
    instance
      .use(async (context, next) => {
        //instance.cancel();
        await next(false);
      })
      .use(async (context, next) => {
        instance.hack((root) => root);
        await next();
      })
      .onStart(() => {
        ++calls.onStart;
      })
      .onProgress(() => {
        ++calls.onProgress;
      })
      .onBeforeHack(() => {
        ++calls.onBeforeHack;
      })
      .onHacked(() => {
        ++calls.onHacked;
      })
      .onFinish(() => {
        ++calls.onFinish;
      })
      .onBeforeCancel(() => {
        ++calls.onBeforeCancel;
      })
      .onCanceled(() => {
        ++calls.onCanceled;
        expect(calls).to.be.equal({
          // life-circle
          onStart: 1,
          onProgress: 2,
          onFinish: 0,
          onBeforeCancel: 1,
          onCanceled: 1,
          // hack
          onBeforeHack: 0,
          onHacked: 0,
        });
        done();
      })
      .start();
  });
});