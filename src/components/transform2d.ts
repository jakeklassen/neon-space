import { Vector2d } from '../lib/vector2d';
import { Component } from '@jakeklassen/ecs';

export class Transform2d extends Component {
  public position = Vector2d.zero();
  public rotation = 0;

  constructor(position: Vector2d = Vector2d.zero()) {
    super();
    this.position = position;
  }
}
