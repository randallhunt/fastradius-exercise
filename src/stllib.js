// this allows dependency injection
let log = {
    info: console.log,
    error: console.log,
    fail: console.log
};


/*
    there is a lot more validation that could be done,
    but the following functions are all I needed in order
    to get myself an array of facets in object format.
*/

function validateSolid(input) {
    const data = input.split(/\n/g);

    const solid = data[0].match(/^\s*solid\s*([a-z_]*)\s*$/);
    if (!solid) {
        log.error('Invalid "solid" declaration.');
        return false;
    }
    const name = solid[1];
    const regex = new RegExp(`^\\s*endsolid\\s*(${name})?\\s*$`);
    const endsolid = data[data.length - 1].match(regex);
    if (!endsolid) {
        log.error('Invalid "endsolid" declaration.');
        return false;
    }

    return data.slice(1, -1);
}

function validateFacets(input) {
    const facets = [];
    let infacet = false;
    let inloop = false;
    let obj = { v: [] };

    for (line of input) {
        if (line.trim() === '') {
            continue;
        }

        const vertex = line.match(/^\s*vertex\s*([0-9\.-]+)\s*([0-9\.-]+)\s([0-9\.-]+)\s*$/);
        if (vertex) {
            if (!infacet || !inloop) {
                log.info(line);
                log.error('"vertex" declared while not in facet or loop.');
                return false;
            } else {
                obj.v.push({ x:vertex[1], y:vertex[2], z:vertex[3] });
                if (obj.v.length > 3) {
                    log.log(line);
                    log.error('Invalid facet: too many vertices.');
                    return false;
                }
                continue;
            }
        }

        const outerloop = line.match(/^\s*outer\s*loop\s*$/);
        if (outerloop) {
            if (inloop) {
                log.info(line);
                log.error('Invalid "outer loop" declaration.');
                return false;
            } else {
                inloop = true;
                continue;
            }
        }

        const endloop = line.match(/^\s*endloop$/);
        if (endloop) {
            if (!inloop) {
                log.error('Invalid "endloop" declaration. Not in a loop.');
                return false;
            }
            if (!infacet) {
                log.error('Invalid "endloop" declaration. Not in a facet.');
                return false;
            }
            if (obj.v.length !== 3) {
                log.error('Invalid "endloop" declaration. Incorrect number of vertices.');
                return false;
            }
 
            inloop = false;
            continue;
        }

        const facet = line.match(/^\s*facet\s*normal\s*([0-9\.-]+)\s*([0-9\.-]+)\s*([0-9\.-]+)\s*$/);
        if (facet) {
            if (infacet) {
                log.info(line);
                log.error('Invalid "facet" declaration.');
                return false;
            } else {
                infacet = true;
                obj.n = { i:facet[1], j: facet[2], k: facet[3] };
                continue;
            }
        }

        const endfacet = line.match(/^\s*endfacet$/);
        if (endfacet) {
            if (inloop) {
                log.error('Invalid "endfacet" declaration. Still in a loop.');
                return false;
            }
            if (!infacet) {
                log.error('Invalid "endfacet" declaration. Not in a facet.');
                return false;
            }
 
            infacet = false;
            facets.push(obj);
            obj = { v: [] };
            continue;
        }

        const data = line.match(/^\s*\S\s*$/);
        if (data) {
            log.info(line);
            log.error(`Invalid input: ${data[1]}`);
            return false;
        }
    };

    // return an array of facets
    return facets;
}

function validateSTL(input) {
    const innerdata = validateSolid(input);
    if (!innerdata) {
        log.fail('input is not a valid STL file\n');
        process.exit();
    };

    const facets = validateFacets(innerdata);
    if (!facets) {
        log.fail('input is not a valid STL file\n');
        process.exit();
    }

    return facets;
}


/*
    the following functions break up the work of
    taking in an array of facets and putting out
    useful data
*/

function countFacets(input) {
    return input.length;
}

function calculateSurfaceArea(input) {
    let area = 0;
    for (let i = 0; i < input.length; i++) {
        const f = input[i];
        area += areaOfTriangle(f.v[0].x, f.v[0].y, f.v[0].z, f.v[1].x, f.v[1].y, f.v[1].z, f.v[2].x, f.v[2].y, f.v[2].z);
    }
    return Number.parseFloat(area.toFixed(4));
}

function findBoundingBox (input) {
    var minx = Infinity,  maxx = -Infinity,  miny = Infinity,  maxy = -Infinity,  minz = Infinity,  maxz = -Infinity;
    var tminx = Infinity, tmaxx = -Infinity, tminy = Infinity, tmaxy = -Infinity, tminz = Infinity, tmaxz = -Infinity;

    input.forEach(function(vertex) {
      tminx = Math.min(vertex.v[0].x, vertex.v[1].x, vertex.v[2].z);
      minx  = tminx < minx ? tminx : minx;
      tmaxx = Math.max(vertex.v[0].x, vertex.v[1].y, vertex.v[2].z);
      maxx  = tmaxx > maxx ? tmaxx : maxx;

      tminy = Math.min(vertex.v[0].y, vertex.v[1].y, vertex.v[2].z);
      miny  = tminy < miny ? tminy : miny;
      tmaxy = Math.max(vertex.v[0].x, vertex.v[1].y, vertex.v[2].z);
      maxy  = tmaxy > maxy ? tmaxy : maxy;

      tminz = Math.min(vertex.v[0].x, vertex.v[1].y, vertex.v[2].z);
      minz  = tminz < minz ? tminz : minz;
      tmaxz = Math.max(vertex.v[0].x, vertex.v[1].y, vertex.v[2].z);
      maxz  = tmaxz > maxz ? tmaxz : maxz;
    });

    // only two coordinates necessary to determine a 3D box
    return [{x: minx, y: miny, z: minz}, {x: maxx, y: maxy, z: maxz}];
}


/*
    helpers
*/

function areaOfTriangle(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z) {
    const ax = p2x - p1x;
    const ay = p2y - p1y;
    const az = p2z - p1z;
    const bx = p3x - p1x;
    const by = p3y - p1y;
    const bz = p3z - p1z;
    const cx = ay*bz - az*by;
    const cy = az*bx - ax*bz;
    const cz = ax*by - ay*bx;

    return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);    
}


/*
    exports
*/

function setLogger(obj) {
    log = obj;
}

module.exports = {
    "validateSolid": validateSolid,
    "validateFacets": validateFacets,
    "validateSTL": validateSTL,
    "countFacets": countFacets,
    "calculateSurfaceArea": calculateSurfaceArea,
    "findBoundingBox": findBoundingBox,
    "setLogger": setLogger
}
