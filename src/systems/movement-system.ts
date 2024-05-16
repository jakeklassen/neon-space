import { System, World } from "@jakeklassen/ecs";
import { Transform2d } from "../components/transform2d";
import { Velocity2d } from "../components/velocity2d";

export class MovementSystem extends System {
	update(world: World, dt: number): void {
		for (const [_entity, components] of world.view(Transform2d, Velocity2d)) {
			const transform = components.get<Transform2d>(Transform2d)!;
			const velocity = components.get<Velocity2d>(Velocity2d)!;

			transform.position.x += velocity.x * dt;
			transform.position.y += velocity.y * dt;
		}
	}
}
