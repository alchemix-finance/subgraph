import { Argv } from 'yargs';
import { args } from '.';

export type UnpackPromise<T> = T extends PromiseLike<infer U> ? U : T;
export type CommonArgs = UnpackPromise<typeof args>;
export type CommandArgs<T extends (argv: Argv) => Argv> = CommonArgs & UnpackPromise<ReturnType<T>['argv']>;
