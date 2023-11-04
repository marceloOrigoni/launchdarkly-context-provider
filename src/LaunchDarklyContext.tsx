import { createContext } from 'react'
import { LaunchDarklyFeatureFlagList } from './types'


const LaunchDarklyContext = createContext<LaunchDarklyFeatureFlagList>({})

export default LaunchDarklyContext
