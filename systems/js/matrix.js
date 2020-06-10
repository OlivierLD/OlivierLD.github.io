/**
 * Utilities for system resolution, least squares, etc.
 * This follows the ES5 standard.
 *
 * @param dim
 * @constructor
 */
function SquareMatrix(dim) {
	let dimension = dim;
	let matrixElements = [];
	for (let row = 0; row < dim; row++) {
		let line = [];
		for (var col = 0; col < dim; col++) {
			line.push(0);
		}
		matrixElements.push(line);
	}

	this.getDimension = function () {
		return (dimension);
	};

	this.setElementAt = function (row, col, val) {
		matrixElements[row][col] = val;
	};

	this.getElementAt = function (row, col) {
		return matrixElements[row][col];
	};

	this.getMatrixElements = function () {
		return this.matrixElements;
	};

	this.setMatrixElements = function (me) {
		this.matrixElements = me;
	};
}

function minor(m, row, col) {
	let small = new SquareMatrix(m.getDimension() - 1);
	for (let c = 0; c < m.getDimension(); c++) {
		if (c !== col) {
			for (var r = 0; r < m.getDimension(); r++) {
				if (r !== row) {
					small.setElementAt(((r < row) ? r : (r - 1)), ((c < col) ? c : (c - 1)), m.getElementAt(r, c));
				}
			}
		}
	}
	return small;
}

function comatrix(m) {
	let co = new SquareMatrix(m.getDimension());
	for (let r = 0; r < m.getDimension(); r++) {
		for (let c = 0; c < m.getDimension(); c++) {
			co.setElementAt(r, c, determinant(minor(m, r, c)) * Math.pow((-1), (r + c + 2)));  // r+c+2 = (r+1) + (c+1)...
		}
	}
	return co;
}

function transposed(m) {
	let t = new SquareMatrix(m.getDimension());
	// Replace line with columns.
	for (let r = 0; r < m.getDimension(); r++) {
		for (let c = 0; c < m.getDimension(); c++) {
			t.setElementAt(r, c, m.getElementAt(c, r));
		}
	}
	return t;
}

function multiply(m, n) {
	let res = new SquareMatrix(m.getDimension());
	for (let r = 0; r < m.getDimension(); r++) {
		for (let c = 0; c < m.getDimension(); c++) {
			res.setElementAt(r, c, m.getElementAt(r, c) * n);
		}
	}
	return res;
}

function determinant(m) {
	let v = 0.0;

	if (m.getDimension() === 1) {
		v = m.getElementAt(0, 0);
	} else {
		// C : column in Major
		for (let C = 0; C < m.getDimension(); C++) { // Walk thru first line
			// Minor's determinant
			let minDet = determinant(minor(m, 0, C));
			v += (m.getElementAt(0, C) * minDet * Math.pow((-1.0), C + 1 + 1)); // line C, column 1
		}
	}
	return v;
}

function invert(m) {
	return multiply(transposed(comatrix(m)), (1.0 / determinant(m)));
}

/**
 * Solves a system, n equations, n unknowns.
 * <p>
 * the values we look for are x, y, z.
 * <p>
 * ax + by + cz = X
 * Ax + By + Cz = Y
 * Px + Qy + Rz = Z
 *
 * @param m Coeffs matrix, n x n (left)
 *          | a b c |
 *          | A B C |
 *          | P Q R |
 * @param c Constants array, n (right) [X, Y, Z]
 * @return the unknown array, n. [x, y, z]
 */
function solveSystem(m, c) {
	let result = [];

	let inv = invert(m);

	// Lines * Column
	for (let row = 0; row < m.getDimension(); row++) {
		result.push(0.0);
		for (let col = 0; col < m.getDimension(); col++) {
			result[row] += (inv.getElementAt(row, col) * c[col]);
		}
	}
	return result;
}

function printSystem(squareMatrix, constants) {
	let unknowns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let dimension = squareMatrix.getDimension();
	for (let row = 0; row < dimension; row++) {
		let line = "";
		for (let col = 0; col < dimension; col++) {
			line += ((line.trim().length > 0 ? " + " : "") + squareMatrix.getElementAt(row, col) + " x " + unknowns.charAt(col));
		}
		line += (" = " + constants[row]);
		console.log(line);
	}
}

function f(x, coeffs) {
	let result = 0.0;
	for (let deg = 0; deg < coeffs.length; deg++) {
		result += (coeffs[deg] * Math.pow(x, coeffs.length - (deg + 1)));
	}
	return result;
}

function derivative(coeff) {
	let dim = coeff.length - 1;
	let derCoeff = [];
	for (let i = 0; i < dim; i++) {
		derCoeff.push((dim - i) * coeff[i]);
	}
	return derCoeff;
}

// Least Squares
function leastSquares(requiredDegree, data) {
	let dimension = requiredDegree + 1;
	let sumXArray = [];
	let sumY = [];
// Init
	for (let i = 0; i < ((requiredDegree * 2) + 1); i++) {
		sumXArray.push(0.0);
	}
	for (let i = 0; i < (requiredDegree + 1); i++) {
		sumY.push(0.0);
	}

	for (let t = 0; t < data.length; t++) {
		for (let i = 0; i < ((requiredDegree * 2) + 1); i++) {
			sumXArray[i] += Math.pow(data[t].x, i);
		}
		for (let i = 0; i < (requiredDegree + 1); i++) {
			sumY[i] += (data[t].y * Math.pow(data[t].x, i));
		}
	}

	let squareMatrix = new SquareMatrix(dimension);
	for (let row = 0; row < dimension; row++) {
		for (let col = 0; col < dimension; col++) {
			let powerRnk = (requiredDegree - row) + (requiredDegree - col);
			console.log("[" + row + "," + col + ":" + (powerRnk) + "] = " + sumXArray[powerRnk]);
			squareMatrix.setElementAt(row, col, sumXArray[powerRnk]);
		}
	}
	let constants = []; // new double[dimension];
	for (let i = 0; i < dimension; i++) {
		constants.push(sumY[requiredDegree - i]);
		console.log("[" + (requiredDegree - i) + "] = " + constants[i]);
	}

//  console.log("Resolving:");
//  printSystem(squareMatrix, constants);

	let result = solveSystem(squareMatrix, constants);
	return result;
}

let fromNode = false;

if (process !== undefined) {
	for (let i = 0; i < process.argv.length; i++) {
		console.log("arg #%d: %s", i, process.argv[i]);
		if (process.argv[i] === 'from-node') {
			fromNode = true;
		}
	}
	console.log("Usage is:");
	console.log("\tnode matrix.js from-node");
}

if (fromNode) {
	/**
	 * An example
	 */
	console.log("\nFirst example");
	let squareMatrix = new SquareMatrix(3);

	/*
	 Resolution of:
	 12x    +  13y +    14z = 234
	 1.345x - 654y + 0.001z = 98.87
	 23.09x + 5.3y - 12.34z = 9.876
	 */
	squareMatrix.setElementAt(0, 0, 12);
	squareMatrix.setElementAt(0, 1, 13);
	squareMatrix.setElementAt(0, 2, 14);

	squareMatrix.setElementAt(1, 0, 1.345);
	squareMatrix.setElementAt(1, 1, -654);
	squareMatrix.setElementAt(1, 2, 0.001);

	squareMatrix.setElementAt(2, 0, 23.09);
	squareMatrix.setElementAt(2, 1, 5.3);
	squareMatrix.setElementAt(2, 2, -12.34);

	let constants = [234, 98.87, 9.876];

	console.log("Solving:");
	printSystem(squareMatrix, constants);

	let result = solveSystem(squareMatrix, constants);

	console.log("A = %d", result[0]);
	console.log("B = %d", result[1]);
	console.log("C = %d", result[2]);
	console.log();
	// Proof:
	let X = (squareMatrix.getElementAt(0, 0) * result[0]) + (squareMatrix.getElementAt(0, 1) * result[1]) + (squareMatrix.getElementAt(0, 2) * result[2]);
	console.log("Proof X: %d", X);
	let Y = (squareMatrix.getElementAt(1, 0) * result[0]) + (squareMatrix.getElementAt(1, 1) * result[1]) + (squareMatrix.getElementAt(1, 2) * result[2]);
	console.log("Proof Y: %d", Y);
	let Z = (squareMatrix.getElementAt(2, 0) * result[0]) + (squareMatrix.getElementAt(2, 1) * result[1]) + (squareMatrix.getElementAt(2, 2) * result[2]);
	console.log("Proof Z: %d", Z);
}

if (fromNode && false) { // Example
	console.log("\nSecond example");
	let REQUIRED_SMOOTHING_DEGREE = 3;
// Cloud of points here:
	let data = [{"x": -8.000000, "y": -6.719560}, {"x": -7.990000, "y": -7.827249}, {
		"x": -7.980000,
		"y": -9.274245
	}, {"x": -7.970000, "y": -8.640282}, {"x": -7.960000, "y": -7.339933}, {
		"x": -7.950000,
		"y": -6.246416
	}, {"x": -7.940000, "y": -9.084759}, {"x": -7.930000, "y": -9.104593}, {
		"x": -7.920000,
		"y": -6.523360
	}, {"x": -7.910000, "y": -5.865572}, {"x": -7.900000, "y": -8.498517}, {
		"x": -7.890000,
		"y": -5.992720
	}, {"x": -7.880000, "y": -10.100942}, {"x": -7.870000, "y": -9.724057}, {
		"x": -7.860000,
		"y": -5.722992
	}, {"x": -7.850000, "y": -5.135082}, {"x": -7.840000, "y": -9.872333}, {
		"x": -7.830000,
		"y": -7.163344
	}, {"x": -7.820000, "y": -9.230664}, {"x": -7.810000, "y": -7.397149}, {
		"x": -7.800000,
		"y": -7.310588
	}, {"x": -7.790000, "y": -9.620354}, {"x": -7.780000, "y": -6.301957}, {
		"x": -7.770000,
		"y": -7.982450
	}, {"x": -7.760000, "y": -7.450044}, {"x": -7.750000, "y": -10.198594}, {
		"x": -7.740000,
		"y": -7.495622
	}, {"x": -7.730000, "y": -10.380142}, {"x": -7.720000, "y": -4.536389}, {
		"x": -7.710000,
		"y": -9.485454
	}, {"x": -7.700000, "y": -9.126708}, {"x": -7.690000, "y": -8.528006}, {
		"x": -7.680000,
		"y": -5.785669
	}, {"x": -7.670000, "y": -9.679696}, {"x": -7.660000, "y": -6.381080}, {
		"x": -7.650000,
		"y": -5.388684
	}, {"x": -7.640000, "y": -4.429049}, {"x": -7.630000, "y": -5.251344}, {
		"x": -7.620000,
		"y": -5.306796
	}, {"x": -7.610000, "y": -8.326423}, {"x": -7.600000, "y": -10.112724}, {
		"x": -7.590000,
		"y": -5.076918
	}, {"x": -7.580000, "y": -6.596441}, {"x": -7.570000, "y": -9.423550}];

	let result = leastSquares(REQUIRED_SMOOTHING_DEGREE, data);

	let out = "[ ";
	for (let i = 0; i < result.length; i++) {
		out += ((i > 0 ? ", " : "") + result[i]);
	}
	out += " ]";
	console.log(out);
}
