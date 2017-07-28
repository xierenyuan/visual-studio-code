const fs = require('fs');
const tinycolor = require('tinycolor2');
const yaml = require('js-yaml');

const withAlphaType = new yaml.Type('!alpha', {
    kind: 'sequence',
    construct: (data) => {
        return data[0] + data[1];
    },
    represent: (data) => {
        return [ data[0], data[1] ];
    }
});
const schema = yaml.Schema.create([ withAlphaType ]);
const standard = fs.readFileSync(`${__dirname}/src/dracula.yml`, 'utf8');

const yamlObj = yaml.load(standard, { schema });
const brightColors = [ ...yamlObj.dracula.ansi, ...yamlObj.dracula.brightOther ];

const soft = standard.replace(/'(#[0-9A-Z]{6})/g, (match, hex) => {
    if (brightColors.indexOf(hex) > -1) {
        return `'${tinycolor(hex).desaturate(20).toHexString()}`;
    }
    return `'${tinycolor(hex).toHexString()}`;
});

fs.writeFileSync(`${__dirname}/theme/aping.json`, JSON.stringify(yaml.load(standard, { schema }), null, 4));
fs.writeFileSync(`${__dirname}/theme/aping-soft.json`, JSON.stringify(yaml.load(soft, { schema }), null, 4));
