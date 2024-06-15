const packageInfo = (package) => {
    const packageParts = package.split('-----');
    const name = packageParts[0];
    const version = packageParts[1];

    return {
        name,
        version
    };
}

const packageName = ({ name, version }) => {
    if (!name) throw new Error('Name is required');

    return version ? `${name}@${version}` : name;
};

module.exports = { packageInfo, packageName };
