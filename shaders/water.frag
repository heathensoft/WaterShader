#ifdef GL_ES
#define LOWP lowp
precision mediump float;
#else
#define LOWP
#endif

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying LOWP vec4 v_color;
varying vec2 v_texCoords;

const float WATER_PERIOD = 10.0;

#FUNCTION_INSERT

void main()
{
    vec2 relativePos = gl_FragCoord.xy / u_resolution - 0.5;
    float len = length(relativePos);
    float vignette = smoothstep(0.7, 0.5, len);

    vec3 period = vec3(10000.0, 10000.0, WATER_PERIOD);
    float noiseX = pnoise(vec3(gl_FragCoord.xy * 0.125, u_time), period);
    float noiseY = pnoise(vec3(gl_FragCoord.xy, u_time), period);
    vec4 tex = texture2D(u_texture, v_texCoords + vec2(noiseX, noiseY) * 0.01);

    tex.rgb = mix(tex.rgb, tex.rgb * vignette, 0.7);

    gl_FragColor = tex * v_color;
}