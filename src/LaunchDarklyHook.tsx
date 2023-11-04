import { useContext } from 'react'
import LaunchDarklyContext from './LaunchDarklyContext'

export const useLaunchDarkly = () => useContext(LaunchDarklyContext)
