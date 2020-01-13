const stllib = require('../src/stllib');
const mockLogger = require('./mockLogger.js');

stllib.setLogger(mockLogger);

describe('validateSolid()', () => {
    test('enforces a file begins with "solid" declaration', () => {
        const goodData = `
            solid foo
            blah
            endsolid
        `;
    
        const badData = `
            blah
            endsolid
        `;
        expect(stllib.validateSolid(goodData));
        expect(!stllib.validateSolid(badData));
    });

    test('enforces a file ends with "endsolid" declaration', () => {
        const goodData = `
            solid foo
            blah
            endsolid
        `;
    
        const badData = `
            solid sdlkf
            blah
        `;
        expect(stllib.validateSolid(goodData));
        expect(!stllib.validateSolid(badData));
    });

    test('even though name is optional, a space is required after "solid"', () => {
        const goodData = `
            solid 
            blah
            endsolid
        `;
        const badData = `
            solid
            blah
            endsolid
        `;
        expect(stllib.validateSolid(goodData));
        expect(!stllib.validateSolid(badData));
    }

    )
});

describe('validateFacets()', () => {
    test('returns an array of facets when data is valid', () => {
        const goodData = `
            solid foo
            facet normal 3 3 3
                outer loop
                    vertex 6 6 6
                    vertex 8 8 8
                    vertex 9 9 9
                endloop
            endfacet
            endsolid
        `;
        expect(stllib.validateSolid(goodData));
    });

    test('returns false if a facet has a bad declaration', () => {
        const badData = `
            solid foo
            facet normal 4 4 
            outer loop
            vertex 3 3 3
            vertex 4 4 4
            vertex 5 5 5
            outer loop
            endsolid
        `;
        expect(!stllib.validateSolid(badData));
    });

    test('returns false if a loop is misplaced', () => {
        const badData = `
            solid foo
            outer loop
            facet normal 4 4 4
            vertex 3 3 3
            vertex 4 4 4
            vertex 5 5 5
            outer loop
            endsolid
        `;
        expect(!stllib.validateSolid(badData));
    });

    test('returns false if a facet has incorrect number of vertices', () => {
        const badData = `
            solid foo
            facet normal 4 4 4
            outer loop
            vertex 4 4 4
            vertex 5 5 5
            outer loop
            endsolid
        `;
        expect(!stllib.validateSolid(badData));
    });
});

describe('countFacets()', () => {
    const facets = [1, 2, 3, 4];
    test('returns the number of facets in the array', () => {
        expect(stllib.countFacets(facets)).toBe(4);
    });
});

describe('calculateSurfaceArea()', () => {
    test('returns the sum of triangles on the solid', () => {
        const facets = [
            { v: [{x:0, y:0, z:0}, {x:1, y:0, z:0}, {x:1, y:1, z:1}] },
            { v: [{x:0, y:0, z:0}, {x:0, y:1, z:1}, {x:1, y:1, z:1}] }
        ];
        expect(stllib.calculateSurfaceArea(facets)).toBe(1.4142);
    });
});

describe('findBoundingBox()', () => {
    test('calculates the bounding box', () => {
        const data = [
            {
                v: [
                    { x:0, y:0, z:0},
                    { x:1, y:0, z:0},
                    { x:1, y:1, z:1}
                ]
            }, {
                v: [
                    { x:0, y:0, z:0},
                    { x:0, y:1, z:1},
                    { x:1, y:1, z:1}
                ]
            }
        ];
        expect(stllib.findBoundingBox(data)).toBeTruthy();
    });
});
