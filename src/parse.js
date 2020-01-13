const fs = require('fs');
const util = require('util');
const log = require('./log');
const stllib = require('./stllib');

stllib.setLogger(log);

const args = process.argv;
if (args.length < 3) {
    log.error(`
    Missing data file argument.
    `)
    process.exit();
}

fs.readFile(args[2], 'utf8', function(err, contents) {
    console.log('\n');
    const facets = stllib.validateSTL(contents.trim());
    console.log(`Number of Triangles: ${stllib.countFacets(facets)}`);
    console.log(`Surface Area: ${stllib.calculateSurfaceArea(facets)}`);
    console.log(`Bounding Box: ${util.inspect(stllib.findBoundingBox(facets))}`);
    console.log('\n');
});

console.log('loading data');
