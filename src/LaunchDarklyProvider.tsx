import React, { useEffect, useState } from 'react'

import * as LaunchDarkly from 'launchdarkly-js-client-sdk'
import { LDFlagSet } from 'launchdarkly-js-client-sdk'
import camelize from 'camelize'
import { LaunchDarklyFeatureFlagList, LaunchDarklyProviderProps } from './types'
import { overrideObject } from './utils'
import LaunchDarklyContext from './LaunchDarklyContext'
import launchDarklyContext from './LaunchDarklyContext'

export const LaunchDarklyProvider = (props: LaunchDarklyProviderProps) => {
    const {launchDarklyClientSideId, launchDarklyUserContext, launchDarklyFeatureFlags, children} = props
    const [featureFlags, setFeatureFlags] = useState<LaunchDarklyFeatureFlagList>(launchDarklyFeatureFlags)

    useEffect(() => {
        if(launchDarklyUserContext.key && launchDarklyUserContext.key.length !== 0 ){
            const ldClient = LaunchDarkly.initialize(launchDarklyClientSideId, launchDarklyUserContext);
            ldClient.waitForInitialization().then(() => {
                const allFlags: LDFlagSet = camelize(ldClient.allFlags())

                setFeatureFlags((flags: LaunchDarklyFeatureFlagList) =>
                    overrideObject(flags, allFlags)
                )
            })

            return () => {
                ldClient.close();
            };
        }
    }, [launchDarklyUserContext])

    return (
        <LaunchDarklyContext.Provider value={ featureFlags }>
            { children }
        </LaunchDarklyContext.Provider>
    )
}

export default LaunchDarklyProvider
