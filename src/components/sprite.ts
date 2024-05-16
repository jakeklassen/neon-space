import { Component } from "@jakeklassen/ecs";

export class Sprite extends Component {
	constructor(public image: HTMLImageElement) {
		super();
	}
}
