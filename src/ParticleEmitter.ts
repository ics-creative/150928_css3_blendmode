/// <reference path="Particle.ts" />

namespace project {

	/**
	 * パーティクル発生装置。マウス座標から速度を計算します。
	 * @class project.Emitter
	 */
	export class Emitter {
		/** 速度(X方向)です。 */
		public vy:number = 0;
		/** 速度(Y方向)です。 */
		public x:number = 0;
		/** マウスのX座標です。 */
		public latestY:number = 0;
		/** マウスのY座標です。 */
		public latestX:number = 0;
		/** パーティクル発生のX座標です。 */
		public y:number = 0;
		/** パーティクル発生のY座標です。 */
		public vx:number = 0;

		/** 現在のベクトルの角度です。 */
		public angular:number = 0;
		/** 角速度です。 */
		public vAngular:number = 0;

		/**
		 * @constructor
		 */
		constructor() {
		}

		/**
		 * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
		 * @method
		 */
		public update():void {
			var dx:number = this.latestX - this.x;
			var dy:number = this.latestY - this.y;
			var d:number = Math.sqrt(dx * dx + dy * dy) * 0.2;
			var rad:number = Math.atan2(dy, dx);

			this.vx += Math.cos(rad) * d;
			this.vy += Math.sin(rad) * d;

			this.vx *= 0.4;
			this.vy *= 0.4;

			this.x += this.vx;
			this.y += this.vy;

			this.vAngular = rad - this.angular;
			this.angular = rad;
		}
	}


	/**
	 * パーティクルエミッターのクラスです。
	 * @class project.ParticleEmitter
	 */
	export class ParticleEmitter extends Emitter {
		/** 1フレーム間に発生させる Particle 数 */
		numParticles:number;
		container:PIXI.Container;
		PRE_CACHE_PARTICLES:number;
		_particleActive:Particle[];
		_particlePool:Particle[];

		/**
		 * @constructor
		 */
		constructor() {
			super();

			this.numParticles = 10;
			this.PRE_CACHE_PARTICLES = 300;

			this.container = new PIXI.Container();

			this._particleActive = [];
			this._particlePool = [];

			/* 予め必要そうな分だけ作成しておく */
			for (var i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
				this._particlePool.push(new Particle());
			}
		}

		/**
		 * パーティクルを発生させます。
		 * @param {number} x パーティクルの発生座標
		 * @param {number} y パーティクルの発生座標
		 * @method
		 */
		public emit(x:number, y:number):void {
			for (var i = 0; i < this.numParticles; i++) {
				this.getNewParticle(x, y);
			}
		}

		/**
		 * パーティクルを更新します。
		 * @method
		 */
		public update():void {

			super.update();

			for (var i = 0; i < this._particleActive.length; i++) {
				var p = this._particleActive[i];
				if (!p.getIsDead()) {

					if (p.y >= window.innerHeight) {
						p.vy *= -0.9;
						p.y = window.innerHeight;
					} else if (p.y <= 0) {
						p.vy *= -0.9;
						p.y = 0;
					}
					if (p.x >= window.innerWidth) {
						p.vx *= -0.9;
						p.x = window.innerWidth;
					} else if (p.x <= 0) {
						p.vx *= -0.9;
						p.x = 0;
					}

					p.update();
				} else {
					this.removeParticle(p);
				}
			}
		}

		/**
		 * パーティクルを追加します。
		 * @param {THREE.Vector3} emitPoint
		 * @return {project.Particle}
		 * @method
		 */
		public getNewParticle(emitX:number, emitY:number):Particle {
			var p:Particle = this.fromPool();
			p.resetParameters(this.x, this.y, this.vx, this.vy, this.vAngular);
			this._particleActive.push(p);
			this.container.addChild(p);
			return p;
		}

		/**
		 * パーティクルを削除します。
		 * @param {Particle} particle
		 * @method
		 */
		public removeParticle(p:Particle):void {

			this.container.removeChild(p);

			var index = this._particleActive.indexOf(p);
			if (index > -1) {
				this._particleActive.splice(index, 1);
			}

			this.toPool(p);
		}

		/**
		 * アクティブなパーティクルを取り出します。
		 * @returns {project.Particle[]}
		 * @method
		 */
		public getActiveParticles():Particle[] {
			return this._particleActive;
		}


		/**
		 * プールからインスタンスを取り出します。
		 * プールになければ新しいインスタンスを作成します。
		 * @returns {project.Particle}
		 * @method
		 */
		public fromPool():Particle {
			if (this._particlePool.length > 0)
				return this._particlePool.shift();

			else return new Particle();
		}

		/**
		 * プールにインスタンスを格納します。
		 * @param {project.Particle}
		 * @method
		 */
		public toPool(particle:Particle):void {
			this._particlePool.push(particle);
		}
	}

}