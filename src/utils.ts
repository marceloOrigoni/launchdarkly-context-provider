export const overrideObject = (baseObj: any, newObj: any) =>
    Object.entries(newObj).map( entry => {
        const [key, value] = entry
        return baseObj.hasOwnProperty(key) && {key, value}
    }).reduce(
        (prev, item) => item ? {...prev, ...{[item.key]: item.value}} : prev,
        baseObj
    )
