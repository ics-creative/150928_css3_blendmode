/// <reference path="easeljs/easeljs.d.ts" />

namespace project {

	/**
	 * ベクトルパスのクラスです。
	 */
	export class Path {
		public prev:createjs.Point = new createjs.Point();
		public prev2:createjs.Point = new createjs.Point();
		public point:createjs.Point = new createjs.Point();
		private mouse:createjs.Point = new createjs.Point();
		public delayFrame:number;
		public percent:number;


		//加速度運動の変数
		private xx:number;
		private yy:number;
		private vx:number;
		private vy:number;
		private ac:number;
		private de:number;
		/** 線幅の係数 */
		private wd:number;

		private pivotX:number;
		private pivotY:number;

		constructor() {
		}

		/**
		 * セットアップします。
		 * @param {number} x
		 * @param {number} y
		 * @param {number} _accele マウスから離れて行く時の加速値
		 * @param {number} delayFrame
		 * @param {number} percent
		 */
		public setup(x:number = 0,
					 y:number = 0,
					 _accele:number = 0.1,
					 delayFrame:number = 0,
					 percent:number = 0.0):void {
			this.xx = this.prev2.x = this.prev.x = this.point.x = innerWidth / 2;
			this.yy = this.prev2.y = this.prev.y = this.point.y = innerHeight / 2;
			this.delayFrame = delayFrame;
			this.percent = percent;

			//初期化
			this.vx = this.vy = 0.0;
			this.ac = _accele;
			this.de = 0.85;
			this.wd = 0.05;

			this.pivotX = 40 * ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) >> 0;
			this.pivotY = 40 * ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) >> 0;
		}

		public setMousePosition(x:number, y:number, needReset:boolean):void {
			this.mouse.x = x + this.pivotX;
			this.mouse.y = y + this.pivotY;

			if (needReset) {
				this.resetPosition(x, y);
			}
		}

		/**
		 * 更新します。
		 */
		public update():void {
			this.prev2.x = this.prev.x;
			this.prev2.y = this.prev.y;
			this.prev.x = this.point.x;
			this.prev.y = this.point.y;

			// 参考
			// http://gihyo.jp/design/feature/01/frocessing/0004?page=1

			//加速度運動
			this.vx += ( this.mouse.x - this.xx ) * this.ac;
			this.vy += ( this.mouse.y - this.yy ) * this.ac;

			this.xx += this.vx;
			this.yy += this.vy;

			//減衰処理
			this.vx *= this.de;
			this.vy *= this.de;

			this.point.x = this.xx;
			this.point.y = this.yy;
		}

		private resetPosition(x:number, y:number) {

			x += +this.pivotX;
			y += +this.pivotY;

			this.point.x = x;
			this.point.y = y;
			this.prev2.x = x;
			this.prev2.y = y;
			this.mouse.x = this.prev.x = this.xx = x;
			this.mouse.y = this.prev.y = this.yy = y;
			this.vx = this.vy = 0.0;
		}
	}
}
