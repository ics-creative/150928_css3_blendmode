/// <reference path="pixi/pixi.d.ts" />
/// <reference path="ParticleInitializer.ts" />

namespace project {
	/**
	 * パーティクル表示クラスです。
	 * @class demo.Particle
	 */
	export class Particle extends PIXI.Sprite {
		public vx:number;
		public vy:number;
		public life:number;
		public size:number;

		private _count:number;
		private _destroy:boolean;
		private _vAngular:number;

		/**
		 * コンストラクタ
		 * @constructor
		 */
		constructor() {
			var texture = PIXI.Texture.fromFrame("particle_" + (ParticleInitializer.NUM_PARTICLE * Math.random() >> 0));
			super(texture);

			this.blendMode = PIXI.BLEND_MODES.SCREEN;
			this.pivot.x = texture.frame.width / 2;
			this.pivot.y = texture.frame.height / 2;

			this._destroy = true;
		}

		/**
		 * パーティクルをリセットします。
		 * @param emitX
		 * @param emitY
		 * @param vx
		 * @param vy
		 * @param vAngular
		 */
		public resetParameters(emitX:number, emitY:number, vx:number, vy:number, vAngular:number):void {

			this.x = emitX;
			this.y = emitY;
			this.vx = vx * 0.5 + (Math.random() - 0.5) * 10;
			this.vy = vy * 0.5 + (Math.random() - 0.5) * 10;
			this.life = Math.random() * Math.random() * 300 + 30;
			this._count = 0;
			this._destroy = false;
			this.rotation = 360 * Math.random();
			this._vAngular = vAngular;

			this.alpha = 1.0;
			this.scale.x = this.scale.y = 1.0;
		}

		/**
		 * パーティクル個別の内部計算を行います。
		 * @method
		 */
		public update():void {

			// Gravity
			this.vy += 0.2;

			this.x += this.vx;
			this.y += this.vy;
			this.rotation += this._vAngular;

			this._count++;

			var maxD:number = (1 - this._count / this.life * 1 / 3);

			this.alpha = Math.random() * 0.4 + 0.6 * this._count / this.life;
			this.scale.x = this.scale.y = maxD;

			// 死亡フラグ
			if (this.life < this._count) {
				this._destroy = true;
				this.parent.removeChild(this);
			}
		}

		/**
		 * パーティクルが死んでいるかどうかを確認します。
		 * @returns {boolean}
		 * @method
		 */
		public getIsDead():boolean {
			return this._destroy;
		}
	}


}