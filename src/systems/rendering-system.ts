import { System, World } from "@jakeklassen/ecs";
import { Transform2d } from "../components/transform2d";
import { Sprite } from "../components/sprite";
import { IDENTITY_MATRIX } from "../lib/canvas";

export class RenderingSystem extends System {
	private readonly ctx: CanvasRenderingContext2D;

	constructor(private readonly canvas: HTMLCanvasElement) {
		super();

		this.ctx = canvas.getContext("2d")!;
	}

	update(world: World, _dt: number): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const [_entity, components] of world.view(Transform2d, Sprite)) {
			const transform = components.get<Transform2d>(Transform2d)!;
			const sprite = components.get<Sprite>(Sprite)!;

			this.ctx.globalCompositeOperation = "lighter";
			this.ctx.translate(transform.position.x, transform.position.y);
			this.ctx.rotate(transform.rotation);

			this.ctx.drawImage(
				sprite.image,
				-sprite.image.width / 2,
				-sprite.image.height / 2,
				sprite.image.width as number,
				sprite.image.height as number,
			);

			this.ctx.setTransform(IDENTITY_MATRIX);
		}
	}
}
