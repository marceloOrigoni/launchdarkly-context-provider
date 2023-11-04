import React from 'react'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { LaunchDarklyFeatureFlagList } from '../../src/types'
import LaunchDarklyProvider from '../../src/LaunchDarklyProvider'
import { useLaunchDarkly } from '../../src/LaunchDarklyHook'

const featureFlags: LaunchDarklyFeatureFlagList = {
    launchDarklyTest: false,
    testLaunchDarkly: false
}

const responsefeatureFlags: LaunchDarklyFeatureFlagList = {
    "some": "thing",
    "launch-darkly-test": true
}

const updatedFeatureFlags: LaunchDarklyFeatureFlagList = {
    launchDarklyTest: true,
    testLaunchDarkly: false
}

const mockUseState: jest.Mock = jest.fn()
const mockSetState: jest.Mock = jest.fn()
const mockClose : jest.Mock = jest.fn()
const mockInitialize : jest.Mock = jest.fn()
const mockWaitForInitialization : jest.Mock = jest.fn()
const setState: jest.Mock = jest.fn( (value) => mockSetState(value(featureFlags)))
const useState = (value: any) => {
    mockUseState(value)
    return [value, setState]
}

const mockLdClient = {
    allFlags: jest.fn( () => responsefeatureFlags ),
    close: jest.fn( () => mockClose() ),
    waitForInitialization: () => {
        mockWaitForInitialization()
        return Promise.resolve((props: any) => props)
    }
}

jest.mock('launchdarkly-js-client-sdk', () => {
    return {
        initialize:
            () => {
                mockInitialize()
                return mockLdClient
            }
    }
})

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState
}))

describe('LaunchDarklyProvider tests', () =>{

    render(
        <LaunchDarklyProvider
            launchDarklyClientSideId={"client-side-id"}
        	launchDarklyFeatureFlags={featureFlags}
            launchDarklyUserContext={{"kind": "user"}}
        >
            <div data-testid={"test-children"}>Hello World</div>
        </LaunchDarklyProvider>
    )


    test("test Provider rendering", () => {
        expect(mockUseState).toHaveBeenCalledWith(featureFlags)
        expect(mockInitialize).toHaveBeenCalled()
        expect(mockWaitForInitialization).toHaveBeenCalled()
        expect(mockSetState).toHaveBeenCalledWith(updatedFeatureFlags)
        expect(screen.getByTestId('test-children')).toBeDefined()
    })

})

describe('LaunchDarklyHook tests', () =>{

    const { result } =  renderHook( useLaunchDarkly, {initialProps: featureFlags })

    test( 'hok tesst', () => expect(result.current).toStrictEqual({}))

})
