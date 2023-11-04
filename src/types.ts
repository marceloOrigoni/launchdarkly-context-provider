import React from 'react'
import { LDSingleKindContext } from 'launchdarkly-js-client-sdk'

export type LaunchDarklyProviderProps = {
    launchDarklyClientSideId: string
    launchDarklyUserContext: LDSingleKindContext
    launchDarklyFeatureFlags: LaunchDarklyFeatureFlagList
    children: React.ReactNode
}

export type LaunchDarklyFeatureFlagList = {
	[key: string]: boolean
}
