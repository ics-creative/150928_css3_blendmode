namespace project {
	export class ColorUtil {
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 *
		 * @param   {number}  h       The hue (0-360)
		 * @param   {number}  s       The saturation (0-100)
		 * @param   {number}  l       The lightness (0-100)
		 * @return  {number}           The RGB representation
		 */
		static hslToRgb(h:number, s:number, l:number):number {
			h = h % 360;
			var m1:number, m2:number, hue:number;
			var r:number, g:number, b:number;
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
		}

		/**
		 * HUE の値を RGB として返却します。
		 * @param {number} m1
		 * @param {number} m2
		 * @param {number} hue
		 * @returns {number}
		 */
		static hueToRgb(m1:number, m2:number, hue:number):number {
			var v:number;
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
		}
	}
}