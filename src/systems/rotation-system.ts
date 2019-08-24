import { System, World } from '@jakeklassen/ecs';
import { Rotator } from '../components/rotator';
import { Transform2d } from '../components/transform2d';

export class RotationSystem extends System {
  update(world: World, dt: number): void {
    for (const [entity, components] of world.view(Transform2d, Rotator)) {
      const transform = components.get<Transform2d>(Transform2d)!;
      const rotator = components.get<Rotator>(Rotator)!;

      transform.rotation += rotator.value * dt;
    }
  }
}
