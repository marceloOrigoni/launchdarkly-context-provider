"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_hooks_1 = require("@testing-library/react-hooks");
const LaunchDarklyProvider_1 = __importDefault(require("../../src/LaunchDarklyProvider"));
const LaunchDarklyHook_1 = require("../../src/LaunchDarklyHook");
const featureFlags = {
    launchDarklyTest: false,
    testLaunchDarkly: false
};
const responsefeatureFlags = {
    "some": "thing",
    "launch-darkly-test": true
};
const updatedFeatureFlags = {
    launchDarklyTest: true,
    testLaunchDarkly: false
};
const mockUseState = jest.fn();
const mockSetState = jest.fn();
const mockClose = jest.fn();
const mockInitialize = jest.fn();
const mockWaitForInitialization = jest.fn();
const setState = jest.fn((value) => mockSetState(value(featureFlags)));
const useState = (value) => {
    mockUseState(value);
    return [value, setState];
};
const mockLdClient = {
    allFlags: jest.fn(() => responsefeatureFlags),
    close: jest.fn(() => mockClose()),
    waitForInitialization: () => {
        mockWaitForInitialization();
        return Promise.resolve((props) => props);
    }
};
jest.mock('launchdarkly-js-client-sdk', () => {
    return {
        initialize: () => {
            mockInitialize();
            return mockLdClient;
        }
    };
});
jest.mock('react', () => (Object.assign(Object.assign({}, jest.requireActual('react')), { useState })));
describe('LaunchDarklyProvider tests', () => {
    (0, react_2.render)(react_1.default.createElement(LaunchDarklyProvider_1.default, { launchDarklyClientSideId: "client-side-id", launchDarklyFeatureFlags: featureFlags, launchDarklyUserContext: { "kind": "user" } },
        react_1.default.createElement("div", { "data-testid": "test-children" }, "Hello World")));
    test("test Provider rendering", () => {
        expect(mockUseState).toHaveBeenCalledWith(featureFlags);
        expect(mockInitialize).toHaveBeenCalled();
        expect(mockWaitForInitialization).toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledWith(updatedFeatureFlags);
        expect(react_2.screen.getByTestId('test-children')).toBeDefined();
    });
});
describe('LaunchDarklyHook tests', () => {
    const { result } = (0, react_hooks_1.renderHook)(LaunchDarklyHook_1.useLaunchDarkly, { initialProps: featureFlags });
    test('hok tesst', () => expect(result.current).toStrictEqual({}));
});
