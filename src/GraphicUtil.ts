namespace project {

	/**
	 * グラフィックのユーティリティークラスです。
	 * @class project.GraphicUtil
	 */
	export class GraphicUtil {

		/**
		 * 五芒星の頂点座標を計算します。
		 * @param radius {number}    半径
		 * @returns {{x:number; y:number;}[]}
		 */
		public static createStartPoints(radius:number, offsetX:number, offsetY:number):{x:number; y:number;}[] {
			//五芒星の時の角度
			var c1 = GraphicUtil.createCordinate(radius, -90, offsetX, offsetY);
			var c2 = GraphicUtil.createCordinate(radius, -234, offsetX, offsetY);
			var c3 = GraphicUtil.createCordinate(radius, -18, offsetX, offsetY);
			var c4 = GraphicUtil.createCordinate(radius, -162, offsetX, offsetY);
			var c5 = GraphicUtil.createCordinate(radius, -306, offsetX, offsetY);
			return [c1, c2, c3, c4, c5];
		}

		private static createCordinate(radius:number, angle:number, offsetX:number, offsetY:number) {
			var x = radius * Math.cos(angle / 180 * Math.PI);
			var y = radius * Math.sin(angle / 180 * Math.PI);

			return {
				"x": x + offsetX,
				"y": y + offsetY
			};
		}
	}

}