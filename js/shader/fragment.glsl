uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

float hash1(float p) {
    vec2 p2 = fract(p * vec2(5.3983, 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
    return fract(p2.x * p2.y * 95.4337);
}

void main(){
    // vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec2 newUV = vUv;
    newUV.x -= 0.5;
    newUV.x *= 0.25 * resolution.x/resolution.y;
    newUV.x += 0.5;

    float stepY = ceil(newUV.y * 5.0)/5.0;
    float scroll = (time * 0.01) * (0.5 + hash1(stepY));

    float sides = 2.0 * length(vUv.x - 0.5);
    float masking = step(0.9, sides);
    float shade = 10.0 * (sides - 0.9) * masking;
    shade = pow(shade, 5.0);

    newUV = (newUV - vec2(0.5, stepY - 0.1)) * (vec2(1.0 + 0.1 * shade, 1.0 + 0.7 * shade) - 0.6 * (1.0 - progress)) + vec2(0.5, stepY - 0.1);

    float direction = (mod(ceil(newUV.y * 5.0), 2.0)==0.0)?-1.0:1.0;

    newUV.x = mod(newUV.x + scroll + 0.3 * progress * direction + hash1(stepY), 1.0);

    newUV = fract(newUV * 5.0);
    vec4 map = texture2D(texture1, newUV);
    gl_FragColor = map;
}