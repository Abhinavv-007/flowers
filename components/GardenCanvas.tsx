import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- GLSL Shaders ---

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
}
`;

const fragmentShader = `
#define PI 3.14159265359

uniform float u_ratio;
uniform vec2 u_cursor;
uniform float u_stop_time;
uniform float u_clean;
uniform vec2 u_stop_randomizer;

uniform sampler2D u_texture;
varying vec2 vUv;

// --------------------------------
// 2D noise

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float get_flower_shape(vec2 _p, float _pet_n, float _angle, float _outline) {
    _angle *= 3.;

    _p = vec2(_p.x * cos(_angle) - _p.y * sin(_angle),
    _p.x * sin(_angle) + _p.y * cos(_angle));

    float a = atan(_p.y, _p.x);

    float flower_sectoral_shape = pow(abs(sin(a * _pet_n)), .4) + .25;

    vec2 flower_size_range = vec2(.04, .15); // Increased size range
    float size = flower_size_range[0] + u_stop_randomizer[0] * flower_size_range[1];

    float flower_radial_shape = pow(length(_p) / size, 2.);
    flower_radial_shape -= .1 * sin(8. * a); // add noise
    flower_radial_shape = max(.1, flower_radial_shape);
    flower_radial_shape += smoothstep(0., 0.03, -_p.y + .2 * abs(_p.x));

    float grow_time = step(.25, u_stop_time) * pow(u_stop_time, .3);
    float flower_shape = 1. - smoothstep(0., flower_sectoral_shape, _outline * flower_radial_shape / grow_time);

    flower_shape *= (1. - step(1., grow_time));

    return flower_shape;
}

float get_stem_shape(vec2 _p, vec2 _uv, float _w, float _angle) {
    _w = max(.004, _w);
    
    float x_offset = _p.y * sin(_angle);
    x_offset *= pow(3. * _uv.y, 2.);
    _p.x -= x_offset;

    // add horizontal noise to the cursor coordinale
    float noise_power = .5;
    float cursor_horizontal_noise = noise_power * snoise(2. * _uv * u_stop_randomizer[0]);
    cursor_horizontal_noise *= pow(dot(_p.y, _p.y), .6);// moise to be zero at cursor
    cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .3);// moise to be zero at bottom
    _p.x += cursor_horizontal_noise;

    // vertical line through the cursor point (_p.x)
    float left = smoothstep(-_w, 0., _p.x);
    float right = 1. - smoothstep(0., _w, _p.x);
    float stem_shape = left * right;

    // make it grow + don't go up to the cursor point
    float grow_time = 1. - smoothstep(0., .2, u_stop_time);
    float stem_top_mask = smoothstep(0., pow(grow_time, .5), .03 -_p.y);
    stem_shape *= stem_top_mask;

    // stop drawing once done
    stem_shape *= (1. - step(.17, u_stop_time));

    return stem_shape;
}

void main() {
    vec3 base = texture2D(u_texture, vUv).xyz;

    vec2 uv = vUv;
    uv.x *= u_ratio;
    vec2 cursor = vUv - u_cursor.xy;
    cursor.x *= u_ratio;
    
    // Enhanced flower colors with more variety
    // Use randomizers to pick different color schemes
    vec3 stem_color = vec3(.1 + u_stop_randomizer[0] * .7, .55 + u_stop_randomizer[1] * .3, .2);
    
    float color_choice = u_stop_randomizer[1];
    vec3 flower_color;
    
    if (color_choice < 0.16) {
        // Deep pink/magenta
        flower_color = vec3(.9, .1 + u_stop_randomizer[0] * .2, .8);
    } else if (color_choice < 0.32) {
        // Vibrant purple
        flower_color = vec3(.7 + u_stop_randomizer[0] * .3, .2, .95);
    } else if (color_choice < 0.48) {
        // Bright orange
        flower_color = vec3(1.0, .5 + u_stop_randomizer[0] * .3, .1);
    } else if (color_choice < 0.64) {
        // Sunny yellow
        flower_color = vec3(1.0, .9, .2 + u_stop_randomizer[0] * .2);
    } else if (color_choice < 0.80) {
        // Sky blue
        flower_color = vec3(.2 + u_stop_randomizer[0] * .3, .6, .95);
    } else {
        // Pure white with hint of color
        flower_color = vec3(.95, .9 + u_stop_randomizer[0] * .1, 1.0);
    }

    float angle = .5 * (u_stop_randomizer[0] - .5);

    float stem_shape = get_stem_shape(cursor, uv, .003, angle);
    stem_shape += get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .003, angle);
    float stem_mask = 1. - get_stem_shape(cursor, uv, .004, angle);
    stem_mask -= get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .004, angle);

    float petals_back_number = 1. + floor(u_stop_randomizer[0] * 2.);
    float angle_offset = -(2. * step(0., angle) - 1.) * .1 * u_stop_time;
    float flower_back_shape = get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.5);
    float flower_back_mask = 1. - get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.6);

    float petals_front_number = 2. + floor(u_stop_randomizer[1] * 2.);
    float flower_front_shape = get_flower_shape(cursor, petals_front_number, angle, 1.);
    float flower_front_mask = 1. - get_flower_shape(cursor, petals_front_number, angle, .95);

    vec3 color = base;
    color *= stem_mask;
    color *= flower_back_mask;
    color *= flower_front_mask;

    color += (stem_shape * stem_color);

    color += (flower_back_shape * (flower_color + vec3(0., .8 * u_stop_time, 0.)));
    color += (flower_front_shape * flower_color);

    color.r *= 1. - (.5 * flower_back_shape * flower_front_shape);
    color.b *= 1. - (flower_back_shape * flower_front_shape);

    color *= u_clean;

    gl_FragColor = vec4(color, 1.);
}
`;

interface GardenCanvasProps {
  resetTrigger: number;
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ resetTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, clicked: false, vanishCanvas: false });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // --- Three.js Setup ---
    let basicMaterial: THREE.MeshBasicMaterial;
    let shaderMaterial: THREE.ShaderMaterial;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sceneShader = new THREE.Scene();
    const sceneBasic = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    const clock = new THREE.Clock();

    let renderTargets = [
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    ];

    const createPlane = () => {
      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_stop_time: { value: 0 },
          u_stop_randomizer: {
            value: new THREE.Vector2(Math.random(), Math.random()),
          },
          u_cursor: { value: new THREE.Vector2(0, 0) },
          u_ratio: { value: window.innerWidth / window.innerHeight },
          u_texture: { value: null },
          u_clean: { value: 1 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      basicMaterial = new THREE.MeshBasicMaterial();
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
      const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);

      sceneBasic.add(planeBasic);
      sceneShader.add(planeShader);
    };

    createPlane();

    const updateSize = () => {
      if (shaderMaterial) {
        shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
      }
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Update render targets size
      renderTargets.forEach(rt => rt.setSize(window.innerWidth, window.innerHeight));
    };
    updateSize();

    let animationFrameId: number;

    const render = () => {
      if (!shaderMaterial || !basicMaterial) return;

      shaderMaterial.uniforms.u_clean.value = pointerRef.current.vanishCanvas ? 0 : 1;
      shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

      if (pointerRef.current.clicked) {
        shaderMaterial.uniforms.u_cursor.value = new THREE.Vector2(
          pointerRef.current.x,
          1 - pointerRef.current.y
        );
        shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector2(
          Math.random(),
          Math.random()
        );
        shaderMaterial.uniforms.u_stop_time.value = 0;
        pointerRef.current.clicked = false;
      }
      shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();

      // Render to target 1 (using shader)
      renderer.setRenderTarget(renderTargets[1]);
      renderer.render(sceneShader, camera);

      // Render target 1 to screen (using basic material)
      basicMaterial.map = renderTargets[1].texture;
      renderer.setRenderTarget(null);
      renderer.render(sceneBasic, camera);

      // Swap targets
      const tmp = renderTargets[0];
      renderTargets[0] = renderTargets[1];
      renderTargets[1] = tmp;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event Listeners
    const handleResize = () => {
      updateSize();
      // Optional: Clear on resize to avoid distortion artifacts, or let it stretch
      pointerRef.current.vanishCanvas = true;
      setTimeout(() => pointerRef.current.vanishCanvas = false, 50);
    };

    const handleClick = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX / window.innerWidth;
      pointerRef.current.y = e.clientY / window.innerHeight;
      pointerRef.current.clicked = true;
    };

    const handleTouch = (e: TouchEvent) => {
      // Prevent default to stop scrolling while drawing
      // e.preventDefault(); 
      if (e.targetTouches.length > 0) {
        pointerRef.current.x = e.targetTouches[0].pageX / window.innerWidth;
        pointerRef.current.y = e.targetTouches[0].pageY / window.innerHeight;
        pointerRef.current.clicked = true;
      }
    };

    // Add event listeners to window to capture clicks anywhere
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
      cancelAnimationFrame(animationFrameId);

      // Cleanup Three.js resources
      renderer.dispose();
      renderTargets.forEach(rt => rt.dispose());
      basicMaterial.dispose();
      shaderMaterial.dispose();
    };
  }, []); // Only run once on mount

  // Watch for external reset trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      pointerRef.current.vanishCanvas = true;
      const timeout = setTimeout(() => {
        pointerRef.current.vanishCanvas = false;
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [resetTrigger]);

  return <canvas ref={canvasRef} className="block w-full h-full touch-none" />;
};