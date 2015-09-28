/// <reference path="pixi/pixi.d.ts" />
/// <reference path="easeljs/easeljs.d.ts" />
/// <reference path="Path.ts" />
/// <reference path="ColorUtil.ts" />
/// <reference path="ParticleEmitter.ts" />
/// <reference path="Particle.ts" />

/**
 * Stats クラスの定義宣言です。
 */
declare class Stats {
	domElement:HTMLElement;

	update():void;
}

namespace project {

	// 初期化命令
	window.addEventListener("load", ()=> {
		new project.Main();
	});

	/**
	 * パーティクルデモのメインクラスです。
	 * @class project.Main
	 */
	export class Main {
		private stage:PIXI.Container;
		private renderer:PIXI.SystemRenderer;
		public stats:Stats;

		/**
		 * @constructor
		 */
		constructor() {
			this.stage = new PIXI.Container();

			this.renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor: 0x000000});
			document.body.appendChild(this.renderer.view);


			// パーティクルサンプルを作成
			var sample = new ParticleSample();
			this.stage.addChild(sample);

			// Tickerを作成
			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.on("tick", this.handleTick, this);

			this.stats = new Stats();
			document.body.appendChild(this.stats.domElement);

			// リサイズイベント
			this.handleResize();
			window.addEventListener("resize", ()=> {
				this.handleResize()
			});
		}

		/**
		 * エンターフレームイベント
		 */
		private handleTick():void {
			// create residual image effect
			this.renderer.render(this.stage);

			this.stats.update();
		}

		/**
		 * リサイズイベント
		 */
		private handleResize():void {
			(<PIXI.WebGLRenderer> this.renderer).resize(innerWidth, innerHeight);
		}
	}


	/**
	 * 大量のパーティクルを発生させてみた
	 * マウスを押してる間でてくるよ
	 * @see http://wonderfl.net/c/4WjT
	 * @class demo.ParticleSample
	 */
	class ParticleSample extends PIXI.Container {
		private _emitter:ParticleEmitter;
		private _bg:PIXI.Graphics;
		private _count:number;
		private _lines:createjs.Shape;
		private _linePoint:any[];
		private _isDown:boolean;
		private _shadow:PIXI.Sprite;
		private stageEaselJS:createjs.Stage;
		private canvasForDisplay:HTMLCanvasElement;
		private pathList:project.Path[];
		private mousePositions:{x:number;y:number;isDown:boolean}[];


		constructor() {
			super();
			// パーティクルを初期化
			ParticleInitializer.generate();

			this.interactive = true;

			this._count = 0;

			this._bg = new PIXI.Graphics();
			this.addChild(this._bg);

			this.canvasForDisplay = document.createElement("canvas");
			this.canvasForDisplay.className = "drawing";
			this.canvasForDisplay.style.pointerEvents = "none";
			var canvasForEasel = document.createElement("canvas");
			this.stageEaselJS = new createjs.Stage(canvasForEasel);
			document.body.appendChild(this.canvasForDisplay);

			var max = 1500;
			this.pathList = [];
			this.mousePositions = [];
			for (var i = 0; i < max; i++) {
				var p = new Path();
				p.setup(0, 0, 0.3 + i / max * 0.5, (180 * Math.random() >> 0), (i + 1) / max);
				this.pathList.push(p);
			}


			this._lines = new createjs.Shape();
			this.stageEaselJS.addChild(this._lines);
			this._linePoint = [];

			this._emitter = new ParticleEmitter();
			this._emitter.latestX = innerWidth / 2;
			this._emitter.latestY = innerHeight / 2;
			this.addChild(this._emitter.container);

			this._shadow = new PIXI.Sprite(PIXI.Texture.fromImage("imgs/Shadow-assets/Shadow.png"));
			this._shadow.blendMode = PIXI.BLEND_MODES.SCREEN;
			this.addChild(this._shadow);

			this
				// events for drag start
				.on("mousedown", this.handleMouseDown, this)
				.on('touchstart', this.handleMouseDown, this)
				// events for drag move
				.on("mousemove", this.handleMouseMove, this)
				.on('touchmove', this.handleMouseMove, this)
				// events for drag end
				.on("mouseup", this.handleMouseUp, this)
				.on("mouseupoutside", this.handleMouseUp, this)
				.on("touchend", this.handleMouseUp, this)
				.on("touchendoutside", this.handleMouseUp, this)

			createjs.Ticker.on("tick", this.enterFrameHandler, this);

			this.handleResize();
			window.addEventListener("resize", ()=> {
				this.handleResize();
			});
		}


		/**
		 * エンターフレームイベント
		 * @param event
		 */
		private enterFrameHandler(event:createjs.Event):void {

			if (this._isDown) {
				this.createParticle();
			}

			this.mousePositions.unshift({x: this._emitter.latestX, y: this._emitter.latestY, isDown: this._isDown});

			for (var i = 0; i < this.pathList.length; i++) {
				var p = this.pathList[i];

				if (this.mousePositions.length > p.delayFrame) {
					var position = this.mousePositions[p.delayFrame];
					//    マウスの位置更新
					p.setMousePosition(position.x, position.y, !position.isDown);
					p.update();
				}
			}

			var gCurve = this._lines.graphics;
			gCurve.clear();
			gCurve.setStrokeStyle(1)

			for (var i = 0; i < this.pathList.length; i++) {
				var p = this.pathList[i];

				// マウスの軌跡を変数に保存
				var p0x = p.point.x;
				var p0y = p.point.y;
				var p1x = p.prev.x;
				var p1y = p.prev.y;
				var p2x = p.prev2.x;
				var p2y = p.prev2.y;

				if (p0x == p2x || p0y == p2y)
					continue;
				if (p0x == p1x || p0y == p1y)
					continue;

				// カーブ用の頂点を割り出す
				var curveStartX = (p2x + p1x) / 2;
				var curveStartY = (p2y + p1y) / 2;
				var curveEndX = (p0x + p1x) / 2;
				var curveEndY = (p0y + p1y) / 2;

				// カーブは中間点を結ぶ。マウスの座標は制御点として扱う。
				var colorLine = createjs.Graphics.getHSL(
					180,
					100,
					100,
					p.percent
				);

				gCurve
					.beginStroke(colorLine)
					.moveTo(curveStartX, curveStartY)
					.curveTo(p1x, p1y, curveEndX, curveEndY)
					.endStroke();
			}

			var color1 = {h: new Date().getTime() / 40, s: 30, l: 40};
			var color2 = {h: (new Date().getTime() + 40 * 89) / 40, s: 70, l: 70};
			this._bg.clear();


			// グラデーションを作るための無理矢理な手法
			for (var i = 0, max = 1024; i < max; i++) {
				var color = ColorUtil.hslToRgb(
					color1.h * (i / max) + color2.h * (1 - i / max),
					color1.s * (i / max) + color2.s * (1 - i / max),
					color1.l * (i / max) + color2.l * (1 - i / max));

				this._bg.beginFill(color, 1.0);
				this._bg.drawRect(0, window.innerHeight * i / max, window.innerWidth, window.innerHeight / max);
			}

			this._emitter.update();

			if (this._isDown) {
				this._linePoint.push({
					x: this._emitter.x,
					y: this._emitter.y,
					vx: this._emitter.vx,
					vy: this._emitter.vy,
					angular: this._emitter.angular
				});
			} else {
				this._linePoint.shift();
			}


			if (max > 200) {
				this._linePoint.shift();
			}


			var contextForDisplay = this.canvasForDisplay.getContext("2d");
			contextForDisplay.globalCompositeOperation = "source-over";
			contextForDisplay.setTransform(1, 0, 0, 1, 0, 0);
			contextForDisplay.fillStyle = "rgba(0, 0, 0, 0.1)";
			contextForDisplay.fillRect(0, 0, innerWidth, innerHeight);

			contextForDisplay.drawImage(<HTMLCanvasElement>this.stageEaselJS.canvas, 0, 0);

			this.stageEaselJS.update();
		}


		private handleMouseDown(event:PIXI.interaction.InteractionEvent):void {
			var data = event.data;
			this._isDown = true;

			this._emitter.x = data.global.x;
			this._emitter.y = data.global.y;
			this._emitter.latestX = data.global.x;
			this._emitter.latestY = data.global.y;
		}

		private handleMouseMove(event:PIXI.interaction.InteractionEvent):void {
			var data = event.data;

			this._emitter.latestX = data.global.x;
			this._emitter.latestY = data.global.y;
		}

		private handleMouseUp(event:PIXI.interaction.InteractionEvent):void {
			var data = event.data;
			this._isDown = false;

			this._emitter.latestX = data.global.x;
			this._emitter.latestY = data.global.y;
		}

		private createParticle():void {
			this._emitter.emit(this._emitter.latestX, this._emitter.latestY);
		}

		private handleResize():void {
			this._shadow.scale.x = (window.innerWidth / 1024);
			this._shadow.scale.y = (window.innerHeight / 1024);

			(<HTMLCanvasElement>this.stageEaselJS.canvas).width = innerWidth;
			(<HTMLCanvasElement>this.stageEaselJS.canvas).height = innerHeight;
			this.canvasForDisplay.width = innerWidth;
			this.canvasForDisplay.height = innerHeight;
		}
	}
}

