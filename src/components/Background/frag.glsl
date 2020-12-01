uniform float uTime;
uniform float uFBMDivider;
uniform float uHasColor;
uniform float uAlpha;
uniform float uShouldTransition;
uniform float uUseColor;
uniform vec3 uBackgroundColor;
uniform vec2 uMouse;

varying vec2 vUv;

float colormap_red(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        // return (829.79 * x + 54.51) / 255.0;
        return (100.79 * x + 54.51) / 255.0;
    } else {
        return 0.2;
    }
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) {
        return 0.0;
    } else if (x < 327013.0 / 810990.0) {
        return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
        return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_blue(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 7249.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return 127.0 / 255.0;
    } else if (x < 327013.0 / 810990.0) {
        return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    } else {
        return 1.0;
    }
}

vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.500000*noise( p + uTime  ); p = mtx*p*2.02;
    f += 0.031250*noise( p ); p = mtx*p*2.01;
    f += 0.250000*noise( p ); p = mtx*p*2.03;
    f += 0.125000*noise( p ); p = mtx*p*2.01;
    f += 0.062500*noise( p ); p = mtx*p*2.04;
    f += 0.015625*noise( p + sin(uTime) );

    return f/uFBMDivider;
    // return f/2.96875;
}

float pattern( in vec2 p )
{
	vec2 q = vec2( fbm( p + uMouse / 3.0 ),
                   fbm( p + vec2(5.2,1.3) ) );

    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                   fbm( p + 4.0*q + vec2(8.3,2.8) ) );

    // return fbm( p + 4.0*r * sin(uTime * 2.) );
    return fbm( p + 4.0*r );
}

float scale = 8.0;
float smoothness = 1.0;
float seed = 12.9898;

void main() {
    
  vec2 newUv = mix(vec2(0.0), uMouse / vec2(2.0), uShouldTransition);
  
  float shade = pattern(vUv + newUv);
  vec4 fbmColor = mix(vec4(shade) - .1, vec4(colormap(shade).rgb, shade), uHasColor);

  vec4 transparent = vec4(0.0);

  float p = mix(-smoothness, 1.0 + smoothness, uAlpha);
  float lower = p - smoothness;
  float higher = p + smoothness; 
  float q = smoothstep(lower, higher, shade);

  vec4 finalColor = mix(fbmColor, transparent, 0.0 + q);
  gl_FragColor =  mix(finalColor, mix(vec4(0.0), vec4(1.0, 0.0, 0.0, 1.0), uAlpha), uShouldTransition);
//   if (finalColor.a <= 0.0) {
//     discard;  
//   }

    // gl_FragColor = mix(
    //     mix(
    //     finalColor,
    //     vec4(
    //         uBackgroundColor.rg,
    //         finalColor.b,
    //         uUseColor - 0.2
    //     ),
    //     uUseColor
    //     ),
        
    //     finalColor, 
    //     uShouldTransition
    // );
}