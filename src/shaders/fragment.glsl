uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
 float PI = 3.141592653589793238;

float sdSphere( vec3 p, float radius ) {
  return length(p)-radius;
}

float sdf(vec3 p) {
    return sdSphere(p, 0.4);
}

vec3 calcNormal(vec3 p ) {
    const float eps = 0.0001;
    const vec2 h = vec2(eps,0);
    return normalize(vec3(
        sdf(p+h.xyy) - sdf(p-h.xyy),
        sdf(p+h.yxy) - sdf(p-h.yxy),
        sdf(p+h.yyx) - sdf(p-h.yyx)
    ));
    }

void main() {
    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

    vec3 camPos = vec3(0.,0.,2.);
    vec3 rayDir = normalize(vec3(vUv -  0.5, -1.));

    vec3 rayPos = camPos;
    float t = 0.;
    float tMax = 5.;
    for(int i =0; i < 256; ++i) {
        vec3 pos = camPos + t * rayDir;
        float h = sdf(pos);
        if(h < 0.0001 || t > tMax) break;
        t += h;
    }
    vec3 color = vec3(0.);
    if(t< tMax) {
        vec3 pos = camPos + t * rayDir;
        color = vec3(1.);
        vec3 normal = calcNormal(pos); 
        color = normal;
        float diff = dot(vec3(1.), normal);
        color = vec3(diff);
    }

    gl_FragColor = vec4(color, 1.0 );
}