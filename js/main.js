var project;
(function (project) {
    var ColorUtil = (function () {
        function ColorUtil() {
        }
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         *
         * @param   {number}  h       The hue (0-360)
         * @param   {number}  s       The saturation (0-100)
         * @param   {number}  l       The lightness (0-100)
         * @return  {number}           The RGB representation
         */
        ColorUtil.hslToRgb = function (h, s, l) {
            h = h % 360;
            var m1, m2, hue;
            var r, g, b;
            s /= 100;
            l /= 100;
            if (s == 0) {
                r = g = b = (l * 255);
            }
            else {
                if (l <= 0.5)
                    m2 = l * (s + 1);
                else
                    m2 = l + s - l * s;
                m1 = l * 2 - m2;
                hue = h / 360;
                r = Math.round(ColorUtil.hueToRgb(m1, m2, hue + 1 / 3));
                g = Math.round(ColorUtil.hueToRgb(m1, m2, hue));
                b = Math.round(ColorUtil.hueToRgb(m1, m2, hue - 1 / 3));
            }
            var color = (r << 16) | (g << 8) | b;
            return color;
        };
        /**
         * HUE の値を RGB として返却します。
         * @param {number} m1
         * @param {number} m2
         * @param {number} hue
         * @returns {number}
         */
        ColorUtil.hueToRgb = function (m1, m2, hue) {
            var v;
            if (hue < 0)
                hue += 1;
            else if (hue > 1)
                hue -= 1;
            if (6 * hue < 1)
                v = m1 + (m2 - m1) * hue * 6;
            else if (2 * hue < 1)
                v = m2;
            else if (3 * hue < 2)
                v = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
            else
                v = m1;
            return 255 * v;
        };
        return ColorUtil;
    })();
    project.ColorUtil = ColorUtil;
})(project || (project = {}));
var project;
(function (project) {
    /**
     * グラフィックのユーティリティークラスです。
     * @class project.GraphicUtil
     */
    var GraphicUtil = (function () {
        function GraphicUtil() {
        }
        /**
         * 五芒星の頂点座標を計算します。
         * @param radius {number}    半径
         * @returns {{x:number; y:number;}[]}
         */
        GraphicUtil.createStartPoints = function (radius, offsetX, offsetY) {
            //五芒星の時の角度
            var c1 = GraphicUtil.createCordinate(radius, -90, offsetX, offsetY);
            var c2 = GraphicUtil.createCordinate(radius, -234, offsetX, offsetY);
            var c3 = GraphicUtil.createCordinate(radius, -18, offsetX, offsetY);
            var c4 = GraphicUtil.createCordinate(radius, -162, offsetX, offsetY);
            var c5 = GraphicUtil.createCordinate(radius, -306, offsetX, offsetY);
            return [c1, c2, c3, c4, c5];
        };
        GraphicUtil.createCordinate = function (radius, angle, offsetX, offsetY) {
            var x = radius * Math.cos(angle / 180 * Math.PI);
            var y = radius * Math.sin(angle / 180 * Math.PI);
            return {
                "x": x + offsetX,
                "y": y + offsetY
            };
        };
        return GraphicUtil;
    })();
    project.GraphicUtil = GraphicUtil;
})(project || (project = {}));
/// <reference path="easeljs/easeljs.d.ts" />
var project;
(function (project) {
    /**
     * ベクトルパスのクラスです。
     */
    var Path = (function () {
        function Path() {
            this.prev = new createjs.Point();
            this.prev2 = new createjs.Point();
            this.point = new createjs.Point();
            this.mouse = new createjs.Point();
        }
        /**
         * セットアップします。
         * @param {number} x
         * @param {number} y
         * @param {number} _accele マウスから離れて行く時の加速値
         * @param {number} delayFrame
         * @param {number} percent
         */
        Path.prototype.setup = function (x, y, _accele, delayFrame, percent) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (_accele === void 0) { _accele = 0.1; }
            if (delayFrame === void 0) { delayFrame = 0; }
            if (percent === void 0) { percent = 0.0; }
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
        };
        Path.prototype.setMousePosition = function (x, y, needReset) {
            this.mouse.x = x + this.pivotX;
            this.mouse.y = y + this.pivotY;
            if (needReset) {
                this.resetPosition(x, y);
            }
        };
        /**
         * 更新します。
         */
        Path.prototype.update = function () {
            this.prev2.x = this.prev.x;
            this.prev2.y = this.prev.y;
            this.prev.x = this.point.x;
            this.prev.y = this.point.y;
            // 参考
            // http://gihyo.jp/design/feature/01/frocessing/0004?page=1
            //加速度運動
            this.vx += (this.mouse.x - this.xx) * this.ac;
            this.vy += (this.mouse.y - this.yy) * this.ac;
            this.xx += this.vx;
            this.yy += this.vy;
            //減衰処理
            this.vx *= this.de;
            this.vy *= this.de;
            this.point.x = this.xx;
            this.point.y = this.yy;
        };
        Path.prototype.resetPosition = function (x, y) {
            x += +this.pivotX;
            y += +this.pivotY;
            this.point.x = x;
            this.point.y = y;
            this.prev2.x = x;
            this.prev2.y = y;
            this.mouse.x = this.prev.x = this.xx = x;
            this.mouse.y = this.prev.y = this.yy = y;
            this.vx = this.vy = 0.0;
        };
        return Path;
    })();
    project.Path = Path;
})(project || (project = {}));
var project;
(function (project) {
    /**
     * パーティクルのテクスチャを生成する初期化用クラスです。
     */
    var ParticleInitializer = (function () {
        function ParticleInitializer() {
        }
        /**
         * パーティクルの模様を作成します。
         */
        ParticleInitializer.generate = function () {
            var spriteSheetBuilder = new createjs.SpriteSheetBuilder();
            spriteSheetBuilder.padding = 2;
            for (var i = 0; i < ParticleInitializer.NUM_PARTICLE; i++) {
                var shape = new createjs.Shape();
                var size = Math.random() * Math.random() * Math.random() * 120 + 4;
                var colorHsl = createjs.Graphics.getHSL(160 + 20 * Math.random(), 0 + Math.random() * 20, 50 + Math.random() * 50);
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
                    }
                    else {
                        // 輪郭だけの円
                        shape.graphics
                            .setStrokeStyle(2) // 線の太さ
                            .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
                    }
                    shape.graphics.drawCircle(0, 0, size);
                    shape.graphics.endFill();
                }
                else if (Math.random() < 0.5) {
                    if (Math.random() < 0.1) {
                        // キリッとした円
                        shape.graphics.beginFill(colorHsl);
                    }
                    else {
                        // 輪郭だけの円
                        shape.graphics
                            .setStrokeStyle(2) // 線の太さ
                            .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
                    }
                    shape.graphics
                        .drawRect(-size, -size, size * 2, size * 2)
                        .endFill();
                }
                else {
                    if (Math.random() < 0.5) {
                        // キリッとした円
                        shape.graphics.beginFill(colorHsl);
                    }
                    else {
                        // 輪郭だけの円
                        shape.graphics
                            .setStrokeStyle(2) // 線の太さ
                            .beginStroke(createjs.Graphics.getRGB(255, 255, 255));
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
            ParticleInitializer.convertSpriteSheet(spriteSheetBuilder.spriteSheet);
        };
        /**
         * CreateJS のスプライトシートビルダーを使られたスプライトシートを
         * Pixi.js のスプライトシート機能に展開するクラス。
         */
        ParticleInitializer.convertSpriteSheet = function (spriteSheet) {
            var textureOriginal = PIXI.Texture.fromCanvas(spriteSheet._images[0]);
            for (var frameLabel in spriteSheet._data) {
                var animation = spriteSheet.getAnimation(frameLabel);
                var frame = spriteSheet.getFrame(animation.frames[0]);
                var textureSize = new PIXI.Rectangle(frame.rect.x, frame.rect.y, frame.rect.width, frame.rect.height);
                PIXI.utils.TextureCache[frameLabel] = new PIXI.Texture(textureOriginal.baseTexture, textureSize);
            }
        };
        ParticleInitializer.NUM_PARTICLE = 200;
        return ParticleInitializer;
    })();
    project.ParticleInitializer = ParticleInitializer;
})(project || (project = {}));
/// <reference path="pixi/pixi.d.ts" />
/// <reference path="ParticleInitializer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var project;
(function (project) {
    /**
     * パーティクル表示クラスです。
     * @class demo.Particle
     */
    var Particle = (function (_super) {
        __extends(Particle, _super);
        /**
         * コンストラクタ
         * @constructor
         */
        function Particle() {
            var texture = PIXI.Texture.fromFrame("particle_" + (project.ParticleInitializer.NUM_PARTICLE * Math.random() >> 0));
            _super.call(this, texture);
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
        Particle.prototype.resetParameters = function (emitX, emitY, vx, vy, vAngular) {
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
        };
        /**
         * パーティクル個別の内部計算を行います。
         * @method
         */
        Particle.prototype.update = function () {
            // Gravity
            this.vy += 0.2;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this._vAngular;
            this._count++;
            var maxD = (1 - this._count / this.life * 1 / 3);
            this.alpha = Math.random() * 0.4 + 0.6 * this._count / this.life;
            this.scale.x = this.scale.y = maxD;
            // 死亡フラグ
            if (this.life < this._count) {
                this._destroy = true;
                this.parent.removeChild(this);
            }
        };
        /**
         * パーティクルが死んでいるかどうかを確認します。
         * @returns {boolean}
         * @method
         */
        Particle.prototype.getIsDead = function () {
            return this._destroy;
        };
        return Particle;
    })(PIXI.Sprite);
    project.Particle = Particle;
})(project || (project = {}));
/// <reference path="Particle.ts" />
var project;
(function (project) {
    /**
     * パーティクル発生装置。マウス座標から速度を計算します。
     * @class project.Emitter
     */
    var Emitter = (function () {
        /**
         * @constructor
         */
        function Emitter() {
            /** 速度(X方向)です。 */
            this.vy = 0;
            /** 速度(Y方向)です。 */
            this.x = 0;
            /** マウスのX座標です。 */
            this.latestY = 0;
            /** マウスのY座標です。 */
            this.latestX = 0;
            /** パーティクル発生のX座標です。 */
            this.y = 0;
            /** パーティクル発生のY座標です。 */
            this.vx = 0;
            /** 現在のベクトルの角度です。 */
            this.angular = 0;
            /** 角速度です。 */
            this.vAngular = 0;
        }
        /**
         * パーティクルエミッターの計算を行います。この計算によりマウスの引力が計算されます。
         * @method
         */
        Emitter.prototype.update = function () {
            var dx = this.latestX - this.x;
            var dy = this.latestY - this.y;
            var d = Math.sqrt(dx * dx + dy * dy) * 0.2;
            var rad = Math.atan2(dy, dx);
            this.vx += Math.cos(rad) * d;
            this.vy += Math.sin(rad) * d;
            this.vx *= 0.4;
            this.vy *= 0.4;
            this.x += this.vx;
            this.y += this.vy;
            this.vAngular = rad - this.angular;
            this.angular = rad;
        };
        return Emitter;
    })();
    project.Emitter = Emitter;
    /**
     * パーティクルエミッターのクラスです。
     * @class project.ParticleEmitter
     */
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        /**
         * @constructor
         */
        function ParticleEmitter() {
            _super.call(this);
            this.numParticles = 10;
            this.PRE_CACHE_PARTICLES = 300;
            this.container = new PIXI.Container();
            this._particleActive = [];
            this._particlePool = [];
            /* 予め必要そうな分だけ作成しておく */
            for (var i = 0; i < this.PRE_CACHE_PARTICLES; i++) {
                this._particlePool.push(new project.Particle());
            }
        }
        /**
         * パーティクルを発生させます。
         * @param {number} x パーティクルの発生座標
         * @param {number} y パーティクルの発生座標
         * @method
         */
        ParticleEmitter.prototype.emit = function (x, y) {
            for (var i = 0; i < this.numParticles; i++) {
                this.getNewParticle(x, y);
            }
        };
        /**
         * パーティクルを更新します。
         * @method
         */
        ParticleEmitter.prototype.update = function () {
            _super.prototype.update.call(this);
            for (var i = 0; i < this._particleActive.length; i++) {
                var p = this._particleActive[i];
                if (!p.getIsDead()) {
                    if (p.y >= window.innerHeight) {
                        p.vy *= -0.9;
                        p.y = window.innerHeight;
                    }
                    else if (p.y <= 0) {
                        p.vy *= -0.9;
                        p.y = 0;
                    }
                    if (p.x >= window.innerWidth) {
                        p.vx *= -0.9;
                        p.x = window.innerWidth;
                    }
                    else if (p.x <= 0) {
                        p.vx *= -0.9;
                        p.x = 0;
                    }
                    p.update();
                }
                else {
                    this.removeParticle(p);
                }
            }
        };
        /**
         * パーティクルを追加します。
         * @param {THREE.Vector3} emitPoint
         * @return {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.getNewParticle = function (emitX, emitY) {
            var p = this.fromPool();
            p.resetParameters(this.x, this.y, this.vx, this.vy, this.vAngular);
            this._particleActive.push(p);
            this.container.addChild(p);
            return p;
        };
        /**
         * パーティクルを削除します。
         * @param {Particle} particle
         * @method
         */
        ParticleEmitter.prototype.removeParticle = function (p) {
            this.container.removeChild(p);
            var index = this._particleActive.indexOf(p);
            if (index > -1) {
                this._particleActive.splice(index, 1);
            }
            this.toPool(p);
        };
        /**
         * アクティブなパーティクルを取り出します。
         * @returns {project.Particle[]}
         * @method
         */
        ParticleEmitter.prototype.getActiveParticles = function () {
            return this._particleActive;
        };
        /**
         * プールからインスタンスを取り出します。
         * プールになければ新しいインスタンスを作成します。
         * @returns {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.fromPool = function () {
            if (this._particlePool.length > 0)
                return this._particlePool.shift();
            else
                return new project.Particle();
        };
        /**
         * プールにインスタンスを格納します。
         * @param {project.Particle}
         * @method
         */
        ParticleEmitter.prototype.toPool = function (particle) {
            this._particlePool.push(particle);
        };
        return ParticleEmitter;
    })(Emitter);
    project.ParticleEmitter = ParticleEmitter;
})(project || (project = {}));
/// <reference path="pixi/pixi.d.ts" />
/// <reference path="easeljs/easeljs.d.ts" />
/// <reference path="Path.ts" />
/// <reference path="ColorUtil.ts" />
/// <reference path="GraphicUtil.ts" />
/// <reference path="ParticleEmitter.ts" />
/// <reference path="Particle.ts" />
var project;
(function (project) {
    // 初期化命令
    window.addEventListener("load", function () {
        new project.Main();
    });
    /**
     * パーティクルデモのメインクラスです。
     * @class project.Main
     */
    var Main = (function () {
        /**
         * @constructor
         */
        function Main() {
            var _this = this;
            this.stage = new PIXI.Container();
            this.renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x000000 });
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
            window.addEventListener("resize", function () {
                _this.handleResize();
            });
        }
        /**
         * エンターフレームイベント
         */
        Main.prototype.handleTick = function () {
            // create residual image effect
            this.renderer.render(this.stage);
            this.stats.update();
        };
        /**
         * リサイズイベント
         */
        Main.prototype.handleResize = function () {
            this.renderer.resize(innerWidth, innerHeight);
        };
        return Main;
    })();
    project.Main = Main;
    /**
     * 大量のパーティクルを発生させてみた
     * マウスを押してる間でてくるよ
     * @see http://wonderfl.net/c/4WjT
     * @class demo.ParticleSample
     */
    var ParticleSample = (function (_super) {
        __extends(ParticleSample, _super);
        function ParticleSample() {
            var _this = this;
            _super.call(this);
            // パーティクルを初期化
            project.ParticleInitializer.generate();
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
                var p = new project.Path();
                p.setup(0, 0, 0.3 + i / max * 0.5, (180 * Math.random() >> 0), (i + 1) / max);
                this.pathList.push(p);
            }
            this._lines = new createjs.Shape();
            this.stageEaselJS.addChild(this._lines);
            this._linePoint = [];
            this._emitter = new project.ParticleEmitter();
            this._emitter.latestX = innerWidth / 2;
            this._emitter.latestY = innerHeight / 2;
            this.addChild(this._emitter.container);
            this._shadow = new PIXI.Sprite(PIXI.Texture.fromImage("imgs/Shadow-assets/Shadow.png"));
            this._shadow.blendMode = PIXI.BLEND_MODES.SCREEN;
            this.addChild(this._shadow);
            // -------------------------
            // オープニングアニメーション
            // -------------------------
            var sx = window.innerWidth / 2;
            var sy = window.innerHeight / 2;
            this._isAutoAnimation = true;
            var points = project.GraphicUtil.createStartPoints(window.innerWidth / 3, sx, sy);
            this._pointAutoMotion = new createjs.Point(points[4].x, points[4].y);
            this._emitter.latestX = this._emitter.x = points[0].x;
            this._emitter.latestY = this._emitter.y = points[0].y;
            var tw = createjs.Tween
                .get(this._pointAutoMotion);
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < points.length; j++) {
                    tw.to(points[j], 250 + 100 * Math.random(), createjs.Ease.quartInOut);
                }
            }
            tw.call(function () {
                _this._isAutoAnimation = false;
                _this._isDown = false;
                _this.buttonMode = true;
                document.getElementById("attention").classList.add("show");
            });
            this._isDown = true;
            this.buttonMode = false;
            // -------------------------
            // イベントの登録
            // -------------------------
            this
                .on("mousedown", this.handleMouseDown, this)
                .on('touchstart', this.handleMouseDown, this)
                .on("mousemove", this.handleMouseMove, this)
                .on('touchmove', this.handleMouseMove, this)
                .on("mouseup", this.handleMouseUp, this)
                .on("mouseupoutside", this.handleMouseUp, this)
                .on("touchend", this.handleMouseUp, this)
                .on("touchendoutside", this.handleMouseUp, this);
            createjs.Ticker.on("tick", this.enterFrameHandler, this);
            this.handleResize();
            window.addEventListener("resize", function () {
                _this.handleResize();
            });
        }
        /**
         * エンターフレームイベント
         * @param event
         */
        ParticleSample.prototype.enterFrameHandler = function (event) {
            if (this._isAutoAnimation == true) {
                // オープニング中は自動的に代入する
                this._emitter.latestX = this._pointAutoMotion.x;
                this._emitter.latestY = this._pointAutoMotion.y;
            }
            else {
            }
            if (this._isDown) {
                this.createParticle();
            }
            this.mousePositions.unshift({ x: this._emitter.latestX, y: this._emitter.latestY, isDown: this._isDown });
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
            gCurve.setStrokeStyle(1);
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
                var colorLine = createjs.Graphics.getHSL(180, 100, 100, p.percent);
                gCurve
                    .beginStroke(colorLine)
                    .moveTo(curveStartX, curveStartY)
                    .curveTo(p1x, p1y, curveEndX, curveEndY)
                    .endStroke();
            }
            var color1 = { h: new Date().getTime() / 40, s: 30, l: 40 };
            var color2 = { h: (new Date().getTime() + 40 * 89) / 40, s: 70, l: 70 };
            this._bg.clear();
            // グラデーションを作るための無理矢理な手法
            for (var i = 0, max = 1024; i < max; i++) {
                var color = project.ColorUtil.hslToRgb(color1.h * (i / max) + color2.h * (1 - i / max), color1.s * (i / max) + color2.s * (1 - i / max), color1.l * (i / max) + color2.l * (1 - i / max));
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
            }
            else {
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
            contextForDisplay.drawImage(this.stageEaselJS.canvas, 0, 0);
            this.stageEaselJS.update();
        };
        ParticleSample.prototype.handleMouseDown = function (event) {
            if (this._isAutoAnimation == true) {
                return; // OPアニメーション中はイベントを無効化
            }
            var data = event.data;
            this._isDown = true;
            this._emitter.x = data.global.x;
            this._emitter.y = data.global.y;
            this._emitter.latestX = data.global.x;
            this._emitter.latestY = data.global.y;
        };
        ParticleSample.prototype.handleMouseMove = function (event) {
            if (this._isAutoAnimation == true) {
                return; // OPアニメーション中はイベントを無効化
            }
            var data = event.data;
            this._emitter.latestX = data.global.x;
            this._emitter.latestY = data.global.y;
        };
        ParticleSample.prototype.handleMouseUp = function (event) {
            if (this._isAutoAnimation == true) {
                return; // OPアニメーション中はイベントを無効化
            }
            var data = event.data;
            this._isDown = false;
            this._emitter.latestX = data.global.x;
            this._emitter.latestY = data.global.y;
        };
        ParticleSample.prototype.createParticle = function () {
            this._emitter.emit(this._emitter.latestX, this._emitter.latestY);
        };
        ParticleSample.prototype.handleResize = function () {
            this._shadow.scale.x = (window.innerWidth / 1024);
            this._shadow.scale.y = (window.innerHeight / 1024);
            this.stageEaselJS.canvas.width = innerWidth;
            this.stageEaselJS.canvas.height = innerHeight;
            this.canvasForDisplay.width = innerWidth;
            this.canvasForDisplay.height = innerHeight;
        };
        return ParticleSample;
    })(PIXI.Container);
})(project || (project = {}));
//# sourceMappingURL=main.js.map