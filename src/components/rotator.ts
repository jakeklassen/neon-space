import { Component } from '@jakeklassen/ecs';

export class Rotator extends Component {
  constructor(public value: number) {
    super();
  }
}
