const resolveArgs = (requiredKeys: string[]) => {

    const args = (process?.argv).slice(2);
    let parsedArgs: any = {};

    args.map(arg => {
        const regx = new RegExp(/(.*)[=:](.*)/gi);
        const keyVal = regx.exec(arg) as RegExpExecArray; //index 1,2
        if (keyVal) parsedArgs[keyVal[1]] = keyVal[2];
    });

    let checkAllKeys = requiredKeys.every((i) => parsedArgs[i]);
    if (!checkAllKeys) throw ('One or more arg. missing.');

    return parsedArgs;

};

export default resolveArgs;