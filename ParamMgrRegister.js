/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import AudioWorkletRegister from './AudioWorkletRegister';
import processor from './ParamMgrProcessor';
import ParamMappingConfigurator from './ParamConfigurator';
/** @typedef { import('../api/WamTypes').WebAudioModule } WebAudioModule */
/** @typedef { import('./types').ParametersMappingConfiguratorOptions } ParametersMappingConfiguratorOptions */
/** @typedef { import('./types').ParamMgrOptions } ParamMgrOptions */

export default class ParamMgrRegister {
	/**
	 * @param {WebAudioModule} module
	 * @param {number} [numberOfInputs = 1]
	 * @param {ParametersMappingConfiguratorOptions} [optionsIn = {}]
	 */
	static async register(module, numberOfInputs = 1, optionsIn = {}) {
		const { audioContext, processorId, instanceId } = module;
		const { paramsConfig, paramsMapping, internalParamsConfig } = new ParamMappingConfigurator(optionsIn);
		const initialParamsValue = Object.entries(paramsConfig)
			.reduce((currentParams, [name, { defaultValue }]) => {
				currentParams[name] = defaultValue;
				return currentParams;
			}, {});
		const serializableParamsConfig = Object.entries(paramsConfig)
			.reduce((currentParams, [name, { id, label, type, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units }]) => {
				currentParams[name] = { id, label, type, defaultValue, minValue, maxValue, discreteStep, exponent, choices, units };
				return currentParams;
			}, {});
		await AudioWorkletRegister.register(processorId, processor, audioContext.audioWorklet, serializableParamsConfig);
		/** @type {ParamMgrOptions} */
		const options = {
			internalParamsConfig,
			numberOfInputs,
			parameterData: initialParamsValue,
			processorOptions: {
				paramsConfig,
				paramsMapping,
				internalParamsMinValues: Object.values(internalParamsConfig)
					.map((config) => Math.max(0, config?.minValue || 0)),
				internalParams: Object.keys(internalParamsConfig),
				instanceId,
				processorId,
			},
		};
		return options;
	}
}
