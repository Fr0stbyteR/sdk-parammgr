var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/AudioWorkletRegister.js
var window2 = globalThis;
var _a;
var registeredProcessors = ((_a = window2.AudioWorkletRegister) == null ? void 0 : _a.registeredProcessors) || new WeakMap();
var _a2;
var registeringProcessors = ((_a2 = window2.AudioWorkletRegister) == null ? void 0 : _a2.registeringProcessors) || new WeakMap();
var _a3;
var resolves = ((_a3 = window2.AudioWorkletRegister) == null ? void 0 : _a3.resolves) || {};
var _a4;
var rejects = ((_a4 = window2.AudioWorkletRegister) == null ? void 0 : _a4.rejects) || {};
var AudioWorkletRegister = class {
  static async registerProcessor(processorId, processor2, audioWorklet, ...injection) {
    this.registeringProcessors.get(audioWorklet).add(processorId);
    try {
      const url = URL.createObjectURL(new Blob([`(${processor2.toString()})(${[processorId, ...injection].map((s) => JSON.stringify(s)).join(", ")});`], { type: "text/javascript" }));
      await audioWorklet.addModule(url);
      this.resolves[processorId].forEach((f) => f());
      this.registeringProcessors.get(audioWorklet).delete(processorId);
      this.registeredProcessors.get(audioWorklet).add(processorId);
    } catch (e) {
      this.rejects[processorId].forEach((f) => f(e));
    }
    this.rejects[processorId] = [];
    this.resolves[processorId] = [];
  }
  static async register(processorId, processor2, audioWorklet, ...injection) {
    if (!this.resolves[processorId])
      this.resolves[processorId] = [];
    if (!this.rejects[processorId])
      this.rejects[processorId] = [];
    const promise = new Promise((resolve, reject) => {
      this.resolves[processorId].push(resolve);
      this.rejects[processorId].push(reject);
    });
    if (!this.registeringProcessors.has(audioWorklet)) {
      this.registeringProcessors.set(audioWorklet, new Set());
    }
    if (!this.registeredProcessors.has(audioWorklet)) {
      this.registeredProcessors.set(audioWorklet, new Set());
    }
    const registered = this.registeredProcessors.get(audioWorklet).has(processorId);
    const registering = this.registeringProcessors.get(audioWorklet).has(processorId);
    if (registered)
      return Promise.resolve();
    if (registering)
      return promise;
    if (!registered && audioWorklet) {
      this.registerProcessor(processorId, processor2, audioWorklet, ...injection);
    }
    return promise;
  }
};
__publicField(AudioWorkletRegister, "registeredProcessors", registeredProcessors);
__publicField(AudioWorkletRegister, "registeringProcessors", registeringProcessors);
__publicField(AudioWorkletRegister, "resolves", resolves);
__publicField(AudioWorkletRegister, "rejects", rejects);
if (!window2.AudioWorkletRegister)
  window2.AudioWorkletRegister = AudioWorkletRegister;

// src/CompositeAudioNode.js
var CompositeAudioNode = class extends GainNode {
  constructor() {
    super(...arguments);
    __publicField(this, "_output");
    __publicField(this, "_wamNode");
  }
  get processorId() {
    return this._wamNode.processorId;
  }
  get instanceId() {
    return this._wamNode.instanceId;
  }
  get module() {
    return this._wamNode.module;
  }
  getParameterInfo(...args) {
    return this._wamNode.getParameterInfo(...args);
  }
  getParameterValues(...args) {
    return this._wamNode.getParameterValues(...args);
  }
  setParameterValues(...args) {
    return this._wamNode.setParameterValues(...args);
  }
  getState() {
    return this._wamNode.getState();
  }
  setState(...args) {
    return this._wamNode.setState(...args);
  }
  getCompensationDelay() {
    return this._wamNode.getCompensationDelay();
  }
  scheduleEvents(...args) {
    return this._wamNode.scheduleEvents(...args);
  }
  clearEvents() {
    return this._wamNode.clearEvents();
  }
  connectEvents(...args) {
    return this._wamNode.connectEvents(...args);
  }
  disconnectEvents(...args) {
    return this._wamNode.disconnectEvents(...args);
  }
  destroy() {
    return this._wamNode.destroy();
  }
  set channelCount(count) {
    if (this._output)
      this._output.channelCount = count;
    else
      super.channelCount = count;
  }
  get channelCount() {
    if (this._output)
      return this._output.channelCount;
    return super.channelCount;
  }
  set channelCountMode(mode) {
    if (this._output)
      this._output.channelCountMode = mode;
    else
      super.channelCountMode = mode;
  }
  get channelCountMode() {
    if (this._output)
      return this._output.channelCountMode;
    return super.channelCountMode;
  }
  set channelInterpretation(interpretation) {
    if (this._output)
      this._output.channelInterpretation = interpretation;
    else
      super.channelInterpretation = interpretation;
  }
  get channelInterpretation() {
    if (this._output)
      return this._output.channelInterpretation;
    return super.channelInterpretation;
  }
  get numberOfInputs() {
    return super.numberOfInputs;
  }
  get numberOfOutputs() {
    if (this._output)
      return this._output.numberOfOutputs;
    return super.numberOfOutputs;
  }
  get gain() {
    return void 0;
  }
  connect(...args) {
    if (this._output && this._output !== this)
      return this._output.connect(...args);
    return super.connect(...args);
  }
  disconnect(...args) {
    if (this._output && this._output !== this)
      return this._output.disconnect(...args);
    return super.disconnect(...args);
  }
};

// src/ParamMgrProcessor.js
var processor = (processorId, paramsConfig) => {
  const audioWorkletGlobalScope3 = globalThis;
  const { AudioWorkletProcessor, registerProcessor } = audioWorkletGlobalScope3;
  const supportSharedArrayBuffer = !!globalThis.SharedArrayBuffer;
  const SharedArrayBuffer2 = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
  const normExp2 = (x, e) => e === 0 ? x : x ** 1.5 ** -e;
  const normalizeE = (x, min, max, e = 0) => min === 0 && max === 1 ? normExp2(x, e) : normExp2((x - min) / (max - min) || 0, e);
  const normalize2 = (x, min, max) => min === 0 && max === 1 ? x : (x - min) / (max - min) || 0;
  const denormalize2 = (x, min, max) => min === 0 && max === 1 ? x : x * (max - min) + min;
  const mapValue = (x, eMin, eMax, sMin, sMax, tMin, tMax) => denormalize2(normalize2(normalize2(Math.min(sMax, Math.max(sMin, x)), eMin, eMax), normalize2(sMin, eMin, eMax), normalize2(sMax, eMin, eMax)), tMin, tMax);
  class ParamMgrProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return Object.entries(paramsConfig).map(([name, { defaultValue, minValue, maxValue }]) => ({
        name,
        defaultValue,
        minValue,
        maxValue
      }));
    }
    constructor(options) {
      super(options);
      this.destroyed = false;
      this.supportSharedArrayBuffer = supportSharedArrayBuffer;
      const {
        paramsMapping,
        internalParamsMinValues,
        internalParams,
        instanceId
      } = options.processorOptions;
      this.moduleId = processorId;
      this.instanceId = instanceId;
      this.internalParamsMinValues = internalParamsMinValues;
      this.paramsConfig = paramsConfig;
      this.paramsMapping = paramsMapping;
      this.paramsValues = {};
      Object.entries(paramsConfig).forEach(([name, { defaultValue }]) => {
        this.paramsValues[name] = defaultValue;
      });
      this.internalParams = internalParams;
      this.internalParamsCount = this.internalParams.length;
      this.buffer = new SharedArrayBuffer2((this.internalParamsCount + 1) * Float32Array.BYTES_PER_ELEMENT);
      this.$lock = new Int32Array(this.buffer, 0, 1);
      this.$internalParamsBuffer = new Float32Array(this.buffer, 4, this.internalParamsCount);
      this.eventQueue = [];
      this.handleEvent = null;
      audioWorkletGlobalScope3.webAudioModules.create(this);
      this.messagePortRequestId = -1;
      const resolves2 = {};
      const rejects2 = {};
      this.call = (call, ...args) => new Promise((resolve, reject) => {
        const id = this.messagePortRequestId--;
        resolves2[id] = resolve;
        rejects2[id] = reject;
        this.port.postMessage({ id, call, args });
      });
      this.handleMessage = ({ data }) => {
        const { id, call, args, value, error } = data;
        if (call) {
          const r = { id };
          try {
            r.value = this[call](...args);
          } catch (e) {
            r.error = e;
          }
          this.port.postMessage(r);
        } else {
          if (error) {
            if (rejects2[id])
              rejects2[id](error);
            delete rejects2[id];
            return;
          }
          if (resolves2[id]) {
            resolves2[id](value);
            delete resolves2[id];
          }
        }
      };
      this.port.start();
      this.port.addEventListener("message", this.handleMessage);
    }
    setParamsMapping(mapping) {
      this.paramsMapping = mapping;
    }
    getBuffer() {
      return { lock: this.$lock, paramsBuffer: this.$internalParamsBuffer };
    }
    getCompensationDelay() {
      return 128;
    }
    getParameterInfo(...parameterIdQuery) {
      if (parameterIdQuery.length === 0)
        parameterIdQuery = Object.keys(this.paramsConfig);
      const parameterInfo = {};
      parameterIdQuery.forEach((parameterId) => {
        parameterInfo[parameterId] = this.paramsConfig[parameterId];
      });
      return parameterInfo;
    }
    getParameterValues(normalized, ...parameterIdQuery) {
      if (parameterIdQuery.length === 0)
        parameterIdQuery = Object.keys(this.paramsConfig);
      const parameterValues = {};
      parameterIdQuery.forEach((parameterId) => {
        if (!(parameterId in this.paramsValues))
          return;
        const { minValue, maxValue, exponent } = this.paramsConfig[parameterId];
        const value = this.paramsValues[parameterId];
        parameterValues[parameterId] = {
          id: parameterId,
          value: normalized ? normalizeE(value, minValue, maxValue, exponent) : value,
          normalized
        };
      });
      return parameterValues;
    }
    scheduleEvents(...events) {
      this.eventQueue.push(...events);
      const { currentTime } = audioWorkletGlobalScope3;
      this.eventQueue.sort((a, b) => (a.time || currentTime) - (b.time || currentTime));
    }
    get downstream() {
      const wams = new Set();
      const { eventGraph } = audioWorkletGlobalScope3.webAudioModules;
      if (!eventGraph.has(this))
        return wams;
      const outputMap = eventGraph.get(this);
      outputMap.forEach((set) => {
        if (set)
          set.forEach((wam) => wams.add(wam));
      });
      return wams;
    }
    emitEvents(...events) {
      const { eventGraph } = audioWorkletGlobalScope3.webAudioModules;
      if (!eventGraph.has(this))
        return;
      const downstream = eventGraph.get(this);
      downstream.forEach((set) => {
        if (set)
          set.forEach((wam) => wam.scheduleEvents(...events));
      });
    }
    clearEvents() {
      this.eventQueue = [];
    }
    lock() {
      if (globalThis.Atomics)
        Atomics.store(this.$lock, 0, 1);
    }
    unlock() {
      if (globalThis.Atomics)
        Atomics.store(this.$lock, 0, 0);
    }
    process(inputs, outputs, parameters) {
      if (this.destroyed)
        return false;
      const outputOffset = 1;
      this.lock();
      Object.entries(this.paramsConfig).forEach(([name, { minValue, maxValue }]) => {
        const raw = parameters[name];
        if (name in this.paramsValues)
          this.paramsValues[name] = raw[raw.length - 1];
        if (!this.paramsMapping[name])
          return;
        Object.entries(this.paramsMapping[name]).forEach(([targetName, targetMapping]) => {
          const j = this.internalParams.indexOf(targetName);
          if (j === -1)
            return;
          const intrinsicValue = this.internalParamsMinValues[j];
          const { sourceRange, targetRange } = targetMapping;
          const [sMin, sMax] = sourceRange;
          const [tMin, tMax] = targetRange;
          let out;
          if (minValue !== tMin || maxValue !== tMax || minValue !== sMin || maxValue !== sMax) {
            out = raw.map((v) => {
              const mappedValue = mapValue(v, minValue, maxValue, sMin, sMax, tMin, tMax);
              return mappedValue - intrinsicValue;
            });
          } else if (intrinsicValue) {
            out = raw.map((v) => v - intrinsicValue);
          } else {
            out = raw;
          }
          if (out.length === 1)
            outputs[j + outputOffset][0].fill(out[0]);
          else
            outputs[j + outputOffset][0].set(out);
          this.$internalParamsBuffer[j] = out[0];
        });
      });
      this.unlock();
      if (!this.supportSharedArrayBuffer) {
        this.call("setBuffer", { lock: this.$lock, paramsBuffer: this.$internalParamsBuffer });
      }
      const { currentTime } = audioWorkletGlobalScope3;
      let $event;
      for ($event = 0; $event < this.eventQueue.length; $event++) {
        const event = this.eventQueue[$event];
        if (event.time && event.time > currentTime)
          break;
        if (typeof this.handleEvent === "function")
          this.handleEvent(event);
        this.call("dispatchWamEvent", event);
      }
      if ($event)
        this.eventQueue.splice(0, $event);
      return true;
    }
    connectEvents(wamInstanceId, output) {
      const wam = audioWorkletGlobalScope3.webAudioModules.processors[wamInstanceId];
      if (!wam)
        return;
      audioWorkletGlobalScope3.webAudioModules.connectEvents(this, wam, output);
    }
    disconnectEvents(wamInstanceId, output) {
      if (typeof wamInstanceId === "undefined") {
        audioWorkletGlobalScope3.webAudioModules.disconnectEvents(this);
        return;
      }
      const wam = audioWorkletGlobalScope3.webAudioModules.processors[wamInstanceId];
      if (!wam)
        return;
      audioWorkletGlobalScope3.webAudioModules.disconnectEvents(this, wam, output);
    }
    destroy() {
      audioWorkletGlobalScope3.webAudioModules.destroy(this);
      this.destroyed = true;
      this.port.close();
    }
  }
  try {
    registerProcessor(processorId, ParamMgrProcessor);
  } catch (error) {
    console.warn(error);
  }
};
var ParamMgrProcessor_default = processor;

// node_modules/@webaudiomodules/sdk/src/WamEnv.js
var executable = () => {
  class WamEnv {
    constructor() {
      this._eventGraph = new Map();
      this._processors = {};
    }
    get eventGraph() {
      return this._eventGraph;
    }
    get processors() {
      return this._processors;
    }
    create(wam) {
      this._processors[wam.instanceId] = wam;
    }
    connectEvents(from, to, output = 0) {
      let outputMap;
      if (this._eventGraph.has(from)) {
        outputMap = this._eventGraph.get(from);
      } else {
        outputMap = [];
        this._eventGraph.set(from, outputMap);
      }
      if (outputMap[output]) {
        outputMap[output].add(to);
      } else {
        const set = new Set();
        set.add(to);
        outputMap[output] = set;
      }
    }
    disconnectEvents(from, to, output) {
      if (!this._eventGraph.has(from))
        return;
      const outputMap = this._eventGraph.get(from);
      if (typeof to === "undefined") {
        outputMap.forEach((set) => {
          if (set)
            set.clear();
        });
        return;
      }
      if (typeof output === "undefined") {
        outputMap.forEach((set) => {
          if (set)
            set.delete(to);
        });
        return;
      }
      if (!outputMap[output])
        return;
      outputMap[output].delete(to);
    }
    destroy(wam) {
      if (this.eventGraph.has(wam))
        this.eventGraph.delete(wam);
      this.eventGraph.forEach((outputMap) => {
        outputMap.forEach((set) => {
          if (set && set.has(wam))
            set.delete(wam);
        });
      });
    }
  }
  const audioWorkletGlobalScope3 = globalThis;
  if (!audioWorkletGlobalScope3.webAudioModules)
    audioWorkletGlobalScope3.webAudioModules = new WamEnv();
  return WamEnv;
};
var audioWorkletGlobalScope = globalThis;
if (audioWorkletGlobalScope.AudioWorkletProcessor) {
  if (!audioWorkletGlobalScope.webAudioModules)
    executable();
}
var WamEnv_default = executable;

// node_modules/@webaudiomodules/sdk/dist/index.js
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __publicField2 = (obj, key, value) => {
  __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;
var denormExp = (x, e) => e === 0 ? x : x ** 1.5 ** e;
var normalize = (x, min, max, e = 0) => min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
var denormalize = (x, min, max, e = 0) => min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
var inRange = (x, min, max) => x >= min && x <= max;
var WamParameterInfo = class {
  constructor(id, config = {}) {
    let {
      type,
      label,
      defaultValue,
      minValue,
      maxValue,
      discreteStep,
      exponent,
      choices,
      units
    } = config;
    if (type === void 0)
      type = "float";
    if (label === void 0)
      label = "";
    if (defaultValue === void 0)
      defaultValue = 0;
    if (choices === void 0)
      choices = [];
    if (type === "boolean" || type === "choice") {
      discreteStep = 1;
      minValue = 0;
      if (choices.length)
        maxValue = choices.length - 1;
      else
        maxValue = 1;
    } else {
      if (minValue === void 0)
        minValue = 0;
      if (maxValue === void 0)
        maxValue = 1;
      if (discreteStep === void 0)
        discreteStep = 0;
      if (exponent === void 0)
        exponent = 0;
      if (units === void 0)
        units = "";
    }
    const errBase = `Param config error | ${id}: `;
    if (minValue >= maxValue)
      throw Error(errBase.concat("minValue must be less than maxValue"));
    if (!inRange(defaultValue, minValue, maxValue))
      throw Error(errBase.concat("defaultValue out of range"));
    if (discreteStep % 1 || discreteStep < 0) {
      throw Error(errBase.concat("discreteStep must be a non-negative integer"));
    } else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) {
      throw Error(errBase.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
    }
    if (type === "choice" && !choices.length) {
      throw Error(errBase.concat("choice type parameter requires list of strings in choices"));
    }
    this.id = id;
    this.label = label;
    this.type = type;
    this.defaultValue = defaultValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.discreteStep = discreteStep;
    this.exponent = exponent;
    this.choices = choices;
    this.units = units;
  }
  normalize(value) {
    return normalize(value, this.minValue, this.maxValue, this.exponent);
  }
  denormalize(valueNorm) {
    return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
  }
  valueString(value) {
    if (this.choices)
      return this.choices[value];
    if (this.units !== "")
      return `${value} ${this.units}`;
    return `${value}`;
  }
};
if (globalThis.AudioWorkletGlobalScope) {
  globalThis.WamParameterInfo = WamParameterInfo;
}
var executable2 = () => {
  class RingBuffer2 {
    static getStorageForCapacity(capacity, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass in a ArrayBuffer subclass");
      }
      const bytes = 8 + (capacity + 1) * Type.BYTES_PER_ELEMENT;
      return new SharedArrayBuffer(bytes);
    }
    constructor(sab, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass a concrete typed array class as second argument");
      }
      this._Type = Type;
      this._capacity = (sab.byteLength - 8) / Type.BYTES_PER_ELEMENT;
      this.buf = sab;
      this.write_ptr = new Uint32Array(this.buf, 0, 1);
      this.read_ptr = new Uint32Array(this.buf, 4, 1);
      this.storage = new Type(this.buf, 8, this._capacity);
    }
    get type() {
      return this._Type.name;
    }
    push(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      if ((wr + 1) % this._storageCapacity() === rd) {
        return 0;
      }
      const toWrite = Math.min(this._availableWrite(rd, wr), elements.length);
      const firstPart = Math.min(this._storageCapacity() - wr, toWrite);
      const secondPart = toWrite - firstPart;
      this._copy(elements, 0, this.storage, wr, firstPart);
      this._copy(elements, firstPart, this.storage, 0, secondPart);
      Atomics.store(this.write_ptr, 0, (wr + toWrite) % this._storageCapacity());
      return toWrite;
    }
    pop(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      if (wr === rd) {
        return 0;
      }
      const isArray = !Number.isInteger(elements);
      const toRead = Math.min(this._availableRead(rd, wr), isArray ? elements.length : elements);
      if (isArray) {
        const firstPart = Math.min(this._storageCapacity() - rd, toRead);
        const secondPart = toRead - firstPart;
        this._copy(this.storage, rd, elements, 0, firstPart);
        this._copy(this.storage, 0, elements, firstPart, secondPart);
      }
      Atomics.store(this.read_ptr, 0, (rd + toRead) % this._storageCapacity());
      return toRead;
    }
    get empty() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return wr === rd;
    }
    get full() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return (wr + 1) % this._capacity !== rd;
    }
    get capacity() {
      return this._capacity - 1;
    }
    get availableRead() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableRead(rd, wr);
    }
    get availableWrite() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableWrite(rd, wr);
    }
    _availableRead(rd, wr) {
      if (wr > rd) {
        return wr - rd;
      }
      return wr + this._storageCapacity() - rd;
    }
    _availableWrite(rd, wr) {
      let rv = rd - wr - 1;
      if (wr >= rd) {
        rv += this._storageCapacity();
      }
      return rv;
    }
    _storageCapacity() {
      return this._capacity;
    }
    _copy(input, offsetInput, output, offsetOutput, size) {
      for (let i = 0; i < size; i++) {
        output[offsetOutput + i] = input[offsetInput + i];
      }
    }
  }
  const audioWorkletGlobalScope3 = globalThis;
  if (audioWorkletGlobalScope3.AudioWorkletProcessor) {
    if (!audioWorkletGlobalScope3.RingBuffer)
      audioWorkletGlobalScope3.RingBuffer = RingBuffer2;
  }
  return RingBuffer2;
};
var audioWorkletGlobalScope2 = globalThis;
if (audioWorkletGlobalScope2.AudioWorkletProcessor) {
  if (!audioWorkletGlobalScope2.RingBuffer)
    executable2();
}
var RingBuffer_default = executable2;
var executable22 = () => {
  const _WamEventRingBuffer = class {
    static getStorageForEventCapacity(RingBuffer2, eventCapacity, maxBytesPerEvent = void 0) {
      if (maxBytesPerEvent === void 0)
        maxBytesPerEvent = _WamEventRingBuffer.DefaultExtraBytesPerEvent;
      else
        maxBytesPerEvent = Math.max(maxBytesPerEvent, _WamEventRingBuffer.DefaultExtraBytesPerEvent);
      const capacity = (Math.max(_WamEventRingBuffer.WamAutomationEventBytes, _WamEventRingBuffer.WamTransportEventBytes, _WamEventRingBuffer.WamMidiEventBytes, _WamEventRingBuffer.WamBinaryEventBytes) + maxBytesPerEvent) * eventCapacity;
      return RingBuffer2.getStorageForCapacity(capacity, Uint8Array);
    }
    constructor(RingBuffer2, sab, parameterIds, maxBytesPerEvent = void 0) {
      this._eventSizeBytes = {};
      this._encodeEventType = {};
      this._decodeEventType = {};
      const wamEventTypes = ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"];
      wamEventTypes.forEach((type, encodedType) => {
        let byteSize = 0;
        switch (type) {
          case "wam-automation":
            byteSize = _WamEventRingBuffer.WamAutomationEventBytes;
            break;
          case "wam-transport":
            byteSize = _WamEventRingBuffer.WamTransportEventBytes;
            break;
          case "wam-mpe":
          case "wam-midi":
            byteSize = _WamEventRingBuffer.WamMidiEventBytes;
            break;
          case "wam-osc":
          case "wam-sysex":
          case "wam-info":
            byteSize = _WamEventRingBuffer.WamBinaryEventBytes;
            break;
          default:
            break;
        }
        this._eventSizeBytes[type] = byteSize;
        this._encodeEventType[type] = encodedType;
        this._decodeEventType[encodedType] = type;
      });
      this._parameterCode = 0;
      this._parameterCodes = {};
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      this.setParameterIds(parameterIds);
      this._sab = sab;
      if (maxBytesPerEvent === void 0)
        maxBytesPerEvent = _WamEventRingBuffer.DefaultExtraBytesPerEvent;
      else
        maxBytesPerEvent = Math.max(maxBytesPerEvent, _WamEventRingBuffer.DefaultExtraBytesPerEvent);
      this._eventBytesAvailable = Math.max(_WamEventRingBuffer.WamAutomationEventBytes, _WamEventRingBuffer.WamTransportEventBytes, _WamEventRingBuffer.WamMidiEventBytes, _WamEventRingBuffer.WamBinaryEventBytes) + maxBytesPerEvent;
      this._eventBytes = new ArrayBuffer(this._eventBytesAvailable);
      this._eventBytesView = new DataView(this._eventBytes);
      this._rb = new RingBuffer2(this._sab, Uint8Array);
      this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4);
      this._eventSizeView = new DataView(this._eventBytes, 0, 4);
    }
    _writeHeader(byteSize, type, time) {
      let byteOffset = 0;
      this._eventBytesView.setUint32(byteOffset, byteSize);
      byteOffset += 4;
      this._eventBytesView.setUint8(byteOffset, this._encodeEventType[type]);
      byteOffset += 1;
      this._eventBytesView.setFloat64(byteOffset, Number.isFinite(time) ? time : -1);
      byteOffset += 8;
      return byteOffset;
    }
    _encode(event) {
      let byteOffset = 0;
      const { type, time } = event;
      switch (event.type) {
        case "wam-automation":
          {
            if (!(event.data.id in this._encodeParameterId))
              break;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const encodedParameterId = this._encodeParameterId[data.id];
            const { value, normalized } = data;
            this._eventBytesView.setUint16(byteOffset, encodedParameterId);
            byteOffset += 2;
            this._eventBytesView.setFloat64(byteOffset, value);
            byteOffset += 8;
            this._eventBytesView.setUint8(byteOffset, normalized ? 1 : 0);
            byteOffset += 1;
          }
          break;
        case "wam-transport":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const {
              currentBar,
              currentBarStarted,
              tempo,
              timeSigNumerator,
              timeSigDenominator,
              playing
            } = data;
            this._eventBytesView.setUint32(byteOffset, currentBar);
            byteOffset += 4;
            this._eventBytesView.setFloat64(byteOffset, currentBarStarted);
            byteOffset += 8;
            this._eventBytesView.setFloat64(byteOffset, tempo);
            byteOffset += 8;
            this._eventBytesView.setUint8(byteOffset, timeSigNumerator);
            byteOffset += 1;
            this._eventBytesView.setUint8(byteOffset, timeSigDenominator);
            byteOffset += 1;
            this._eventBytesView.setUint8(byteOffset, playing ? 1 : 0);
            byteOffset += 1;
          }
          break;
        case "wam-mpe":
        case "wam-midi":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const { data } = event;
            const { bytes } = data;
            let b = 0;
            while (b < 3) {
              this._eventBytesView.setUint8(byteOffset, bytes[b]);
              byteOffset += 1;
              b++;
            }
          }
          break;
        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            let bytes = null;
            if (event.type === "wam-info") {
              const { data } = event;
              bytes = new TextEncoder().encode(data.instanceId);
            } else {
              const { data } = event;
              bytes = data.bytes;
            }
            const numBytes = bytes.length;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize + numBytes, type, time);
            this._eventBytesView.setUint32(byteOffset, numBytes);
            byteOffset += 4;
            const bytesRequired = byteOffset + numBytes;
            if (bytesRequired > this._eventBytesAvailable)
              console.error(`Event requires ${bytesRequired} bytes but only ${this._eventBytesAvailable} have been allocated!`);
            const buffer = new Uint8Array(this._eventBytes, byteOffset, numBytes);
            buffer.set(bytes);
            byteOffset += numBytes;
          }
          break;
        default:
          break;
      }
      return new Uint8Array(this._eventBytes, 0, byteOffset);
    }
    _decode() {
      let byteOffset = 0;
      const type = this._decodeEventType[this._eventBytesView.getUint8(byteOffset)];
      byteOffset += 1;
      let time = this._eventBytesView.getFloat64(byteOffset);
      if (time === -1)
        time = void 0;
      byteOffset += 8;
      switch (type) {
        case "wam-automation": {
          const encodedParameterId = this._eventBytesView.getUint16(byteOffset);
          byteOffset += 2;
          const value = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const normalized = !!this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          if (!(encodedParameterId in this._decodeParameterId))
            break;
          const id = this._decodeParameterId[encodedParameterId];
          const event = {
            type,
            time,
            data: {
              id,
              value,
              normalized
            }
          };
          return event;
        }
        case "wam-transport": {
          const currentBar = this._eventBytesView.getUint32(byteOffset);
          byteOffset += 4;
          const currentBarStarted = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const tempo = this._eventBytesView.getFloat64(byteOffset);
          byteOffset += 8;
          const timeSigNumerator = this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          const timeSigDenominator = this._eventBytesView.getUint8(byteOffset);
          byteOffset += 1;
          const playing = this._eventBytesView.getUint8(byteOffset) == 1;
          byteOffset += 1;
          const event = {
            type,
            time,
            data: {
              currentBar,
              currentBarStarted,
              tempo,
              timeSigNumerator,
              timeSigDenominator,
              playing
            }
          };
          return event;
        }
        case "wam-mpe":
        case "wam-midi": {
          const bytes = [0, 0, 0];
          let b = 0;
          while (b < 3) {
            bytes[b] = this._eventBytesView.getUint8(byteOffset);
            byteOffset += 1;
            b++;
          }
          const event = {
            type,
            time,
            data: { bytes }
          };
          return event;
        }
        case "wam-osc":
        case "wam-sysex":
        case "wam-info": {
          const numBytes = this._eventBytesView.getUint32(byteOffset);
          byteOffset += 4;
          const bytes = new Uint8Array(numBytes);
          bytes.set(new Uint8Array(this._eventBytes, byteOffset, numBytes));
          byteOffset += numBytes;
          if (type === "wam-info") {
            const instanceId = new TextDecoder().decode(bytes);
            const data = { instanceId };
            return { type, time, data };
          } else {
            const data = { bytes };
            return { type, time, data };
          }
        }
        default:
          break;
      }
      return false;
    }
    write(...events) {
      const numEvents = events.length;
      let bytesAvailable = this._rb.availableWrite;
      let numSkipped = 0;
      let i = 0;
      while (i < numEvents) {
        const event = events[i];
        const bytes = this._encode(event);
        const eventSizeBytes = bytes.byteLength;
        let bytesWritten = 0;
        if (bytesAvailable >= eventSizeBytes) {
          if (eventSizeBytes === 0)
            numSkipped++;
          else
            bytesWritten = this._rb.push(bytes);
        } else
          break;
        bytesAvailable -= bytesWritten;
        i++;
      }
      return i - numSkipped;
    }
    read() {
      if (this._rb.empty)
        return [];
      const events = [];
      let bytesAvailable = this._rb.availableRead;
      let bytesRead = 0;
      while (bytesAvailable > 0) {
        bytesRead = this._rb.pop(this._eventSizeArray);
        bytesAvailable -= bytesRead;
        const eventSizeBytes = this._eventSizeView.getUint32(0);
        const eventBytes = new Uint8Array(this._eventBytes, 0, eventSizeBytes - 4);
        bytesRead = this._rb.pop(eventBytes);
        bytesAvailable -= bytesRead;
        const decodedEvent = this._decode();
        if (decodedEvent)
          events.push(decodedEvent);
      }
      return events;
    }
    setParameterIds(parameterIds) {
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      parameterIds.forEach((parameterId) => {
        let parameterCode = -1;
        if (parameterId in this._parameterCodes)
          parameterCode = this._parameterCodes[parameterId];
        else {
          parameterCode = this._generateParameterCode();
          this._parameterCodes[parameterId] = parameterCode;
        }
        this._encodeParameterId[parameterId] = parameterCode;
        this._decodeParameterId[parameterCode] = parameterId;
      });
    }
    _generateParameterCode() {
      if (this._parameterCode > 65535)
        throw Error("Too many parameters have been registered!");
      return this._parameterCode++;
    }
  };
  let WamEventRingBuffer2 = _WamEventRingBuffer;
  __publicField2(WamEventRingBuffer2, "DefaultExtraBytesPerEvent", 64);
  __publicField2(WamEventRingBuffer2, "WamEventBaseBytes", 4 + 1 + 8);
  __publicField2(WamEventRingBuffer2, "WamAutomationEventBytes", _WamEventRingBuffer.WamEventBaseBytes + 2 + 8 + 1);
  __publicField2(WamEventRingBuffer2, "WamTransportEventBytes", _WamEventRingBuffer.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1);
  __publicField2(WamEventRingBuffer2, "WamMidiEventBytes", _WamEventRingBuffer.WamEventBaseBytes + 1 + 1 + 1);
  __publicField2(WamEventRingBuffer2, "WamBinaryEventBytes", _WamEventRingBuffer.WamEventBaseBytes + 4);
  const audioWorkletGlobalScope3 = globalThis;
  if (audioWorkletGlobalScope3.AudioWorkletProcessor) {
    if (!audioWorkletGlobalScope3.WamEventRingBuffer) {
      audioWorkletGlobalScope3.WamEventRingBuffer = WamEventRingBuffer2;
    }
  }
  return WamEventRingBuffer2;
};
var audioWorkletGlobalScope22 = globalThis;
if (audioWorkletGlobalScope22.AudioWorkletProcessor) {
  if (!audioWorkletGlobalScope22.WamEventRingBuffer)
    executable22();
}
var WamEventRingBuffer_default = executable22;
var RingBuffer = RingBuffer_default();
var WamEventRingBuffer = WamEventRingBuffer_default();
var WamNode = class extends AudioWorkletNode {
  static async addModules(audioContext, baseURL) {
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/RingBuffer.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamEventRingBuffer.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamArrayRingBuffer.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamEnv.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamParameter.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamParameterInfo.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamParameterInterpolator.js`);
    await audioContext.audioWorklet.addModule(`${baseURL}/../../sdk/src/WamProcessor.js`);
  }
  constructor(module, options) {
    const { audioContext, moduleId, instanceId } = module;
    options.processorOptions = __spreadValues2({
      moduleId,
      instanceId
    }, options.processorOptions);
    super(audioContext, moduleId, options);
    this.module = module;
    this._supportedEventTypes = new Set(["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc"]);
    this._messageId = 1;
    this._pendingResponses = {};
    this._pendingEvents = {};
    this._useSab = false;
    this._eventSabReady = false;
    this._destroyed = false;
    this.port.onmessage = this._onMessage.bind(this);
  }
  get moduleId() {
    return this.module.moduleId;
  }
  get instanceId() {
    return this.module.instanceId;
  }
  get processorId() {
    return this.moduleId;
  }
  async getParameterInfo(...parameterIds) {
    const request = "get/parameterInfo";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { parameterIds }
      });
    });
  }
  async getParameterValues(normalized, ...parameterIds) {
    const request = "get/parameterValues";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { normalized, parameterIds }
      });
    });
  }
  async setParameterValues(parameterValues) {
    const request = "set/parameterValues";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { parameterValues }
      });
    });
  }
  async getState() {
    const request = "get/state";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  async setState(state) {
    const request = "set/state";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { state }
      });
    });
  }
  async getCompensationDelay() {
    const request = "get/compensationDelay";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  addEventListener(type, callback, options) {
    if (this._supportedEventTypes.has(type))
      super.addEventListener(type, callback, options);
  }
  removeEventListener(type, callback, options) {
    if (this._supportedEventTypes.has(type))
      super.removeEventListener(type, callback, options);
  }
  scheduleEvents(...events) {
    let i = 0;
    const numEvents = events.length;
    if (this._eventSabReady) {
      i = this._eventWriter.write(...events);
    }
    while (i < numEvents) {
      const event = events[i];
      const request = "add/event";
      const id = this._generateMessageId();
      let processed = false;
      new Promise((resolve, reject) => {
        this._pendingResponses[id] = resolve;
        this._pendingEvents[id] = () => {
          if (!processed)
            reject();
        };
        this.port.postMessage({
          id,
          request,
          content: { event }
        });
      }).then((resolved) => {
        processed = true;
        delete this._pendingEvents[id];
        this._onEvent(event);
      }).catch((rejected) => {
        delete this._pendingResponses[id];
      });
      i++;
    }
  }
  async clearEvents() {
    const request = "remove/events";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      const ids = Object.keys(this._pendingEvents);
      if (ids.length) {
        this._pendingResponses[id] = resolve;
        this.port.postMessage({ id, request });
      }
    }).then((clearedIds) => {
      clearedIds.forEach((clearedId) => {
        this._pendingEvents[clearedId]();
        delete this._pendingEvents[clearedId];
      });
    });
  }
  connectEvents(to, output) {
    var _a5;
    if (!((_a5 = to.module) == null ? void 0 : _a5.isWebAudioModule))
      return;
    const request = "connect/events";
    const id = this._generateMessageId();
    new Promise((resolve, reject) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { wamInstanceId: to.instanceId, output }
      });
    });
  }
  disconnectEvents(to, output) {
    var _a5;
    if (to && !((_a5 = to.module) == null ? void 0 : _a5.isWebAudioModule))
      return;
    const request = "disconnect/events";
    const id = this._generateMessageId();
    new Promise((resolve, reject) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({
        id,
        request,
        content: { wamInstanceId: to == null ? void 0 : to.instanceId, output }
      });
    });
  }
  destroy() {
    if (this._audioToMainInterval)
      clearInterval(this._audioToMainInterval);
    this.port.postMessage({ destroy: true });
    this.port.close();
    this.disconnect();
    this._destroyed = true;
  }
  _generateMessageId() {
    return this._messageId++;
  }
  async _initialize() {
    const request = "initialize/processor";
    const id = this._generateMessageId();
    return new Promise((resolve) => {
      this._pendingResponses[id] = resolve;
      this.port.postMessage({ id, request });
    });
  }
  _onMessage(message) {
    const { data } = message;
    const { response, event, eventSab } = data;
    if (response) {
      const { id, content } = data;
      const resolvePendingResponse = this._pendingResponses[id];
      if (resolvePendingResponse) {
        delete this._pendingResponses[id];
        resolvePendingResponse(content);
      }
    } else if (eventSab) {
      this._useSab = true;
      const { eventCapacity, parameterIds } = eventSab;
      if (this._eventSabReady) {
        this._eventWriter.setParameterIds(parameterIds);
        this._eventReader.setParameterIds(parameterIds);
        return;
      }
      this._mainToAudioEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
      this._audioToMainEventSab = WamEventRingBuffer.getStorageForEventCapacity(RingBuffer, eventCapacity);
      this._eventWriter = new WamEventRingBuffer(RingBuffer, this._mainToAudioEventSab, parameterIds);
      this._eventReader = new WamEventRingBuffer(RingBuffer, this._audioToMainEventSab, parameterIds);
      const request = "initialize/eventSab";
      const id = this._generateMessageId();
      new Promise((resolve, reject) => {
        this._pendingResponses[id] = resolve;
        this.port.postMessage({
          id,
          request,
          content: {
            mainToAudioEventSab: this._mainToAudioEventSab,
            audioToMainEventSab: this._audioToMainEventSab
          }
        });
      }).then((resolved) => {
        this._eventSabReady = true;
        this._audioToMainInterval = setInterval(() => {
          const events = this._eventReader.read();
          events.forEach((e) => {
            this._onEvent(e);
          });
        }, 100);
      });
    } else if (event)
      this._onEvent(event);
  }
  _onEvent(event) {
    const { type } = event;
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      detail: event
    }));
  }
};

// src/ParamConfigurator.js
var ParamMappingConfigurator = class {
  constructor(options = {}) {
    __publicField(this, "_paramsConfig");
    __publicField(this, "_internalParamsConfig");
    __publicField(this, "_paramsMapping", {});
    const { paramsConfig, paramsMapping, internalParamsConfig } = options;
    this._paramsConfig = paramsConfig;
    this._paramsMapping = paramsMapping;
    this._internalParamsConfig = internalParamsConfig;
  }
  get paramsConfig() {
    const { internalParamsConfig } = this;
    return Object.entries(this._paramsConfig || internalParamsConfig).reduce((configs, [id, config]) => {
      var _a5, _b, _c, _d;
      const internalParam = internalParamsConfig[id];
      configs[id] = new WamParameterInfo(id, __spreadProps(__spreadValues({}, config), {
        label: (_a5 = config.label) != null ? _a5 : id,
        defaultValue: (_b = config.defaultValue) != null ? _b : internalParam == null ? void 0 : internalParam.defaultValue,
        minValue: (_c = config.minValue) != null ? _c : internalParam == null ? void 0 : internalParam.minValue,
        maxValue: (_d = config.maxValue) != null ? _d : internalParam == null ? void 0 : internalParam.maxValue
      }));
      return configs;
    }, {});
  }
  get internalParamsConfig() {
    return Object.entries(this._internalParamsConfig || {}).reduce((configs, [name, config]) => {
      if (config instanceof AudioParam)
        configs[name] = config;
      else {
        const defaultConfig = {
          minValue: 0,
          maxValue: 1,
          defaultValue: 0,
          automationRate: 30
        };
        configs[name] = __spreadValues(__spreadValues({}, defaultConfig), config);
      }
      return configs;
    }, {});
  }
  get paramsMapping() {
    const declared = this._paramsMapping || {};
    const externalParams = this.paramsConfig;
    const internalParams = this.internalParamsConfig;
    return Object.entries(externalParams).reduce((mapping, [name, { minValue, maxValue }]) => {
      const sourceRange = [minValue, maxValue];
      const defaultMapping = { sourceRange, targetRange: [...sourceRange] };
      if (declared[name]) {
        const declaredTargets = Object.entries(declared[name]).reduce((targets, [targetName, targetMapping]) => {
          if (internalParams[targetName]) {
            targets[targetName] = __spreadValues(__spreadValues({}, defaultMapping), targetMapping);
          }
          return targets;
        }, {});
        mapping[name] = declaredTargets;
      } else if (internalParams[name]) {
        mapping[name] = { [name]: __spreadValues({}, defaultMapping) };
      }
      return mapping;
    }, {});
  }
};

// src/MgrAudioParam.js
var MgrAudioParam = class extends AudioParam {
  constructor() {
    super(...arguments);
    __publicField(this, "_info");
  }
  get exponent() {
    return this.info.exponent;
  }
  get info() {
    return this._info;
  }
  set info(info) {
    this._info = info;
  }
  set normalizedValue(valueIn) {
    this.value = this.info.denormalize(valueIn);
  }
  get normalizedValue() {
    return this.info.normalize(this.value);
  }
  setValueAtTime(value, startTime) {
    return super.setValueAtTime(value, startTime);
  }
  setNormalizedValueAtTime(valueIn, startTime) {
    const value = this.info.denormalize(valueIn);
    return this.setValueAtTime(value, startTime);
  }
  linearRampToValueAtTime(value, endTime) {
    return super.linearRampToValueAtTime(value, endTime);
  }
  linearRampToNormalizedValueAtTime(valueIn, endTime) {
    const value = this.info.denormalize(valueIn);
    return this.linearRampToValueAtTime(value, endTime);
  }
  exponentialRampToValueAtTime(value, endTime) {
    return super.exponentialRampToValueAtTime(value, endTime);
  }
  exponentialRampToNormalizedValueAtTime(valueIn, endTime) {
    const value = this.info.denormalize(valueIn);
    return this.exponentialRampToValueAtTime(value, endTime);
  }
  setTargetAtTime(target, startTime, timeConstant) {
    return super.setTargetAtTime(target, startTime, timeConstant);
  }
  setNormalizedTargetAtTime(targetIn, startTime, timeConstant) {
    const target = this.info.denormalize(targetIn);
    return this.setTargetAtTime(target, startTime, timeConstant);
  }
  setValueCurveAtTime(values, startTime, duration) {
    return super.setValueCurveAtTime(values, startTime, duration);
  }
  setNormalizedValueCurveAtTime(valuesIn, startTime, duration) {
    const values = Array.from(valuesIn).map((v) => this.info.denormalize(v));
    return this.setValueCurveAtTime(values, startTime, duration);
  }
  cancelScheduledParamValues(cancelTime) {
    return super.cancelScheduledValues(cancelTime);
  }
  cancelAndHoldParamAtTime(cancelTime) {
    return super.cancelAndHoldAtTime(cancelTime);
  }
};

// src/ParamMgrNode.js
var AudioWorkletNode2 = globalThis.AudioWorkletNode;
var ParamMgrNode = class extends AudioWorkletNode2 {
  constructor(module, options) {
    super(module.audioContext, module.moduleId, {
      numberOfInputs: 0,
      numberOfOutputs: 1 + options.processorOptions.internalParams.length,
      parameterData: options.parameterData,
      processorOptions: options.processorOptions
    });
    __publicField(this, "requestDispatchIParamChange", (name) => {
      const config = this.internalParamsConfig[name];
      if (!("onChange" in config))
        return;
      const { automationRate, onChange } = config;
      if (typeof automationRate !== "number" || !automationRate)
        return;
      const interval = 1e3 / automationRate;
      const i = this.internalParams.indexOf(name);
      if (i === -1)
        return;
      if (i >= this.internalParams.length)
        return;
      if (typeof this.paramsUpdateCheckFnRef[i] === "number") {
        window.clearTimeout(this.paramsUpdateCheckFnRef[i]);
      }
      this.paramsUpdateCheckFn[i] = () => {
        const prev = this.$prevParamsBuffer[i];
        const cur = this.$paramsBuffer[i];
        if (cur !== prev) {
          onChange(cur, prev);
          this.$prevParamsBuffer[i] = cur;
        }
        this.paramsUpdateCheckFnRef[i] = window.setTimeout(this.paramsUpdateCheckFn[i], interval);
      };
      this.paramsUpdateCheckFn[i]();
    });
    const { processorOptions, internalParamsConfig } = options;
    this.initialized = false;
    this.module = module;
    this.paramsConfig = processorOptions.paramsConfig;
    this.internalParams = processorOptions.internalParams;
    this.internalParamsConfig = internalParamsConfig;
    this.$prevParamsBuffer = new Float32Array(this.internalParams.length);
    this.paramsUpdateCheckFn = [];
    this.paramsUpdateCheckFnRef = [];
    this.messageRequestId = 0;
    Object.entries(this.getParams()).forEach(([name, param]) => {
      Object.setPrototypeOf(param, MgrAudioParam.prototype);
      param._info = this.paramsConfig[name];
    });
    const resolves2 = {};
    const rejects2 = {};
    this.call = (call, ...args) => {
      const id = this.messageRequestId;
      this.messageRequestId += 1;
      return new Promise((resolve, reject) => {
        resolves2[id] = resolve;
        rejects2[id] = reject;
        this.port.postMessage({ id, call, args });
      });
    };
    this.handleMessage = ({ data }) => {
      const { id, call, args, value, error } = data;
      if (call) {
        const r = { id };
        try {
          r.value = this[call](...args);
        } catch (e) {
          r.error = e;
        }
        this.port.postMessage(r);
      } else {
        if (error) {
          if (rejects2[id])
            rejects2[id](error);
          delete rejects2[id];
          return;
        }
        if (resolves2[id]) {
          resolves2[id](value);
          delete resolves2[id];
        }
      }
    };
    this.port.start();
    this.port.addEventListener("message", this.handleMessage);
  }
  get parameters() {
    return super.parameters;
  }
  get processorId() {
    return this.module.moduleId;
  }
  get instanceId() {
    return this.module.instanceId;
  }
  async initialize() {
    const response = await this.call("getBuffer");
    const { lock, paramsBuffer } = response;
    this.$lock = lock;
    this.$paramsBuffer = paramsBuffer;
    const offset = 1;
    Object.entries(this.internalParamsConfig).forEach(([name, config], i) => {
      if (this.context.state === "suspended")
        this.$paramsBuffer[i] = config.defaultValue;
      if (config instanceof AudioParam) {
        try {
          config.automationRate = "a-rate";
        } catch (e) {
        } finally {
          config.value = Math.max(0, config.minValue);
          this.connect(config, offset + i);
        }
      } else if (config instanceof AudioNode) {
        this.connect(config, offset + i);
      } else {
        this.requestDispatchIParamChange(name);
      }
    });
    this.connect(this.module.audioContext.destination, 0, 0);
    this.initialized = true;
    return this;
  }
  setBuffer({ lock, paramsBuffer }) {
    this.$lock = lock;
    this.$paramsBuffer = paramsBuffer;
  }
  setParamsMapping(paramsMapping) {
    return this.call("setParamsMapping", paramsMapping);
  }
  getCompensationDelay() {
    return this.call("getCompensationDelay");
  }
  getParameterInfo(...parameterIdQuery) {
    return this.call("getParameterInfo", ...parameterIdQuery);
  }
  getParameterValues(normalized, ...parameterIdQuery) {
    return this.call("getParameterValues", normalized, ...parameterIdQuery);
  }
  scheduleAutomation(event) {
    const time = event.time || this.context.currentTime;
    const { id, normalized, value } = event.data;
    const audioParam = this.getParam(id);
    if (!audioParam)
      return;
    if (audioParam.info.type === "float") {
      if (normalized)
        audioParam.linearRampToNormalizedValueAtTime(value, time);
      else
        audioParam.linearRampToValueAtTime(value, time);
    } else {
      if (normalized)
        audioParam.setNormalizedValueAtTime(value, time);
      else
        audioParam.setValueAtTime(value, time);
    }
  }
  scheduleEvents(...events) {
    events.forEach((event) => {
      if (event.type === "wam-automation") {
        this.scheduleAutomation(event);
      }
    });
    this.call("scheduleEvents", ...events);
  }
  emitEvents(...events) {
    this.call("emitEvents", ...events);
  }
  clearEvents() {
    this.call("clearEvents");
  }
  dispatchWamEvent(event) {
    if (event.type === "wam-automation") {
      this.scheduleAutomation(event);
    } else {
      this.dispatchEvent(new CustomEvent(event.type, { detail: event }));
    }
  }
  async setParameterValues(parameterValues) {
    Object.keys(parameterValues).forEach((parameterId) => {
      const parameterUpdate = parameterValues[parameterId];
      const parameter = this.parameters.get(parameterId);
      if (!parameter)
        return;
      if (!parameterUpdate.normalized)
        parameter.value = parameterUpdate.value;
      else
        parameter.normalizedValue = parameterUpdate.value;
    });
  }
  async getState() {
    return this.getParamsValues();
  }
  async setState(state) {
    this.setParamsValues(state);
  }
  convertTimeToFrame(time) {
    return Math.round(time * this.context.sampleRate);
  }
  convertFrameToTime(frame) {
    return frame / this.context.sampleRate;
  }
  getIParamIndex(name) {
    const i = this.internalParams.indexOf(name);
    return i === -1 ? null : i;
  }
  connectIParam(name, dest, index) {
    const offset = 1;
    const i = this.getIParamIndex(name);
    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === "number")
          this.connect(dest, offset + i, index);
        else
          this.connect(dest, offset + i);
      } else {
        this.connect(dest, offset + i);
      }
    }
  }
  disconnectIParam(name, dest, index) {
    const offset = 1;
    const i = this.getIParamIndex(name);
    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === "number")
          this.disconnect(dest, offset + i, index);
        else
          this.disconnect(dest, offset + i);
      } else {
        this.disconnect(dest, offset + i);
      }
    }
  }
  getIParamValue(name) {
    const i = this.getIParamIndex(name);
    return i !== null ? this.$paramsBuffer[i] : null;
  }
  getIParamsValues() {
    const values = {};
    this.internalParams.forEach((name, i) => {
      values[name] = this.$paramsBuffer[i];
    });
    return values;
  }
  getParam(name) {
    return this.parameters.get(name) || null;
  }
  getParams() {
    return Object.fromEntries(this.parameters);
  }
  getParamValue(name) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.value;
  }
  setParamValue(name, value) {
    const param = this.parameters.get(name);
    if (!param)
      return;
    param.value = value;
  }
  getParamsValues() {
    const values = {};
    this.parameters.forEach((v, k) => {
      values[k] = v.value;
    });
    return values;
  }
  setParamsValues(values) {
    if (!values)
      return;
    Object.entries(values).forEach(([k, v]) => {
      this.setParamValue(k, v);
    });
  }
  getNormalizedParamValue(name) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.normalizedValue;
  }
  setNormalizedParamValue(name, value) {
    const param = this.parameters.get(name);
    if (!param)
      return;
    param.normalizedValue = value;
  }
  getNormalizedParamsValues() {
    const values = {};
    this.parameters.forEach((v, k) => {
      values[k] = this.getNormalizedParamValue(k);
    });
    return values;
  }
  setNormalizedParamsValues(values) {
    if (!values)
      return;
    Object.entries(values).forEach(([k, v]) => {
      this.setNormalizedParamValue(k, v);
    });
  }
  setParamValueAtTime(name, value, startTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setValueAtTime(value, startTime);
  }
  setNormalizedParamValueAtTime(name, value, startTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setNormalizedValueAtTime(value, startTime);
  }
  linearRampToParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.linearRampToValueAtTime(value, endTime);
  }
  linearRampToNormalizedParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.linearRampToNormalizedValueAtTime(value, endTime);
  }
  exponentialRampToParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.exponentialRampToValueAtTime(value, endTime);
  }
  exponentialRampToNormalizedParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.exponentialRampToNormalizedValueAtTime(value, endTime);
  }
  setParamTargetAtTime(name, target, startTime, timeConstant) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setTargetAtTime(target, startTime, timeConstant);
  }
  setNormalizedParamTargetAtTime(name, target, startTime, timeConstant) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setNormalizedTargetAtTime(target, startTime, timeConstant);
  }
  setParamValueCurveAtTime(name, values, startTime, duration) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setValueCurveAtTime(values, startTime, duration);
  }
  setNormalizedParamValueCurveAtTime(name, values, startTime, duration) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.setNormalizedValueCurveAtTime(values, startTime, duration);
  }
  cancelScheduledParamValues(name, cancelTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.cancelScheduledValues(cancelTime);
  }
  cancelAndHoldParamAtTime(name, cancelTime) {
    const param = this.parameters.get(name);
    if (!param)
      return null;
    return param.cancelAndHoldAtTime(cancelTime);
  }
  connectEvents(to, output) {
    var _a5;
    if (!((_a5 = to.module) == null ? void 0 : _a5.isWebAudioModule))
      return;
    this.call("connectEvents", to.instanceId, output);
  }
  disconnectEvents(to, output) {
    var _a5;
    if (to && !((_a5 = to.module) == null ? void 0 : _a5.isWebAudioModule))
      return;
    this.call("disconnectEvents", to == null ? void 0 : to.instanceId, output);
  }
  async destroy() {
    this.disconnect();
    this.paramsUpdateCheckFnRef.forEach((ref) => {
      if (typeof ref === "number")
        window.clearTimeout(ref);
    });
    await this.call("destroy");
    this.port.close();
  }
};

// src/ParamMgrFactory.js
var ParamMgrFactory = class {
  static async create(module, optionsIn = {}) {
    const { audioContext, moduleId: processorId, instanceId } = module;
    const { paramsConfig, paramsMapping, internalParamsConfig } = new ParamMappingConfigurator(optionsIn);
    const initialParamsValue = Object.entries(paramsConfig).reduce((currentParams, [name, { defaultValue }]) => {
      currentParams[name] = defaultValue;
      return currentParams;
    }, {});
    const serializableParamsConfig = Object.entries(paramsConfig).reduce((currentParams, [name, { id, label, type, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units }]) => {
      currentParams[name] = { id, label, type, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units };
      return currentParams;
    }, {});
    const AudioWorkletRegister2 = window.AudioWorkletRegister;
    await AudioWorkletRegister2.register("__WebAudioModules_WamEnv", WamEnv_default, audioContext.audioWorklet);
    await AudioWorkletRegister2.register(processorId, ParamMgrProcessor_default, audioContext.audioWorklet, serializableParamsConfig);
    const options = {
      internalParamsConfig,
      parameterData: initialParamsValue,
      processorOptions: {
        paramsConfig,
        paramsMapping,
        internalParamsMinValues: Object.values(internalParamsConfig).map((config) => Math.max(0, (config == null ? void 0 : config.minValue) || 0)),
        internalParams: Object.keys(internalParamsConfig),
        instanceId,
        processorId
      }
    };
    const node = new ParamMgrNode(module, options);
    await node.initialize();
    return node;
  }
};
export {
  AudioWorkletRegister,
  CompositeAudioNode,
  ParamMgrFactory
};
//# sourceMappingURL=index.js.map
