namespace project {

	/**
	 * パーティクルのテクスチャを生成する初期化用クラスです。
	 */
	export class ParticleInitializer {
		static NUM_PARTICLE:number = 200;

		/**
		 * パーティクルの模様を作成します。
		 */
		static generate() {
			var spriteSheetBuilder = new createjs.SpriteSheetBuilder();
			spriteSheetBuilder.padding = 2;


			for (var i = 0; i < ParticleInitializer.NUM_PARTICLE; i++) {
				var shape = new createjs.Shape();
				var size = Math.random() * Math.random() * Math.random() * 120 + 4;

				var colorHsl:string = createjs.Graphics.getHSL(
					160 + 20 * Math.random(),
					0 + Math.random() * 20,
					50 + Math.random() * 50);

				shape.graphics.clear();

				// 円
				if (Math.random() < 0.7) {
					if (Math.random() < 0.3) {
						// もやっとした円
						shape.graphics.beginRadialGradientFill([colorHsl, "#000000"], [0.0, 1.0], 0, 0, size / 10, 0, 0, size);
					}
					else if (Math.random() < 0.5) {
						// キリッとした円
						shape.graphics.beginFill(colorHsl);
					} else {
						// 輪郭だけの円
						shape.graphics
							.setStrokeStyle(2) // 線の太さ
							.beginStroke(createjs.Graphics.getRGB(255, 255, 255))
					}

					shape.graphics.drawCircle(0, 0, size);
					shape.graphics.endFill();
				}
				// 四角形
				else if (Math.random() < 0.5) {
					if (Math.random() < 0.1) {
						// キリッとした円
						shape.graphics.beginFill(colorHsl);
					} else {
						// 輪郭だけの円
						shape.graphics
							.setStrokeStyle(2) // 線の太さ
							.beginStroke(createjs.Graphics.getRGB(255, 255, 255))
					}

					shape.graphics
						.drawRect(-size, -size, size * 2, size * 2)
						.endFill();
				}
				// 三角形
				else {
					if (Math.random() < 0.5) {
						// キリッとした円
						shape.graphics.beginFill(colorHsl);
					} else {
						// 輪郭だけの円
						shape.graphics
							.setStrokeStyle(2) // 線の太さ
							.beginStroke(createjs.Graphics.getRGB(255, 255, 255))
					}

					var takasa = size * Math.sin(Math.PI / 3);

					shape.graphics
						.moveTo(-size / 2, size / 2)
						.lineTo(0, size / 2 - takasa)
						.lineTo(+size / 2, size / 2)
						.closePath()
						.endFill();
				}


				var padding = 4;
				shape.cache(-size - padding, -size - padding, size * 2 + padding * 2, size * 2 + padding * 2);

				var frameNum = spriteSheetBuilder.addFrame(shape);
				spriteSheetBuilder.addAnimation("particle_" + i, [frameNum]);
			}

			spriteSheetBuilder.build();
			ParticleInitializer.convertSpriteSheet(spriteSheetBuilder.spriteSheet)
		}

		/**
		 * CreateJS のスプライトシートビルダーを使られたスプライトシートを
		 * Pixi.js のスプライトシート機能に展開するクラス。
		 */
		static convertSpriteSheet(spriteSheet:any):void {
			var textureOriginal = PIXI.Texture.fromCanvas(spriteSheet._images[0]);

			for (var frameLabel in spriteSheet._data) {
				var animation = spriteSheet.getAnimation(frameLabel);
				var frame = spriteSheet.getFrame(animation.frames[0]);
				var textureSize = new PIXI.Rectangle(frame.rect.x, frame.rect.y, frame.rect.width, frame.rect.height);
				PIXI.utils.TextureCache[frameLabel] = new PIXI.Texture(textureOriginal.baseTexture, textureSize);
			}
		}
	}
}