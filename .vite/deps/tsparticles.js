import {
  AlterType,
  AnimatableColor,
  AnimationStatus,
  Circle,
  CollisionMode,
  DestroyType,
  DivType,
  EasingType,
  ExternalInteractorBase,
  OptionsColor,
  OutMode,
  OutModeDirection,
  ParticleOutType,
  ParticlesInteractorBase,
  PixelMode,
  Rectangle,
  RotateDirection,
  ValueWithRandom,
  Vector,
  addEasing,
  arrayRandomIndex,
  calcPositionOrRandomFromSize,
  calcPositionOrRandomFromSizeRanged,
  calculateBounds,
  circleBounce,
  circleBounceDataFromParticle,
  clamp,
  colorMix,
  deepExtend,
  degToRad,
  divMode,
  divModeExecute,
  drawLine,
  errorPrefix,
  executeOnSingleOrMultiple,
  getDistance,
  getDistances,
  getEasing,
  getHslAnimationFromHsl,
  getLinkColor,
  getLinkRandomColor,
  getLogger,
  getRandom,
  getRangeMax,
  getRangeValue,
  getSize,
  getStyleFromHsl,
  getStyleFromRgb,
  halfRandom,
  initParticleNumericAnimationValue,
  isArray,
  isDivModeEnabled,
  isInArray,
  isNumber,
  isObject,
  isPointInside,
  isSsr,
  itemFromArray,
  itemFromSingleOrMultiple,
  loadFont,
  loadParticlesOptions,
  millisecondsToSeconds,
  mouseLeaveEvent,
  mouseMoveEvent,
  percentDenominator,
  randomInRange,
  rangeColorToHsl,
  rangeColorToRgb,
  rectBounce,
  rgbToHsl,
  setRangeValue,
  updateAnimation,
  updateColor
} from "./chunk-A7WJ3HQE.js";
import "./chunk-G3PMV62Z.js";

// node_modules/@tsparticles/plugin-absorbers/browser/Options/Classes/AbsorberSizeLimit.js
var AbsorberSizeLimit = class {
  constructor() {
    this.radius = 0;
    this.mass = 0;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.mass !== void 0) {
      this.mass = data.mass;
    }
    if (data.radius !== void 0) {
      this.radius = data.radius;
    }
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/Options/Classes/AbsorberSize.js
var AbsorberSize = class extends ValueWithRandom {
  constructor() {
    super();
    this.density = 5;
    this.value = 50;
    this.limit = new AbsorberSizeLimit();
  }
  load(data) {
    if (!data) {
      return;
    }
    super.load(data);
    if (data.density !== void 0) {
      this.density = data.density;
    }
    if (isNumber(data.limit)) {
      this.limit.radius = data.limit;
    } else {
      this.limit.load(data.limit);
    }
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/Options/Classes/Absorber.js
var Absorber = class {
  constructor() {
    this.color = new OptionsColor();
    this.color.value = "#000000";
    this.draggable = false;
    this.opacity = 1;
    this.destroy = true;
    this.orbits = false;
    this.size = new AbsorberSize();
  }
  load(data) {
    if (data === void 0) {
      return;
    }
    if (data.color !== void 0) {
      this.color = OptionsColor.create(this.color, data.color);
    }
    if (data.draggable !== void 0) {
      this.draggable = data.draggable;
    }
    this.name = data.name;
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
    if (data.position !== void 0) {
      this.position = {};
      if (data.position.x !== void 0) {
        this.position.x = setRangeValue(data.position.x);
      }
      if (data.position.y !== void 0) {
        this.position.y = setRangeValue(data.position.y);
      }
    }
    if (data.size !== void 0) {
      this.size.load(data.size);
    }
    if (data.destroy !== void 0) {
      this.destroy = data.destroy;
    }
    if (data.orbits !== void 0) {
      this.orbits = data.orbits;
    }
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/Enums/AbsorberClickMode.js
var AbsorberClickMode;
(function(AbsorberClickMode2) {
  AbsorberClickMode2["absorber"] = "absorber";
})(AbsorberClickMode || (AbsorberClickMode = {}));

// node_modules/@tsparticles/plugin-absorbers/browser/AbsorberInstance.js
var squareExp = 2;
var absorbFactor = 0.033;
var minOrbitLength = 0;
var minRadius = 0;
var minMass = 0;
var origin = {
  x: 0,
  y: 0
};
var minAngle = 0;
var double = 2;
var maxAngle = Math.PI * double;
var minVelocity = 0;
var AbsorberInstance = class {
  constructor(absorbers, container, options, position) {
    var _a;
    this.absorbers = absorbers;
    this.container = container;
    this._calcPosition = () => {
      const exactPosition = calcPositionOrRandomFromSizeRanged({
        size: this.container.canvas.size,
        position: this.options.position
      });
      return Vector.create(exactPosition.x, exactPosition.y);
    };
    this._updateParticlePosition = (particle, v) => {
      if (particle.destroyed) {
        return;
      }
      const container2 = this.container, canvasSize = container2.canvas.size;
      if (particle.needsNewPosition) {
        const newPosition = calcPositionOrRandomFromSize({ size: canvasSize });
        particle.position.setTo(newPosition);
        particle.velocity.setTo(particle.initialVelocity);
        particle.absorberOrbit = void 0;
        particle.needsNewPosition = false;
      }
      if (this.options.orbits) {
        if (particle.absorberOrbit === void 0) {
          particle.absorberOrbit = Vector.origin;
          particle.absorberOrbit.length = getDistance(particle.getPosition(), this.position);
          particle.absorberOrbit.angle = getRandom() * maxAngle;
        }
        if (particle.absorberOrbit.length <= this.size && !this.options.destroy) {
          const minSize = Math.min(canvasSize.width, canvasSize.height), offset = 1, randomOffset = 0.1, randomFactor = 0.2;
          particle.absorberOrbit.length = minSize * (offset + (getRandom() * randomFactor - randomOffset));
        }
        if (particle.absorberOrbitDirection === void 0) {
          particle.absorberOrbitDirection = particle.velocity.x >= minVelocity ? RotateDirection.clockwise : RotateDirection.counterClockwise;
        }
        const orbitRadius = particle.absorberOrbit.length, orbitAngle = particle.absorberOrbit.angle, orbitDirection = particle.absorberOrbitDirection;
        particle.velocity.setTo(Vector.origin);
        const updateFunc = {
          x: orbitDirection === RotateDirection.clockwise ? Math.cos : Math.sin,
          y: orbitDirection === RotateDirection.clockwise ? Math.sin : Math.cos
        };
        particle.position.x = this.position.x + orbitRadius * updateFunc.x(orbitAngle);
        particle.position.y = this.position.y + orbitRadius * updateFunc.y(orbitAngle);
        particle.absorberOrbit.length -= v.length;
        particle.absorberOrbit.angle += (particle.retina.moveSpeed ?? minVelocity) * container2.retina.pixelRatio / percentDenominator * container2.retina.reduceFactor;
      } else {
        const addV = Vector.origin;
        addV.length = v.length;
        addV.angle = v.angle;
        particle.velocity.addTo(addV);
      }
    };
    this.initialPosition = position ? Vector.create(position.x, position.y) : void 0;
    if (options instanceof Absorber) {
      this.options = options;
    } else {
      this.options = new Absorber();
      this.options.load(options);
    }
    this.dragging = false;
    this.name = this.options.name;
    this.opacity = this.options.opacity;
    this.size = getRangeValue(this.options.size.value) * container.retina.pixelRatio;
    this.mass = this.size * this.options.size.density * container.retina.reduceFactor;
    const limit = this.options.size.limit;
    this.limit = {
      radius: limit.radius * container.retina.pixelRatio * container.retina.reduceFactor,
      mass: limit.mass
    };
    this.color = rangeColorToRgb(this.options.color) ?? {
      b: 0,
      g: 0,
      r: 0
    };
    this.position = ((_a = this.initialPosition) == null ? void 0 : _a.copy()) ?? this._calcPosition();
  }
  attract(particle) {
    const container = this.container, options = this.options;
    if (options.draggable) {
      const mouse = container.interactivity.mouse;
      if (mouse.clicking && mouse.downPosition) {
        const mouseDist = getDistance(this.position, mouse.downPosition);
        if (mouseDist <= this.size) {
          this.dragging = true;
        }
      } else {
        this.dragging = false;
      }
      if (this.dragging && mouse.position) {
        this.position.x = mouse.position.x;
        this.position.y = mouse.position.y;
      }
    }
    const pos = particle.getPosition(), { dx, dy, distance } = getDistances(this.position, pos), v = Vector.create(dx, dy);
    v.length = this.mass / Math.pow(distance, squareExp) * container.retina.reduceFactor;
    if (distance < this.size + particle.getRadius()) {
      const sizeFactor = particle.getRadius() * absorbFactor * container.retina.pixelRatio;
      if (this.size > particle.getRadius() && distance < this.size - particle.getRadius() || particle.absorberOrbit !== void 0 && particle.absorberOrbit.length < minOrbitLength) {
        if (options.destroy) {
          particle.destroy();
        } else {
          particle.needsNewPosition = true;
          this._updateParticlePosition(particle, v);
        }
      } else {
        if (options.destroy) {
          particle.size.value -= sizeFactor;
        }
        this._updateParticlePosition(particle, v);
      }
      if (this.limit.radius <= minRadius || this.size < this.limit.radius) {
        this.size += sizeFactor;
      }
      if (this.limit.mass <= minMass || this.mass < this.limit.mass) {
        this.mass += sizeFactor * this.options.size.density * container.retina.reduceFactor;
      }
    } else {
      this._updateParticlePosition(particle, v);
    }
  }
  draw(context) {
    context.translate(this.position.x, this.position.y);
    context.beginPath();
    context.arc(origin.x, origin.y, this.size, minAngle, maxAngle, false);
    context.closePath();
    context.fillStyle = getStyleFromRgb(this.color, this.opacity);
    context.fill();
  }
  resize() {
    const initialPosition = this.initialPosition;
    this.position = initialPosition && isPointInside(initialPosition, this.container.canvas.size, Vector.origin) ? initialPosition : this._calcPosition();
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/Absorbers.js
var defaultIndex = 0;
var Absorbers = class {
  constructor(container) {
    this.container = container;
    this.array = [];
    this.absorbers = [];
    this.interactivityAbsorbers = [];
    container.getAbsorber = (idxOrName) => idxOrName === void 0 || isNumber(idxOrName) ? this.array[idxOrName ?? defaultIndex] : this.array.find((t) => t.name === idxOrName);
    container.addAbsorber = async (options, position) => this.addAbsorber(options, position);
  }
  async addAbsorber(options, position) {
    const absorber = new AbsorberInstance(this, this.container, options, position);
    this.array.push(absorber);
    return Promise.resolve(absorber);
  }
  draw(context) {
    for (const absorber of this.array) {
      absorber.draw(context);
    }
  }
  handleClickMode(mode) {
    const absorberOptions = this.absorbers, modeAbsorbers = this.interactivityAbsorbers;
    if (mode === AbsorberClickMode.absorber) {
      const absorbersModeOptions = itemFromSingleOrMultiple(modeAbsorbers), absorbersOptions = absorbersModeOptions ?? itemFromSingleOrMultiple(absorberOptions), aPosition = this.container.interactivity.mouse.clickPosition;
      void this.addAbsorber(absorbersOptions, aPosition);
    }
  }
  async init() {
    this.absorbers = this.container.actualOptions.absorbers;
    this.interactivityAbsorbers = this.container.actualOptions.interactivity.modes.absorbers;
    const promises = executeOnSingleOrMultiple(this.absorbers, async (absorber) => {
      await this.addAbsorber(absorber);
    });
    if (promises instanceof Array) {
      await Promise.all(promises);
    } else {
      await promises;
    }
  }
  particleUpdate(particle) {
    for (const absorber of this.array) {
      absorber.attract(particle);
      if (particle.destroyed) {
        break;
      }
    }
  }
  removeAbsorber(absorber) {
    const index = this.array.indexOf(absorber), deleteCount = 1;
    if (index >= defaultIndex) {
      this.array.splice(index, deleteCount);
    }
  }
  resize() {
    for (const absorber of this.array) {
      absorber.resize();
    }
  }
  stop() {
    this.array = [];
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/AbsorbersPlugin.js
var AbsorbersPlugin = class {
  constructor() {
    this.id = "absorbers";
  }
  async getPlugin(container) {
    return Promise.resolve(new Absorbers(container));
  }
  loadOptions(options, source) {
    var _a, _b;
    if (!this.needsPlugin(options) && !this.needsPlugin(source)) {
      return;
    }
    if (source == null ? void 0 : source.absorbers) {
      options.absorbers = executeOnSingleOrMultiple(source.absorbers, (absorber) => {
        const tmp = new Absorber();
        tmp.load(absorber);
        return tmp;
      });
    }
    options.interactivity.modes.absorbers = executeOnSingleOrMultiple((_b = (_a = source == null ? void 0 : source.interactivity) == null ? void 0 : _a.modes) == null ? void 0 : _b.absorbers, (absorber) => {
      const tmp = new Absorber();
      tmp.load(absorber);
      return tmp;
    });
  }
  needsPlugin(options) {
    var _a, _b, _c;
    if (!options) {
      return false;
    }
    const absorbers = options.absorbers;
    if (isArray(absorbers)) {
      return !!absorbers.length;
    } else if (absorbers) {
      return true;
    } else if (((_c = (_b = (_a = options.interactivity) == null ? void 0 : _a.events) == null ? void 0 : _b.onClick) == null ? void 0 : _c.mode) && isInArray(AbsorberClickMode.absorber, options.interactivity.events.onClick.mode)) {
      return true;
    }
    return false;
  }
};

// node_modules/@tsparticles/plugin-absorbers/browser/index.js
async function loadAbsorbersPlugin(engine, refresh = true) {
  await engine.addPlugin(new AbsorbersPlugin(), refresh);
}

// node_modules/@tsparticles/updater-destroy/browser/Options/Classes/DestroyBounds.js
var DestroyBounds = class {
  load(data) {
    if (!data) {
      return;
    }
    if (data.bottom !== void 0) {
      this.bottom = setRangeValue(data.bottom);
    }
    if (data.left !== void 0) {
      this.left = setRangeValue(data.left);
    }
    if (data.right !== void 0) {
      this.right = setRangeValue(data.right);
    }
    if (data.top !== void 0) {
      this.top = setRangeValue(data.top);
    }
  }
};

// node_modules/@tsparticles/updater-destroy/browser/Enums/DestroyMode.js
var DestroyMode;
(function(DestroyMode2) {
  DestroyMode2["none"] = "none";
  DestroyMode2["split"] = "split";
})(DestroyMode || (DestroyMode = {}));

// node_modules/@tsparticles/updater-destroy/browser/Options/Classes/SplitFactor.js
var SplitFactor = class extends ValueWithRandom {
  constructor() {
    super();
    this.value = 3;
  }
};

// node_modules/@tsparticles/updater-destroy/browser/Options/Classes/SplitRate.js
var SplitRate = class extends ValueWithRandom {
  constructor() {
    super();
    this.value = { min: 4, max: 9 };
  }
};

// node_modules/@tsparticles/updater-destroy/browser/Options/Classes/Split.js
var Split = class {
  constructor() {
    this.count = 1;
    this.factor = new SplitFactor();
    this.rate = new SplitRate();
    this.sizeOffset = true;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.color !== void 0) {
      this.color = OptionsColor.create(this.color, data.color);
    }
    if (data.count !== void 0) {
      this.count = data.count;
    }
    this.factor.load(data.factor);
    this.rate.load(data.rate);
    this.particles = executeOnSingleOrMultiple(data.particles, (particles) => {
      return deepExtend({}, particles);
    });
    if (data.sizeOffset !== void 0) {
      this.sizeOffset = data.sizeOffset;
    }
    if (data.colorOffset) {
      this.colorOffset = this.colorOffset ?? {};
      if (data.colorOffset.h !== void 0) {
        this.colorOffset.h = data.colorOffset.h;
      }
      if (data.colorOffset.s !== void 0) {
        this.colorOffset.s = data.colorOffset.s;
      }
      if (data.colorOffset.l !== void 0) {
        this.colorOffset.l = data.colorOffset.l;
      }
    }
  }
};

// node_modules/@tsparticles/updater-destroy/browser/Options/Classes/Destroy.js
var Destroy = class {
  constructor() {
    this.bounds = new DestroyBounds();
    this.mode = DestroyMode.none;
    this.split = new Split();
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.mode) {
      this.mode = data.mode;
    }
    if (data.bounds) {
      this.bounds.load(data.bounds);
    }
    this.split.load(data.split);
  }
};

// node_modules/@tsparticles/updater-destroy/browser/Utils.js
var defaultOffset = 0;
var minDestroySize = 0.5;
var defaultSplitCount = 0;
var increment = 1;
var unbreakableTime = 500;
var minSplitCount = 0;
function addSplitParticle(engine, container, parent, splitParticlesOptions) {
  const destroyOptions = parent.options.destroy;
  if (!destroyOptions) {
    return;
  }
  const splitOptions = destroyOptions.split, options = loadParticlesOptions(engine, container, parent.options), factor = getRangeValue(splitOptions.factor.value), parentColor = parent.getFillColor();
  if (splitOptions.color) {
    options.color.load(splitOptions.color);
  } else if (splitOptions.colorOffset && parentColor) {
    options.color.load({
      value: {
        hsl: {
          h: parentColor.h + getRangeValue(splitOptions.colorOffset.h ?? defaultOffset),
          s: parentColor.s + getRangeValue(splitOptions.colorOffset.s ?? defaultOffset),
          l: parentColor.l + getRangeValue(splitOptions.colorOffset.l ?? defaultOffset)
        }
      }
    });
  } else {
    options.color.load({
      value: {
        hsl: parent.getFillColor()
      }
    });
  }
  options.move.load({
    center: {
      x: parent.position.x,
      y: parent.position.y,
      mode: PixelMode.precise
    }
  });
  if (isNumber(options.size.value)) {
    options.size.value /= factor;
  } else {
    options.size.value.min /= factor;
    options.size.value.max /= factor;
  }
  options.load(splitParticlesOptions);
  const offset = splitOptions.sizeOffset ? setRangeValue(-parent.size.value, parent.size.value) : defaultOffset, position = {
    x: parent.position.x + randomInRange(offset),
    y: parent.position.y + randomInRange(offset)
  };
  return container.particles.addParticle(position, options, parent.group, (particle) => {
    if (particle.size.value < minDestroySize) {
      return false;
    }
    particle.velocity.length = randomInRange(setRangeValue(parent.velocity.length, particle.velocity.length));
    particle.splitCount = (parent.splitCount ?? defaultSplitCount) + increment;
    particle.unbreakable = true;
    setTimeout(() => {
      particle.unbreakable = false;
    }, unbreakableTime);
    return true;
  });
}
function split(engine, container, particle) {
  const destroyOptions = particle.options.destroy;
  if (!destroyOptions) {
    return;
  }
  const splitOptions = destroyOptions.split;
  if (splitOptions.count >= minSplitCount && (particle.splitCount === void 0 || particle.splitCount++ > splitOptions.count)) {
    return;
  }
  const rate = getRangeValue(splitOptions.rate.value), particlesSplitOptions = itemFromSingleOrMultiple(splitOptions.particles);
  for (let i = 0; i < rate; i++) {
    addSplitParticle(engine, container, particle, particlesSplitOptions);
  }
}

// node_modules/@tsparticles/updater-destroy/browser/DestroyUpdater.js
var DestroyUpdater = class {
  constructor(engine, container) {
    this.container = container;
    this.engine = engine;
  }
  init(particle) {
    const container = this.container, particlesOptions = particle.options, destroyOptions = particlesOptions.destroy;
    if (!destroyOptions) {
      return;
    }
    particle.splitCount = 0;
    const destroyBoundsOptions = destroyOptions.bounds;
    if (!particle.destroyBounds) {
      particle.destroyBounds = {};
    }
    const { bottom, left, right, top } = destroyBoundsOptions, { destroyBounds } = particle, canvasSize = container.canvas.size;
    if (bottom) {
      destroyBounds.bottom = getRangeValue(bottom) * canvasSize.height / percentDenominator;
    }
    if (left) {
      destroyBounds.left = getRangeValue(left) * canvasSize.width / percentDenominator;
    }
    if (right) {
      destroyBounds.right = getRangeValue(right) * canvasSize.width / percentDenominator;
    }
    if (top) {
      destroyBounds.top = getRangeValue(top) * canvasSize.height / percentDenominator;
    }
  }
  isEnabled(particle) {
    return !particle.destroyed;
  }
  loadOptions(options, ...sources) {
    if (!options.destroy) {
      options.destroy = new Destroy();
    }
    for (const source of sources) {
      options.destroy.load(source == null ? void 0 : source.destroy);
    }
  }
  particleDestroyed(particle, override) {
    if (override) {
      return;
    }
    const destroyOptions = particle.options.destroy;
    if (destroyOptions && destroyOptions.mode === DestroyMode.split) {
      split(this.engine, this.container, particle);
    }
  }
  update(particle) {
    if (!this.isEnabled(particle)) {
      return;
    }
    const position = particle.getPosition(), bounds = particle.destroyBounds;
    if (!bounds) {
      return;
    }
    if (bounds.bottom !== void 0 && position.y >= bounds.bottom || bounds.left !== void 0 && position.x <= bounds.left || bounds.right !== void 0 && position.x >= bounds.right || bounds.top !== void 0 && position.y <= bounds.top) {
      particle.destroy();
    }
  }
};

// node_modules/@tsparticles/updater-destroy/browser/index.js
async function loadDestroyUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("destroy", (container) => {
    return Promise.resolve(new DestroyUpdater(engine, container));
  }, refresh);
}

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/EmitterLife.js
var EmitterLife = class {
  constructor() {
    this.wait = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.count !== void 0) {
      this.count = data.count;
    }
    if (data.delay !== void 0) {
      this.delay = setRangeValue(data.delay);
    }
    if (data.duration !== void 0) {
      this.duration = setRangeValue(data.duration);
    }
    if (data.wait !== void 0) {
      this.wait = data.wait;
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/EmitterRate.js
var EmitterRate = class {
  constructor() {
    this.quantity = 1;
    this.delay = 0.1;
  }
  load(data) {
    if (data === void 0) {
      return;
    }
    if (data.quantity !== void 0) {
      this.quantity = setRangeValue(data.quantity);
    }
    if (data.delay !== void 0) {
      this.delay = setRangeValue(data.delay);
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/EmitterShapeReplace.js
var EmitterShapeReplace = class {
  constructor() {
    this.color = false;
    this.opacity = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.color !== void 0) {
      this.color = data.color;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/EmitterShape.js
var EmitterShape = class {
  constructor() {
    this.options = {};
    this.replace = new EmitterShapeReplace();
    this.type = "square";
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.options !== void 0) {
      this.options = deepExtend({}, data.options ?? {});
    }
    this.replace.load(data.replace);
    if (data.type !== void 0) {
      this.type = data.type;
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/EmitterSize.js
var EmitterSize = class {
  constructor() {
    this.mode = PixelMode.percent;
    this.height = 0;
    this.width = 0;
  }
  load(data) {
    if (data === void 0) {
      return;
    }
    if (data.mode !== void 0) {
      this.mode = data.mode;
    }
    if (data.height !== void 0) {
      this.height = data.height;
    }
    if (data.width !== void 0) {
      this.width = data.width;
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Options/Classes/Emitter.js
var Emitter = class {
  constructor() {
    this.autoPlay = true;
    this.fill = true;
    this.life = new EmitterLife();
    this.rate = new EmitterRate();
    this.shape = new EmitterShape();
    this.startCount = 0;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.autoPlay !== void 0) {
      this.autoPlay = data.autoPlay;
    }
    if (data.size !== void 0) {
      if (!this.size) {
        this.size = new EmitterSize();
      }
      this.size.load(data.size);
    }
    if (data.direction !== void 0) {
      this.direction = data.direction;
    }
    this.domId = data.domId;
    if (data.fill !== void 0) {
      this.fill = data.fill;
    }
    this.life.load(data.life);
    this.name = data.name;
    this.particles = executeOnSingleOrMultiple(data.particles, (particles) => {
      return deepExtend({}, particles);
    });
    this.rate.load(data.rate);
    this.shape.load(data.shape);
    if (data.position !== void 0) {
      this.position = {};
      if (data.position.x !== void 0) {
        this.position.x = setRangeValue(data.position.x);
      }
      if (data.position.y !== void 0) {
        this.position.y = setRangeValue(data.position.y);
      }
    }
    if (data.spawnColor !== void 0) {
      if (this.spawnColor === void 0) {
        this.spawnColor = new AnimatableColor();
      }
      this.spawnColor.load(data.spawnColor);
    }
    if (data.startCount !== void 0) {
      this.startCount = data.startCount;
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Enums/EmitterClickMode.js
var EmitterClickMode;
(function(EmitterClickMode2) {
  EmitterClickMode2["emitter"] = "emitter";
})(EmitterClickMode || (EmitterClickMode = {}));

// node_modules/@tsparticles/plugin-emitters/browser/EmitterInstance.js
var half = 0.5;
var defaultLifeDelay = 0;
var minLifeCount = 0;
var defaultSpawnDelay = 0;
var defaultEmitDelay = 0;
var defaultLifeCount = -1;
var defaultColorAnimationFactor = 1;
function setParticlesOptionsColor(particlesOptions, color) {
  if (particlesOptions.color) {
    particlesOptions.color.value = color;
  } else {
    particlesOptions.color = {
      value: color
    };
  }
}
var EmitterInstance = class {
  constructor(engine, emitters, container, options, position) {
    var _a, _b;
    this.emitters = emitters;
    this.container = container;
    this._destroy = () => {
      var _a2, _b2;
      (_a2 = this._mutationObserver) == null ? void 0 : _a2.disconnect();
      this._mutationObserver = void 0;
      (_b2 = this._resizeObserver) == null ? void 0 : _b2.disconnect();
      this._resizeObserver = void 0;
      this.emitters.removeEmitter(this);
      this._engine.dispatchEvent("emitterDestroyed", {
        container: this.container,
        data: {
          emitter: this
        }
      });
    };
    this._prepareToDie = () => {
      var _a2;
      if (this._paused) {
        return;
      }
      const duration = ((_a2 = this.options.life) == null ? void 0 : _a2.duration) !== void 0 ? getRangeValue(this.options.life.duration) : void 0, minDuration = 0, minLifeCount2 = 0;
      if (this.container.retina.reduceFactor && (this._lifeCount > minLifeCount2 || this._immortal) && duration !== void 0 && duration > minDuration) {
        this._duration = duration * millisecondsToSeconds;
      }
    };
    this._setColorAnimation = (animation, initValue, maxValue, factor = defaultColorAnimationFactor) => {
      const container2 = this.container;
      if (!animation.enable) {
        return initValue;
      }
      const colorOffset = randomInRange(animation.offset), delay = getRangeValue(this.options.rate.delay), emitFactor = delay * millisecondsToSeconds / container2.retina.reduceFactor, defaultColorSpeed = 0, colorSpeed = getRangeValue(animation.speed ?? defaultColorSpeed);
      return (initValue + colorSpeed * container2.fpsLimit / emitFactor + colorOffset * factor) % maxValue;
    };
    this._engine = engine;
    this._currentDuration = 0;
    this._currentEmitDelay = 0;
    this._currentSpawnDelay = 0;
    this._initialPosition = position;
    if (options instanceof Emitter) {
      this.options = options;
    } else {
      this.options = new Emitter();
      this.options.load(options);
    }
    this._spawnDelay = getRangeValue(this.options.life.delay ?? defaultLifeDelay) * millisecondsToSeconds / this.container.retina.reduceFactor;
    this.position = this._initialPosition ?? this._calcPosition();
    this.name = this.options.name;
    this.fill = this.options.fill;
    this._firstSpawn = !this.options.life.wait;
    this._startParticlesAdded = false;
    let particlesOptions = deepExtend({}, this.options.particles);
    particlesOptions ?? (particlesOptions = {});
    particlesOptions.move ?? (particlesOptions.move = {});
    (_a = particlesOptions.move).direction ?? (_a.direction = this.options.direction);
    if (this.options.spawnColor) {
      this.spawnColor = rangeColorToHsl(this.options.spawnColor);
    }
    this._paused = !this.options.autoPlay;
    this._particlesOptions = particlesOptions;
    this._size = this._calcSize();
    this.size = getSize(this._size, this.container.canvas.size);
    this._lifeCount = this.options.life.count ?? defaultLifeCount;
    this._immortal = this._lifeCount <= minLifeCount;
    if (this.options.domId) {
      const element = document.getElementById(this.options.domId);
      if (element) {
        this._mutationObserver = new MutationObserver(() => {
          this.resize();
        });
        this._resizeObserver = new ResizeObserver(() => {
          this.resize();
        });
        this._mutationObserver.observe(element, {
          attributes: true,
          attributeFilter: ["style", "width", "height"]
        });
        this._resizeObserver.observe(element);
      }
    }
    const shapeOptions = this.options.shape, shapeGenerator = (_b = this._engine.emitterShapeManager) == null ? void 0 : _b.getShapeGenerator(shapeOptions.type);
    if (shapeGenerator) {
      this._shape = shapeGenerator.generate(this.position, this.size, this.fill, shapeOptions.options);
    }
    this._engine.dispatchEvent("emitterCreated", {
      container,
      data: {
        emitter: this
      }
    });
    this.play();
  }
  externalPause() {
    this._paused = true;
    this.pause();
  }
  externalPlay() {
    this._paused = false;
    this.play();
  }
  async init() {
    var _a;
    await ((_a = this._shape) == null ? void 0 : _a.init());
  }
  pause() {
    if (this._paused) {
      return;
    }
    delete this._emitDelay;
  }
  play() {
    if (this._paused) {
      return;
    }
    if (!(this.container.retina.reduceFactor && (this._lifeCount > minLifeCount || this._immortal || !this.options.life.count) && (this._firstSpawn || this._currentSpawnDelay >= (this._spawnDelay ?? defaultSpawnDelay)))) {
      return;
    }
    if (this._emitDelay === void 0) {
      const delay = getRangeValue(this.options.rate.delay);
      this._emitDelay = delay * millisecondsToSeconds / this.container.retina.reduceFactor;
    }
    if (this._lifeCount > minLifeCount || this._immortal) {
      this._prepareToDie();
    }
  }
  resize() {
    var _a;
    const initialPosition = this._initialPosition;
    this.position = initialPosition && isPointInside(initialPosition, this.container.canvas.size, Vector.origin) ? initialPosition : this._calcPosition();
    this._size = this._calcSize();
    this.size = getSize(this._size, this.container.canvas.size);
    (_a = this._shape) == null ? void 0 : _a.resize(this.position, this.size);
  }
  update(delta) {
    var _a;
    if (this._paused) {
      return;
    }
    if (this._firstSpawn) {
      this._firstSpawn = false;
      this._currentSpawnDelay = this._spawnDelay ?? defaultSpawnDelay;
      this._currentEmitDelay = this._emitDelay ?? defaultEmitDelay;
    }
    if (!this._startParticlesAdded) {
      this._startParticlesAdded = true;
      this._emitParticles(this.options.startCount);
    }
    if (this._duration !== void 0) {
      this._currentDuration += delta.value;
      if (this._currentDuration >= this._duration) {
        this.pause();
        if (this._spawnDelay !== void 0) {
          delete this._spawnDelay;
        }
        if (!this._immortal) {
          this._lifeCount--;
        }
        if (this._lifeCount > minLifeCount || this._immortal) {
          this.position = this._calcPosition();
          (_a = this._shape) == null ? void 0 : _a.resize(this.position, this.size);
          this._spawnDelay = getRangeValue(this.options.life.delay ?? defaultLifeDelay) * millisecondsToSeconds / this.container.retina.reduceFactor;
        } else {
          this._destroy();
        }
        this._currentDuration -= this._duration;
        delete this._duration;
      }
    }
    if (this._spawnDelay !== void 0) {
      this._currentSpawnDelay += delta.value;
      if (this._currentSpawnDelay >= this._spawnDelay) {
        this._engine.dispatchEvent("emitterPlay", {
          container: this.container
        });
        this.play();
        this._currentSpawnDelay -= this._currentSpawnDelay;
        delete this._spawnDelay;
      }
    }
    if (this._emitDelay !== void 0) {
      this._currentEmitDelay += delta.value;
      if (this._currentEmitDelay >= this._emitDelay) {
        this._emit();
        this._currentEmitDelay -= this._emitDelay;
      }
    }
  }
  _calcPosition() {
    if (this.options.domId) {
      const element = document.getElementById(this.options.domId);
      if (element) {
        const elRect = element.getBoundingClientRect(), pxRatio = this.container.retina.pixelRatio;
        return {
          x: (elRect.x + elRect.width * half) * pxRatio,
          y: (elRect.y + elRect.height * half) * pxRatio
        };
      }
    }
    return calcPositionOrRandomFromSizeRanged({
      size: this.container.canvas.size,
      position: this.options.position
    });
  }
  _calcSize() {
    const container = this.container;
    if (this.options.domId) {
      const element = document.getElementById(this.options.domId);
      if (element) {
        const elRect = element.getBoundingClientRect();
        return {
          width: elRect.width * container.retina.pixelRatio,
          height: elRect.height * container.retina.pixelRatio,
          mode: PixelMode.precise
        };
      }
    }
    return this.options.size ?? (() => {
      const size = new EmitterSize();
      size.load({
        height: 0,
        mode: PixelMode.percent,
        width: 0
      });
      return size;
    })();
  }
  _emit() {
    if (this._paused) {
      return;
    }
    const quantity = getRangeValue(this.options.rate.quantity);
    this._emitParticles(quantity);
  }
  _emitParticles(quantity) {
    var _a;
    const singleParticlesOptions = itemFromSingleOrMultiple(this._particlesOptions);
    for (let i = 0; i < quantity; i++) {
      const particlesOptions = deepExtend({}, singleParticlesOptions);
      if (this.spawnColor) {
        const hslAnimation = (_a = this.options.spawnColor) == null ? void 0 : _a.animation;
        if (hslAnimation) {
          const maxValues = {
            h: 360,
            s: 100,
            l: 100
          }, colorFactor = 3.6;
          this.spawnColor.h = this._setColorAnimation(hslAnimation.h, this.spawnColor.h, maxValues.h, colorFactor);
          this.spawnColor.s = this._setColorAnimation(hslAnimation.s, this.spawnColor.s, maxValues.s);
          this.spawnColor.l = this._setColorAnimation(hslAnimation.l, this.spawnColor.l, maxValues.l);
        }
        setParticlesOptionsColor(particlesOptions, this.spawnColor);
      }
      const shapeOptions = this.options.shape;
      let position = this.position;
      if (this._shape) {
        const shapePosData = this._shape.randomPosition();
        if (shapePosData) {
          position = shapePosData.position;
          const replaceData = shapeOptions.replace;
          if (replaceData.color && shapePosData.color) {
            setParticlesOptionsColor(particlesOptions, shapePosData.color);
          }
          if (replaceData.opacity) {
            if (particlesOptions.opacity) {
              particlesOptions.opacity.value = shapePosData.opacity;
            } else {
              particlesOptions.opacity = {
                value: shapePosData.opacity
              };
            }
          }
        } else {
          position = null;
        }
      }
      if (position) {
        this.container.particles.addParticle(position, particlesOptions);
      }
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/Emitters.js
var Emitters = class {
  constructor(engine, container) {
    this.container = container;
    this._engine = engine;
    this.array = [];
    this.emitters = [];
    this.interactivityEmitters = {
      random: {
        count: 1,
        enable: false
      },
      value: []
    };
    const defaultIndex2 = 0;
    container.getEmitter = (idxOrName) => idxOrName === void 0 || isNumber(idxOrName) ? this.array[idxOrName ?? defaultIndex2] : this.array.find((t) => t.name === idxOrName);
    container.addEmitter = async (options, position) => this.addEmitter(options, position);
    container.removeEmitter = (idxOrName) => {
      const emitter = container.getEmitter(idxOrName);
      if (emitter) {
        this.removeEmitter(emitter);
      }
    };
    container.playEmitter = (idxOrName) => {
      const emitter = container.getEmitter(idxOrName);
      if (emitter) {
        emitter.externalPlay();
      }
    };
    container.pauseEmitter = (idxOrName) => {
      const emitter = container.getEmitter(idxOrName);
      if (emitter) {
        emitter.externalPause();
      }
    };
  }
  async addEmitter(options, position) {
    const emitterOptions = new Emitter();
    emitterOptions.load(options);
    const emitter = new EmitterInstance(this._engine, this, this.container, emitterOptions, position);
    await emitter.init();
    this.array.push(emitter);
    return emitter;
  }
  handleClickMode(mode) {
    const emitterOptions = this.emitters, modeEmitters = this.interactivityEmitters;
    if (mode !== EmitterClickMode.emitter) {
      return;
    }
    let emittersModeOptions;
    if (modeEmitters && isArray(modeEmitters.value)) {
      const minLength = 0;
      if (modeEmitters.value.length > minLength && modeEmitters.random.enable) {
        emittersModeOptions = [];
        const usedIndexes = [];
        for (let i = 0; i < modeEmitters.random.count; i++) {
          const idx = arrayRandomIndex(modeEmitters.value);
          if (usedIndexes.includes(idx) && usedIndexes.length < modeEmitters.value.length) {
            i--;
            continue;
          }
          usedIndexes.push(idx);
          emittersModeOptions.push(itemFromArray(modeEmitters.value, idx));
        }
      } else {
        emittersModeOptions = modeEmitters.value;
      }
    } else {
      emittersModeOptions = modeEmitters == null ? void 0 : modeEmitters.value;
    }
    const emittersOptions = emittersModeOptions ?? emitterOptions, ePosition = this.container.interactivity.mouse.clickPosition;
    void executeOnSingleOrMultiple(emittersOptions, async (emitter) => {
      await this.addEmitter(emitter, ePosition);
    });
  }
  async init() {
    this.emitters = this.container.actualOptions.emitters;
    this.interactivityEmitters = this.container.actualOptions.interactivity.modes.emitters;
    if (!this.emitters) {
      return;
    }
    if (isArray(this.emitters)) {
      for (const emitterOptions of this.emitters) {
        await this.addEmitter(emitterOptions);
      }
    } else {
      await this.addEmitter(this.emitters);
    }
  }
  pause() {
    for (const emitter of this.array) {
      emitter.pause();
    }
  }
  play() {
    for (const emitter of this.array) {
      emitter.play();
    }
  }
  removeEmitter(emitter) {
    const index = this.array.indexOf(emitter), minIndex = 0, deleteCount = 1;
    if (index >= minIndex) {
      this.array.splice(index, deleteCount);
    }
  }
  resize() {
    for (const emitter of this.array) {
      emitter.resize();
    }
  }
  stop() {
    this.array = [];
  }
  update(delta) {
    for (const emitter of this.array) {
      emitter.update(delta);
    }
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/EmittersPlugin.js
var EmittersPlugin = class {
  constructor(engine) {
    this._engine = engine;
    this.id = "emitters";
  }
  getPlugin(container) {
    return Promise.resolve(new Emitters(this._engine, container));
  }
  loadOptions(options, source) {
    var _a, _b;
    if (!this.needsPlugin(options) && !this.needsPlugin(source)) {
      return;
    }
    if (source == null ? void 0 : source.emitters) {
      options.emitters = executeOnSingleOrMultiple(source.emitters, (emitter) => {
        const tmp = new Emitter();
        tmp.load(emitter);
        return tmp;
      });
    }
    const interactivityEmitters = (_b = (_a = source == null ? void 0 : source.interactivity) == null ? void 0 : _a.modes) == null ? void 0 : _b.emitters;
    if (interactivityEmitters) {
      if (isArray(interactivityEmitters)) {
        options.interactivity.modes.emitters = {
          random: {
            count: 1,
            enable: true
          },
          value: interactivityEmitters.map((s) => {
            const tmp = new Emitter();
            tmp.load(s);
            return tmp;
          })
        };
      } else {
        const emitterMode = interactivityEmitters;
        if (emitterMode.value !== void 0) {
          const defaultCount = 1;
          if (isArray(emitterMode.value)) {
            options.interactivity.modes.emitters = {
              random: {
                count: emitterMode.random.count ?? defaultCount,
                enable: emitterMode.random.enable ?? false
              },
              value: emitterMode.value.map((s) => {
                const tmp = new Emitter();
                tmp.load(s);
                return tmp;
              })
            };
          } else {
            const tmp = new Emitter();
            tmp.load(emitterMode.value);
            options.interactivity.modes.emitters = {
              random: {
                count: emitterMode.random.count ?? defaultCount,
                enable: emitterMode.random.enable ?? false
              },
              value: tmp
            };
          }
        } else {
          const emitterOptions = options.interactivity.modes.emitters = {
            random: {
              count: 1,
              enable: false
            },
            value: new Emitter()
          };
          emitterOptions.value.load(interactivityEmitters);
        }
      }
    }
  }
  needsPlugin(options) {
    var _a, _b, _c;
    if (!options) {
      return false;
    }
    const emitters = options.emitters;
    return isArray(emitters) && !!emitters.length || emitters !== void 0 || !!((_c = (_b = (_a = options.interactivity) == null ? void 0 : _a.events) == null ? void 0 : _b.onClick) == null ? void 0 : _c.mode) && isInArray(EmitterClickMode.emitter, options.interactivity.events.onClick.mode);
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/ShapeManager.js
var shapeGeneratorss = /* @__PURE__ */ new Map();
var ShapeManager = class {
  constructor(engine) {
    this._engine = engine;
  }
  addShapeGenerator(name, generator) {
    if (!this.getShapeGenerator(name)) {
      shapeGeneratorss.set(name, generator);
    }
  }
  getShapeGenerator(name) {
    return shapeGeneratorss.get(name);
  }
  getSupportedShapeGenerators() {
    return shapeGeneratorss.keys();
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/EmitterShapeBase.js
var EmitterShapeBase = class {
  constructor(position, size, fill, options) {
    this.position = position;
    this.size = size;
    this.fill = fill;
    this.options = options;
  }
  resize(position, size) {
    this.position = position;
    this.size = size;
  }
};

// node_modules/@tsparticles/plugin-emitters/browser/index.js
async function loadEmittersPlugin(engine, refresh = true) {
  if (!engine.emitterShapeManager) {
    engine.emitterShapeManager = new ShapeManager(engine);
  }
  if (!engine.addEmitterShapeGenerator) {
    engine.addEmitterShapeGenerator = (name, generator) => {
      var _a;
      (_a = engine.emitterShapeManager) == null ? void 0 : _a.addShapeGenerator(name, generator);
    };
  }
  const plugin = new EmittersPlugin(engine);
  await engine.addPlugin(plugin, refresh);
}

// node_modules/@tsparticles/plugin-emitters-shape-circle/browser/EmittersCircleShape.js
var quarter = 0.25;
var double2 = 2;
var doublePI = Math.PI * double2;
var squareExp2 = 2;
var half2 = 0.5;
var EmittersCircleShape = class extends EmitterShapeBase {
  constructor(position, size, fill, options) {
    super(position, size, fill, options);
  }
  async init() {
  }
  randomPosition() {
    const size = this.size, fill = this.fill, position = this.position, generateTheta = (x, y) => {
      const u = getRandom() * quarter, theta = Math.atan(y / x * Math.tan(doublePI * u)), v = getRandom();
      if (v < quarter) {
        return theta;
      } else if (v < double2 * quarter) {
        return Math.PI - theta;
      } else if (v < double2 * quarter + quarter) {
        return Math.PI + theta;
      } else {
        return -theta;
      }
    }, radius = (x, y, theta) => x * y / Math.sqrt((y * Math.cos(theta)) ** squareExp2 + (x * Math.sin(theta)) ** squareExp2), [a, b] = [size.width * half2, size.height * half2], randomTheta = generateTheta(a, b), maxRadius = radius(a, b, randomTheta), randomRadius = fill ? maxRadius * Math.sqrt(getRandom()) : maxRadius;
    return {
      position: {
        x: position.x + randomRadius * Math.cos(randomTheta),
        y: position.y + randomRadius * Math.sin(randomTheta)
      }
    };
  }
};

// node_modules/@tsparticles/plugin-emitters-shape-circle/browser/EmittersCircleShapeGenerator.js
var EmittersCircleShapeGenerator = class {
  generate(position, size, fill, options) {
    return new EmittersCircleShape(position, size, fill, options);
  }
};

// node_modules/@tsparticles/plugin-emitters-shape-circle/browser/index.js
async function loadEmittersShapeCircle(engine, refresh = true) {
  var _a;
  const emittersEngine = engine;
  (_a = emittersEngine.addEmitterShapeGenerator) == null ? void 0 : _a.call(emittersEngine, "circle", new EmittersCircleShapeGenerator());
  await emittersEngine.refresh(refresh);
}

// node_modules/@tsparticles/plugin-emitters-shape-square/browser/EmittersSquareShape.js
var half3 = 0.5;
var sides = 4;
var double3 = 2;
var Sides;
(function(Sides2) {
  Sides2[Sides2["TopLeft"] = 0] = "TopLeft";
  Sides2[Sides2["TopRight"] = 1] = "TopRight";
  Sides2[Sides2["BottomRight"] = 2] = "BottomRight";
  Sides2[Sides2["BottomLeft"] = 3] = "BottomLeft";
})(Sides || (Sides = {}));
function randomSquareCoordinate(position, offset) {
  return position + offset * (getRandom() - halfRandom);
}
var EmittersSquareShape = class extends EmitterShapeBase {
  constructor(position, size, fill, options) {
    super(position, size, fill, options);
  }
  async init() {
  }
  randomPosition() {
    const fill = this.fill, position = this.position, size = this.size;
    if (fill) {
      return {
        position: {
          x: randomSquareCoordinate(position.x, size.width),
          y: randomSquareCoordinate(position.y, size.height)
        }
      };
    } else {
      const halfW = size.width * half3, halfH = size.height * half3, side = Math.floor(getRandom() * sides), v = (getRandom() - halfRandom) * double3;
      switch (side) {
        case Sides.TopLeft:
          return {
            position: {
              x: position.x + v * halfW,
              y: position.y - halfH
            }
          };
        case Sides.TopRight:
          return {
            position: {
              x: position.x - halfW,
              y: position.y + v * halfH
            }
          };
        case Sides.BottomRight:
          return {
            position: {
              x: position.x + v * halfW,
              y: position.y + halfH
            }
          };
        case Sides.BottomLeft:
        default:
          return {
            position: {
              x: position.x + halfW,
              y: position.y + v * halfH
            }
          };
      }
    }
  }
};

// node_modules/@tsparticles/plugin-emitters-shape-square/browser/EmittersSquareShapeGenerator.js
var EmittersSquareShapeGenerator = class {
  generate(position, size, fill, options) {
    return new EmittersSquareShape(position, size, fill, options);
  }
};

// node_modules/@tsparticles/plugin-emitters-shape-square/browser/index.js
async function loadEmittersShapeSquare(engine, refresh = true) {
  var _a;
  const emittersEngine = engine;
  (_a = emittersEngine.addEmitterShapeGenerator) == null ? void 0 : _a.call(emittersEngine, "square", new EmittersSquareShapeGenerator());
  await emittersEngine.refresh(refresh);
}

// node_modules/@tsparticles/interaction-external-trail/browser/Options/Classes/Trail.js
var Trail = class {
  constructor() {
    this.delay = 1;
    this.pauseOnStop = false;
    this.quantity = 1;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.delay !== void 0) {
      this.delay = data.delay;
    }
    if (data.quantity !== void 0) {
      this.quantity = data.quantity;
    }
    if (data.particles !== void 0) {
      this.particles = deepExtend({}, data.particles);
    }
    if (data.pauseOnStop !== void 0) {
      this.pauseOnStop = data.pauseOnStop;
    }
  }
};

// node_modules/@tsparticles/interaction-external-trail/browser/TrailMaker.js
var trailMode = "trail";
var TrailMaker = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
    this._delay = 0;
  }
  clear() {
  }
  init() {
  }
  interact(delta) {
    var _a, _b, _c, _d;
    const container = this.container, { interactivity } = container;
    if (!container.retina.reduceFactor) {
      return;
    }
    const options = container.actualOptions, trailOptions = options.interactivity.modes.trail;
    if (!trailOptions) {
      return;
    }
    const optDelay = trailOptions.delay * millisecondsToSeconds / this.container.retina.reduceFactor;
    if (this._delay < optDelay) {
      this._delay += delta.value;
    }
    if (this._delay < optDelay) {
      return;
    }
    const canEmit = !(trailOptions.pauseOnStop && (interactivity.mouse.position === this._lastPosition || ((_a = interactivity.mouse.position) == null ? void 0 : _a.x) === ((_b = this._lastPosition) == null ? void 0 : _b.x) && ((_c = interactivity.mouse.position) == null ? void 0 : _c.y) === ((_d = this._lastPosition) == null ? void 0 : _d.y)));
    const mousePos = container.interactivity.mouse.position;
    if (mousePos) {
      this._lastPosition = { ...mousePos };
    } else {
      delete this._lastPosition;
    }
    if (canEmit) {
      container.particles.push(trailOptions.quantity, container.interactivity.mouse, trailOptions.particles);
    }
    this._delay -= optDelay;
  }
  isEnabled(particle) {
    const container = this.container, options = container.actualOptions, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? options.interactivity).events;
    return mouse.clicking && mouse.inside && !!mouse.position && isInArray(trailMode, events.onClick.mode) || mouse.inside && !!mouse.position && isInArray(trailMode, events.onHover.mode);
  }
  loadModeOptions(options, ...sources) {
    if (!options.trail) {
      options.trail = new Trail();
    }
    for (const source of sources) {
      options.trail.load(source == null ? void 0 : source.trail);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-trail/browser/index.js
async function loadExternalTrailInteraction(engine, refresh = true) {
  await engine.addInteractor("externalTrail", (container) => {
    return Promise.resolve(new TrailMaker(container));
  }, refresh);
}

// node_modules/@tsparticles/updater-roll/browser/RollMode.js
var RollMode;
(function(RollMode2) {
  RollMode2["both"] = "both";
  RollMode2["horizontal"] = "horizontal";
  RollMode2["vertical"] = "vertical";
})(RollMode || (RollMode = {}));

// node_modules/@tsparticles/updater-roll/browser/Utils.js
var double4 = 2;
var doublePI2 = Math.PI * double4;
var maxAngle2 = 360;
function initParticle(particle) {
  const rollOpt = particle.options.roll;
  if (!(rollOpt == null ? void 0 : rollOpt.enable)) {
    particle.roll = {
      enable: false,
      horizontal: false,
      vertical: false,
      angle: 0,
      speed: 0
    };
    return;
  }
  particle.roll = {
    enable: rollOpt.enable,
    horizontal: rollOpt.mode === RollMode.horizontal || rollOpt.mode === RollMode.both,
    vertical: rollOpt.mode === RollMode.vertical || rollOpt.mode === RollMode.both,
    angle: getRandom() * doublePI2,
    speed: getRangeValue(rollOpt.speed) / maxAngle2
  };
  if (rollOpt.backColor) {
    particle.backColor = rangeColorToHsl(rollOpt.backColor);
  } else if (rollOpt.darken.enable && rollOpt.enlighten.enable) {
    const alterType = getRandom() >= halfRandom ? AlterType.darken : AlterType.enlighten;
    particle.roll.alter = {
      type: alterType,
      value: getRangeValue(alterType === AlterType.darken ? rollOpt.darken.value : rollOpt.enlighten.value)
    };
  } else if (rollOpt.darken.enable) {
    particle.roll.alter = {
      type: AlterType.darken,
      value: getRangeValue(rollOpt.darken.value)
    };
  } else if (rollOpt.enlighten.enable) {
    particle.roll.alter = {
      type: AlterType.enlighten,
      value: getRangeValue(rollOpt.enlighten.value)
    };
  }
}
function updateRoll(particle, delta) {
  const roll = particle.options.roll, data = particle.roll;
  if (!data || !(roll == null ? void 0 : roll.enable)) {
    return;
  }
  const speed = data.speed * delta.factor, max = doublePI2;
  data.angle += speed;
  if (data.angle > max) {
    data.angle -= max;
  }
}

// node_modules/@tsparticles/updater-roll/browser/Options/Classes/RollLight.js
var RollLight = class {
  constructor() {
    this.enable = false;
    this.value = 0;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.value !== void 0) {
      this.value = setRangeValue(data.value);
    }
  }
};

// node_modules/@tsparticles/updater-roll/browser/Options/Classes/Roll.js
var Roll = class {
  constructor() {
    this.darken = new RollLight();
    this.enable = false;
    this.enlighten = new RollLight();
    this.mode = RollMode.vertical;
    this.speed = 25;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.backColor !== void 0) {
      this.backColor = OptionsColor.create(this.backColor, data.backColor);
    }
    this.darken.load(data.darken);
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    this.enlighten.load(data.enlighten);
    if (data.mode !== void 0) {
      this.mode = data.mode;
    }
    if (data.speed !== void 0) {
      this.speed = setRangeValue(data.speed);
    }
  }
};

// node_modules/@tsparticles/updater-roll/browser/RollUpdater.js
var RollUpdater = class {
  getTransformValues(particle) {
    var _a;
    const roll = ((_a = particle.roll) == null ? void 0 : _a.enable) && particle.roll, rollHorizontal = roll && roll.horizontal, rollVertical = roll && roll.vertical;
    return {
      a: rollHorizontal ? Math.cos(roll.angle) : void 0,
      d: rollVertical ? Math.sin(roll.angle) : void 0
    };
  }
  init(particle) {
    initParticle(particle);
  }
  isEnabled(particle) {
    const roll = particle.options.roll;
    return !particle.destroyed && !particle.spawning && !!(roll == null ? void 0 : roll.enable);
  }
  loadOptions(options, ...sources) {
    if (!options.roll) {
      options.roll = new Roll();
    }
    for (const source of sources) {
      options.roll.load(source == null ? void 0 : source.roll);
    }
  }
  update(particle, delta) {
    if (!this.isEnabled(particle)) {
      return;
    }
    updateRoll(particle, delta);
  }
};

// node_modules/@tsparticles/updater-roll/browser/index.js
async function loadRollUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("roll", () => {
    return Promise.resolve(new RollUpdater());
  }, refresh);
}

// node_modules/@tsparticles/move-base/browser/Utils.js
var half4 = 0.5;
var minVelocity2 = 0;
var identity = 1;
var moveSpeedFactor = 60;
var minSpinRadius = 0;
var spinFactor = 0.01;
function applyDistance(particle) {
  const initialPosition = particle.initialPosition, { dx, dy } = getDistances(initialPosition, particle.position), dxFixed = Math.abs(dx), dyFixed = Math.abs(dy), { maxDistance } = particle.retina, hDistance = maxDistance.horizontal, vDistance = maxDistance.vertical;
  if (!hDistance && !vDistance) {
    return;
  }
  const hasHDistance = (hDistance && dxFixed >= hDistance) ?? false, hasVDistance = (vDistance && dyFixed >= vDistance) ?? false;
  if ((hasHDistance || hasVDistance) && !particle.misplaced) {
    particle.misplaced = !!hDistance && dxFixed > hDistance || !!vDistance && dyFixed > vDistance;
    if (hDistance) {
      particle.velocity.x = particle.velocity.y * half4 - particle.velocity.x;
    }
    if (vDistance) {
      particle.velocity.y = particle.velocity.x * half4 - particle.velocity.y;
    }
  } else if ((!hDistance || dxFixed < hDistance) && (!vDistance || dyFixed < vDistance) && particle.misplaced) {
    particle.misplaced = false;
  } else if (particle.misplaced) {
    const pos = particle.position, vel = particle.velocity;
    if (hDistance && (pos.x < initialPosition.x && vel.x < minVelocity2 || pos.x > initialPosition.x && vel.x > minVelocity2)) {
      vel.x *= -getRandom();
    }
    if (vDistance && (pos.y < initialPosition.y && vel.y < minVelocity2 || pos.y > initialPosition.y && vel.y > minVelocity2)) {
      vel.y *= -getRandom();
    }
  }
}
function move(particle, moveOptions, moveSpeed, maxSpeed, moveDrift, delta) {
  applyPath(particle, delta);
  const gravityOptions = particle.gravity, gravityFactor = (gravityOptions == null ? void 0 : gravityOptions.enable) && gravityOptions.inverse ? -identity : identity;
  if (moveDrift && moveSpeed) {
    particle.velocity.x += moveDrift * delta.factor / (moveSpeedFactor * moveSpeed);
  }
  if ((gravityOptions == null ? void 0 : gravityOptions.enable) && moveSpeed) {
    particle.velocity.y += gravityFactor * (gravityOptions.acceleration * delta.factor) / (moveSpeedFactor * moveSpeed);
  }
  const decay = particle.moveDecay;
  particle.velocity.multTo(decay);
  const velocity = particle.velocity.mult(moveSpeed);
  if ((gravityOptions == null ? void 0 : gravityOptions.enable) && maxSpeed > minVelocity2 && (!gravityOptions.inverse && velocity.y >= minVelocity2 && velocity.y >= maxSpeed || gravityOptions.inverse && velocity.y <= minVelocity2 && velocity.y <= -maxSpeed)) {
    velocity.y = gravityFactor * maxSpeed;
    if (moveSpeed) {
      particle.velocity.y = velocity.y / moveSpeed;
    }
  }
  const zIndexOptions = particle.options.zIndex, zVelocityFactor = (identity - particle.zIndexFactor) ** zIndexOptions.velocityRate;
  velocity.multTo(zVelocityFactor);
  const { position } = particle;
  position.addTo(velocity);
  if (moveOptions.vibrate) {
    position.x += Math.sin(position.x * Math.cos(position.y));
    position.y += Math.cos(position.y * Math.sin(position.x));
  }
}
function spin(particle, moveSpeed) {
  const container = particle.container;
  if (!particle.spin) {
    return;
  }
  const updateFunc = {
    x: particle.spin.direction === RotateDirection.clockwise ? Math.cos : Math.sin,
    y: particle.spin.direction === RotateDirection.clockwise ? Math.sin : Math.cos
  };
  particle.position.x = particle.spin.center.x + particle.spin.radius * updateFunc.x(particle.spin.angle);
  particle.position.y = particle.spin.center.y + particle.spin.radius * updateFunc.y(particle.spin.angle);
  particle.spin.radius += particle.spin.acceleration;
  const maxCanvasSize = Math.max(container.canvas.size.width, container.canvas.size.height), halfMaxSize = maxCanvasSize * half4;
  if (particle.spin.radius > halfMaxSize) {
    particle.spin.radius = halfMaxSize;
    particle.spin.acceleration *= -identity;
  } else if (particle.spin.radius < minSpinRadius) {
    particle.spin.radius = minSpinRadius;
    particle.spin.acceleration *= -identity;
  }
  particle.spin.angle += moveSpeed * spinFactor * (identity - particle.spin.radius / maxCanvasSize);
}
function applyPath(particle, delta) {
  var _a;
  const particlesOptions = particle.options, pathOptions = particlesOptions.move.path, pathEnabled = pathOptions.enable;
  if (!pathEnabled) {
    return;
  }
  if (particle.lastPathTime <= particle.pathDelay) {
    particle.lastPathTime += delta.value;
    return;
  }
  const path = (_a = particle.pathGenerator) == null ? void 0 : _a.generate(particle, delta);
  if (path) {
    particle.velocity.addTo(path);
  }
  if (pathOptions.clamp) {
    particle.velocity.x = clamp(particle.velocity.x, -identity, identity);
    particle.velocity.y = clamp(particle.velocity.y, -identity, identity);
  }
  particle.lastPathTime -= particle.pathDelay;
}
function getProximitySpeedFactor(particle) {
  return particle.slow.inRange ? particle.slow.factor : identity;
}
function initSpin(particle) {
  const container = particle.container, options = particle.options, spinOptions = options.move.spin;
  if (!spinOptions.enable) {
    return;
  }
  const spinPos = spinOptions.position ?? { x: 50, y: 50 }, spinFactor2 = 0.01, spinCenter = {
    x: spinPos.x * spinFactor2 * container.canvas.size.width,
    y: spinPos.y * spinFactor2 * container.canvas.size.height
  }, pos = particle.getPosition(), distance = getDistance(pos, spinCenter), spinAcceleration = getRangeValue(spinOptions.acceleration);
  particle.retina.spinAcceleration = spinAcceleration * container.retina.pixelRatio;
  const minVelocity7 = 0;
  particle.spin = {
    center: spinCenter,
    direction: particle.velocity.x >= minVelocity7 ? RotateDirection.clockwise : RotateDirection.counterClockwise,
    angle: particle.velocity.angle,
    radius: distance,
    acceleration: particle.retina.spinAcceleration
  };
}

// node_modules/@tsparticles/move-base/browser/BaseMover.js
var diffFactor = 2;
var defaultSizeFactor = 1;
var defaultDeltaFactor = 1;
var BaseMover = class {
  init(particle) {
    const options = particle.options, gravityOptions = options.move.gravity;
    particle.gravity = {
      enable: gravityOptions.enable,
      acceleration: getRangeValue(gravityOptions.acceleration),
      inverse: gravityOptions.inverse
    };
    initSpin(particle);
  }
  isEnabled(particle) {
    return !particle.destroyed && particle.options.move.enable;
  }
  move(particle, delta) {
    var _a, _b;
    const particleOptions = particle.options, moveOptions = particleOptions.move;
    if (!moveOptions.enable) {
      return;
    }
    const container = particle.container, pxRatio = container.retina.pixelRatio;
    (_a = particle.retina).moveSpeed ?? (_a.moveSpeed = getRangeValue(moveOptions.speed) * pxRatio);
    (_b = particle.retina).moveDrift ?? (_b.moveDrift = getRangeValue(particle.options.move.drift) * pxRatio);
    const slowFactor = getProximitySpeedFactor(particle), baseSpeed = particle.retina.moveSpeed * container.retina.reduceFactor, moveDrift = particle.retina.moveDrift, maxSize = getRangeMax(particleOptions.size.value) * pxRatio, sizeFactor = moveOptions.size ? particle.getRadius() / maxSize : defaultSizeFactor, deltaFactor = delta.factor || defaultDeltaFactor, moveSpeed = baseSpeed * sizeFactor * slowFactor * deltaFactor / diffFactor, maxSpeed = particle.retina.maxSpeed ?? container.retina.maxSpeed;
    if (moveOptions.spin.enable) {
      spin(particle, moveSpeed);
    } else {
      move(particle, moveOptions, moveSpeed, maxSpeed, moveDrift, delta);
    }
    applyDistance(particle);
  }
};

// node_modules/@tsparticles/move-base/browser/index.js
async function loadBaseMover(engine, refresh = true) {
  await engine.addMover("base", () => {
    return Promise.resolve(new BaseMover());
  }, refresh);
}

// node_modules/@tsparticles/shape-circle/browser/Utils.js
var double5 = 2;
var doublePI3 = Math.PI * double5;
var minAngle2 = 0;
var origin2 = { x: 0, y: 0 };
function drawCircle(data) {
  const { context, particle, radius } = data;
  if (!particle.circleRange) {
    particle.circleRange = { min: minAngle2, max: doublePI3 };
  }
  const circleRange = particle.circleRange;
  context.arc(origin2.x, origin2.y, radius, circleRange.min, circleRange.max, false);
}

// node_modules/@tsparticles/shape-circle/browser/CircleDrawer.js
var sides2 = 12;
var maxAngle3 = 360;
var minAngle3 = 0;
var CircleDrawer = class {
  constructor() {
    this.validTypes = ["circle"];
  }
  draw(data) {
    drawCircle(data);
  }
  getSidesCount() {
    return sides2;
  }
  particleInit(container, particle) {
    const shapeData = particle.shapeData, angle = (shapeData == null ? void 0 : shapeData.angle) ?? {
      max: maxAngle3,
      min: minAngle3
    };
    particle.circleRange = !isObject(angle) ? {
      min: minAngle3,
      max: degToRad(angle)
    } : { min: degToRad(angle.min), max: degToRad(angle.max) };
  }
};

// node_modules/@tsparticles/shape-circle/browser/index.js
async function loadCircleShape(engine, refresh = true) {
  await engine.addShape(new CircleDrawer(), refresh);
}

// node_modules/@tsparticles/updater-color/browser/ColorUpdater.js
var ColorUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    const hslColor = rangeColorToHsl(particle.options.color, particle.id, particle.options.reduceDuplicates);
    if (hslColor) {
      particle.color = getHslAnimationFromHsl(hslColor, particle.options.color.animation, this.container.retina.reduceFactor);
    }
  }
  isEnabled(particle) {
    const { h: hAnimation, s: sAnimation, l: lAnimation } = particle.options.color.animation, { color } = particle;
    return !particle.destroyed && !particle.spawning && ((color == null ? void 0 : color.h.value) !== void 0 && hAnimation.enable || (color == null ? void 0 : color.s.value) !== void 0 && sAnimation.enable || (color == null ? void 0 : color.l.value) !== void 0 && lAnimation.enable);
  }
  update(particle, delta) {
    updateColor(particle.color, delta);
  }
};

// node_modules/@tsparticles/updater-color/browser/index.js
async function loadColorUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("color", (container) => {
    return Promise.resolve(new ColorUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/updater-opacity/browser/OpacityUpdater.js
var OpacityUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    const opacityOptions = particle.options.opacity, pxRatio = 1;
    particle.opacity = initParticleNumericAnimationValue(opacityOptions, pxRatio);
    const opacityAnimation = opacityOptions.animation;
    if (opacityAnimation.enable) {
      particle.opacity.velocity = getRangeValue(opacityAnimation.speed) / percentDenominator * this.container.retina.reduceFactor;
      if (!opacityAnimation.sync) {
        particle.opacity.velocity *= getRandom();
      }
    }
  }
  isEnabled(particle) {
    const none = 0;
    return !particle.destroyed && !particle.spawning && !!particle.opacity && particle.opacity.enable && ((particle.opacity.maxLoops ?? none) <= none || (particle.opacity.maxLoops ?? none) > none && (particle.opacity.loops ?? none) < (particle.opacity.maxLoops ?? none));
  }
  reset(particle) {
    if (particle.opacity) {
      particle.opacity.time = 0;
      particle.opacity.loops = 0;
    }
  }
  update(particle, delta) {
    if (!this.isEnabled(particle) || !particle.opacity) {
      return;
    }
    updateAnimation(particle, particle.opacity, true, particle.options.opacity.animation.destroy, delta);
  }
};

// node_modules/@tsparticles/updater-opacity/browser/index.js
async function loadOpacityUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("opacity", (container) => {
    return Promise.resolve(new OpacityUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/updater-out-modes/browser/Utils.js
var minVelocity3 = 0;
var boundsMin = 0;
function bounceHorizontal(data) {
  if (data.outMode !== OutMode.bounce && data.outMode !== OutMode.split || data.direction !== OutModeDirection.left && data.direction !== OutModeDirection.right) {
    return;
  }
  if (data.bounds.right < boundsMin && data.direction === OutModeDirection.left) {
    data.particle.position.x = data.size + data.offset.x;
  } else if (data.bounds.left > data.canvasSize.width && data.direction === OutModeDirection.right) {
    data.particle.position.x = data.canvasSize.width - data.size - data.offset.x;
  }
  const velocity = data.particle.velocity.x;
  let bounced = false;
  if (data.direction === OutModeDirection.right && data.bounds.right >= data.canvasSize.width && velocity > minVelocity3 || data.direction === OutModeDirection.left && data.bounds.left <= boundsMin && velocity < minVelocity3) {
    const newVelocity = getRangeValue(data.particle.options.bounce.horizontal.value);
    data.particle.velocity.x *= -newVelocity;
    bounced = true;
  }
  if (!bounced) {
    return;
  }
  const minPos = data.offset.x + data.size;
  if (data.bounds.right >= data.canvasSize.width && data.direction === OutModeDirection.right) {
    data.particle.position.x = data.canvasSize.width - minPos;
  } else if (data.bounds.left <= boundsMin && data.direction === OutModeDirection.left) {
    data.particle.position.x = minPos;
  }
  if (data.outMode === OutMode.split) {
    data.particle.destroy();
  }
}
function bounceVertical(data) {
  if (data.outMode !== OutMode.bounce && data.outMode !== OutMode.split || data.direction !== OutModeDirection.bottom && data.direction !== OutModeDirection.top) {
    return;
  }
  if (data.bounds.bottom < boundsMin && data.direction === OutModeDirection.top) {
    data.particle.position.y = data.size + data.offset.y;
  } else if (data.bounds.top > data.canvasSize.height && data.direction === OutModeDirection.bottom) {
    data.particle.position.y = data.canvasSize.height - data.size - data.offset.y;
  }
  const velocity = data.particle.velocity.y;
  let bounced = false;
  if (data.direction === OutModeDirection.bottom && data.bounds.bottom >= data.canvasSize.height && velocity > minVelocity3 || data.direction === OutModeDirection.top && data.bounds.top <= boundsMin && velocity < minVelocity3) {
    const newVelocity = getRangeValue(data.particle.options.bounce.vertical.value);
    data.particle.velocity.y *= -newVelocity;
    bounced = true;
  }
  if (!bounced) {
    return;
  }
  const minPos = data.offset.y + data.size;
  if (data.bounds.bottom >= data.canvasSize.height && data.direction === OutModeDirection.bottom) {
    data.particle.position.y = data.canvasSize.height - minPos;
  } else if (data.bounds.top <= boundsMin && data.direction === OutModeDirection.top) {
    data.particle.position.y = minPos;
  }
  if (data.outMode === OutMode.split) {
    data.particle.destroy();
  }
}

// node_modules/@tsparticles/updater-out-modes/browser/BounceOutMode.js
var BounceOutMode = class {
  constructor(container) {
    this.container = container;
    this.modes = [
      OutMode.bounce,
      OutMode.split
    ];
  }
  update(particle, direction, delta, outMode) {
    if (!this.modes.includes(outMode)) {
      return;
    }
    const container = this.container;
    let handled = false;
    for (const [, plugin] of container.plugins) {
      if (plugin.particleBounce !== void 0) {
        handled = plugin.particleBounce(particle, delta, direction);
      }
      if (handled) {
        break;
      }
    }
    if (handled) {
      return;
    }
    const pos = particle.getPosition(), offset = particle.offset, size = particle.getRadius(), bounds = calculateBounds(pos, size), canvasSize = container.canvas.size;
    bounceHorizontal({ particle, outMode, direction, bounds, canvasSize, offset, size });
    bounceVertical({ particle, outMode, direction, bounds, canvasSize, offset, size });
  }
};

// node_modules/@tsparticles/updater-out-modes/browser/DestroyOutMode.js
var minVelocity4 = 0;
var DestroyOutMode = class {
  constructor(container) {
    this.container = container;
    this.modes = [OutMode.destroy];
  }
  update(particle, direction, _delta, outMode) {
    if (!this.modes.includes(outMode)) {
      return;
    }
    const container = this.container;
    switch (particle.outType) {
      case ParticleOutType.normal:
      case ParticleOutType.outside:
        if (isPointInside(particle.position, container.canvas.size, Vector.origin, particle.getRadius(), direction)) {
          return;
        }
        break;
      case ParticleOutType.inside: {
        const { dx, dy } = getDistances(particle.position, particle.moveCenter), { x: vx, y: vy } = particle.velocity;
        if (vx < minVelocity4 && dx > particle.moveCenter.radius || vy < minVelocity4 && dy > particle.moveCenter.radius || vx >= minVelocity4 && dx < -particle.moveCenter.radius || vy >= minVelocity4 && dy < -particle.moveCenter.radius) {
          return;
        }
        break;
      }
    }
    container.particles.remove(particle, void 0, true);
  }
};

// node_modules/@tsparticles/updater-out-modes/browser/NoneOutMode.js
var minVelocity5 = 0;
var NoneOutMode = class {
  constructor(container) {
    this.container = container;
    this.modes = [OutMode.none];
  }
  update(particle, direction, delta, outMode) {
    if (!this.modes.includes(outMode)) {
      return;
    }
    if ((particle.options.move.distance.horizontal && (direction === OutModeDirection.left || direction === OutModeDirection.right)) ?? (particle.options.move.distance.vertical && (direction === OutModeDirection.top || direction === OutModeDirection.bottom))) {
      return;
    }
    const gravityOptions = particle.options.move.gravity, container = this.container, canvasSize = container.canvas.size, pRadius = particle.getRadius();
    if (!gravityOptions.enable) {
      if (particle.velocity.y > minVelocity5 && particle.position.y <= canvasSize.height + pRadius || particle.velocity.y < minVelocity5 && particle.position.y >= -pRadius || particle.velocity.x > minVelocity5 && particle.position.x <= canvasSize.width + pRadius || particle.velocity.x < minVelocity5 && particle.position.x >= -pRadius) {
        return;
      }
      if (!isPointInside(particle.position, container.canvas.size, Vector.origin, pRadius, direction)) {
        container.particles.remove(particle);
      }
    } else {
      const position = particle.position;
      if (!gravityOptions.inverse && position.y > canvasSize.height + pRadius && direction === OutModeDirection.bottom || gravityOptions.inverse && position.y < -pRadius && direction === OutModeDirection.top) {
        container.particles.remove(particle);
      }
    }
  }
};

// node_modules/@tsparticles/updater-out-modes/browser/OutOutMode.js
var minVelocity6 = 0;
var minDistance = 0;
var OutOutMode = class {
  constructor(container) {
    this.container = container;
    this.modes = [OutMode.out];
  }
  update(particle, direction, delta, outMode) {
    if (!this.modes.includes(outMode)) {
      return;
    }
    const container = this.container;
    switch (particle.outType) {
      case ParticleOutType.inside: {
        const { x: vx, y: vy } = particle.velocity;
        const circVec = Vector.origin;
        circVec.length = particle.moveCenter.radius;
        circVec.angle = particle.velocity.angle + Math.PI;
        circVec.addTo(Vector.create(particle.moveCenter));
        const { dx, dy } = getDistances(particle.position, circVec);
        if (vx <= minVelocity6 && dx >= minDistance || vy <= minVelocity6 && dy >= minDistance || vx >= minVelocity6 && dx <= minDistance || vy >= minVelocity6 && dy <= minDistance) {
          return;
        }
        particle.position.x = Math.floor(randomInRange({
          min: 0,
          max: container.canvas.size.width
        }));
        particle.position.y = Math.floor(randomInRange({
          min: 0,
          max: container.canvas.size.height
        }));
        const { dx: newDx, dy: newDy } = getDistances(particle.position, particle.moveCenter);
        particle.direction = Math.atan2(-newDy, -newDx);
        particle.velocity.angle = particle.direction;
        break;
      }
      default: {
        if (isPointInside(particle.position, container.canvas.size, Vector.origin, particle.getRadius(), direction)) {
          return;
        }
        switch (particle.outType) {
          case ParticleOutType.outside: {
            particle.position.x = Math.floor(randomInRange({
              min: -particle.moveCenter.radius,
              max: particle.moveCenter.radius
            })) + particle.moveCenter.x;
            particle.position.y = Math.floor(randomInRange({
              min: -particle.moveCenter.radius,
              max: particle.moveCenter.radius
            })) + particle.moveCenter.y;
            const { dx, dy } = getDistances(particle.position, particle.moveCenter);
            if (particle.moveCenter.radius) {
              particle.direction = Math.atan2(dy, dx);
              particle.velocity.angle = particle.direction;
            }
            break;
          }
          case ParticleOutType.normal: {
            const warp = particle.options.move.warp, canvasSize = container.canvas.size, newPos = {
              bottom: canvasSize.height + particle.getRadius() + particle.offset.y,
              left: -particle.getRadius() - particle.offset.x,
              right: canvasSize.width + particle.getRadius() + particle.offset.x,
              top: -particle.getRadius() - particle.offset.y
            }, sizeValue = particle.getRadius(), nextBounds = calculateBounds(particle.position, sizeValue);
            if (direction === OutModeDirection.right && nextBounds.left > canvasSize.width + particle.offset.x) {
              particle.position.x = newPos.left;
              particle.initialPosition.x = particle.position.x;
              if (!warp) {
                particle.position.y = getRandom() * canvasSize.height;
                particle.initialPosition.y = particle.position.y;
              }
            } else if (direction === OutModeDirection.left && nextBounds.right < -particle.offset.x) {
              particle.position.x = newPos.right;
              particle.initialPosition.x = particle.position.x;
              if (!warp) {
                particle.position.y = getRandom() * canvasSize.height;
                particle.initialPosition.y = particle.position.y;
              }
            }
            if (direction === OutModeDirection.bottom && nextBounds.top > canvasSize.height + particle.offset.y) {
              if (!warp) {
                particle.position.x = getRandom() * canvasSize.width;
                particle.initialPosition.x = particle.position.x;
              }
              particle.position.y = newPos.top;
              particle.initialPosition.y = particle.position.y;
            } else if (direction === OutModeDirection.top && nextBounds.bottom < -particle.offset.y) {
              if (!warp) {
                particle.position.x = getRandom() * canvasSize.width;
                particle.initialPosition.x = particle.position.x;
              }
              particle.position.y = newPos.bottom;
              particle.initialPosition.y = particle.position.y;
            }
            break;
          }
        }
        break;
      }
    }
  }
};

// node_modules/@tsparticles/updater-out-modes/browser/OutOfCanvasUpdater.js
var checkOutMode = (outModes, outMode) => {
  return outModes.default === outMode || outModes.bottom === outMode || outModes.left === outMode || outModes.right === outMode || outModes.top === outMode;
};
var OutOfCanvasUpdater = class {
  constructor(container) {
    this._updateOutMode = (particle, delta, outMode, direction) => {
      for (const updater of this.updaters) {
        updater.update(particle, direction, delta, outMode);
      }
    };
    this.container = container;
    this.updaters = [];
  }
  init(particle) {
    this.updaters = [];
    const outModes = particle.options.move.outModes;
    if (checkOutMode(outModes, OutMode.bounce)) {
      this.updaters.push(new BounceOutMode(this.container));
    } else if (checkOutMode(outModes, OutMode.out)) {
      this.updaters.push(new OutOutMode(this.container));
    } else if (checkOutMode(outModes, OutMode.destroy)) {
      this.updaters.push(new DestroyOutMode(this.container));
    } else if (checkOutMode(outModes, OutMode.none)) {
      this.updaters.push(new NoneOutMode(this.container));
    }
  }
  isEnabled(particle) {
    return !particle.destroyed && !particle.spawning;
  }
  update(particle, delta) {
    const outModes = particle.options.move.outModes;
    this._updateOutMode(particle, delta, outModes.bottom ?? outModes.default, OutModeDirection.bottom);
    this._updateOutMode(particle, delta, outModes.left ?? outModes.default, OutModeDirection.left);
    this._updateOutMode(particle, delta, outModes.right ?? outModes.default, OutModeDirection.right);
    this._updateOutMode(particle, delta, outModes.top ?? outModes.default, OutModeDirection.top);
  }
};

// node_modules/@tsparticles/updater-out-modes/browser/index.js
async function loadOutModesUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("outModes", (container) => {
    return Promise.resolve(new OutOfCanvasUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/updater-size/browser/SizeUpdater.js
var minLoops = 0;
var SizeUpdater = class {
  init(particle) {
    const container = particle.container, sizeOptions = particle.options.size, sizeAnimation = sizeOptions.animation;
    if (sizeAnimation.enable) {
      particle.size.velocity = (particle.retina.sizeAnimationSpeed ?? container.retina.sizeAnimationSpeed) / percentDenominator * container.retina.reduceFactor;
      if (!sizeAnimation.sync) {
        particle.size.velocity *= getRandom();
      }
    }
  }
  isEnabled(particle) {
    return !particle.destroyed && !particle.spawning && particle.size.enable && ((particle.size.maxLoops ?? minLoops) <= minLoops || (particle.size.maxLoops ?? minLoops) > minLoops && (particle.size.loops ?? minLoops) < (particle.size.maxLoops ?? minLoops));
  }
  reset(particle) {
    particle.size.loops = minLoops;
  }
  update(particle, delta) {
    if (!this.isEnabled(particle)) {
      return;
    }
    updateAnimation(particle, particle.size, true, particle.options.size.animation.destroy, delta);
  }
};

// node_modules/@tsparticles/updater-size/browser/index.js
async function loadSizeUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("size", () => {
    return Promise.resolve(new SizeUpdater());
  }, refresh);
}

// node_modules/@tsparticles/basic/browser/index.js
async function loadBasic(engine, refresh = true) {
  await loadBaseMover(engine, false);
  await loadCircleShape(engine, false);
  await loadColorUpdater(engine, false);
  await loadOpacityUpdater(engine, false);
  await loadOutModesUpdater(engine, false);
  await loadSizeUpdater(engine, false);
  await engine.refresh(refresh);
}

// node_modules/@tsparticles/plugin-easing-quad/browser/index.js
async function loadEasingQuadPlugin() {
  addEasing(EasingType.easeInQuad, (value) => value ** 2);
  addEasing(EasingType.easeOutQuad, (value) => 1 - (1 - value) ** 2);
  addEasing(EasingType.easeInOutQuad, (value) => value < 0.5 ? 2 * value ** 2 : 1 - (-2 * value + 2) ** 2 / 2);
  await Promise.resolve();
}

// node_modules/@tsparticles/shape-emoji/browser/Utils.js
function drawEmoji(data) {
  const { context, particle, radius, opacity } = data, emojiData = particle.emojiData, double18 = 2, diameter = radius * double18, previousAlpha = context.globalAlpha;
  if (!emojiData) {
    return;
  }
  context.globalAlpha = opacity;
  context.drawImage(emojiData, -radius, -radius, diameter, diameter);
  context.globalAlpha = previousAlpha;
}

// node_modules/@tsparticles/shape-emoji/browser/EmojiDrawer.js
var defaultFont = '"Twemoji Mozilla", Apple Color Emoji, "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne Color"';
var EmojiDrawer = class {
  constructor() {
    this.validTypes = ["emoji"];
    this._emojiShapeDict = /* @__PURE__ */ new Map();
  }
  destroy() {
    for (const [key, emojiData] of this._emojiShapeDict) {
      if (emojiData instanceof ImageBitmap) {
        emojiData == null ? void 0 : emojiData.close();
        this._emojiShapeDict.delete(key);
      }
    }
  }
  draw(data) {
    drawEmoji(data);
  }
  async init(container) {
    const options = container.actualOptions, { validTypes } = this;
    if (!validTypes.find((t) => isInArray(t, options.particles.shape.type))) {
      return;
    }
    const promises = [loadFont(defaultFont)], shapeOptions = validTypes.map((t) => options.particles.shape.options[t]).find((t) => !!t);
    if (shapeOptions) {
      executeOnSingleOrMultiple(shapeOptions, (shape) => {
        if (shape.font) {
          promises.push(loadFont(shape.font));
        }
      });
    }
    await Promise.all(promises);
  }
  particleDestroy(particle) {
    delete particle.emojiData;
  }
  particleInit(container, particle) {
    const double18 = 2, shapeData = particle.shapeData;
    if (!(shapeData == null ? void 0 : shapeData.value)) {
      return;
    }
    const emoji = itemFromSingleOrMultiple(shapeData.value, particle.randomIndexData), font = shapeData.font ?? defaultFont;
    if (!emoji) {
      return;
    }
    const key = `${emoji}_${font}`, existingData = this._emojiShapeDict.get(key);
    if (existingData) {
      particle.emojiData = existingData;
      return;
    }
    const canvasSize = getRangeMax(particle.size.value) * double18;
    let emojiData;
    const maxSize = getRangeMax(particle.size.value);
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(canvasSize, canvasSize), context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.font = `400 ${maxSize * double18}px ${font}`;
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(emoji, maxSize, maxSize);
      emojiData = canvas.transferToImageBitmap();
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }
      context.font = `400 ${maxSize * double18}px ${font}`;
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(emoji, maxSize, maxSize);
      emojiData = canvas;
    }
    this._emojiShapeDict.set(key, emojiData);
    particle.emojiData = emojiData;
  }
};

// node_modules/@tsparticles/shape-emoji/browser/index.js
async function loadEmojiShape(engine, refresh = true) {
  await engine.addShape(new EmojiDrawer(), refresh);
}

// node_modules/@tsparticles/interaction-external-attract/browser/Utils.js
var minFactor = 1;
var identity2 = 1;
var minRadius2 = 0;
function processAttract(container, position, attractRadius, area, queryCb) {
  const attractOptions = container.actualOptions.interactivity.modes.attract;
  if (!attractOptions) {
    return;
  }
  const query = container.particles.quadTree.query(area, queryCb);
  for (const particle of query) {
    const { dx, dy, distance } = getDistances(particle.position, position), velocity = attractOptions.speed * attractOptions.factor, attractFactor2 = clamp(getEasing(attractOptions.easing)(identity2 - distance / attractRadius) * velocity, minFactor, attractOptions.maxSpeed), normVec = Vector.create(!distance ? velocity : dx / distance * attractFactor2, !distance ? velocity : dy / distance * attractFactor2);
    particle.position.subFrom(normVec);
  }
}
function clickAttract(container, enabledCb) {
  if (!container.attract) {
    container.attract = { particles: [] };
  }
  const { attract } = container;
  if (!attract.finish) {
    if (!attract.count) {
      attract.count = 0;
    }
    attract.count++;
    if (attract.count === container.particles.count) {
      attract.finish = true;
    }
  }
  if (attract.clicking) {
    const mousePos = container.interactivity.mouse.clickPosition, attractRadius = container.retina.attractModeDistance;
    if (!attractRadius || attractRadius < minRadius2 || !mousePos) {
      return;
    }
    processAttract(container, mousePos, attractRadius, new Circle(mousePos.x, mousePos.y, attractRadius), (p) => enabledCb(p));
  } else if (attract.clicking === false) {
    attract.particles = [];
  }
}
function hoverAttract(container, enabledCb) {
  const mousePos = container.interactivity.mouse.position, attractRadius = container.retina.attractModeDistance;
  if (!attractRadius || attractRadius < minRadius2 || !mousePos) {
    return;
  }
  processAttract(container, mousePos, attractRadius, new Circle(mousePos.x, mousePos.y, attractRadius), (p) => enabledCb(p));
}

// node_modules/@tsparticles/interaction-external-attract/browser/Options/Classes/Attract.js
var Attract = class {
  constructor() {
    this.distance = 200;
    this.duration = 0.4;
    this.easing = EasingType.easeOutQuad;
    this.factor = 1;
    this.maxSpeed = 50;
    this.speed = 1;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    if (data.duration !== void 0) {
      this.duration = data.duration;
    }
    if (data.easing !== void 0) {
      this.easing = data.easing;
    }
    if (data.factor !== void 0) {
      this.factor = data.factor;
    }
    if (data.maxSpeed !== void 0) {
      this.maxSpeed = data.maxSpeed;
    }
    if (data.speed !== void 0) {
      this.speed = data.speed;
    }
  }
};

// node_modules/@tsparticles/interaction-external-attract/browser/Attractor.js
var attractMode = "attract";
var Attractor = class extends ExternalInteractorBase {
  constructor(engine, container) {
    super(container);
    this._engine = engine;
    if (!container.attract) {
      container.attract = { particles: [] };
    }
    this.handleClickMode = (mode) => {
      const options = this.container.actualOptions, attract = options.interactivity.modes.attract;
      if (!attract || mode !== attractMode) {
        return;
      }
      if (!container.attract) {
        container.attract = { particles: [] };
      }
      container.attract.clicking = true;
      container.attract.count = 0;
      for (const particle of container.attract.particles) {
        if (!this.isEnabled(particle)) {
          continue;
        }
        particle.velocity.setTo(particle.initialVelocity);
      }
      container.attract.particles = [];
      container.attract.finish = false;
      setTimeout(() => {
        if (container.destroyed) {
          return;
        }
        if (!container.attract) {
          container.attract = { particles: [] };
        }
        container.attract.clicking = false;
      }, attract.duration * millisecondsToSeconds);
    };
  }
  clear() {
  }
  init() {
    const container = this.container, attract = container.actualOptions.interactivity.modes.attract;
    if (!attract) {
      return;
    }
    container.retina.attractModeDistance = attract.distance * container.retina.pixelRatio;
  }
  interact() {
    const container = this.container, options = container.actualOptions, mouseMoveStatus = container.interactivity.status === mouseMoveEvent, events = options.interactivity.events, { enable: hoverEnabled, mode: hoverMode } = events.onHover, { enable: clickEnabled, mode: clickMode } = events.onClick;
    if (mouseMoveStatus && hoverEnabled && isInArray(attractMode, hoverMode)) {
      hoverAttract(this.container, (p) => this.isEnabled(p));
    } else if (clickEnabled && isInArray(attractMode, clickMode)) {
      clickAttract(this.container, (p) => this.isEnabled(p));
    }
  }
  isEnabled(particle) {
    const container = this.container, options = container.actualOptions, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? options.interactivity).events;
    if ((!mouse.position || !events.onHover.enable) && (!mouse.clickPosition || !events.onClick.enable)) {
      return false;
    }
    const hoverMode = events.onHover.mode, clickMode = events.onClick.mode;
    return isInArray(attractMode, hoverMode) || isInArray(attractMode, clickMode);
  }
  loadModeOptions(options, ...sources) {
    if (!options.attract) {
      options.attract = new Attract();
    }
    for (const source of sources) {
      options.attract.load(source == null ? void 0 : source.attract);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-attract/browser/index.js
async function loadExternalAttractInteraction(engine, refresh = true) {
  await engine.addInteractor("externalAttract", (container) => {
    return Promise.resolve(new Attractor(engine, container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-bounce/browser/Utils.js
var squareExp3 = 2;
var half5 = 0.5;
var halfPI = Math.PI * half5;
var double6 = 2;
var toleranceFactor = 10;
var minRadius3 = 0;
function processBounce(container, position, radius, area, enabledCb) {
  const query = container.particles.quadTree.query(area, enabledCb);
  for (const particle of query) {
    if (area instanceof Circle) {
      circleBounce(circleBounceDataFromParticle(particle), {
        position,
        radius,
        mass: radius ** squareExp3 * halfPI,
        velocity: Vector.origin,
        factor: Vector.origin
      });
    } else if (area instanceof Rectangle) {
      rectBounce(particle, calculateBounds(position, radius));
    }
  }
}
function singleSelectorBounce(container, selector, div, bounceCb) {
  const query = document.querySelectorAll(selector);
  if (!query.length) {
    return;
  }
  query.forEach((item) => {
    const elem = item, pxRatio = container.retina.pixelRatio, pos = {
      x: (elem.offsetLeft + elem.offsetWidth * half5) * pxRatio,
      y: (elem.offsetTop + elem.offsetHeight * half5) * pxRatio
    }, radius = elem.offsetWidth * half5 * pxRatio, tolerance = toleranceFactor * pxRatio, area = div.type === DivType.circle ? new Circle(pos.x, pos.y, radius + tolerance) : new Rectangle(elem.offsetLeft * pxRatio - tolerance, elem.offsetTop * pxRatio - tolerance, elem.offsetWidth * pxRatio + tolerance * double6, elem.offsetHeight * pxRatio + tolerance * double6);
    bounceCb(pos, radius, area);
  });
}
function divBounce(container, divs, bounceMode2, enabledCb) {
  divModeExecute(bounceMode2, divs, (selector, div) => singleSelectorBounce(container, selector, div, (pos, radius, area) => processBounce(container, pos, radius, area, enabledCb)));
}
function mouseBounce(container, enabledCb) {
  const pxRatio = container.retina.pixelRatio, tolerance = toleranceFactor * pxRatio, mousePos = container.interactivity.mouse.position, radius = container.retina.bounceModeDistance;
  if (!radius || radius < minRadius3 || !mousePos) {
    return;
  }
  processBounce(container, mousePos, radius, new Circle(mousePos.x, mousePos.y, radius + tolerance), enabledCb);
}

// node_modules/@tsparticles/interaction-external-bounce/browser/Options/Classes/Bounce.js
var Bounce = class {
  constructor() {
    this.distance = 200;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
  }
};

// node_modules/@tsparticles/interaction-external-bounce/browser/Bouncer.js
var bounceMode = "bounce";
var Bouncer = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
  }
  clear() {
  }
  init() {
    const container = this.container, bounce2 = container.actualOptions.interactivity.modes.bounce;
    if (!bounce2) {
      return;
    }
    container.retina.bounceModeDistance = bounce2.distance * container.retina.pixelRatio;
  }
  interact() {
    const container = this.container, options = container.actualOptions, events = options.interactivity.events, mouseMoveStatus = container.interactivity.status === mouseMoveEvent, hoverEnabled = events.onHover.enable, hoverMode = events.onHover.mode, divs = events.onDiv;
    if (mouseMoveStatus && hoverEnabled && isInArray(bounceMode, hoverMode)) {
      mouseBounce(this.container, (p) => this.isEnabled(p));
    } else {
      divBounce(this.container, divs, bounceMode, (p) => this.isEnabled(p));
    }
  }
  isEnabled(particle) {
    const container = this.container, options = container.actualOptions, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? options.interactivity).events, divs = events.onDiv;
    return !!mouse.position && events.onHover.enable && isInArray(bounceMode, events.onHover.mode) || isDivModeEnabled(bounceMode, divs);
  }
  loadModeOptions(options, ...sources) {
    if (!options.bounce) {
      options.bounce = new Bounce();
    }
    for (const source of sources) {
      options.bounce.load(source == null ? void 0 : source.bounce);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-bounce/browser/index.js
async function loadExternalBounceInteraction(engine, refresh = true) {
  await engine.addInteractor("externalBounce", (container) => {
    return Promise.resolve(new Bouncer(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-bubble/browser/Options/Classes/BubbleBase.js
var BubbleBase = class {
  constructor() {
    this.distance = 200;
    this.duration = 0.4;
    this.mix = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    if (data.duration !== void 0) {
      this.duration = data.duration;
    }
    if (data.mix !== void 0) {
      this.mix = data.mix;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
    if (data.color !== void 0) {
      const sourceColor = isArray(this.color) ? void 0 : this.color;
      this.color = executeOnSingleOrMultiple(data.color, (color) => {
        return OptionsColor.create(sourceColor, color);
      });
    }
    if (data.size !== void 0) {
      this.size = data.size;
    }
  }
};

// node_modules/@tsparticles/interaction-external-bubble/browser/Options/Classes/BubbleDiv.js
var BubbleDiv = class extends BubbleBase {
  constructor() {
    super();
    this.selectors = [];
  }
  load(data) {
    super.load(data);
    if (!data) {
      return;
    }
    if (data.selectors !== void 0) {
      this.selectors = data.selectors;
    }
  }
};

// node_modules/@tsparticles/interaction-external-bubble/browser/Options/Classes/Bubble.js
var Bubble = class extends BubbleBase {
  load(data) {
    super.load(data);
    if (!data) {
      return;
    }
    this.divs = executeOnSingleOrMultiple(data.divs, (div) => {
      const tmp = new BubbleDiv();
      tmp.load(div);
      return tmp;
    });
  }
};

// node_modules/@tsparticles/interaction-external-bubble/browser/Enums.js
var ProcessBubbleType;
(function(ProcessBubbleType2) {
  ProcessBubbleType2["color"] = "color";
  ProcessBubbleType2["opacity"] = "opacity";
  ProcessBubbleType2["size"] = "size";
})(ProcessBubbleType || (ProcessBubbleType = {}));

// node_modules/@tsparticles/interaction-external-bubble/browser/Utils.js
function calculateBubbleValue(particleValue, modeValue, optionsValue, ratio) {
  if (modeValue >= optionsValue) {
    const value = particleValue + (modeValue - optionsValue) * ratio;
    return clamp(value, particleValue, modeValue);
  } else if (modeValue < optionsValue) {
    const value = particleValue - (optionsValue - modeValue) * ratio;
    return clamp(value, modeValue, particleValue);
  }
}

// node_modules/@tsparticles/interaction-external-bubble/browser/Bubbler.js
var bubbleMode = "bubble";
var minDistance2 = 0;
var defaultClickTime = 0;
var double7 = 2;
var defaultOpacity = 1;
var ratioOffset = 1;
var defaultBubbleValue = 0;
var minRatio = 0;
var half6 = 0.5;
var defaultRatio = 1;
var Bubbler = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
    this._clickBubble = () => {
      var _a;
      const container2 = this.container, options = container2.actualOptions, mouseClickPos = container2.interactivity.mouse.clickPosition, bubbleOptions = options.interactivity.modes.bubble;
      if (!bubbleOptions || !mouseClickPos) {
        return;
      }
      if (!container2.bubble) {
        container2.bubble = {};
      }
      const distance = container2.retina.bubbleModeDistance;
      if (!distance || distance < minDistance2) {
        return;
      }
      const query = container2.particles.quadTree.queryCircle(mouseClickPos, distance, (p) => this.isEnabled(p)), { bubble } = container2;
      for (const particle of query) {
        if (!bubble.clicking) {
          continue;
        }
        particle.bubble.inRange = !bubble.durationEnd;
        const pos = particle.getPosition(), distMouse = getDistance(pos, mouseClickPos), timeSpent = ((/* @__PURE__ */ new Date()).getTime() - (container2.interactivity.mouse.clickTime ?? defaultClickTime)) / millisecondsToSeconds;
        if (timeSpent > bubbleOptions.duration) {
          bubble.durationEnd = true;
        }
        if (timeSpent > bubbleOptions.duration * double7) {
          bubble.clicking = false;
          bubble.durationEnd = false;
        }
        const sizeData = {
          bubbleObj: {
            optValue: container2.retina.bubbleModeSize,
            value: particle.bubble.radius
          },
          particlesObj: {
            optValue: getRangeMax(particle.options.size.value) * container2.retina.pixelRatio,
            value: particle.size.value
          },
          type: ProcessBubbleType.size
        };
        this._process(particle, distMouse, timeSpent, sizeData);
        const opacityData = {
          bubbleObj: {
            optValue: bubbleOptions.opacity,
            value: particle.bubble.opacity
          },
          particlesObj: {
            optValue: getRangeMax(particle.options.opacity.value),
            value: ((_a = particle.opacity) == null ? void 0 : _a.value) ?? defaultOpacity
          },
          type: ProcessBubbleType.opacity
        };
        this._process(particle, distMouse, timeSpent, opacityData);
        if (!bubble.durationEnd && distMouse <= distance) {
          this._hoverBubbleColor(particle, distMouse);
        } else {
          delete particle.bubble.color;
        }
      }
    };
    this._hoverBubble = () => {
      const container2 = this.container, mousePos = container2.interactivity.mouse.position, distance = container2.retina.bubbleModeDistance;
      if (!distance || distance < minDistance2 || !mousePos) {
        return;
      }
      const query = container2.particles.quadTree.queryCircle(mousePos, distance, (p) => this.isEnabled(p));
      for (const particle of query) {
        particle.bubble.inRange = true;
        const pos = particle.getPosition(), pointDistance = getDistance(pos, mousePos), ratio = ratioOffset - pointDistance / distance;
        if (pointDistance <= distance) {
          if (ratio >= minRatio && container2.interactivity.status === mouseMoveEvent) {
            this._hoverBubbleSize(particle, ratio);
            this._hoverBubbleOpacity(particle, ratio);
            this._hoverBubbleColor(particle, ratio);
          }
        } else {
          this.reset(particle);
        }
        if (container2.interactivity.status === mouseLeaveEvent) {
          this.reset(particle);
        }
      }
    };
    this._hoverBubbleColor = (particle, ratio, divBubble) => {
      const options = this.container.actualOptions, bubbleOptions = divBubble ?? options.interactivity.modes.bubble;
      if (!bubbleOptions) {
        return;
      }
      if (!particle.bubble.finalColor) {
        const modeColor = bubbleOptions.color;
        if (!modeColor) {
          return;
        }
        const bubbleColor = itemFromSingleOrMultiple(modeColor);
        particle.bubble.finalColor = rangeColorToHsl(bubbleColor);
      }
      if (!particle.bubble.finalColor) {
        return;
      }
      if (bubbleOptions.mix) {
        particle.bubble.color = void 0;
        const pColor = particle.getFillColor();
        particle.bubble.color = pColor ? rgbToHsl(colorMix(pColor, particle.bubble.finalColor, ratioOffset - ratio, ratio)) : particle.bubble.finalColor;
      } else {
        particle.bubble.color = particle.bubble.finalColor;
      }
    };
    this._hoverBubbleOpacity = (particle, ratio, divBubble) => {
      var _a, _b;
      const container2 = this.container, options = container2.actualOptions, modeOpacity = (divBubble == null ? void 0 : divBubble.opacity) ?? ((_a = options.interactivity.modes.bubble) == null ? void 0 : _a.opacity);
      if (!modeOpacity) {
        return;
      }
      const optOpacity = particle.options.opacity.value, pOpacity = ((_b = particle.opacity) == null ? void 0 : _b.value) ?? defaultOpacity, opacity = calculateBubbleValue(pOpacity, modeOpacity, getRangeMax(optOpacity), ratio);
      if (opacity !== void 0) {
        particle.bubble.opacity = opacity;
      }
    };
    this._hoverBubbleSize = (particle, ratio, divBubble) => {
      const container2 = this.container, modeSize = (divBubble == null ? void 0 : divBubble.size) ? divBubble.size * container2.retina.pixelRatio : container2.retina.bubbleModeSize;
      if (modeSize === void 0) {
        return;
      }
      const optSize = getRangeMax(particle.options.size.value) * container2.retina.pixelRatio, pSize = particle.size.value, size = calculateBubbleValue(pSize, modeSize, optSize, ratio);
      if (size !== void 0) {
        particle.bubble.radius = size;
      }
    };
    this._process = (particle, distMouse, timeSpent, data) => {
      const container2 = this.container, bubbleParam = data.bubbleObj.optValue, options = container2.actualOptions, bubbleOptions = options.interactivity.modes.bubble;
      if (!bubbleOptions || bubbleParam === void 0) {
        return;
      }
      const bubbleDuration = bubbleOptions.duration, bubbleDistance = container2.retina.bubbleModeDistance, particlesParam = data.particlesObj.optValue, pObjBubble = data.bubbleObj.value, pObj = data.particlesObj.value ?? defaultBubbleValue, type = data.type;
      if (!bubbleDistance || bubbleDistance < minDistance2 || bubbleParam === particlesParam) {
        return;
      }
      if (!container2.bubble) {
        container2.bubble = {};
      }
      if (container2.bubble.durationEnd) {
        if (pObjBubble) {
          if (type === ProcessBubbleType.size) {
            delete particle.bubble.radius;
          }
          if (type === ProcessBubbleType.opacity) {
            delete particle.bubble.opacity;
          }
        }
      } else {
        if (distMouse <= bubbleDistance) {
          const obj = pObjBubble ?? pObj;
          if (obj !== bubbleParam) {
            const value = pObj - timeSpent * (pObj - bubbleParam) / bubbleDuration;
            if (type === ProcessBubbleType.size) {
              particle.bubble.radius = value;
            }
            if (type === ProcessBubbleType.opacity) {
              particle.bubble.opacity = value;
            }
          }
        } else {
          if (type === ProcessBubbleType.size) {
            delete particle.bubble.radius;
          }
          if (type === ProcessBubbleType.opacity) {
            delete particle.bubble.opacity;
          }
        }
      }
    };
    this._singleSelectorHover = (delta, selector, div) => {
      const container2 = this.container, selectors = document.querySelectorAll(selector), bubble = container2.actualOptions.interactivity.modes.bubble;
      if (!bubble || !selectors.length) {
        return;
      }
      selectors.forEach((item) => {
        const elem = item, pxRatio = container2.retina.pixelRatio, pos = {
          x: (elem.offsetLeft + elem.offsetWidth * half6) * pxRatio,
          y: (elem.offsetTop + elem.offsetHeight * half6) * pxRatio
        }, repulseRadius = elem.offsetWidth * half6 * pxRatio, area = div.type === DivType.circle ? new Circle(pos.x, pos.y, repulseRadius) : new Rectangle(elem.offsetLeft * pxRatio, elem.offsetTop * pxRatio, elem.offsetWidth * pxRatio, elem.offsetHeight * pxRatio), query = container2.particles.quadTree.query(area, (p) => this.isEnabled(p));
        for (const particle of query) {
          if (!area.contains(particle.getPosition())) {
            continue;
          }
          particle.bubble.inRange = true;
          const divs = bubble.divs, divBubble = divMode(divs, elem);
          if (!particle.bubble.div || particle.bubble.div !== elem) {
            this.clear(particle, delta, true);
            particle.bubble.div = elem;
          }
          this._hoverBubbleSize(particle, defaultRatio, divBubble);
          this._hoverBubbleOpacity(particle, defaultRatio, divBubble);
          this._hoverBubbleColor(particle, defaultRatio, divBubble);
        }
      });
    };
    if (!container.bubble) {
      container.bubble = {};
    }
    this.handleClickMode = (mode) => {
      if (mode !== bubbleMode) {
        return;
      }
      if (!container.bubble) {
        container.bubble = {};
      }
      container.bubble.clicking = true;
    };
  }
  clear(particle, delta, force) {
    if (particle.bubble.inRange && !force) {
      return;
    }
    delete particle.bubble.div;
    delete particle.bubble.opacity;
    delete particle.bubble.radius;
    delete particle.bubble.color;
  }
  init() {
    const container = this.container, bubble = container.actualOptions.interactivity.modes.bubble;
    if (!bubble) {
      return;
    }
    container.retina.bubbleModeDistance = bubble.distance * container.retina.pixelRatio;
    if (bubble.size !== void 0) {
      container.retina.bubbleModeSize = bubble.size * container.retina.pixelRatio;
    }
  }
  interact(delta) {
    const options = this.container.actualOptions, events = options.interactivity.events, onHover = events.onHover, onClick = events.onClick, hoverEnabled = onHover.enable, hoverMode = onHover.mode, clickEnabled = onClick.enable, clickMode = onClick.mode, divs = events.onDiv;
    if (hoverEnabled && isInArray(bubbleMode, hoverMode)) {
      this._hoverBubble();
    } else if (clickEnabled && isInArray(bubbleMode, clickMode)) {
      this._clickBubble();
    } else {
      divModeExecute(bubbleMode, divs, (selector, div) => this._singleSelectorHover(delta, selector, div));
    }
  }
  isEnabled(particle) {
    const container = this.container, options = container.actualOptions, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? options.interactivity).events, { onClick, onDiv, onHover } = events, divBubble = isDivModeEnabled(bubbleMode, onDiv);
    if (!(divBubble || onHover.enable && !!mouse.position || onClick.enable && mouse.clickPosition)) {
      return false;
    }
    return isInArray(bubbleMode, onHover.mode) || isInArray(bubbleMode, onClick.mode) || divBubble;
  }
  loadModeOptions(options, ...sources) {
    if (!options.bubble) {
      options.bubble = new Bubble();
    }
    for (const source of sources) {
      options.bubble.load(source == null ? void 0 : source.bubble);
    }
  }
  reset(particle) {
    particle.bubble.inRange = false;
  }
};

// node_modules/@tsparticles/interaction-external-bubble/browser/index.js
async function loadExternalBubbleInteraction(engine, refresh = true) {
  await engine.addInteractor("externalBubble", (container) => {
    return Promise.resolve(new Bubbler(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-connect/browser/Options/Classes/ConnectLinks.js
var ConnectLinks = class {
  constructor() {
    this.opacity = 0.5;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
  }
};

// node_modules/@tsparticles/interaction-external-connect/browser/Options/Classes/Connect.js
var Connect = class {
  constructor() {
    this.distance = 80;
    this.links = new ConnectLinks();
    this.radius = 60;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    this.links.load(data.links);
    if (data.radius !== void 0) {
      this.radius = data.radius;
    }
  }
};

// node_modules/@tsparticles/interaction-external-connect/browser/Utils.js
var gradientMin = 0;
var gradientMax = 1;
var defaultLinksWidth = 0;
function gradient(context, p1, p2, opacity) {
  const gradStop = Math.floor(p2.getRadius() / p1.getRadius()), color1 = p1.getFillColor(), color2 = p2.getFillColor();
  if (!color1 || !color2) {
    return;
  }
  const sourcePos = p1.getPosition(), destPos = p2.getPosition(), midRgb = colorMix(color1, color2, p1.getRadius(), p2.getRadius()), grad = context.createLinearGradient(sourcePos.x, sourcePos.y, destPos.x, destPos.y);
  grad.addColorStop(gradientMin, getStyleFromHsl(color1, opacity));
  grad.addColorStop(clamp(gradStop, gradientMin, gradientMax), getStyleFromRgb(midRgb, opacity));
  grad.addColorStop(gradientMax, getStyleFromHsl(color2, opacity));
  return grad;
}
function drawConnectLine(context, width, lineStyle2, begin, end) {
  drawLine(context, begin, end);
  context.lineWidth = width;
  context.strokeStyle = lineStyle2;
  context.stroke();
}
function lineStyle(container, ctx, p1, p2) {
  const options = container.actualOptions, connectOptions = options.interactivity.modes.connect;
  if (!connectOptions) {
    return;
  }
  return gradient(ctx, p1, p2, connectOptions.links.opacity);
}
function drawConnection(container, p1, p2) {
  container.canvas.draw((ctx) => {
    const ls = lineStyle(container, ctx, p1, p2);
    if (!ls) {
      return;
    }
    const pos1 = p1.getPosition(), pos2 = p2.getPosition();
    drawConnectLine(ctx, p1.retina.linksWidth ?? defaultLinksWidth, ls, pos1, pos2);
  });
}

// node_modules/@tsparticles/interaction-external-connect/browser/Connector.js
var connectMode = "connect";
var minDistance3 = 0;
var Connector = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
  }
  clear() {
  }
  init() {
    const container = this.container, connect = container.actualOptions.interactivity.modes.connect;
    if (!connect) {
      return;
    }
    container.retina.connectModeDistance = connect.distance * container.retina.pixelRatio;
    container.retina.connectModeRadius = connect.radius * container.retina.pixelRatio;
  }
  interact() {
    const container = this.container, options = container.actualOptions;
    if (options.interactivity.events.onHover.enable && container.interactivity.status === "pointermove") {
      const mousePos = container.interactivity.mouse.position, { connectModeDistance, connectModeRadius } = container.retina;
      if (!connectModeDistance || connectModeDistance < minDistance3 || !connectModeRadius || connectModeRadius < minDistance3 || !mousePos) {
        return;
      }
      const distance = Math.abs(connectModeRadius), query = container.particles.quadTree.queryCircle(mousePos, distance, (p) => this.isEnabled(p));
      query.forEach((p1, i) => {
        const pos1 = p1.getPosition(), indexOffset = 1;
        for (const p2 of query.slice(i + indexOffset)) {
          const pos2 = p2.getPosition(), distMax = Math.abs(connectModeDistance), xDiff = Math.abs(pos1.x - pos2.x), yDiff = Math.abs(pos1.y - pos2.y);
          if (xDiff < distMax && yDiff < distMax) {
            drawConnection(container, p1, p2);
          }
        }
      });
    }
  }
  isEnabled(particle) {
    const container = this.container, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? container.actualOptions.interactivity).events;
    if (!(events.onHover.enable && mouse.position)) {
      return false;
    }
    return isInArray(connectMode, events.onHover.mode);
  }
  loadModeOptions(options, ...sources) {
    if (!options.connect) {
      options.connect = new Connect();
    }
    for (const source of sources) {
      options.connect.load(source == null ? void 0 : source.connect);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-connect/browser/index.js
async function loadExternalConnectInteraction(engine, refresh = true) {
  await engine.addInteractor("externalConnect", (container) => {
    return Promise.resolve(new Connector(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-grab/browser/Options/Classes/GrabLinks.js
var GrabLinks = class {
  constructor() {
    this.blink = false;
    this.consent = false;
    this.opacity = 1;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.blink !== void 0) {
      this.blink = data.blink;
    }
    if (data.color !== void 0) {
      this.color = OptionsColor.create(this.color, data.color);
    }
    if (data.consent !== void 0) {
      this.consent = data.consent;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
  }
};

// node_modules/@tsparticles/interaction-external-grab/browser/Options/Classes/Grab.js
var Grab = class {
  constructor() {
    this.distance = 100;
    this.links = new GrabLinks();
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    this.links.load(data.links);
  }
};

// node_modules/@tsparticles/interaction-external-grab/browser/Utils.js
var defaultWidth = 0;
function drawGrabLine(context, width, begin, end, colorLine, opacity) {
  drawLine(context, begin, end);
  context.strokeStyle = getStyleFromRgb(colorLine, opacity);
  context.lineWidth = width;
  context.stroke();
}
function drawGrab(container, particle, lineColor, opacity, mousePos) {
  container.canvas.draw((ctx) => {
    const beginPos = particle.getPosition();
    drawGrabLine(ctx, particle.retina.linksWidth ?? defaultWidth, beginPos, mousePos, lineColor, opacity);
  });
}

// node_modules/@tsparticles/interaction-external-grab/browser/Grabber.js
var grabMode = "grab";
var minDistance4 = 0;
var minOpacity = 0;
var Grabber = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
  }
  clear() {
  }
  init() {
    const container = this.container, grab = container.actualOptions.interactivity.modes.grab;
    if (!grab) {
      return;
    }
    container.retina.grabModeDistance = grab.distance * container.retina.pixelRatio;
  }
  interact() {
    var _a;
    const container = this.container, options = container.actualOptions, interactivity = options.interactivity;
    if (!interactivity.modes.grab || !interactivity.events.onHover.enable || container.interactivity.status !== mouseMoveEvent) {
      return;
    }
    const mousePos = container.interactivity.mouse.position;
    if (!mousePos) {
      return;
    }
    const distance = container.retina.grabModeDistance;
    if (!distance || distance < minDistance4) {
      return;
    }
    const query = container.particles.quadTree.queryCircle(mousePos, distance, (p) => this.isEnabled(p));
    for (const particle of query) {
      const pos = particle.getPosition(), pointDistance = getDistance(pos, mousePos);
      if (pointDistance > distance) {
        continue;
      }
      const grabLineOptions = interactivity.modes.grab.links, lineOpacity = grabLineOptions.opacity, opacityLine = lineOpacity - pointDistance * lineOpacity / distance;
      if (opacityLine <= minOpacity) {
        continue;
      }
      const optColor = grabLineOptions.color ?? ((_a = particle.options.links) == null ? void 0 : _a.color);
      if (!container.particles.grabLineColor && optColor) {
        const linksOptions = interactivity.modes.grab.links;
        container.particles.grabLineColor = getLinkRandomColor(optColor, linksOptions.blink, linksOptions.consent);
      }
      const colorLine = getLinkColor(particle, void 0, container.particles.grabLineColor);
      if (!colorLine) {
        continue;
      }
      drawGrab(container, particle, colorLine, opacityLine, mousePos);
    }
  }
  isEnabled(particle) {
    const container = this.container, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? container.actualOptions.interactivity).events;
    return events.onHover.enable && !!mouse.position && isInArray(grabMode, events.onHover.mode);
  }
  loadModeOptions(options, ...sources) {
    if (!options.grab) {
      options.grab = new Grab();
    }
    for (const source of sources) {
      options.grab.load(source == null ? void 0 : source.grab);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-grab/browser/index.js
async function loadExternalGrabInteraction(engine, refresh = true) {
  await engine.addInteractor("externalGrab", (container) => {
    return Promise.resolve(new Grabber(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-pause/browser/Pauser.js
var pauseMode = "pause";
var Pauser = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
    this.handleClickMode = (mode) => {
      if (mode !== pauseMode) {
        return;
      }
      const container2 = this.container;
      if (container2.animationStatus) {
        container2.pause();
      } else {
        container2.play();
      }
    };
  }
  clear() {
  }
  init() {
  }
  interact() {
  }
  isEnabled() {
    return true;
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-pause/browser/index.js
async function loadExternalPauseInteraction(engine, refresh = true) {
  await engine.addInteractor("externalPause", (container) => {
    return Promise.resolve(new Pauser(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-push/browser/Options/Classes/Push.js
var Push = class {
  constructor() {
    this.default = true;
    this.groups = [];
    this.quantity = 4;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.default !== void 0) {
      this.default = data.default;
    }
    if (data.groups !== void 0) {
      this.groups = data.groups.map((t) => t);
    }
    if (!this.groups.length) {
      this.default = true;
    }
    const quantity = data.quantity;
    if (quantity !== void 0) {
      this.quantity = setRangeValue(quantity);
    }
  }
};

// node_modules/@tsparticles/interaction-external-push/browser/Pusher.js
var pushMode = "push";
var minQuantity = 0;
var Pusher = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
    this.handleClickMode = (mode) => {
      if (mode !== pushMode) {
        return;
      }
      const container2 = this.container, options = container2.actualOptions, pushOptions = options.interactivity.modes.push;
      if (!pushOptions) {
        return;
      }
      const quantity = getRangeValue(pushOptions.quantity);
      if (quantity <= minQuantity) {
        return;
      }
      const group = itemFromArray([void 0, ...pushOptions.groups]), groupOptions = group !== void 0 ? container2.actualOptions.particles.groups[group] : void 0;
      void container2.particles.push(quantity, container2.interactivity.mouse, groupOptions, group);
    };
  }
  clear() {
  }
  init() {
  }
  interact() {
  }
  isEnabled() {
    return true;
  }
  loadModeOptions(options, ...sources) {
    if (!options.push) {
      options.push = new Push();
    }
    for (const source of sources) {
      options.push.load(source == null ? void 0 : source.push);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-push/browser/index.js
async function loadExternalPushInteraction(engine, refresh = true) {
  await engine.addInteractor("externalPush", (container) => {
    return Promise.resolve(new Pusher(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-remove/browser/Options/Classes/Remove.js
var Remove = class {
  constructor() {
    this.quantity = 2;
  }
  load(data) {
    if (!data) {
      return;
    }
    const quantity = data.quantity;
    if (quantity !== void 0) {
      this.quantity = setRangeValue(quantity);
    }
  }
};

// node_modules/@tsparticles/interaction-external-remove/browser/Remover.js
var removeMode = "remove";
var Remover = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
    this.handleClickMode = (mode) => {
      const container2 = this.container, options = container2.actualOptions;
      if (!options.interactivity.modes.remove || mode !== removeMode) {
        return;
      }
      const removeNb = getRangeValue(options.interactivity.modes.remove.quantity);
      container2.particles.removeQuantity(removeNb);
    };
  }
  clear() {
  }
  init() {
  }
  interact() {
  }
  isEnabled() {
    return true;
  }
  loadModeOptions(options, ...sources) {
    if (!options.remove) {
      options.remove = new Remove();
    }
    for (const source of sources) {
      options.remove.load(source == null ? void 0 : source.remove);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-remove/browser/index.js
async function loadExternalRemoveInteraction(engine, refresh = true) {
  await engine.addInteractor("externalRemove", (container) => {
    return Promise.resolve(new Remover(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-repulse/browser/Options/Classes/RepulseBase.js
var RepulseBase = class {
  constructor() {
    this.distance = 200;
    this.duration = 0.4;
    this.factor = 100;
    this.speed = 1;
    this.maxSpeed = 50;
    this.easing = EasingType.easeOutQuad;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    if (data.duration !== void 0) {
      this.duration = data.duration;
    }
    if (data.easing !== void 0) {
      this.easing = data.easing;
    }
    if (data.factor !== void 0) {
      this.factor = data.factor;
    }
    if (data.speed !== void 0) {
      this.speed = data.speed;
    }
    if (data.maxSpeed !== void 0) {
      this.maxSpeed = data.maxSpeed;
    }
  }
};

// node_modules/@tsparticles/interaction-external-repulse/browser/Options/Classes/RepulseDiv.js
var RepulseDiv = class extends RepulseBase {
  constructor() {
    super();
    this.selectors = [];
  }
  load(data) {
    super.load(data);
    if (!data) {
      return;
    }
    if (data.selectors !== void 0) {
      this.selectors = data.selectors;
    }
  }
};

// node_modules/@tsparticles/interaction-external-repulse/browser/Options/Classes/Repulse.js
var Repulse = class extends RepulseBase {
  load(data) {
    super.load(data);
    if (!data) {
      return;
    }
    this.divs = executeOnSingleOrMultiple(data.divs, (div) => {
      const tmp = new RepulseDiv();
      tmp.load(div);
      return tmp;
    });
  }
};

// node_modules/@tsparticles/interaction-external-repulse/browser/Repulser.js
var repulseMode = "repulse";
var minDistance5 = 0;
var repulseRadiusFactor = 6;
var repulseRadiusPower = 3;
var squarePower = 2;
var minRadius4 = 0;
var minSpeed = 0;
var easingOffset = 1;
var half7 = 0.5;
var Repulser = class extends ExternalInteractorBase {
  constructor(engine, container) {
    super(container);
    this._clickRepulse = () => {
      const container2 = this.container, repulseOptions = container2.actualOptions.interactivity.modes.repulse;
      if (!repulseOptions) {
        return;
      }
      const repulse = container2.repulse ?? { particles: [] };
      if (!repulse.finish) {
        if (!repulse.count) {
          repulse.count = 0;
        }
        repulse.count++;
        if (repulse.count === container2.particles.count) {
          repulse.finish = true;
        }
      }
      if (repulse.clicking) {
        const repulseDistance = container2.retina.repulseModeDistance;
        if (!repulseDistance || repulseDistance < minDistance5) {
          return;
        }
        const repulseRadius = Math.pow(repulseDistance / repulseRadiusFactor, repulseRadiusPower), mouseClickPos = container2.interactivity.mouse.clickPosition;
        if (mouseClickPos === void 0) {
          return;
        }
        const range = new Circle(mouseClickPos.x, mouseClickPos.y, repulseRadius), query = container2.particles.quadTree.query(range, (p) => this.isEnabled(p));
        for (const particle of query) {
          const { dx, dy, distance } = getDistances(mouseClickPos, particle.position), d = distance ** squarePower, velocity = repulseOptions.speed, force = -repulseRadius * velocity / d;
          if (d <= repulseRadius) {
            repulse.particles.push(particle);
            const vect = Vector.create(dx, dy);
            vect.length = force;
            particle.velocity.setTo(vect);
          }
        }
      } else if (repulse.clicking === false) {
        for (const particle of repulse.particles) {
          particle.velocity.setTo(particle.initialVelocity);
        }
        repulse.particles = [];
      }
    };
    this._hoverRepulse = () => {
      const container2 = this.container, mousePos = container2.interactivity.mouse.position, repulseRadius = container2.retina.repulseModeDistance;
      if (!repulseRadius || repulseRadius < minRadius4 || !mousePos) {
        return;
      }
      this._processRepulse(mousePos, repulseRadius, new Circle(mousePos.x, mousePos.y, repulseRadius));
    };
    this._processRepulse = (position, repulseRadius, area, divRepulse) => {
      const container2 = this.container, query = container2.particles.quadTree.query(area, (p) => this.isEnabled(p)), repulseOptions = container2.actualOptions.interactivity.modes.repulse;
      if (!repulseOptions) {
        return;
      }
      const { easing, speed, factor, maxSpeed } = repulseOptions, easingFunc = getEasing(easing), velocity = ((divRepulse == null ? void 0 : divRepulse.speed) ?? speed) * factor;
      for (const particle of query) {
        const { dx, dy, distance } = getDistances(particle.position, position), repulseFactor = clamp(easingFunc(easingOffset - distance / repulseRadius) * velocity, minSpeed, maxSpeed), normVec = Vector.create(!distance ? velocity : dx / distance * repulseFactor, !distance ? velocity : dy / distance * repulseFactor);
        particle.position.addTo(normVec);
      }
    };
    this._singleSelectorRepulse = (selector, div) => {
      const container2 = this.container, repulse = container2.actualOptions.interactivity.modes.repulse;
      if (!repulse) {
        return;
      }
      const query = document.querySelectorAll(selector);
      if (!query.length) {
        return;
      }
      query.forEach((item) => {
        const elem = item, pxRatio = container2.retina.pixelRatio, pos = {
          x: (elem.offsetLeft + elem.offsetWidth * half7) * pxRatio,
          y: (elem.offsetTop + elem.offsetHeight * half7) * pxRatio
        }, repulseRadius = elem.offsetWidth * half7 * pxRatio, area = div.type === DivType.circle ? new Circle(pos.x, pos.y, repulseRadius) : new Rectangle(elem.offsetLeft * pxRatio, elem.offsetTop * pxRatio, elem.offsetWidth * pxRatio, elem.offsetHeight * pxRatio), divs = repulse.divs, divRepulse = divMode(divs, elem);
        this._processRepulse(pos, repulseRadius, area, divRepulse);
      });
    };
    this._engine = engine;
    if (!container.repulse) {
      container.repulse = { particles: [] };
    }
    this.handleClickMode = (mode) => {
      const options = this.container.actualOptions, repulseOpts = options.interactivity.modes.repulse;
      if (!repulseOpts || mode !== repulseMode) {
        return;
      }
      if (!container.repulse) {
        container.repulse = { particles: [] };
      }
      const repulse = container.repulse;
      repulse.clicking = true;
      repulse.count = 0;
      for (const particle of container.repulse.particles) {
        if (!this.isEnabled(particle)) {
          continue;
        }
        particle.velocity.setTo(particle.initialVelocity);
      }
      repulse.particles = [];
      repulse.finish = false;
      setTimeout(() => {
        if (container.destroyed) {
          return;
        }
        repulse.clicking = false;
      }, repulseOpts.duration * millisecondsToSeconds);
    };
  }
  clear() {
  }
  init() {
    const container = this.container, repulse = container.actualOptions.interactivity.modes.repulse;
    if (!repulse) {
      return;
    }
    container.retina.repulseModeDistance = repulse.distance * container.retina.pixelRatio;
  }
  interact() {
    const container = this.container, options = container.actualOptions, mouseMoveStatus = container.interactivity.status === mouseMoveEvent, events = options.interactivity.events, hover = events.onHover, hoverEnabled = hover.enable, hoverMode = hover.mode, click = events.onClick, clickEnabled = click.enable, clickMode = click.mode, divs = events.onDiv;
    if (mouseMoveStatus && hoverEnabled && isInArray(repulseMode, hoverMode)) {
      this._hoverRepulse();
    } else if (clickEnabled && isInArray(repulseMode, clickMode)) {
      this._clickRepulse();
    } else {
      divModeExecute(repulseMode, divs, (selector, div) => this._singleSelectorRepulse(selector, div));
    }
  }
  isEnabled(particle) {
    const container = this.container, options = container.actualOptions, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? options.interactivity).events, divs = events.onDiv, hover = events.onHover, click = events.onClick, divRepulse = isDivModeEnabled(repulseMode, divs);
    if (!(divRepulse || hover.enable && !!mouse.position || click.enable && mouse.clickPosition)) {
      return false;
    }
    const hoverMode = hover.mode, clickMode = click.mode;
    return isInArray(repulseMode, hoverMode) || isInArray(repulseMode, clickMode) || divRepulse;
  }
  loadModeOptions(options, ...sources) {
    if (!options.repulse) {
      options.repulse = new Repulse();
    }
    for (const source of sources) {
      options.repulse.load(source == null ? void 0 : source.repulse);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-external-repulse/browser/index.js
async function loadExternalRepulseInteraction(engine, refresh = true) {
  await engine.addInteractor("externalRepulse", (container) => {
    return Promise.resolve(new Repulser(engine, container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-external-slow/browser/Options/Classes/Slow.js
var Slow = class {
  constructor() {
    this.factor = 3;
    this.radius = 200;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.factor !== void 0) {
      this.factor = data.factor;
    }
    if (data.radius !== void 0) {
      this.radius = data.radius;
    }
  }
};

// node_modules/@tsparticles/interaction-external-slow/browser/Slower.js
var slowMode = "slow";
var minRadius5 = 0;
var Slower = class extends ExternalInteractorBase {
  constructor(container) {
    super(container);
  }
  clear(particle, delta, force) {
    if (particle.slow.inRange && !force) {
      return;
    }
    particle.slow.factor = 1;
  }
  init() {
    const container = this.container, slow = container.actualOptions.interactivity.modes.slow;
    if (!slow) {
      return;
    }
    container.retina.slowModeRadius = slow.radius * container.retina.pixelRatio;
  }
  interact() {
  }
  isEnabled(particle) {
    const container = this.container, mouse = container.interactivity.mouse, events = ((particle == null ? void 0 : particle.interactivity) ?? container.actualOptions.interactivity).events;
    return events.onHover.enable && !!mouse.position && isInArray(slowMode, events.onHover.mode);
  }
  loadModeOptions(options, ...sources) {
    if (!options.slow) {
      options.slow = new Slow();
    }
    for (const source of sources) {
      options.slow.load(source == null ? void 0 : source.slow);
    }
  }
  reset(particle) {
    particle.slow.inRange = false;
    const container = this.container, options = container.actualOptions, mousePos = container.interactivity.mouse.position, radius = container.retina.slowModeRadius, slowOptions = options.interactivity.modes.slow;
    if (!slowOptions || !radius || radius < minRadius5 || !mousePos) {
      return;
    }
    const particlePos = particle.getPosition(), dist = getDistance(mousePos, particlePos), proximityFactor = dist / radius, slowFactor = slowOptions.factor, { slow } = particle;
    if (dist > radius) {
      return;
    }
    slow.inRange = true;
    slow.factor = proximityFactor / slowFactor;
  }
};

// node_modules/@tsparticles/interaction-external-slow/browser/index.js
async function loadExternalSlowInteraction(engine, refresh = true) {
  await engine.addInteractor("externalSlow", (container) => {
    return Promise.resolve(new Slower(container));
  }, refresh);
}

// node_modules/@tsparticles/shape-image/browser/Utils.js
var stringStart = 0;
var defaultOpacity2 = 1;
var currentColorRegex = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))|currentcolor/gi;
function replaceColorSvg(imageShape, color, opacity) {
  const { svgData } = imageShape;
  if (!svgData) {
    return "";
  }
  const colorStyle = getStyleFromHsl(color, opacity);
  if (svgData.includes("fill")) {
    return svgData.replace(currentColorRegex, () => colorStyle);
  }
  const preFillIndex = svgData.indexOf(">");
  return `${svgData.substring(stringStart, preFillIndex)} fill="${colorStyle}"${svgData.substring(preFillIndex)}`;
}
async function loadImage(image) {
  return new Promise((resolve) => {
    image.loading = true;
    const img = new Image();
    image.element = img;
    img.addEventListener("load", () => {
      image.loading = false;
      resolve();
    });
    img.addEventListener("error", () => {
      image.element = void 0;
      image.error = true;
      image.loading = false;
      getLogger().error(`${errorPrefix} loading image: ${image.source}`);
      resolve();
    });
    img.src = image.source;
  });
}
async function downloadSvgImage(image) {
  if (image.type !== "svg") {
    await loadImage(image);
    return;
  }
  image.loading = true;
  const response = await fetch(image.source);
  if (!response.ok) {
    getLogger().error(`${errorPrefix} Image not found`);
    image.error = true;
  } else {
    image.svgData = await response.text();
  }
  image.loading = false;
}
function replaceImageColor(image, imageData, color, particle) {
  var _a;
  const svgColoredData = replaceColorSvg(image, color, ((_a = particle.opacity) == null ? void 0 : _a.value) ?? defaultOpacity2), imageRes = {
    color,
    gif: imageData.gif,
    data: {
      ...image,
      svgData: svgColoredData
    },
    loaded: false,
    ratio: imageData.width / imageData.height,
    replaceColor: imageData.replaceColor,
    source: imageData.src
  };
  return new Promise((resolve) => {
    const svg = new Blob([svgColoredData], { type: "image/svg+xml" }), domUrl = URL || window.URL || window.webkitURL || window, url = domUrl.createObjectURL(svg), img = new Image();
    img.addEventListener("load", () => {
      imageRes.loaded = true;
      imageRes.element = img;
      resolve(imageRes);
      domUrl.revokeObjectURL(url);
    });
    const errorHandler = async () => {
      domUrl.revokeObjectURL(url);
      const img2 = {
        ...image,
        error: false,
        loading: true
      };
      await loadImage(img2);
      imageRes.loaded = true;
      imageRes.element = img2.element;
      resolve(imageRes);
    };
    img.addEventListener("error", () => void errorHandler());
    img.src = url;
  });
}

// node_modules/@tsparticles/shape-image/browser/GifUtils/Constants.js
var InterlaceOffsets = [0, 4, 2, 1];
var InterlaceSteps = [8, 8, 4, 2];

// node_modules/@tsparticles/shape-image/browser/GifUtils/ByteStream.js
var ByteStream = class {
  constructor(bytes) {
    this.pos = 0;
    this.data = new Uint8ClampedArray(bytes);
  }
  getString(count) {
    const slice = this.data.slice(this.pos, this.pos + count);
    this.pos += slice.length;
    return slice.reduce((acc, curr) => acc + String.fromCharCode(curr), "");
  }
  nextByte() {
    return this.data[this.pos++];
  }
  nextTwoBytes() {
    const increment2 = 2, previous = 1, shift = 8;
    this.pos += increment2;
    return this.data[this.pos - increment2] + (this.data[this.pos - previous] << shift);
  }
  readSubBlocks() {
    let blockString = "", size = 0;
    const minCount = 0, emptySize = 0;
    do {
      size = this.data[this.pos++];
      for (let count = size; --count >= minCount; blockString += String.fromCharCode(this.data[this.pos++])) {
      }
    } while (size !== emptySize);
    return blockString;
  }
  readSubBlocksBin() {
    let size = this.data[this.pos], len = 0;
    const emptySize = 0, increment2 = 1;
    for (let offset = 0; size !== emptySize; offset += size + increment2, size = this.data[this.pos + offset]) {
      len += size;
    }
    const blockData = new Uint8Array(len);
    size = this.data[this.pos++];
    for (let i = 0; size !== emptySize; size = this.data[this.pos++]) {
      for (let count = size; --count >= emptySize; blockData[i++] = this.data[this.pos++]) {
      }
    }
    return blockData;
  }
  skipSubBlocks() {
    for (const increment2 = 1, noData = 0; this.data[this.pos] !== noData; this.pos += this.data[this.pos] + increment2) {
    }
    this.pos++;
  }
};

// node_modules/@tsparticles/shape-image/browser/GifUtils/Enums/DisposalMethod.js
var DisposalMethod;
(function(DisposalMethod2) {
  DisposalMethod2[DisposalMethod2["Replace"] = 0] = "Replace";
  DisposalMethod2[DisposalMethod2["Combine"] = 1] = "Combine";
  DisposalMethod2[DisposalMethod2["RestoreBackground"] = 2] = "RestoreBackground";
  DisposalMethod2[DisposalMethod2["RestorePrevious"] = 3] = "RestorePrevious";
  DisposalMethod2[DisposalMethod2["UndefinedA"] = 4] = "UndefinedA";
  DisposalMethod2[DisposalMethod2["UndefinedB"] = 5] = "UndefinedB";
  DisposalMethod2[DisposalMethod2["UndefinedC"] = 6] = "UndefinedC";
  DisposalMethod2[DisposalMethod2["UndefinedD"] = 7] = "UndefinedD";
})(DisposalMethod || (DisposalMethod = {}));

// node_modules/@tsparticles/shape-image/browser/GifUtils/Types/GIFDataHeaders.js
var GIFDataHeaders;
(function(GIFDataHeaders2) {
  GIFDataHeaders2[GIFDataHeaders2["Extension"] = 33] = "Extension";
  GIFDataHeaders2[GIFDataHeaders2["ApplicationExtension"] = 255] = "ApplicationExtension";
  GIFDataHeaders2[GIFDataHeaders2["GraphicsControlExtension"] = 249] = "GraphicsControlExtension";
  GIFDataHeaders2[GIFDataHeaders2["PlainTextExtension"] = 1] = "PlainTextExtension";
  GIFDataHeaders2[GIFDataHeaders2["CommentExtension"] = 254] = "CommentExtension";
  GIFDataHeaders2[GIFDataHeaders2["Image"] = 44] = "Image";
  GIFDataHeaders2[GIFDataHeaders2["EndOfFile"] = 59] = "EndOfFile";
})(GIFDataHeaders || (GIFDataHeaders = {}));

// node_modules/@tsparticles/shape-image/browser/GifUtils/Utils.js
var origin3 = {
  x: 0,
  y: 0
};
var defaultFrame = 0;
var half8 = 0.5;
var initialTime = 0;
var firstIndex = 0;
var defaultLoopCount = 0;
function parseColorTable(byteStream, count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push({
      r: byteStream.data[byteStream.pos],
      g: byteStream.data[byteStream.pos + 1],
      b: byteStream.data[byteStream.pos + 2]
    });
    byteStream.pos += 3;
  }
  return colors;
}
function parseExtensionBlock(byteStream, gif, getFrameIndex, getTransparencyIndex) {
  switch (byteStream.nextByte()) {
    case GIFDataHeaders.GraphicsControlExtension: {
      const frame = gif.frames[getFrameIndex(false)];
      byteStream.pos++;
      const packedByte = byteStream.nextByte();
      frame.GCreserved = (packedByte & 224) >>> 5;
      frame.disposalMethod = (packedByte & 28) >>> 2;
      frame.userInputDelayFlag = (packedByte & 2) === 2;
      const transparencyFlag = (packedByte & 1) === 1;
      frame.delayTime = byteStream.nextTwoBytes() * 10;
      const transparencyIndex = byteStream.nextByte();
      if (transparencyFlag) {
        getTransparencyIndex(transparencyIndex);
      }
      byteStream.pos++;
      break;
    }
    case GIFDataHeaders.ApplicationExtension: {
      byteStream.pos++;
      const applicationExtension = {
        identifier: byteStream.getString(8),
        authenticationCode: byteStream.getString(3),
        data: byteStream.readSubBlocksBin()
      };
      gif.applicationExtensions.push(applicationExtension);
      break;
    }
    case GIFDataHeaders.CommentExtension: {
      gif.comments.push([getFrameIndex(false), byteStream.readSubBlocks()]);
      break;
    }
    case GIFDataHeaders.PlainTextExtension: {
      if (gif.globalColorTable.length === 0) {
        throw new EvalError("plain text extension without global color table");
      }
      byteStream.pos++;
      gif.frames[getFrameIndex(false)].plainTextData = {
        left: byteStream.nextTwoBytes(),
        top: byteStream.nextTwoBytes(),
        width: byteStream.nextTwoBytes(),
        height: byteStream.nextTwoBytes(),
        charSize: {
          width: byteStream.nextTwoBytes(),
          height: byteStream.nextTwoBytes()
        },
        foregroundColor: byteStream.nextByte(),
        backgroundColor: byteStream.nextByte(),
        text: byteStream.readSubBlocks()
      };
      break;
    }
    default:
      byteStream.skipSubBlocks();
      break;
  }
}
async function parseImageBlock(byteStream, gif, avgAlpha, getFrameIndex, getTransparencyIndex, progressCallback) {
  const frame = gif.frames[getFrameIndex(true)];
  frame.left = byteStream.nextTwoBytes();
  frame.top = byteStream.nextTwoBytes();
  frame.width = byteStream.nextTwoBytes();
  frame.height = byteStream.nextTwoBytes();
  const packedByte = byteStream.nextByte(), localColorTableFlag = (packedByte & 128) === 128, interlacedFlag = (packedByte & 64) === 64;
  frame.sortFlag = (packedByte & 32) === 32;
  frame.reserved = (packedByte & 24) >>> 3;
  const localColorCount = 1 << (packedByte & 7) + 1;
  if (localColorTableFlag) {
    frame.localColorTable = parseColorTable(byteStream, localColorCount);
  }
  const getColor = (index) => {
    const { r, g, b } = (localColorTableFlag ? frame.localColorTable : gif.globalColorTable)[index];
    if (index !== getTransparencyIndex(null)) {
      return { r, g, b, a: 255 };
    }
    return { r, g, b, a: avgAlpha ? ~~((r + g + b) / 3) : 0 };
  };
  const image = (() => {
    try {
      return new ImageData(frame.width, frame.height, { colorSpace: "srgb" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "IndexSizeError") {
        return null;
      }
      throw error;
    }
  })();
  if (image == null) {
    throw new EvalError("GIF frame size is to large");
  }
  const minCodeSize = byteStream.nextByte(), imageData = byteStream.readSubBlocksBin(), clearCode = 1 << minCodeSize;
  const readBits = (pos, len) => {
    const bytePos = pos >>> 3, bitPos = pos & 7;
    return (imageData[bytePos] + (imageData[bytePos + 1] << 8) + (imageData[bytePos + 2] << 16) & (1 << len) - 1 << bitPos) >>> bitPos;
  };
  if (interlacedFlag) {
    for (let code = 0, size = minCodeSize + 1, pos = 0, dic = [[0]], pass = 0; pass < 4; pass++) {
      if (InterlaceOffsets[pass] < frame.height) {
        let pixelPos = 0, lineIndex = 0, exit = false;
        while (!exit) {
          const last = code;
          code = readBits(pos, size);
          pos += size + 1;
          if (code === clearCode) {
            size = minCodeSize + 1;
            dic.length = clearCode + 2;
            for (let i = 0; i < dic.length; i++) {
              dic[i] = i < clearCode ? [i] : [];
            }
          } else {
            if (code >= dic.length) {
              dic.push(dic[last].concat(dic[last][0]));
            } else if (last !== clearCode) {
              dic.push(dic[last].concat(dic[code][0]));
            }
            for (const item of dic[code]) {
              const { r, g, b, a } = getColor(item);
              image.data.set([r, g, b, a], InterlaceOffsets[pass] * frame.width + InterlaceSteps[pass] * lineIndex + pixelPos % (frame.width * 4));
              pixelPos += 4;
            }
            if (dic.length === 1 << size && size < 12) {
              size++;
            }
          }
          if (pixelPos === frame.width * 4 * (lineIndex + 1)) {
            lineIndex++;
            if (InterlaceOffsets[pass] + InterlaceSteps[pass] * lineIndex >= frame.height) {
              exit = true;
            }
          }
        }
      }
      progressCallback == null ? void 0 : progressCallback(byteStream.pos / (byteStream.data.length - 1), getFrameIndex(false) + 1, image, { x: frame.left, y: frame.top }, { width: gif.width, height: gif.height });
    }
    frame.image = image;
    frame.bitmap = await createImageBitmap(image);
  } else {
    let code = 0, size = minCodeSize + 1, pos = 0, pixelPos = -4, exit = false;
    const dic = [[0]];
    while (!exit) {
      const last = code;
      code = readBits(pos, size);
      pos += size;
      if (code === clearCode) {
        size = minCodeSize + 1;
        dic.length = clearCode + 2;
        for (let i = 0; i < dic.length; i++) {
          dic[i] = i < clearCode ? [i] : [];
        }
      } else {
        if (code === clearCode + 1) {
          exit = true;
          break;
        }
        if (code >= dic.length) {
          dic.push(dic[last].concat(dic[last][0]));
        } else if (last !== clearCode) {
          dic.push(dic[last].concat(dic[code][0]));
        }
        for (const item of dic[code]) {
          const { r, g, b, a } = getColor(item);
          image.data.set([r, g, b, a], pixelPos += 4);
        }
        if (dic.length >= 1 << size && size < 12) {
          size++;
        }
      }
    }
    frame.image = image;
    frame.bitmap = await createImageBitmap(image);
    progressCallback == null ? void 0 : progressCallback((byteStream.pos + 1) / byteStream.data.length, getFrameIndex(false) + 1, frame.image, { x: frame.left, y: frame.top }, { width: gif.width, height: gif.height });
  }
}
async function parseBlock(byteStream, gif, avgAlpha, getFrameIndex, getTransparencyIndex, progressCallback) {
  switch (byteStream.nextByte()) {
    case GIFDataHeaders.EndOfFile:
      return true;
    case GIFDataHeaders.Image:
      await parseImageBlock(byteStream, gif, avgAlpha, getFrameIndex, getTransparencyIndex, progressCallback);
      break;
    case GIFDataHeaders.Extension:
      parseExtensionBlock(byteStream, gif, getFrameIndex, getTransparencyIndex);
      break;
    default:
      throw new EvalError("undefined block found");
  }
  return false;
}
function getGIFLoopAmount(gif) {
  for (const extension of gif.applicationExtensions) {
    if (extension.identifier + extension.authenticationCode !== "NETSCAPE2.0") {
      continue;
    }
    return extension.data[1] + (extension.data[2] << 8);
  }
  return NaN;
}
async function decodeGIF(gifURL, progressCallback, avgAlpha) {
  if (!avgAlpha)
    avgAlpha = false;
  const res = await fetch(gifURL);
  if (!res.ok && res.status === 404) {
    throw new EvalError("file not found");
  }
  const buffer = await res.arrayBuffer();
  const gif = {
    width: 0,
    height: 0,
    totalTime: 0,
    colorRes: 0,
    pixelAspectRatio: 0,
    frames: [],
    sortFlag: false,
    globalColorTable: [],
    backgroundImage: new ImageData(1, 1, { colorSpace: "srgb" }),
    comments: [],
    applicationExtensions: []
  }, byteStream = new ByteStream(new Uint8ClampedArray(buffer));
  if (byteStream.getString(6) !== "GIF89a") {
    throw new Error("not a supported GIF file");
  }
  gif.width = byteStream.nextTwoBytes();
  gif.height = byteStream.nextTwoBytes();
  const packedByte = byteStream.nextByte(), globalColorTableFlag = (packedByte & 128) === 128;
  gif.colorRes = (packedByte & 112) >>> 4;
  gif.sortFlag = (packedByte & 8) === 8;
  const globalColorCount = 1 << (packedByte & 7) + 1, backgroundColorIndex = byteStream.nextByte();
  gif.pixelAspectRatio = byteStream.nextByte();
  if (gif.pixelAspectRatio !== 0) {
    gif.pixelAspectRatio = (gif.pixelAspectRatio + 15) / 64;
  }
  if (globalColorTableFlag) {
    gif.globalColorTable = parseColorTable(byteStream, globalColorCount);
  }
  const backgroundImage = (() => {
    try {
      return new ImageData(gif.width, gif.height, { colorSpace: "srgb" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "IndexSizeError") {
        return null;
      }
      throw error;
    }
  })();
  if (backgroundImage == null) {
    throw new Error("GIF frame size is to large");
  }
  const { r, g, b } = gif.globalColorTable[backgroundColorIndex];
  backgroundImage.data.set(globalColorTableFlag ? [r, g, b, 255] : [0, 0, 0, 0]);
  for (let i = 4; i < backgroundImage.data.length; i *= 2) {
    backgroundImage.data.copyWithin(i, 0, i);
  }
  gif.backgroundImage = backgroundImage;
  let frameIndex = -1, incrementFrameIndex = true, transparencyIndex = -1;
  const getframeIndex = (increment2) => {
    if (increment2) {
      incrementFrameIndex = true;
    }
    return frameIndex;
  };
  const getTransparencyIndex = (newValue) => {
    if (newValue != null) {
      transparencyIndex = newValue;
    }
    return transparencyIndex;
  };
  try {
    do {
      if (incrementFrameIndex) {
        gif.frames.push({
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          disposalMethod: DisposalMethod.Replace,
          image: new ImageData(1, 1, { colorSpace: "srgb" }),
          plainTextData: null,
          userInputDelayFlag: false,
          delayTime: 0,
          sortFlag: false,
          localColorTable: [],
          reserved: 0,
          GCreserved: 0
        });
        frameIndex++;
        transparencyIndex = -1;
        incrementFrameIndex = false;
      }
    } while (!await parseBlock(byteStream, gif, avgAlpha, getframeIndex, getTransparencyIndex, progressCallback));
    gif.frames.length--;
    for (const frame of gif.frames) {
      if (frame.userInputDelayFlag && frame.delayTime === 0) {
        gif.totalTime = Infinity;
        break;
      }
      gif.totalTime += frame.delayTime;
    }
    return gif;
  } catch (error) {
    if (error instanceof EvalError) {
      throw new Error(`error while parsing frame ${frameIndex} "${error.message}"`);
    }
    throw error;
  }
}
function drawGif(data) {
  const { context, radius, particle, delta } = data, image = particle.image;
  if (!(image == null ? void 0 : image.gifData) || !image.gif) {
    return;
  }
  const offscreenCanvas = new OffscreenCanvas(image.gifData.width, image.gifData.height), offscreenContext = offscreenCanvas.getContext("2d");
  if (!offscreenContext) {
    throw new Error("could not create offscreen canvas context");
  }
  offscreenContext.imageSmoothingQuality = "low";
  offscreenContext.imageSmoothingEnabled = false;
  offscreenContext.clearRect(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
  if (particle.gifLoopCount === void 0) {
    particle.gifLoopCount = image.gifLoopCount ?? defaultLoopCount;
  }
  let frameIndex = particle.gifFrame ?? defaultFrame;
  const pos = { x: -image.gifData.width * half8, y: -image.gifData.height * half8 }, frame = image.gifData.frames[frameIndex];
  if (particle.gifTime === void 0) {
    particle.gifTime = initialTime;
  }
  if (!frame.bitmap) {
    return;
  }
  context.scale(radius / image.gifData.width, radius / image.gifData.height);
  switch (frame.disposalMethod) {
    case DisposalMethod.UndefinedA:
    case DisposalMethod.UndefinedB:
    case DisposalMethod.UndefinedC:
    case DisposalMethod.UndefinedD:
    case DisposalMethod.Replace:
      offscreenContext.drawImage(frame.bitmap, frame.left, frame.top);
      context.drawImage(offscreenCanvas, pos.x, pos.y);
      offscreenContext.clearRect(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
      break;
    case DisposalMethod.Combine:
      offscreenContext.drawImage(frame.bitmap, frame.left, frame.top);
      context.drawImage(offscreenCanvas, pos.x, pos.y);
      break;
    case DisposalMethod.RestoreBackground:
      offscreenContext.drawImage(frame.bitmap, frame.left, frame.top);
      context.drawImage(offscreenCanvas, pos.x, pos.y);
      offscreenContext.clearRect(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
      if (!image.gifData.globalColorTable.length) {
        offscreenContext.putImageData(image.gifData.frames[firstIndex].image, pos.x + frame.left, pos.y + frame.top);
      } else {
        offscreenContext.putImageData(image.gifData.backgroundImage, pos.x, pos.y);
      }
      break;
    case DisposalMethod.RestorePrevious:
      {
        const previousImageData = offscreenContext.getImageData(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
        offscreenContext.drawImage(frame.bitmap, frame.left, frame.top);
        context.drawImage(offscreenCanvas, pos.x, pos.y);
        offscreenContext.clearRect(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
        offscreenContext.putImageData(previousImageData, origin3.x, origin3.y);
      }
      break;
  }
  particle.gifTime += delta.value;
  if (particle.gifTime > frame.delayTime) {
    particle.gifTime -= frame.delayTime;
    if (++frameIndex >= image.gifData.frames.length) {
      if (--particle.gifLoopCount <= defaultLoopCount) {
        return;
      }
      frameIndex = firstIndex;
      offscreenContext.clearRect(origin3.x, origin3.y, offscreenCanvas.width, offscreenCanvas.height);
    }
    particle.gifFrame = frameIndex;
  }
  context.scale(image.gifData.width / radius, image.gifData.height / radius);
}
async function loadGifImage(image) {
  if (image.type !== "gif") {
    await loadImage(image);
    return;
  }
  image.loading = true;
  try {
    image.gifData = await decodeGIF(image.source);
    image.gifLoopCount = getGIFLoopAmount(image.gifData) ?? defaultLoopCount;
    if (!image.gifLoopCount) {
      image.gifLoopCount = Infinity;
    }
  } catch {
    image.error = true;
  }
  image.loading = false;
}

// node_modules/@tsparticles/shape-image/browser/ImageDrawer.js
var double8 = 2;
var defaultAlpha = 1;
var sides3 = 12;
var defaultRatio2 = 1;
var ImageDrawer = class {
  constructor(engine) {
    this.validTypes = ["image", "images"];
    this.loadImageShape = async (imageShape) => {
      if (!this._engine.loadImage) {
        throw new Error(`${errorPrefix} image shape not initialized`);
      }
      await this._engine.loadImage({
        gif: imageShape.gif,
        name: imageShape.name,
        replaceColor: imageShape.replaceColor ?? false,
        src: imageShape.src
      });
    };
    this._engine = engine;
  }
  addImage(image) {
    if (!this._engine.images) {
      this._engine.images = [];
    }
    this._engine.images.push(image);
  }
  draw(data) {
    const { context, radius, particle, opacity } = data, image = particle.image, element = image == null ? void 0 : image.element;
    if (!image) {
      return;
    }
    context.globalAlpha = opacity;
    if (image.gif && image.gifData) {
      drawGif(data);
    } else if (element) {
      const ratio = image.ratio, pos = {
        x: -radius,
        y: -radius
      }, diameter = radius * double8;
      context.drawImage(element, pos.x, pos.y, diameter, diameter / ratio);
    }
    context.globalAlpha = defaultAlpha;
  }
  getSidesCount() {
    return sides3;
  }
  async init(container) {
    const options = container.actualOptions;
    if (!options.preload || !this._engine.loadImage) {
      return;
    }
    for (const imageData of options.preload) {
      await this._engine.loadImage(imageData);
    }
  }
  loadShape(particle) {
    if (particle.shape !== "image" && particle.shape !== "images") {
      return;
    }
    if (!this._engine.images) {
      this._engine.images = [];
    }
    const imageData = particle.shapeData;
    if (!imageData) {
      return;
    }
    const image = this._engine.images.find((t) => t.name === imageData.name || t.source === imageData.src);
    if (!image) {
      void this.loadImageShape(imageData).then(() => {
        this.loadShape(particle);
      });
    }
  }
  particleInit(container, particle) {
    if (particle.shape !== "image" && particle.shape !== "images") {
      return;
    }
    if (!this._engine.images) {
      this._engine.images = [];
    }
    const images = this._engine.images, imageData = particle.shapeData;
    if (!imageData) {
      return;
    }
    const color = particle.getFillColor(), image = images.find((t) => t.name === imageData.name || t.source === imageData.src);
    if (!image) {
      return;
    }
    const replaceColor = imageData.replaceColor ?? image.replaceColor;
    if (image.loading) {
      setTimeout(() => {
        this.particleInit(container, particle);
      });
      return;
    }
    void (async () => {
      let imageRes;
      if (image.svgData && color) {
        imageRes = await replaceImageColor(image, imageData, color, particle);
      } else {
        imageRes = {
          color,
          data: image,
          element: image.element,
          gif: image.gif,
          gifData: image.gifData,
          gifLoopCount: image.gifLoopCount,
          loaded: true,
          ratio: imageData.width && imageData.height ? imageData.width / imageData.height : image.ratio ?? defaultRatio2,
          replaceColor,
          source: imageData.src
        };
      }
      if (!imageRes.ratio) {
        imageRes.ratio = 1;
      }
      const fill = imageData.fill ?? particle.shapeFill, close = imageData.close ?? particle.shapeClose, imageShape = {
        image: imageRes,
        fill,
        close
      };
      particle.image = imageShape.image;
      particle.shapeFill = imageShape.fill;
      particle.shapeClose = imageShape.close;
    })();
  }
};

// node_modules/@tsparticles/shape-image/browser/Options/Classes/Preload.js
var Preload = class {
  constructor() {
    this.src = "";
    this.gif = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.gif !== void 0) {
      this.gif = data.gif;
    }
    if (data.height !== void 0) {
      this.height = data.height;
    }
    if (data.name !== void 0) {
      this.name = data.name;
    }
    if (data.replaceColor !== void 0) {
      this.replaceColor = data.replaceColor;
    }
    if (data.src !== void 0) {
      this.src = data.src;
    }
    if (data.width !== void 0) {
      this.width = data.width;
    }
  }
};

// node_modules/@tsparticles/shape-image/browser/ImagePreloader.js
var ImagePreloaderPlugin = class {
  constructor(engine) {
    this.id = "imagePreloader";
    this._engine = engine;
  }
  async getPlugin() {
    await Promise.resolve();
    return {};
  }
  loadOptions(options, source) {
    if (!(source == null ? void 0 : source.preload)) {
      return;
    }
    if (!options.preload) {
      options.preload = [];
    }
    const preloadOptions = options.preload;
    for (const item of source.preload) {
      const existing = preloadOptions.find((t) => t.name === item.name || t.src === item.src);
      if (existing) {
        existing.load(item);
      } else {
        const preload = new Preload();
        preload.load(item);
        preloadOptions.push(preload);
      }
    }
  }
  needsPlugin() {
    return true;
  }
};

// node_modules/@tsparticles/shape-image/browser/index.js
var extLength = 3;
function addLoadImageToEngine(engine) {
  if (engine.loadImage) {
    return;
  }
  engine.loadImage = async (data) => {
    if (!data.name && !data.src) {
      throw new Error(`${errorPrefix} no image source provided`);
    }
    if (!engine.images) {
      engine.images = [];
    }
    if (engine.images.find((t) => t.name === data.name || t.source === data.src)) {
      return;
    }
    try {
      const image = {
        gif: data.gif ?? false,
        name: data.name ?? data.src,
        source: data.src,
        type: data.src.substring(data.src.length - extLength),
        error: false,
        loading: true,
        replaceColor: data.replaceColor,
        ratio: data.width && data.height ? data.width / data.height : void 0
      };
      engine.images.push(image);
      let imageFunc;
      if (data.gif) {
        imageFunc = loadGifImage;
      } else {
        imageFunc = data.replaceColor ? downloadSvgImage : loadImage;
      }
      await imageFunc(image);
    } catch {
      throw new Error(`${errorPrefix} ${data.name ?? data.src} not found`);
    }
  };
}
async function loadImageShape(engine, refresh = true) {
  addLoadImageToEngine(engine);
  const preloader = new ImagePreloaderPlugin(engine);
  await engine.addPlugin(preloader, refresh);
  await engine.addShape(new ImageDrawer(engine), refresh);
}

// node_modules/@tsparticles/updater-life/browser/Options/Classes/LifeDelay.js
var LifeDelay = class extends ValueWithRandom {
  constructor() {
    super();
    this.sync = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    super.load(data);
    if (data.sync !== void 0) {
      this.sync = data.sync;
    }
  }
};

// node_modules/@tsparticles/updater-life/browser/Options/Classes/LifeDuration.js
var LifeDuration = class extends ValueWithRandom {
  constructor() {
    super();
    this.sync = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    super.load(data);
    if (data.sync !== void 0) {
      this.sync = data.sync;
    }
  }
};

// node_modules/@tsparticles/updater-life/browser/Options/Classes/Life.js
var Life = class {
  constructor() {
    this.count = 0;
    this.delay = new LifeDelay();
    this.duration = new LifeDuration();
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.count !== void 0) {
      this.count = data.count;
    }
    this.delay.load(data.delay);
    this.duration.load(data.duration);
  }
};

// node_modules/@tsparticles/updater-life/browser/Utils.js
var noTime = 0;
var infiniteValue = -1;
var noLife = 0;
var minCanvasSize = 0;
function updateLife(particle, delta, canvasSize) {
  if (!particle.life) {
    return;
  }
  const life = particle.life;
  let justSpawned = false;
  if (particle.spawning) {
    life.delayTime += delta.value;
    if (life.delayTime >= particle.life.delay) {
      justSpawned = true;
      particle.spawning = false;
      life.delayTime = noTime;
      life.time = noTime;
    } else {
      return;
    }
  }
  if (life.duration === infiniteValue) {
    return;
  }
  if (particle.spawning) {
    return;
  }
  if (justSpawned) {
    life.time = noTime;
  } else {
    life.time += delta.value;
  }
  if (life.time < life.duration) {
    return;
  }
  life.time = noTime;
  if (particle.life.count > noLife) {
    particle.life.count--;
  }
  if (particle.life.count === noLife) {
    particle.destroy();
    return;
  }
  const widthRange = setRangeValue(minCanvasSize, canvasSize.width), heightRange = setRangeValue(minCanvasSize, canvasSize.width);
  particle.position.x = randomInRange(widthRange);
  particle.position.y = randomInRange(heightRange);
  particle.spawning = true;
  life.delayTime = noTime;
  life.time = noTime;
  particle.reset();
  const lifeOptions = particle.options.life;
  if (lifeOptions) {
    life.delay = getRangeValue(lifeOptions.delay.value) * millisecondsToSeconds;
    life.duration = getRangeValue(lifeOptions.duration.value) * millisecondsToSeconds;
  }
}

// node_modules/@tsparticles/updater-life/browser/LifeUpdater.js
var noTime2 = 0;
var identity3 = 1;
var infiniteValue2 = -1;
var LifeUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    const container = this.container, particlesOptions = particle.options, lifeOptions = particlesOptions.life;
    if (!lifeOptions) {
      return;
    }
    particle.life = {
      delay: container.retina.reduceFactor ? getRangeValue(lifeOptions.delay.value) * (lifeOptions.delay.sync ? identity3 : getRandom()) / container.retina.reduceFactor * millisecondsToSeconds : noTime2,
      delayTime: noTime2,
      duration: container.retina.reduceFactor ? getRangeValue(lifeOptions.duration.value) * (lifeOptions.duration.sync ? identity3 : getRandom()) / container.retina.reduceFactor * millisecondsToSeconds : noTime2,
      time: noTime2,
      count: lifeOptions.count
    };
    if (particle.life.duration <= noTime2) {
      particle.life.duration = infiniteValue2;
    }
    if (particle.life.count <= noTime2) {
      particle.life.count = infiniteValue2;
    }
    if (particle.life) {
      particle.spawning = particle.life.delay > noTime2;
    }
  }
  isEnabled(particle) {
    return !particle.destroyed;
  }
  loadOptions(options, ...sources) {
    if (!options.life) {
      options.life = new Life();
    }
    for (const source of sources) {
      options.life.load(source == null ? void 0 : source.life);
    }
  }
  update(particle, delta) {
    if (!this.isEnabled(particle) || !particle.life) {
      return;
    }
    updateLife(particle, delta, this.container.canvas.size);
  }
};

// node_modules/@tsparticles/updater-life/browser/index.js
async function loadLifeUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("life", async (container) => {
    return Promise.resolve(new LifeUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/shape-line/browser/Utils.js
function drawLine2(data) {
  const { context, particle, radius } = data, shapeData = particle.shapeData, centerY = 0;
  context.moveTo(-radius, centerY);
  context.lineTo(radius, centerY);
  context.lineCap = (shapeData == null ? void 0 : shapeData.cap) ?? "butt";
}

// node_modules/@tsparticles/shape-line/browser/LineDrawer.js
var sides4 = 1;
var LineDrawer = class {
  constructor() {
    this.validTypes = ["line"];
  }
  draw(data) {
    drawLine2(data);
  }
  getSidesCount() {
    return sides4;
  }
};

// node_modules/@tsparticles/shape-line/browser/index.js
async function loadLineShape(engine, refresh = true) {
  await engine.addShape(new LineDrawer(), refresh);
}

// node_modules/@tsparticles/move-parallax/browser/ParallaxMover.js
var half9 = 0.5;
var ParallaxMover = class {
  init() {
  }
  isEnabled(particle) {
    return !isSsr() && !particle.destroyed && particle.container.actualOptions.interactivity.events.onHover.parallax.enable;
  }
  move(particle) {
    const container = particle.container, options = container.actualOptions, parallaxOptions = options.interactivity.events.onHover.parallax;
    if (isSsr() || !parallaxOptions.enable) {
      return;
    }
    const parallaxForce = parallaxOptions.force, mousePos = container.interactivity.mouse.position;
    if (!mousePos) {
      return;
    }
    const canvasSize = container.canvas.size, canvasCenter = {
      x: canvasSize.width * half9,
      y: canvasSize.height * half9
    }, parallaxSmooth = parallaxOptions.smooth, factor = particle.getRadius() / parallaxForce, centerDistance = {
      x: (mousePos.x - canvasCenter.x) * factor,
      y: (mousePos.y - canvasCenter.y) * factor
    }, { offset } = particle;
    offset.x += (centerDistance.x - offset.x) / parallaxSmooth;
    offset.y += (centerDistance.y - offset.y) / parallaxSmooth;
  }
};

// node_modules/@tsparticles/move-parallax/browser/index.js
async function loadParallaxMover(engine, refresh = true) {
  await engine.addMover("parallax", () => {
    return Promise.resolve(new ParallaxMover());
  }, refresh);
}

// node_modules/@tsparticles/interaction-particles-attract/browser/Attractor.js
var attractFactor = 1e3;
var identity4 = 1;
var Attractor2 = class extends ParticlesInteractorBase {
  constructor(container) {
    super(container);
  }
  clear() {
  }
  init() {
  }
  interact(p1) {
    const container = this.container;
    if (p1.attractDistance === void 0) {
      p1.attractDistance = getRangeValue(p1.options.move.attract.distance) * container.retina.pixelRatio;
    }
    const distance = p1.attractDistance, pos1 = p1.getPosition(), query = container.particles.quadTree.queryCircle(pos1, distance);
    for (const p2 of query) {
      if (p1 === p2 || !p2.options.move.attract.enable || p2.destroyed || p2.spawning) {
        continue;
      }
      const pos2 = p2.getPosition(), { dx, dy } = getDistances(pos1, pos2), rotate = p1.options.move.attract.rotate, ax = dx / (rotate.x * attractFactor), ay = dy / (rotate.y * attractFactor), p1Factor = p2.size.value / p1.size.value, p2Factor = identity4 / p1Factor;
      p1.velocity.x -= ax * p1Factor;
      p1.velocity.y -= ay * p1Factor;
      p2.velocity.x += ax * p2Factor;
      p2.velocity.y += ay * p2Factor;
    }
  }
  isEnabled(particle) {
    return particle.options.move.attract.enable;
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-particles-attract/browser/index.js
async function loadParticlesAttractInteraction(engine, refresh = true) {
  await engine.addInteractor("particlesAttract", (container) => {
    return Promise.resolve(new Attractor2(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-particles-collisions/browser/Absorb.js
var half10 = 0.5;
var absorbFactor2 = 10;
var minAbsorbFactor = 0;
function updateAbsorb(p1, r1, p2, r2, delta, pixelRatio) {
  const factor = clamp(p1.options.collisions.absorb.speed * delta.factor / absorbFactor2, minAbsorbFactor, r2);
  p1.size.value += factor * half10;
  p2.size.value -= factor;
  if (r2 <= pixelRatio) {
    p2.size.value = 0;
    p2.destroy();
  }
}
function absorb(p1, p2, delta, pixelRatio) {
  const r1 = p1.getRadius(), r2 = p2.getRadius();
  if (r1 === void 0 && r2 !== void 0) {
    p1.destroy();
  } else if (r1 !== void 0 && r2 === void 0) {
    p2.destroy();
  } else if (r1 !== void 0 && r2 !== void 0) {
    if (r1 >= r2) {
      updateAbsorb(p1, r1, p2, r2, delta, pixelRatio);
    } else {
      updateAbsorb(p2, r2, p1, r1, delta, pixelRatio);
    }
  }
}

// node_modules/@tsparticles/interaction-particles-collisions/browser/Bounce.js
var fixBounceSpeed = (p) => {
  if (p.collisionMaxSpeed === void 0) {
    p.collisionMaxSpeed = getRangeValue(p.options.collisions.maxSpeed);
  }
  if (p.velocity.length > p.collisionMaxSpeed) {
    p.velocity.length = p.collisionMaxSpeed;
  }
};
function bounce(p1, p2) {
  circleBounce(circleBounceDataFromParticle(p1), circleBounceDataFromParticle(p2));
  fixBounceSpeed(p1);
  fixBounceSpeed(p2);
}

// node_modules/@tsparticles/interaction-particles-collisions/browser/Destroy.js
function destroy(p1, p2) {
  if (!p1.unbreakable && !p2.unbreakable) {
    bounce(p1, p2);
  }
  if (p1.getRadius() === void 0 && p2.getRadius() !== void 0) {
    p1.destroy();
  } else if (p1.getRadius() !== void 0 && p2.getRadius() === void 0) {
    p2.destroy();
  } else if (p1.getRadius() !== void 0 && p2.getRadius() !== void 0) {
    const deleteP = p1.getRadius() >= p2.getRadius() ? p2 : p1;
    deleteP.destroy();
  }
}

// node_modules/@tsparticles/interaction-particles-collisions/browser/ResolveCollision.js
function resolveCollision(p1, p2, delta, pixelRatio) {
  switch (p1.options.collisions.mode) {
    case CollisionMode.absorb: {
      absorb(p1, p2, delta, pixelRatio);
      break;
    }
    case CollisionMode.bounce: {
      bounce(p1, p2);
      break;
    }
    case CollisionMode.destroy: {
      destroy(p1, p2);
      break;
    }
  }
}

// node_modules/@tsparticles/interaction-particles-collisions/browser/Collider.js
var double9 = 2;
var Collider = class extends ParticlesInteractorBase {
  constructor(container) {
    super(container);
  }
  clear() {
  }
  init() {
  }
  interact(p1, delta) {
    if (p1.destroyed || p1.spawning) {
      return;
    }
    const container = this.container, pos1 = p1.getPosition(), radius1 = p1.getRadius(), query = container.particles.quadTree.queryCircle(pos1, radius1 * double9);
    for (const p2 of query) {
      if (p1 === p2 || !p2.options.collisions.enable || p1.options.collisions.mode !== p2.options.collisions.mode || p2.destroyed || p2.spawning) {
        continue;
      }
      const pos2 = p2.getPosition(), radius2 = p2.getRadius();
      if (Math.abs(Math.round(pos1.z) - Math.round(pos2.z)) > radius1 + radius2) {
        continue;
      }
      const dist = getDistance(pos1, pos2), distP = radius1 + radius2;
      if (dist > distP) {
        continue;
      }
      resolveCollision(p1, p2, delta, container.retina.pixelRatio);
    }
  }
  isEnabled(particle) {
    return particle.options.collisions.enable;
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-particles-collisions/browser/index.js
async function loadParticlesCollisionsInteraction(engine, refresh = true) {
  await engine.addInteractor("particlesCollisions", (container) => {
    return Promise.resolve(new Collider(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-particles-links/browser/CircleWarp.js
var double10 = 2;
var CircleWarp = class extends Circle {
  constructor(x, y, radius, canvasSize) {
    super(x, y, radius);
    this.canvasSize = canvasSize;
    this.canvasSize = { ...canvasSize };
  }
  contains(point) {
    const { width, height } = this.canvasSize, { x, y } = point;
    return super.contains(point) || super.contains({ x: x - width, y }) || super.contains({ x: x - width, y: y - height }) || super.contains({ x, y: y - height });
  }
  intersects(range) {
    if (super.intersects(range)) {
      return true;
    }
    const rect = range, circle = range, newPos = {
      x: range.position.x - this.canvasSize.width,
      y: range.position.y - this.canvasSize.height
    };
    if (circle.radius !== void 0) {
      const biggerCircle = new Circle(newPos.x, newPos.y, circle.radius * double10);
      return super.intersects(biggerCircle);
    } else if (rect.size !== void 0) {
      const rectSW = new Rectangle(newPos.x, newPos.y, rect.size.width * double10, rect.size.height * double10);
      return super.intersects(rectSW);
    }
    return false;
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/Options/Classes/LinksShadow.js
var LinksShadow = class {
  constructor() {
    this.blur = 5;
    this.color = new OptionsColor();
    this.color.value = "#000";
    this.enable = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.blur !== void 0) {
      this.blur = data.blur;
    }
    this.color = OptionsColor.create(this.color, data.color);
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/Options/Classes/LinksTriangle.js
var LinksTriangle = class {
  constructor() {
    this.enable = false;
    this.frequency = 1;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.color !== void 0) {
      this.color = OptionsColor.create(this.color, data.color);
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.frequency !== void 0) {
      this.frequency = data.frequency;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/Options/Classes/Links.js
var Links = class {
  constructor() {
    this.blink = false;
    this.color = new OptionsColor();
    this.color.value = "#fff";
    this.consent = false;
    this.distance = 100;
    this.enable = false;
    this.frequency = 1;
    this.opacity = 1;
    this.shadow = new LinksShadow();
    this.triangles = new LinksTriangle();
    this.width = 1;
    this.warp = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.id !== void 0) {
      this.id = data.id;
    }
    if (data.blink !== void 0) {
      this.blink = data.blink;
    }
    this.color = OptionsColor.create(this.color, data.color);
    if (data.consent !== void 0) {
      this.consent = data.consent;
    }
    if (data.distance !== void 0) {
      this.distance = data.distance;
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.frequency !== void 0) {
      this.frequency = data.frequency;
    }
    if (data.opacity !== void 0) {
      this.opacity = data.opacity;
    }
    this.shadow.load(data.shadow);
    this.triangles.load(data.triangles);
    if (data.width !== void 0) {
      this.width = data.width;
    }
    if (data.warp !== void 0) {
      this.warp = data.warp;
    }
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/Linker.js
var squarePower2 = 2;
var opacityOffset = 1;
var origin4 = {
  x: 0,
  y: 0
};
var minDistance6 = 0;
function getLinkDistance(pos1, pos2, optDistance, canvasSize, warp) {
  const { dx, dy, distance } = getDistances(pos1, pos2);
  if (!warp || distance <= optDistance) {
    return distance;
  }
  const absDiffs = {
    x: Math.abs(dx),
    y: Math.abs(dy)
  }, warpDistances = {
    x: Math.min(absDiffs.x, canvasSize.width - absDiffs.x),
    y: Math.min(absDiffs.y, canvasSize.height - absDiffs.y)
  };
  return Math.sqrt(warpDistances.x ** squarePower2 + warpDistances.y ** squarePower2);
}
var Linker = class extends ParticlesInteractorBase {
  constructor(container) {
    super(container);
    this._setColor = (p1) => {
      if (!p1.options.links) {
        return;
      }
      const container2 = this.linkContainer, linksOptions = p1.options.links;
      let linkColor = linksOptions.id === void 0 ? container2.particles.linksColor : container2.particles.linksColors.get(linksOptions.id);
      if (linkColor) {
        return;
      }
      const optColor = linksOptions.color;
      linkColor = getLinkRandomColor(optColor, linksOptions.blink, linksOptions.consent);
      if (linksOptions.id === void 0) {
        container2.particles.linksColor = linkColor;
      } else {
        container2.particles.linksColors.set(linksOptions.id, linkColor);
      }
    };
    this.linkContainer = container;
  }
  clear() {
  }
  init() {
    this.linkContainer.particles.linksColor = void 0;
    this.linkContainer.particles.linksColors = /* @__PURE__ */ new Map();
  }
  interact(p1) {
    if (!p1.options.links) {
      return;
    }
    p1.links = [];
    const pos1 = p1.getPosition(), container = this.container, canvasSize = container.canvas.size;
    if (pos1.x < origin4.x || pos1.y < origin4.y || pos1.x > canvasSize.width || pos1.y > canvasSize.height) {
      return;
    }
    const linkOpt1 = p1.options.links, optOpacity = linkOpt1.opacity, optDistance = p1.retina.linksDistance ?? minDistance6, warp = linkOpt1.warp;
    let range;
    if (warp) {
      range = new CircleWarp(pos1.x, pos1.y, optDistance, canvasSize);
    } else {
      range = new Circle(pos1.x, pos1.y, optDistance);
    }
    const query = container.particles.quadTree.query(range);
    for (const p2 of query) {
      const linkOpt2 = p2.options.links;
      if (p1 === p2 || !(linkOpt2 == null ? void 0 : linkOpt2.enable) || linkOpt1.id !== linkOpt2.id || p2.spawning || p2.destroyed || !p2.links || p1.links.some((t) => t.destination === p2) || p2.links.some((t) => t.destination === p1)) {
        continue;
      }
      const pos2 = p2.getPosition();
      if (pos2.x < origin4.x || pos2.y < origin4.y || pos2.x > canvasSize.width || pos2.y > canvasSize.height) {
        continue;
      }
      const distance = getLinkDistance(pos1, pos2, optDistance, canvasSize, warp && linkOpt2.warp);
      if (distance > optDistance) {
        continue;
      }
      const opacityLine = (opacityOffset - distance / optDistance) * optOpacity;
      this._setColor(p1);
      p1.links.push({
        destination: p2,
        opacity: opacityLine
      });
    }
  }
  isEnabled(particle) {
    var _a;
    return !!((_a = particle.options.links) == null ? void 0 : _a.enable);
  }
  loadParticlesOptions(options, ...sources) {
    if (!options.links) {
      options.links = new Links();
    }
    for (const source of sources) {
      options.links.load(source == null ? void 0 : source.links);
    }
  }
  reset() {
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/interaction.js
async function loadLinksInteraction(engine, refresh = true) {
  await engine.addInteractor("particlesLinks", async (container) => {
    return Promise.resolve(new Linker(container));
  }, refresh);
}

// node_modules/@tsparticles/interaction-particles-links/browser/Utils.js
function drawTriangle(context, p1, p2, p3) {
  context.beginPath();
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineTo(p3.x, p3.y);
  context.closePath();
}
function drawLinkLine(params) {
  let drawn = false;
  const { begin, end, maxDistance, context, canvasSize, width, backgroundMask, colorLine, opacity, links } = params;
  if (getDistance(begin, end) <= maxDistance) {
    drawLine(context, begin, end);
    drawn = true;
  } else if (links.warp) {
    let pi1;
    let pi2;
    const endNE = {
      x: end.x - canvasSize.width,
      y: end.y
    };
    const d1 = getDistances(begin, endNE);
    if (d1.distance <= maxDistance) {
      const yi = begin.y - d1.dy / d1.dx * begin.x;
      pi1 = { x: 0, y: yi };
      pi2 = { x: canvasSize.width, y: yi };
    } else {
      const endSW = {
        x: end.x,
        y: end.y - canvasSize.height
      };
      const d2 = getDistances(begin, endSW);
      if (d2.distance <= maxDistance) {
        const yi = begin.y - d2.dy / d2.dx * begin.x;
        const xi = -yi / (d2.dy / d2.dx);
        pi1 = { x: xi, y: 0 };
        pi2 = { x: xi, y: canvasSize.height };
      } else {
        const endSE = {
          x: end.x - canvasSize.width,
          y: end.y - canvasSize.height
        };
        const d3 = getDistances(begin, endSE);
        if (d3.distance <= maxDistance) {
          const yi = begin.y - d3.dy / d3.dx * begin.x;
          const xi = -yi / (d3.dy / d3.dx);
          pi1 = { x: xi, y: yi };
          pi2 = { x: pi1.x + canvasSize.width, y: pi1.y + canvasSize.height };
        }
      }
    }
    if (pi1 && pi2) {
      drawLine(context, begin, pi1);
      drawLine(context, end, pi2);
      drawn = true;
    }
  }
  if (!drawn) {
    return;
  }
  context.lineWidth = width;
  if (backgroundMask.enable) {
    context.globalCompositeOperation = backgroundMask.composite;
  }
  context.strokeStyle = getStyleFromRgb(colorLine, opacity);
  const { shadow } = links;
  if (shadow.enable) {
    const shadowColor = rangeColorToRgb(shadow.color);
    if (shadowColor) {
      context.shadowBlur = shadow.blur;
      context.shadowColor = getStyleFromRgb(shadowColor);
    }
  }
  context.stroke();
}
function drawLinkTriangle(params) {
  const { context, pos1, pos2, pos3, backgroundMask, colorTriangle, opacityTriangle } = params;
  drawTriangle(context, pos1, pos2, pos3);
  if (backgroundMask.enable) {
    context.globalCompositeOperation = backgroundMask.composite;
  }
  context.fillStyle = getStyleFromRgb(colorTriangle, opacityTriangle);
  context.fill();
}
function getLinkKey(ids) {
  ids.sort((a, b) => a - b);
  return ids.join("_");
}
function setLinkFrequency(particles, dictionary) {
  const key = getLinkKey(particles.map((t) => t.id));
  let res = dictionary.get(key);
  if (res === void 0) {
    res = getRandom();
    dictionary.set(key, res);
  }
  return res;
}

// node_modules/@tsparticles/interaction-particles-links/browser/LinkInstance.js
var minOpacity2 = 0;
var minWidth = 0;
var minDistance7 = 0;
var half11 = 0.5;
var maxFrequency = 1;
var LinkInstance = class {
  constructor(container) {
    this.container = container;
    this._drawLinkLine = (p1, link) => {
      const p1LinksOptions = p1.options.links;
      if (!(p1LinksOptions == null ? void 0 : p1LinksOptions.enable)) {
        return;
      }
      const container2 = this.container, options = container2.actualOptions, p2 = link.destination, pos1 = p1.getPosition(), pos2 = p2.getPosition();
      let opacity = link.opacity;
      container2.canvas.draw((ctx) => {
        var _a;
        let colorLine;
        const twinkle = (_a = p1.options.twinkle) == null ? void 0 : _a.lines;
        if (twinkle == null ? void 0 : twinkle.enable) {
          const twinkleFreq = twinkle.frequency, twinkleRgb = rangeColorToRgb(twinkle.color), twinkling = getRandom() < twinkleFreq;
          if (twinkling && twinkleRgb) {
            colorLine = twinkleRgb;
            opacity = getRangeValue(twinkle.opacity);
          }
        }
        if (!colorLine) {
          const linkColor = p1LinksOptions.id !== void 0 ? container2.particles.linksColors.get(p1LinksOptions.id) : container2.particles.linksColor;
          colorLine = getLinkColor(p1, p2, linkColor);
        }
        if (!colorLine) {
          return;
        }
        const width = p1.retina.linksWidth ?? minWidth, maxDistance = p1.retina.linksDistance ?? minDistance7, { backgroundMask } = options;
        drawLinkLine({
          context: ctx,
          width,
          begin: pos1,
          end: pos2,
          maxDistance,
          canvasSize: container2.canvas.size,
          links: p1LinksOptions,
          backgroundMask,
          colorLine,
          opacity
        });
      });
    };
    this._drawLinkTriangle = (p1, link1, link2) => {
      const linksOptions = p1.options.links;
      if (!(linksOptions == null ? void 0 : linksOptions.enable)) {
        return;
      }
      const triangleOptions = linksOptions.triangles;
      if (!triangleOptions.enable) {
        return;
      }
      const container2 = this.container, options = container2.actualOptions, p2 = link1.destination, p3 = link2.destination, opacityTriangle = triangleOptions.opacity ?? (link1.opacity + link2.opacity) * half11;
      if (opacityTriangle <= minOpacity2) {
        return;
      }
      container2.canvas.draw((ctx) => {
        const pos1 = p1.getPosition(), pos2 = p2.getPosition(), pos3 = p3.getPosition(), linksDistance = p1.retina.linksDistance ?? minDistance7;
        if (getDistance(pos1, pos2) > linksDistance || getDistance(pos3, pos2) > linksDistance || getDistance(pos3, pos1) > linksDistance) {
          return;
        }
        let colorTriangle = rangeColorToRgb(triangleOptions.color);
        if (!colorTriangle) {
          const linkColor = linksOptions.id !== void 0 ? container2.particles.linksColors.get(linksOptions.id) : container2.particles.linksColor;
          colorTriangle = getLinkColor(p1, p2, linkColor);
        }
        if (!colorTriangle) {
          return;
        }
        drawLinkTriangle({
          context: ctx,
          pos1,
          pos2,
          pos3,
          backgroundMask: options.backgroundMask,
          colorTriangle,
          opacityTriangle
        });
      });
    };
    this._drawTriangles = (options, p1, link, p1Links) => {
      var _a, _b, _c;
      const p2 = link.destination;
      if (!(((_a = options.links) == null ? void 0 : _a.triangles.enable) && ((_b = p2.options.links) == null ? void 0 : _b.triangles.enable))) {
        return;
      }
      const vertices = (_c = p2.links) == null ? void 0 : _c.filter((t) => {
        const linkFreq = this._getLinkFrequency(p2, t.destination), minCount = 0;
        return p2.options.links && linkFreq <= p2.options.links.frequency && p1Links.findIndex((l) => l.destination === t.destination) >= minCount;
      });
      if (!(vertices == null ? void 0 : vertices.length)) {
        return;
      }
      for (const vertex of vertices) {
        const p3 = vertex.destination, triangleFreq = this._getTriangleFrequency(p1, p2, p3);
        if (triangleFreq > options.links.triangles.frequency) {
          continue;
        }
        this._drawLinkTriangle(p1, link, vertex);
      }
    };
    this._getLinkFrequency = (p1, p2) => {
      return setLinkFrequency([p1, p2], this._freqs.links);
    };
    this._getTriangleFrequency = (p1, p2, p3) => {
      return setLinkFrequency([p1, p2, p3], this._freqs.triangles);
    };
    this._freqs = {
      links: /* @__PURE__ */ new Map(),
      triangles: /* @__PURE__ */ new Map()
    };
  }
  drawParticle(context, particle) {
    const { links, options } = particle;
    if (!(links == null ? void 0 : links.length)) {
      return;
    }
    const p1Links = links.filter((l) => options.links && (options.links.frequency >= maxFrequency || this._getLinkFrequency(particle, l.destination) <= options.links.frequency));
    for (const link of p1Links) {
      this._drawTriangles(options, particle, link, p1Links);
      if (link.opacity > minOpacity2 && (particle.retina.linksWidth ?? minWidth) > minWidth) {
        this._drawLinkLine(particle, link);
      }
    }
  }
  async init() {
    this._freqs.links = /* @__PURE__ */ new Map();
    this._freqs.triangles = /* @__PURE__ */ new Map();
    await Promise.resolve();
  }
  particleCreated(particle) {
    particle.links = [];
    if (!particle.options.links) {
      return;
    }
    const ratio = this.container.retina.pixelRatio, { retina } = particle, { distance, width } = particle.options.links;
    retina.linksDistance = distance * ratio;
    retina.linksWidth = width * ratio;
  }
  particleDestroyed(particle) {
    particle.links = [];
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/LinksPlugin.js
var LinksPlugin = class {
  constructor() {
    this.id = "links";
  }
  getPlugin(container) {
    return Promise.resolve(new LinkInstance(container));
  }
  loadOptions() {
  }
  needsPlugin() {
    return true;
  }
};

// node_modules/@tsparticles/interaction-particles-links/browser/plugin.js
async function loadLinksPlugin(engine, refresh = true) {
  const plugin = new LinksPlugin();
  await engine.addPlugin(plugin, refresh);
}

// node_modules/@tsparticles/interaction-particles-links/browser/index.js
async function loadParticlesLinksInteraction(engine, refresh = true) {
  await loadLinksInteraction(engine, refresh);
  await loadLinksPlugin(engine, refresh);
}

// node_modules/@tsparticles/shape-polygon/browser/Utils.js
var piDeg = 180;
var origin5 = { x: 0, y: 0 };
var sidesOffset = 2;
function drawPolygon(data, start, side) {
  const { context } = data, sideCount = side.count.numerator * side.count.denominator, decimalSides = side.count.numerator / side.count.denominator, interiorAngleDegrees = piDeg * (decimalSides - sidesOffset) / decimalSides, interiorAngle = Math.PI - degToRad(interiorAngleDegrees);
  if (!context) {
    return;
  }
  context.beginPath();
  context.translate(start.x, start.y);
  context.moveTo(origin5.x, origin5.y);
  for (let i = 0; i < sideCount; i++) {
    context.lineTo(side.length, origin5.y);
    context.translate(side.length, origin5.y);
    context.rotate(interiorAngle);
  }
}

// node_modules/@tsparticles/shape-polygon/browser/PolygonDrawerBase.js
var defaultSides = 5;
var PolygonDrawerBase = class {
  draw(data) {
    const { particle, radius } = data, start = this.getCenter(particle, radius), side = this.getSidesData(particle, radius);
    drawPolygon(data, start, side);
  }
  getSidesCount(particle) {
    const polygon = particle.shapeData;
    return Math.round(getRangeValue((polygon == null ? void 0 : polygon.sides) ?? defaultSides));
  }
};

// node_modules/@tsparticles/shape-polygon/browser/PolygonDrawer.js
var sidesCenterFactor = 3.5;
var yFactor = 2.66;
var sidesFactor = 3;
var PolygonDrawer = class extends PolygonDrawerBase {
  constructor() {
    super(...arguments);
    this.validTypes = ["polygon"];
  }
  getCenter(particle, radius) {
    return {
      x: -radius / (particle.sides / sidesCenterFactor),
      y: -radius / (yFactor / sidesCenterFactor)
    };
  }
  getSidesData(particle, radius) {
    const sides7 = particle.sides;
    return {
      count: {
        denominator: 1,
        numerator: sides7
      },
      length: radius * yFactor / (sides7 / sidesFactor)
    };
  }
};

// node_modules/@tsparticles/shape-polygon/browser/TriangleDrawer.js
var yFactor2 = 1.66;
var sides5 = 3;
var double11 = 2;
var TriangleDrawer = class extends PolygonDrawerBase {
  constructor() {
    super(...arguments);
    this.validTypes = ["triangle"];
  }
  getCenter(particle, radius) {
    return {
      x: -radius,
      y: radius / yFactor2
    };
  }
  getSidesCount() {
    return sides5;
  }
  getSidesData(particle, radius) {
    const diameter = radius * double11;
    return {
      count: {
        denominator: 2,
        numerator: 3
      },
      length: diameter
    };
  }
};

// node_modules/@tsparticles/shape-polygon/browser/index.js
async function loadGenericPolygonShape(engine, refresh = true) {
  await engine.addShape(new PolygonDrawer(), refresh);
}
async function loadTriangleShape(engine, refresh = true) {
  await engine.addShape(new TriangleDrawer(), refresh);
}
async function loadPolygonShape(engine, refresh = true) {
  await loadGenericPolygonShape(engine, refresh);
  await loadTriangleShape(engine, refresh);
}

// node_modules/@tsparticles/updater-rotate/browser/Options/Classes/RotateAnimation.js
var RotateAnimation = class {
  constructor() {
    this.enable = false;
    this.speed = 0;
    this.decay = 0;
    this.sync = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.speed !== void 0) {
      this.speed = setRangeValue(data.speed);
    }
    if (data.decay !== void 0) {
      this.decay = setRangeValue(data.decay);
    }
    if (data.sync !== void 0) {
      this.sync = data.sync;
    }
  }
};

// node_modules/@tsparticles/updater-rotate/browser/Options/Classes/Rotate.js
var Rotate = class extends ValueWithRandom {
  constructor() {
    super();
    this.animation = new RotateAnimation();
    this.direction = RotateDirection.clockwise;
    this.path = false;
    this.value = 0;
  }
  load(data) {
    if (!data) {
      return;
    }
    super.load(data);
    if (data.direction !== void 0) {
      this.direction = data.direction;
    }
    this.animation.load(data.animation);
    if (data.path !== void 0) {
      this.path = data.path;
    }
  }
};

// node_modules/@tsparticles/updater-rotate/browser/RotateUpdater.js
var double12 = 2;
var doublePI4 = Math.PI * double12;
var identity5 = 1;
var doublePIDeg = 360;
var RotateUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    const rotateOptions = particle.options.rotate;
    if (!rotateOptions) {
      return;
    }
    particle.rotate = {
      enable: rotateOptions.animation.enable,
      value: degToRad(getRangeValue(rotateOptions.value)),
      min: 0,
      max: doublePI4
    };
    particle.pathRotation = rotateOptions.path;
    let rotateDirection = rotateOptions.direction;
    if (rotateDirection === RotateDirection.random) {
      const index = Math.floor(getRandom() * double12), minIndex = 0;
      rotateDirection = index > minIndex ? RotateDirection.counterClockwise : RotateDirection.clockwise;
    }
    switch (rotateDirection) {
      case RotateDirection.counterClockwise:
      case "counterClockwise":
        particle.rotate.status = AnimationStatus.decreasing;
        break;
      case RotateDirection.clockwise:
        particle.rotate.status = AnimationStatus.increasing;
        break;
    }
    const rotateAnimation = rotateOptions.animation;
    if (rotateAnimation.enable) {
      particle.rotate.decay = identity5 - getRangeValue(rotateAnimation.decay);
      particle.rotate.velocity = getRangeValue(rotateAnimation.speed) / doublePIDeg * this.container.retina.reduceFactor;
      if (!rotateAnimation.sync) {
        particle.rotate.velocity *= getRandom();
      }
    }
    particle.rotation = particle.rotate.value;
  }
  isEnabled(particle) {
    const rotate = particle.options.rotate;
    if (!rotate) {
      return false;
    }
    return !particle.destroyed && !particle.spawning && (!!rotate.value || rotate.animation.enable || rotate.path);
  }
  loadOptions(options, ...sources) {
    if (!options.rotate) {
      options.rotate = new Rotate();
    }
    for (const source of sources) {
      options.rotate.load(source == null ? void 0 : source.rotate);
    }
  }
  update(particle, delta) {
    if (!this.isEnabled(particle)) {
      return;
    }
    particle.isRotating = !!particle.rotate;
    if (!particle.rotate) {
      return;
    }
    updateAnimation(particle, particle.rotate, false, DestroyType.none, delta);
    particle.rotation = particle.rotate.value;
  }
};

// node_modules/@tsparticles/updater-rotate/browser/index.js
async function loadRotateUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("rotate", (container) => {
    return Promise.resolve(new RotateUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/shape-square/browser/Utils.js
var fixFactorSquared = 2;
var fixFactor = Math.sqrt(fixFactorSquared);
var double13 = 2;
function drawSquare(data) {
  const { context, radius } = data, fixedRadius = radius / fixFactor, fixedDiameter = fixedRadius * double13;
  context.rect(-fixedRadius, -fixedRadius, fixedDiameter, fixedDiameter);
}

// node_modules/@tsparticles/shape-square/browser/SquareDrawer.js
var sides6 = 4;
var SquareDrawer = class {
  constructor() {
    this.validTypes = ["edge", "square"];
  }
  draw(data) {
    drawSquare(data);
  }
  getSidesCount() {
    return sides6;
  }
};

// node_modules/@tsparticles/shape-square/browser/index.js
async function loadSquareShape(engine, refresh = true) {
  await engine.addShape(new SquareDrawer(), refresh);
}

// node_modules/@tsparticles/shape-star/browser/Utils.js
var defaultInset = 2;
var origin6 = { x: 0, y: 0 };
function drawStar(data) {
  const { context, particle, radius } = data, sides7 = particle.sides, inset = particle.starInset ?? defaultInset;
  context.moveTo(origin6.x, origin6.y - radius);
  for (let i = 0; i < sides7; i++) {
    context.rotate(Math.PI / sides7);
    context.lineTo(origin6.x, origin6.y - radius * inset);
    context.rotate(Math.PI / sides7);
    context.lineTo(origin6.x, origin6.y - radius);
  }
}

// node_modules/@tsparticles/shape-star/browser/StarDrawer.js
var defaultInset2 = 2;
var defaultSides2 = 5;
var StarDrawer = class {
  constructor() {
    this.validTypes = ["star"];
  }
  draw(data) {
    drawStar(data);
  }
  getSidesCount(particle) {
    const star = particle.shapeData;
    return Math.round(getRangeValue((star == null ? void 0 : star.sides) ?? defaultSides2));
  }
  particleInit(container, particle) {
    const star = particle.shapeData;
    particle.starInset = getRangeValue((star == null ? void 0 : star.inset) ?? defaultInset2);
  }
};

// node_modules/@tsparticles/shape-star/browser/index.js
async function loadStarShape(engine, refresh = true) {
  await engine.addShape(new StarDrawer(), refresh);
}

// node_modules/@tsparticles/updater-stroke-color/browser/StrokeColorUpdater.js
var defaultOpacity3 = 1;
var StrokeColorUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    var _a;
    const container = this.container, options = particle.options;
    const stroke = itemFromSingleOrMultiple(options.stroke, particle.id, options.reduceDuplicates);
    particle.strokeWidth = getRangeValue(stroke.width) * container.retina.pixelRatio;
    particle.strokeOpacity = getRangeValue(stroke.opacity ?? defaultOpacity3);
    particle.strokeAnimation = (_a = stroke.color) == null ? void 0 : _a.animation;
    const strokeHslColor = rangeColorToHsl(stroke.color) ?? particle.getFillColor();
    if (strokeHslColor) {
      particle.strokeColor = getHslAnimationFromHsl(strokeHslColor, particle.strokeAnimation, container.retina.reduceFactor);
    }
  }
  isEnabled(particle) {
    const color = particle.strokeAnimation, { strokeColor } = particle;
    return !particle.destroyed && !particle.spawning && !!color && ((strokeColor == null ? void 0 : strokeColor.h.value) !== void 0 && strokeColor.h.enable || (strokeColor == null ? void 0 : strokeColor.s.value) !== void 0 && strokeColor.s.enable || (strokeColor == null ? void 0 : strokeColor.l.value) !== void 0 && strokeColor.l.enable);
  }
  update(particle, delta) {
    if (!this.isEnabled(particle)) {
      return;
    }
    updateColor(particle.strokeColor, delta);
  }
};

// node_modules/@tsparticles/updater-stroke-color/browser/index.js
async function loadStrokeColorUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("strokeColor", (container) => {
    return Promise.resolve(new StrokeColorUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/slim/browser/index.js
async function loadSlim(engine, refresh = true) {
  await loadParallaxMover(engine, false);
  await loadExternalAttractInteraction(engine, false);
  await loadExternalBounceInteraction(engine, false);
  await loadExternalBubbleInteraction(engine, false);
  await loadExternalConnectInteraction(engine, false);
  await loadExternalGrabInteraction(engine, false);
  await loadExternalPauseInteraction(engine, false);
  await loadExternalPushInteraction(engine, false);
  await loadExternalRemoveInteraction(engine, false);
  await loadExternalRepulseInteraction(engine, false);
  await loadExternalSlowInteraction(engine, false);
  await loadParticlesAttractInteraction(engine, false);
  await loadParticlesCollisionsInteraction(engine, false);
  await loadParticlesLinksInteraction(engine, false);
  await loadEasingQuadPlugin();
  await loadEmojiShape(engine, false);
  await loadImageShape(engine, false);
  await loadLineShape(engine, false);
  await loadPolygonShape(engine, false);
  await loadSquareShape(engine, false);
  await loadStarShape(engine, false);
  await loadLifeUpdater(engine, false);
  await loadRotateUpdater(engine, false);
  await loadStrokeColorUpdater(engine, false);
  await loadBasic(engine, refresh);
}

// node_modules/@tsparticles/shape-text/browser/Utils.js
var double14 = 2;
var half12 = 0.5;
function drawText(data) {
  const { context, particle, radius, opacity } = data, character = particle.shapeData;
  if (!character) {
    return;
  }
  const textData = character.value;
  if (textData === void 0) {
    return;
  }
  if (particle.text === void 0) {
    particle.text = itemFromSingleOrMultiple(textData, particle.randomIndexData);
  }
  const text = particle.text, style = character.style ?? "", weight = character.weight ?? "400", size = Math.round(radius) * double14, font = character.font ?? "Verdana", fill = particle.shapeFill;
  const lines = text == null ? void 0 : text.split("\n");
  if (!lines) {
    return;
  }
  context.font = `${style} ${weight} ${size}px "${font}"`;
  context.globalAlpha = opacity;
  for (let i = 0; i < lines.length; i++) {
    drawLine3(context, lines[i], radius, opacity, i, fill);
  }
  context.globalAlpha = 1;
}
function drawLine3(context, line, radius, opacity, index, fill) {
  const offsetX = line.length * radius * half12, pos = {
    x: -offsetX,
    y: radius * half12
  }, diameter = radius * double14;
  if (fill) {
    context.fillText(line, pos.x, pos.y + diameter * index);
  } else {
    context.strokeText(line, pos.x, pos.y + diameter * index);
  }
}

// node_modules/@tsparticles/shape-text/browser/TextDrawer.js
var TextDrawer = class {
  constructor() {
    this.validTypes = ["text", "character", "char", "multiline-text"];
  }
  draw(data) {
    drawText(data);
  }
  async init(container) {
    const options = container.actualOptions, { validTypes } = this;
    if (validTypes.find((t) => isInArray(t, options.particles.shape.type))) {
      const shapeOptions = validTypes.map((t) => options.particles.shape.options[t]).find((t) => !!t), promises = [];
      executeOnSingleOrMultiple(shapeOptions, (shape) => {
        promises.push(loadFont(shape.font, shape.weight));
      });
      await Promise.all(promises);
    }
  }
  particleInit(container, particle) {
    if (!particle.shape || !this.validTypes.includes(particle.shape)) {
      return;
    }
    const character = particle.shapeData;
    if (character === void 0) {
      return;
    }
    const textData = character.value;
    if (textData === void 0) {
      return;
    }
    particle.text = itemFromSingleOrMultiple(textData, particle.randomIndexData);
  }
};

// node_modules/@tsparticles/shape-text/browser/index.js
async function loadTextShape(engine, refresh = true) {
  await engine.addShape(new TextDrawer(), refresh);
}

// node_modules/@tsparticles/updater-tilt/browser/TiltDirection.js
var TiltDirection;
(function(TiltDirection2) {
  TiltDirection2["clockwise"] = "clockwise";
  TiltDirection2["counterClockwise"] = "counter-clockwise";
  TiltDirection2["random"] = "random";
})(TiltDirection || (TiltDirection = {}));

// node_modules/@tsparticles/updater-tilt/browser/Options/Classes/TiltAnimation.js
var TiltAnimation = class {
  constructor() {
    this.enable = false;
    this.speed = 0;
    this.decay = 0;
    this.sync = false;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.speed !== void 0) {
      this.speed = setRangeValue(data.speed);
    }
    if (data.decay !== void 0) {
      this.decay = setRangeValue(data.decay);
    }
    if (data.sync !== void 0) {
      this.sync = data.sync;
    }
  }
};

// node_modules/@tsparticles/updater-tilt/browser/Options/Classes/Tilt.js
var Tilt = class extends ValueWithRandom {
  constructor() {
    super();
    this.animation = new TiltAnimation();
    this.direction = TiltDirection.clockwise;
    this.enable = false;
    this.value = 0;
  }
  load(data) {
    super.load(data);
    if (!data) {
      return;
    }
    this.animation.load(data.animation);
    if (data.direction !== void 0) {
      this.direction = data.direction;
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
  }
};

// node_modules/@tsparticles/updater-tilt/browser/TiltUpdater.js
var identity6 = 1;
var double15 = 2;
var doublePI5 = Math.PI * double15;
var maxAngle4 = 360;
var TiltUpdater = class {
  constructor(container) {
    this.container = container;
  }
  getTransformValues(particle) {
    var _a;
    const tilt = ((_a = particle.tilt) == null ? void 0 : _a.enable) && particle.tilt;
    return {
      b: tilt ? Math.cos(tilt.value) * tilt.cosDirection : void 0,
      c: tilt ? Math.sin(tilt.value) * tilt.sinDirection : void 0
    };
  }
  init(particle) {
    var _a;
    const tiltOptions = particle.options.tilt;
    if (!tiltOptions) {
      return;
    }
    particle.tilt = {
      enable: tiltOptions.enable,
      value: degToRad(getRangeValue(tiltOptions.value)),
      sinDirection: getRandom() >= halfRandom ? identity6 : -identity6,
      cosDirection: getRandom() >= halfRandom ? identity6 : -identity6,
      min: 0,
      max: doublePI5
    };
    let tiltDirection = tiltOptions.direction;
    if (tiltDirection === TiltDirection.random) {
      const index = Math.floor(getRandom() * double15), minIndex = 0;
      tiltDirection = index > minIndex ? TiltDirection.counterClockwise : TiltDirection.clockwise;
    }
    switch (tiltDirection) {
      case TiltDirection.counterClockwise:
      case "counterClockwise":
        particle.tilt.status = AnimationStatus.decreasing;
        break;
      case TiltDirection.clockwise:
        particle.tilt.status = AnimationStatus.increasing;
        break;
    }
    const tiltAnimation = (_a = particle.options.tilt) == null ? void 0 : _a.animation;
    if (tiltAnimation == null ? void 0 : tiltAnimation.enable) {
      particle.tilt.decay = identity6 - getRangeValue(tiltAnimation.decay);
      particle.tilt.velocity = getRangeValue(tiltAnimation.speed) / maxAngle4 * this.container.retina.reduceFactor;
      if (!tiltAnimation.sync) {
        particle.tilt.velocity *= getRandom();
      }
    }
  }
  isEnabled(particle) {
    var _a;
    const tiltAnimation = (_a = particle.options.tilt) == null ? void 0 : _a.animation;
    return !particle.destroyed && !particle.spawning && !!(tiltAnimation == null ? void 0 : tiltAnimation.enable);
  }
  loadOptions(options, ...sources) {
    if (!options.tilt) {
      options.tilt = new Tilt();
    }
    for (const source of sources) {
      options.tilt.load(source == null ? void 0 : source.tilt);
    }
  }
  async update(particle, delta) {
    if (!this.isEnabled(particle) || !particle.tilt) {
      return;
    }
    updateAnimation(particle, particle.tilt, false, DestroyType.none, delta);
    await Promise.resolve();
  }
};

// node_modules/@tsparticles/updater-tilt/browser/index.js
async function loadTiltUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("tilt", (container) => {
    return Promise.resolve(new TiltUpdater(container));
  }, refresh);
}

// node_modules/@tsparticles/updater-twinkle/browser/Options/Classes/TwinkleValues.js
var TwinkleValues = class {
  constructor() {
    this.enable = false;
    this.frequency = 0.05;
    this.opacity = 1;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.color !== void 0) {
      this.color = OptionsColor.create(this.color, data.color);
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.frequency !== void 0) {
      this.frequency = data.frequency;
    }
    if (data.opacity !== void 0) {
      this.opacity = setRangeValue(data.opacity);
    }
  }
};

// node_modules/@tsparticles/updater-twinkle/browser/Options/Classes/Twinkle.js
var Twinkle = class {
  constructor() {
    this.lines = new TwinkleValues();
    this.particles = new TwinkleValues();
  }
  load(data) {
    if (!data) {
      return;
    }
    this.lines.load(data.lines);
    this.particles.load(data.particles);
  }
};

// node_modules/@tsparticles/updater-twinkle/browser/TwinkleUpdater.js
var TwinkleUpdater = class {
  getColorStyles(particle, context, radius, opacity) {
    const pOptions = particle.options, twinkleOptions = pOptions.twinkle;
    if (!twinkleOptions) {
      return {};
    }
    const twinkle = twinkleOptions.particles, twinkling = twinkle.enable && getRandom() < twinkle.frequency, zIndexOptions = particle.options.zIndex, zOffset = 1, zOpacityFactor = (zOffset - particle.zIndexFactor) ** zIndexOptions.opacityRate, twinklingOpacity = twinkling ? getRangeValue(twinkle.opacity) * zOpacityFactor : opacity, twinkleRgb = rangeColorToHsl(twinkle.color), twinkleStyle = twinkleRgb ? getStyleFromHsl(twinkleRgb, twinklingOpacity) : void 0, res = {}, needsTwinkle = twinkling && twinkleStyle;
    res.fill = needsTwinkle ? twinkleStyle : void 0;
    res.stroke = needsTwinkle ? twinkleStyle : void 0;
    return res;
  }
  async init() {
    await Promise.resolve();
  }
  isEnabled(particle) {
    const pOptions = particle.options, twinkleOptions = pOptions.twinkle;
    if (!twinkleOptions) {
      return false;
    }
    return twinkleOptions.particles.enable;
  }
  loadOptions(options, ...sources) {
    if (!options.twinkle) {
      options.twinkle = new Twinkle();
    }
    for (const source of sources) {
      options.twinkle.load(source == null ? void 0 : source.twinkle);
    }
  }
  async update() {
    await Promise.resolve();
  }
};

// node_modules/@tsparticles/updater-twinkle/browser/index.js
async function loadTwinkleUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("twinkle", () => {
    return Promise.resolve(new TwinkleUpdater());
  }, refresh);
}

// node_modules/@tsparticles/updater-wobble/browser/Options/Classes/WobbleSpeed.js
var WobbleSpeed = class {
  constructor() {
    this.angle = 50;
    this.move = 10;
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.angle !== void 0) {
      this.angle = setRangeValue(data.angle);
    }
    if (data.move !== void 0) {
      this.move = setRangeValue(data.move);
    }
  }
};

// node_modules/@tsparticles/updater-wobble/browser/Options/Classes/Wobble.js
var Wobble = class {
  constructor() {
    this.distance = 5;
    this.enable = false;
    this.speed = new WobbleSpeed();
  }
  load(data) {
    if (!data) {
      return;
    }
    if (data.distance !== void 0) {
      this.distance = setRangeValue(data.distance);
    }
    if (data.enable !== void 0) {
      this.enable = data.enable;
    }
    if (data.speed !== void 0) {
      if (isNumber(data.speed)) {
        this.speed.load({ angle: data.speed });
      } else {
        const rangeSpeed = data.speed;
        if (rangeSpeed.min !== void 0) {
          this.speed.load({ angle: rangeSpeed });
        } else {
          this.speed.load(data.speed);
        }
      }
    }
  }
};

// node_modules/@tsparticles/updater-wobble/browser/Utils.js
var defaultDistance = 0;
var double16 = 2;
var doublePI6 = Math.PI * double16;
var distanceFactor = 60;
function updateWobble(particle, delta) {
  const { wobble: wobbleOptions } = particle.options, { wobble } = particle;
  if (!(wobbleOptions == null ? void 0 : wobbleOptions.enable) || !wobble) {
    return;
  }
  const angleSpeed = wobble.angleSpeed * delta.factor, moveSpeed = wobble.moveSpeed * delta.factor, distance = moveSpeed * ((particle.retina.wobbleDistance ?? defaultDistance) * delta.factor) / (millisecondsToSeconds / distanceFactor), max = doublePI6, { position } = particle;
  wobble.angle += angleSpeed;
  if (wobble.angle > max) {
    wobble.angle -= max;
  }
  position.x += distance * Math.cos(wobble.angle);
  position.y += distance * Math.abs(Math.sin(wobble.angle));
}

// node_modules/@tsparticles/updater-wobble/browser/WobbleUpdater.js
var double17 = 2;
var doublePI7 = Math.PI * double17;
var maxAngle5 = 360;
var moveSpeedFactor2 = 10;
var defaultDistance2 = 0;
var WobbleUpdater = class {
  constructor(container) {
    this.container = container;
  }
  init(particle) {
    const wobbleOpt = particle.options.wobble;
    if (wobbleOpt == null ? void 0 : wobbleOpt.enable) {
      particle.wobble = {
        angle: getRandom() * doublePI7,
        angleSpeed: getRangeValue(wobbleOpt.speed.angle) / maxAngle5,
        moveSpeed: getRangeValue(wobbleOpt.speed.move) / moveSpeedFactor2
      };
    } else {
      particle.wobble = {
        angle: 0,
        angleSpeed: 0,
        moveSpeed: 0
      };
    }
    particle.retina.wobbleDistance = getRangeValue((wobbleOpt == null ? void 0 : wobbleOpt.distance) ?? defaultDistance2) * this.container.retina.pixelRatio;
  }
  isEnabled(particle) {
    var _a;
    return !particle.destroyed && !particle.spawning && !!((_a = particle.options.wobble) == null ? void 0 : _a.enable);
  }
  loadOptions(options, ...sources) {
    if (!options.wobble) {
      options.wobble = new Wobble();
    }
    for (const source of sources) {
      options.wobble.load(source == null ? void 0 : source.wobble);
    }
  }
  update(particle, delta) {
    if (!this.isEnabled(particle)) {
      return;
    }
    updateWobble(particle, delta);
  }
};

// node_modules/@tsparticles/updater-wobble/browser/index.js
async function loadWobbleUpdater(engine, refresh = true) {
  await engine.addParticleUpdater("wobble", (container) => {
    return Promise.resolve(new WobbleUpdater(container));
  }, refresh);
}

// node_modules/tsparticles/browser/index.js
async function loadFull(engine, refresh = true) {
  await loadDestroyUpdater(engine, false);
  await loadRollUpdater(engine, false);
  await loadTiltUpdater(engine, false);
  await loadTwinkleUpdater(engine, false);
  await loadWobbleUpdater(engine, false);
  await loadTextShape(engine, false);
  await loadExternalTrailInteraction(engine, false);
  await loadAbsorbersPlugin(engine, false);
  await loadEmittersPlugin(engine, false);
  await loadEmittersShapeCircle(engine, false);
  await loadEmittersShapeSquare(engine, false);
  await loadSlim(engine, refresh);
}
export {
  loadFull
};
//# sourceMappingURL=tsparticles.js.map
